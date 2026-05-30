export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg bg-background pattern-waves">
      {children}
    </div>
  );
}
