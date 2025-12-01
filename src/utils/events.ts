export const HISTORIAL_CHANGED = "historial:changed";

export function emitHistorialChanged(detail?: any) {
  try {
    const ev = new CustomEvent(HISTORIAL_CHANGED, { detail });
    window.dispatchEvent(ev);
  } catch (e) {
    (window as any).__historial_changed_payload = detail ?? {};
    try { window.dispatchEvent(new Event(HISTORIAL_CHANGED)); } catch {}
  }
}

export function addHistorialChangedListener(cb: (ev?: Event) => void) {
  const handler = (ev: Event) => cb(ev);
  window.addEventListener(HISTORIAL_CHANGED, handler);
  return () => window.removeEventListener(HISTORIAL_CHANGED, handler);
}
