export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">404 — Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}
