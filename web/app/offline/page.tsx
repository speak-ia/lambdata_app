export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-heading text-2xl font-bold">Hors ligne</h1>
      <p className="text-muted-foreground">
        Lambdata fonctionne hors connexion. Vos contributions seront synchronisées
        dès le retour du réseau.
      </p>
    </div>
  );
}
