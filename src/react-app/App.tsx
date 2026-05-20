import { useState, useEffect, createContext, useContext } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CrmPage from "./pages/CrmPage";
import StudentsPage from "./pages/StudentsPage";

export type Page = "login" | "dashboard" | "crm" | "students";

export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

export interface AppContextType {
  user: AuthUser | null;
  token: string | null;
  navigate: (page: Page) => void;
  logout: () => Promise<void>;
  currentPage: Page;
}

export const AppCtx = createContext<AppContextType>({} as AppContextType);
export const useApp = () => useContext(AppCtx);

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("cognify_token");
    if (saved) {
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${saved}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
            setToken(saved);
            setPage("dashboard");
          } else {
            localStorage.removeItem("cognify_token");
          }
        })
        .catch(() => localStorage.removeItem("cognify_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (u: AuthUser, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("cognify_token", t);
    setPage("dashboard");
  };

  const handleLogout = async () => {
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem("cognify_token");
    setUser(null);
    setToken(null);
    setPage("login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-primary">refresh</span>
          <span className="text-body-md">Loading Cognify...</span>
        </div>
      </div>
    );
  }

  const ctx: AppContextType = {
    user,
    token,
    navigate: setPage,
    logout: handleLogout,
    currentPage: page,
  };

  return (
    <AppCtx.Provider value={ctx}>
      {page === "login" && <LoginPage onLogin={handleLogin} />}
      {page === "dashboard" && <DashboardPage />}
      {page === "crm" && <CrmPage />}
      {page === "students" && <StudentsPage />}
    </AppCtx.Provider>
  );
}
