export default function ModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is a placeholder for the @modal parallel route.
  // When using Next intercepting/parallel routes, this layout would render
  // modal content into a named slot. For now it just renders children.
  return <>{children}</>;
}
