export function DashboardShell({
  userName,
  todayStr,
  children,
}: {
  userName: string;
  todayStr: string;
  children: React.ReactNode;
}) {
  const firstName = userName.split(" ")[0];

  const todayDisplay = new Date(todayStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 max-w-lg mx-auto space-y-6 font-[family-name:var(--font-geist-sans)]">

      {/* Greeting — static, no skeleton needed */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#F4F3ED]/70 font-medium mb-1 capitalize">{todayDisplay}</p>
          <h1 className="text-2xl font-bold text-[#F4F3ED]">Halo, {firstName} 👋</h1>
          <p className="text-sm text-[#F4F3ED]/70 mt-1">Ini ringkasan hari ini.</p>
        </div>
      </div>

      {/* Dynamic content (streamed) */}
      {children}

    </main>
  );
}