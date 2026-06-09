import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getSettings, updateSettings } from '../lib/settings.js';

// Green pill toggle switch.
function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
          checked ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  );
}

// A radio dot (filled blue ring when selected).
function Radio({ selected }) {
  return (
    <span
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${
        selected ? 'border-jw-blue' : 'border-gray-300 dark:border-gray-600'
      }`}
    >
      {selected && <span className="h-3.5 w-3.5 rounded-full bg-jw-blue" />}
    </span>
  );
}

// A row with a title, description, and a control on the right.
function Row({ title, description, control, divide = true }) {
  return (
    <div className={divide ? 'border-b border-gray-100 py-5 dark:border-gray-700' : 'py-5'}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xl text-jw-ink dark:text-gray-100">{title}</div>
          {description && (
            <div className="mt-1 text-base text-gray-500 dark:text-gray-400">{description}</div>
          )}
        </div>
        {control}
      </div>
    </div>
  );
}

function GeneralTab({ settings, set }) {
  const themes = [
    { key: 'light', label: 'Light theme' },
    { key: 'dark', label: 'Dark theme' },
    { key: 'system', label: 'Match device theme' },
  ];

  return (
    <div>
      {/* Appearance */}
      <div className="border-b border-gray-100 py-5 dark:border-gray-700">
        <div className="text-xl text-jw-ink dark:text-gray-100">Appearance</div>
        <div className="mt-3 flex flex-col gap-3">
          {themes.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => set({ theme: t.key })}
              className="flex items-center gap-3 text-left"
            >
              <Radio selected={settings.theme === t.key} />
              <span className="text-lg font-bold text-jw-ink dark:text-gray-100">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Row
        title="Play sound effects"
        description="Short sounds on button taps etc."
        control={
          <Toggle
            label="Play sound effects"
            checked={settings.soundEffects}
            onChange={(v) => set({ soundEffects: v })}
          />
        }
      />

      <Row
        title="Download stories"
        description={
          'Stories in-progress and "Study later" stories on your device so they’re available offline.'
        }
        control={
          <Toggle
            label="Download stories"
            checked={settings.downloadStories}
            onChange={(v) => set({ downloadStories: v })}
          />
        }
      />

      <Row
        title="Quickstart guide"
        description="Learn the Jiveworld Method step by step with a short story."
        control={null}
      />
      <div className="-mt-3 pb-5">
        <button
          type="button"
          onClick={() => {
            // Clears the locally-stored resume-card progress.
            try {
              localStorage.removeItem('jw_resume_progress');
            } catch {
              /* ignore */
            }
          }}
          className="rounded-full bg-gray-100 px-5 py-2.5 text-lg font-bold text-jw-ink hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          Reset story and guide…
        </button>
      </div>

      <Row
        title="Vocabulary export (Experimental)"
        divide={false}
        description={
          <>
            Displays an extra option on the story vocabulary list, that downloads a file with your
            selected vocabulary that you can import into a flashcard program.{' '}
            <a
              href="https://jiveworld.com"
              target="_blank"
              rel="noreferrer"
              className="text-jw-blue hover:underline"
            >
              Learn more
            </a>
          </>
        }
        control={
          <Toggle
            label="Vocabulary export"
            checked={settings.vocabExport}
            onChange={(v) => set({ vocabExport: v })}
          />
        }
      />
    </div>
  );
}

function PlayerTab({ settings, set }) {
  const xray = [
    { key: 'showAll', label: 'Show all words', preview: <span>Lorem ipsum dolor sit amet</span> },
    {
      key: 'hideSome',
      label: 'Hide some words',
      preview: (
        <span className="flex items-center gap-2">
          <Bar w="w-16" /> ipsum <Bar w="w-16" /> sit amet
        </span>
      ),
    },
    {
      key: 'hideAll',
      label: 'Hide all words',
      preview: (
        <span className="flex items-center gap-2">
          <Bar w="w-16" /> <Bar w="w-20" /> <Bar w="w-16" /> <Bar w="w-10" /> <Bar w="w-16" />
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="pt-5">
        <div className="text-xl text-jw-ink dark:text-gray-100">X-Ray mode</div>
        <div className="mt-1 text-base text-gray-500 dark:text-gray-400">
          Challenge yourself by hiding some (or all) of the words in the transcript.
        </div>

        <div className="mt-4 rounded-2xl bg-gray-100 px-4 dark:bg-gray-800">
          {xray.map((opt, i) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => set({ xrayMode: opt.key })}
              className={`flex w-full items-center gap-4 py-4 text-left ${
                i > 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''
              }`}
            >
              <Radio selected={settings.xrayMode === opt.key} />
              <span>
                <span className="block text-lg font-bold text-jw-ink dark:text-gray-100">
                  {opt.label}
                </span>
                <span className="mt-1 block text-lg text-gray-600 dark:text-gray-300">
                  {opt.preview}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <Row
          title="Smart Pause"
          description="Waits until the end of a sentence before stopping. Tap twice to stop immediately."
          control={
            <Toggle
              label="Smart Pause"
              checked={settings.smartPause}
              onChange={(v) => set({ smartPause: v })}
            />
          }
        />
        <Row
          title="Compact toolbar"
          divide={false}
          description="Shows more actions in the sentence toolbar, without labels."
          control={
            <Toggle
              label="Compact toolbar"
              checked={settings.compactToolbar}
              onChange={(v) => set({ compactToolbar: v })}
            />
          }
        />
      </div>
    </div>
  );
}

// A redacted-word bar used in the X-Ray previews.
function Bar({ w }) {
  return <span className={`inline-block h-4 ${w} rounded bg-gray-400 align-middle`} />;
}

export default function SettingsModal({ open, onClose }) {
  const [tab, setTab] = useState('general');
  const [settings, setSettings] = useState(getSettings);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function set(partial) {
    setSettings(updateSettings(partial));
  }

  return createPortal(
    <div
      className="animate-backdrop-fade fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 sm:py-10"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="animate-modal-pop flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        {/* Header */}
        <div className="relative px-6 pt-6">
          <h2 className="text-center text-2xl font-bold text-jw-ink dark:text-gray-100">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="absolute right-5 top-5 text-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>

          {/* Tabs */}
          <div className="mt-5 grid grid-cols-2">
            {[
              ['general', 'General'],
              ['player', 'Player'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`border-b-2 pb-3 text-lg font-bold transition-colors ${
                  tab === key
                    ? 'border-jw-blue text-jw-blue'
                    : 'border-gray-200 text-gray-400 hover:text-gray-600 dark:border-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
          {tab === 'general' ? (
            <GeneralTab settings={settings} set={set} />
          ) : (
            <PlayerTab settings={settings} set={set} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
