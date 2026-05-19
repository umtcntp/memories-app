import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Sidebar from "../components/Sidebar";
import CloverIcon from "../components/CloverIcon";

function AppLayout() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  async function checkAuth() {
    try {
      const response = await axiosClient.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.error(error);
      navigate("/login");
    } finally {
      setCheckingAuth(false);
    }
  }

  async function handleLogout() {
    try {
      await axiosClient.post("/auth/logout");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ec]">
        <div className="flex items-center gap-3 text-green-800">
          <CloverIcon className="h-6 w-6 animate-pulse" />
          <span>Kontrol ediliyor...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ec] text-green-950">
      <div className="flex">
        <Sidebar user={user} onLogout={handleLogout} />

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <MobileHeader user={user} onLogout={handleLogout} />

          <div className="mx-auto max-w-7xl">
            <Outlet context={{ user }} />
          </div>
        </section>
      </div>
    </main>
  );
}

function MobileHeader({ user, onLogout }) {
  return (
    <header className="mb-5 flex items-center justify-between rounded-3xl border border-green-100 bg-white/80 p-4 shadow-sm lg:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <CloverIcon className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold text-green-950">Yoncalı Anılar</p>
          <p className="text-xs text-green-700">
            {user?.name || "Can"} & Yonca
          </p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="rounded-2xl bg-green-700 px-4 py-2 text-sm text-white"
      >
        Çıkış
      </button>
    </header>
  );
}

export default AppLayout;