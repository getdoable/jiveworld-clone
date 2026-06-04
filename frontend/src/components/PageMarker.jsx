// Injects an HTML comment node at the top of a page identifying the crawler
// state it represents, e.g. <!-- PAGE STATE: stories:filter=Shorts -->.
// React can't emit raw comment nodes, so we mount one via dangerouslySetInnerHTML.
export default function PageMarker({ state }) {
  return (
    <div
      data-page-state={state}
      style={{ display: 'none' }}
      dangerouslySetInnerHTML={{ __html: `<!-- PAGE STATE: ${state} -->` }}
    />
  );
}
