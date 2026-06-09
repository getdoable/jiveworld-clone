import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PageMarker from '../components/PageMarker.jsx';
import Logo from '../components/Logo.jsx';
import { getUser, isAuthenticated, logout, updateStoredUser } from '../lib/auth.js';
import {
  fetchAccount,
  updateAccount,
  changePassword,
  updatePayment,
  cancelSubscription,
  resubscribe,
} from '../lib/api.js';

const BASE = '/es-en/app/learn';

// Full-screen account layout: a top-left back-arrow + logo (navigates straight
// to the homepage — no About popup) above a centered content column.
function AccountShell({ children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-10 pb-10 pt-8">
        <button
          type="button"
          onClick={() => navigate(`${BASE}/home`)}
          aria-label="Back to home"
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span className="text-3xl leading-none" aria-hidden="true">←</span>
          <Logo showWord={false} />
        </button>
        {children}
      </div>
    </div>
  );
}

function EditButton({ onClick, label = 'Edit' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 px-5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {label}
    </button>
  );
}

// A My-details row that flips between a read view and an inline editor.
function EditableRow({ label, value, editing, onEdit, onCancel, children }) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-400 dark:text-gray-400">{label}</div>
          {!editing && <div className="mt-1 text-lg text-jw-ink dark:text-gray-100">{value}</div>}
        </div>
        {!editing && <EditButton onClick={onEdit} />}
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 px-5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
      {editing && <div className="mt-3">{children}</div>}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 py-4">
      <div className="text-sm font-semibold text-gray-400 dark:text-gray-400">{label}</div>
      <div className="mt-1 text-lg text-jw-ink dark:text-gray-100">{value}</div>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-lg text-jw-ink dark:text-gray-100 focus:border-jw-blue focus:outline-none';
const saveClass =
  'rounded-full bg-jw-blue px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50';

export default function Account() {
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(null); // 'name' | 'email' | 'password' | null
  const [draft, setDraft] = useState({});
  const [rowError, setRowError] = useState('');
  const [saving, setSaving] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAccount()
      .then((data) => {
        if (!cancelled) setAccount(data);
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function startEdit(field) {
    setRowError('');
    setEditing(field);
    if (field === 'name') setDraft({ name: account.name });
    else if (field === 'email') setDraft({ email: account.email });
    else if (field === 'password') setDraft({ currentPassword: '', newPassword: '' });
  }

  function cancelEdit() {
    setEditing(null);
    setRowError('');
    setDraft({});
  }

  async function saveDetails() {
    setSaving(true);
    setRowError('');
    try {
      if (editing === 'password') {
        await changePassword(draft.currentPassword, draft.newPassword);
      } else {
        const patch = editing === 'name' ? { name: draft.name } : { email: draft.email };
        const updated = await updateAccount(patch);
        setAccount(updated);
        updateStoredUser({ name: updated.name, email: updated.email });
      }
      cancelEdit();
    } catch (e) {
      setRowError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelSub() {
    setSaving(true);
    try {
      const membership = await cancelSubscription();
      setAccount((a) => ({ ...a, membership }));
      setConfirmCancel(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleResubscribe() {
    setSaving(true);
    try {
      const membership = await resubscribe();
      setAccount((a) => ({ ...a, membership }));
    } finally {
      setSaving(false);
    }
  }

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  if (loadError) {
    return (
      <AccountShell>
        <PageMarker state="account" />
        <h1 className="text-4xl font-extrabold text-jw-ink dark:text-gray-100">My account</h1>
        <p className="mt-6 text-red-500">Couldn’t load your account: {loadError}</p>
      </AccountShell>
    );
  }

  if (!account) {
    return (
      <AccountShell>
        <PageMarker state="account" />
        <h1 className="text-4xl font-extrabold text-jw-ink dark:text-gray-100">My account</h1>
        <p className="mt-6 text-gray-500 dark:text-gray-400">Loading…</p>
      </AccountShell>
    );
  }

  const m = account.membership;
  const canceled = m.status === 'canceled';
  const card = m.payment;

  return (
    <AccountShell>
      <PageMarker state="account" />

      {/* Title + sign out */}
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-jw-ink dark:text-gray-100">My account</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-base font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <span aria-hidden="true">⏏️</span>
          Sign out
        </button>
      </header>

      {/* My details */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-jw-ink dark:text-gray-100">My details</h2>
        <div className="mt-3">
          <EditableRow
            label="First name"
            value={account.name}
            editing={editing === 'name'}
            onEdit={() => startEdit('name')}
            onCancel={cancelEdit}
          >
            <input
              className={inputClass}
              value={draft.name || ''}
              onChange={(e) => setDraft({ name: e.target.value })}
              autoFocus
            />
            {rowError && <p className="mt-2 text-sm text-red-500">{rowError}</p>}
            <div className="mt-3">
              <button type="button" className={saveClass} disabled={saving} onClick={saveDetails}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </EditableRow>

          <EditableRow
            label="Email"
            value={account.email}
            editing={editing === 'email'}
            onEdit={() => startEdit('email')}
            onCancel={cancelEdit}
          >
            <input
              type="email"
              className={inputClass}
              value={draft.email || ''}
              onChange={(e) => setDraft({ email: e.target.value })}
              autoFocus
            />
            {rowError && <p className="mt-2 text-sm text-red-500">{rowError}</p>}
            <div className="mt-3">
              <button type="button" className={saveClass} disabled={saving} onClick={saveDetails}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </EditableRow>

          <EditableRow
            label="Password"
            value="•••••••"
            editing={editing === 'password'}
            onEdit={() => startEdit('password')}
            onCancel={cancelEdit}
          >
            <div className="flex flex-col gap-3">
              <input
                type="password"
                className={inputClass}
                placeholder="Current password"
                value={draft.currentPassword || ''}
                onChange={(e) => setDraft((d) => ({ ...d, currentPassword: e.target.value }))}
                autoFocus
              />
              <input
                type="password"
                className={inputClass}
                placeholder="New password (min 6 characters)"
                value={draft.newPassword || ''}
                onChange={(e) => setDraft((d) => ({ ...d, newPassword: e.target.value }))}
              />
            </div>
            {rowError && <p className="mt-2 text-sm text-red-500">{rowError}</p>}
            <div className="mt-3">
              <button type="button" className={saveClass} disabled={saving} onClick={saveDetails}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </EditableRow>
        </div>
      </section>

      {/* My membership */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-jw-ink dark:text-gray-100">My membership</h2>
        <div className="mt-3 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800" />
        <div className="mt-1">
          <Field label={null} value={<span className="font-bold">{m.plan}</span>} />
          <Field label="Membership type" value={m.type} />
          {canceled ? (
            <Field
              label="Access ends"
              value={<span className="text-jw-ink dark:text-gray-100">{m.endsOn}</span>}
            />
          ) : (
            <Field label="Renews" value={m.renews} />
          )}
          <Field label="Renewal amount" value={m.amount} />

          <div className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 py-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-400 dark:text-gray-400">Payment method</div>
              <div className="mt-1 text-lg text-jw-ink dark:text-gray-100">
                {card.brand} ending {card.last4} · exp {card.exp}
              </div>
            </div>
            <EditButton label="View / update" onClick={() => setPayOpen(true)} />
          </div>
        </div>

        <div className="border-b border-gray-100 dark:border-gray-800 py-5 text-center">
          {canceled ? (
            <button
              type="button"
              onClick={handleResubscribe}
              disabled={saving}
              className="text-lg font-semibold text-jw-blue hover:underline disabled:opacity-50"
            >
              Resubscribe
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmCancel(true)}
              className="text-lg font-semibold text-red-500 hover:underline"
            >
              Cancel subscription
            </button>
          )}
        </div>
      </section>

      {payOpen && (
        <PaymentModal
          card={card}
          onClose={() => setPayOpen(false)}
          onSaved={(membership) => {
            setAccount((a) => ({ ...a, membership }));
            setPayOpen(false);
          }}
        />
      )}

      {confirmCancel && (
        <ConfirmCancelModal
          endsOn={m.renews}
          saving={saving}
          onDismiss={() => setConfirmCancel(false)}
          onConfirm={handleCancelSub}
        />
      )}
    </AccountShell>
  );
}

// --- Modals ----------------------------------------------------------------

function ModalShell({ label, onClose, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="animate-backdrop-fade fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="animate-modal-pop w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  );
}

function PaymentModal({ card, onClose, onSaved }) {
  const [brand, setBrand] = useState(card.brand);
  const [last4, setLast4] = useState(card.last4);
  const [exp, setExp] = useState(card.exp);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setError('');
    try {
      const membership = await updatePayment({ brand, last4, exp });
      onSaved(membership);
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  return (
    <ModalShell label="Payment method" onClose={onClose}>
      <h2 className="text-2xl font-bold text-jw-ink dark:text-gray-100">Payment method</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Update the card on file.</p>

      <div className="mt-6 flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Card brand
          <input className={`mt-1 ${inputClass}`} value={brand} onChange={(e) => setBrand(e.target.value)} />
        </label>
        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Last 4 digits
          <input
            className={`mt-1 ${inputClass}`}
            value={last4}
            maxLength={4}
            inputMode="numeric"
            onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
          />
        </label>
        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Expiry (MM/YY)
          <input
            className={`mt-1 ${inputClass}`}
            value={exp}
            placeholder="MM/YY"
            onChange={(e) => setExp(e.target.value)}
          />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <button type="button" className={`mt-6 w-full py-4 text-lg ${saveClass}`} disabled={saving} onClick={save}>
        {saving ? 'Saving…' : 'Save card'}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="mt-3 w-full rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-4 text-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Cancel
      </button>
    </ModalShell>
  );
}

function ConfirmCancelModal({ endsOn, saving, onDismiss, onConfirm }) {
  return (
    <ModalShell label="Cancel subscription" onClose={onDismiss}>
      <h2 className="text-2xl font-bold text-jw-ink dark:text-gray-100">Cancel subscription?</h2>
      <p className="mt-3 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
        You’ll keep full access until <span className="font-semibold text-jw-ink dark:text-gray-100">{endsOn}</span>,
        after which your membership won’t renew.
      </p>

      <button
        type="button"
        onClick={onConfirm}
        disabled={saving}
        className="mt-6 w-full rounded-xl bg-red-500 px-4 py-4 text-lg font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {saving ? 'Cancelling…' : 'Yes, cancel subscription'}
      </button>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-3 w-full rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-4 text-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Keep my subscription
      </button>
    </ModalShell>
  );
}
