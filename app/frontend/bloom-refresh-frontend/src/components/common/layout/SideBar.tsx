export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <nav className="space-y-2">
        <a href="/dashboard" className="block p-2 hover:bg-gray-200 rounded">Dashboard</a>
        <a href="/events" className="block p-2 hover:bg-gray-200 rounded">Events</a>
        <a href="/reports" className="block p-2 hover:bg-gray-200 rounded">Reports</a>
      </nav>
    </aside>
  );
}
