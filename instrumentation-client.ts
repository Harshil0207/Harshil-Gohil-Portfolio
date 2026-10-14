// React's <ViewTransition> silently ignores the InvalidStateError the browser
// raises when a transition is skipped because the tab went hidden — but it
// matches on exact message strings, and newer Chrome appends ". Document hidden"
// to "Transition was aborted because of invalid state". The mismatch makes React
// surface a harmless skip as an uncaught error. Normalise the message on the
// transition's `ready` promise so React recognises it again.
const KNOWN_MESSAGE = "Transition was aborted because of invalid state";

if (typeof document !== "undefined" && "startViewTransition" in document) {
  const start = document.startViewTransition.bind(document);

  document.startViewTransition = ((arg?: Parameters<typeof start>[0]) => {
    const transition = start(arg);
    const ready = transition.ready.catch((error: unknown) => {
      if (
        error instanceof DOMException &&
        error.name === "InvalidStateError" &&
        error.message.startsWith(KNOWN_MESSAGE)
      ) {
        throw new DOMException(KNOWN_MESSAGE, "InvalidStateError");
      }
      throw error;
    });
    Object.defineProperty(transition, "ready", { value: ready });
    return transition;
  }) as typeof document.startViewTransition;
}
