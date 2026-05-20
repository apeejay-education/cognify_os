import { useApp, type Page } from "../App";

const NAV_LINKS: { label: string; page: Page | null }[] = [
  { label: "Dashboard", page: "dashboard" },
  { label: "CRM", page: "crm" },
  { label: "Curriculum", page: null },
  { label: "Insights", page: null },
];

export default function Navbar() {
  const { navigate, logout, user, currentPage } = useApp();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <header className="bg-white/70 backdrop-blur-[20px] fixed top-0 w-full z-50 border-b border-white/50 shadow-[0_4px_30px_rgba(95,92,112,0.06)]">
      <div className="flex justify-between items-center h-20 px-margin-page max-w-container-max mx-auto">
        {/* Brand + Nav */}
        <div className="flex items-center gap-10">
          <button
            onClick={() => navigate("dashboard")}
            className="font-semibold text-2xl text-primary tracking-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            Cognify
          </button>
          <nav className="hidden md:flex gap-8 items-center">
            {NAV_LINKS.map(({ label, page }) => {
              const active = page === currentPage;
              return (
                <button
                  key={label}
                  onClick={() => page && navigate(page)}
                  className={`text-body-md font-medium transition-all duration-300 ${
                    active
                      ? "text-primary font-semibold border-b-2 border-primary pb-1"
                      : page
                      ? "text-on-surface-variant hover:text-primary"
                      : "text-on-surface-variant/50 cursor-default"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button className="hidden lg:block bg-primary text-on-primary px-6 py-2 rounded-full text-label-caps font-bold tracking-widest scale-95 active:scale-90 transition-transform shadow-lg">
            CREATE
          </button>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <button className="hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button
              onClick={logout}
              title={`Sign out (${user?.email})`}
              className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm hover:bg-secondary hover:text-on-secondary transition-colors"
            >
              {initials}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
