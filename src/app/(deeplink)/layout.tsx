/**
 * Minimal layout for deep link bridge pages.
 * 
 * Route group (deeplink) uses this layout instead of the root layout.
 * This avoids nesting a full <html> document inside the global layout's
 * <html>/<body> wrappers, which would produce invalid HTML.
 * 
 * This layout renders NOTHING extra — children get the full document control.
 * The DeepLinkBridge component renders its own complete <html> document
 * with inline CSS for instant, zero-flash rendering.
 */
export default function DeepLinkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
