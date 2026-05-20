import { NavLink } from "react-router-dom";
import CloverIcon from "./CloverIcon";
import DaysTogetherCard from "./DaysTogetherCard";
import { dailyNotes } from "../data/dailyNotes";
import { getTodayDailyNote } from "../utils/dateUtils";

const menuItems = [
    { label: "Ana Sayfa", icon: "⌂", path: "/dashboard" },
    { label: "Fotoğraflar", icon: "▧", path: "/photos" },
    { label: "Videolar", icon: "▶", path: "/videos" },
    { label: "Ses Kayıtları", icon: "🎙", path: "/audio" },
    { label: "Müzikler", icon: "♪", path: "/music" },
    { label: "Özel Günler", icon: "□", path: "/special-days" },
    { label: "Notlar", icon: "✎", path: "/notes" },
    { label: "Favoriler", icon: "♡", path: "/favorites" },
    { label: "Anıları Yönet", icon: "⚙", path: "/admin/memories" },
    { label: "Anı Ekle", icon: "+", path: "/admin/memories/new" },
];

function Sidebar({ user, onLogout }) {
    const todayNote = getTodayDailyNote(dailyNotes);
    return (
        <aside className="hidden min-h-screen w-72 shrink-0 border-r border-green-100 bg-white/70 px-6 py-8 lg:flex lg:flex-col">
            <div className="mb-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <CloverIcon className="h-7 w-7" />
                </div>

                <div>
                    <p className="text-xl font-semibold leading-5 text-green-950">
                        Yoncalı
                    </p>
                    <p className="text-xl font-semibold leading-5 text-rose-500">
                        Anılar
                    </p>
                </div>
            </div>

            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${isActive
                                ? "bg-rose-50 text-rose-500"
                                : "text-green-950 hover:bg-green-50"
                            }`
                        }
                    >
                        <span className="flex h-6 w-6 items-center justify-center text-base">
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-8 rounded-3xl border border-green-100 bg-green-50/70 p-5">
                <div className="mb-3 flex items-center gap-2">
                    <CloverIcon className="h-5 w-5 text-green-500" />
                    <p className="text-sm font-semibold text-green-950">Bugünün Notu</p>
                </div>

                <p className="text-sm leading-6 text-green-700">
                    “{todayNote}”
                </p>

                <div className="mt-4 flex items-center gap-1">
                    <span className="h-1.5 w-6 rounded-full bg-green-500" />
                    <span className="h-1.5 w-1.5 rounded-full bg-green-200" />
                    <span className="h-1.5 w-1.5 rounded-full bg-green-200" />
                </div>
            </div>

            <div className="mt-auto space-y-5">
                <DaysTogetherCard />

                <div className="flex items-center gap-3 rounded-2xl bg-white p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-800">
                        {user?.name?.[0] || "C"}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-green-950">
                            {user?.name || "Can"}
                        </p>
                        <p className="truncate text-xs text-green-600">{user?.role}</p>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="w-full rounded-2xl border border-green-100 bg-white px-4 py-3 text-sm font-medium text-green-800 hover:bg-green-50"
                >
                    Çıkış Yap
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;