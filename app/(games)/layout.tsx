
export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white antialiased">

      <main className="flex-grow">
        {children}
      </main>

    </div>
  );
}
