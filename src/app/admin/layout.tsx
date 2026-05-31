//src/app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore } from "react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "DRIVER" | "ADMIN";
};

type StoredSession = {
  token: string | null;
  user: AdminUser | null;
  isAuthorized: boolean;
};

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/stations",
    label: "Pontos de recarga",
  },
  {
    href: "/admin/reviews",
    label: "Avaliações",
  },
  {
    href: "/admin/reports",
    label: "Relatórios",
  },
  {
    href: "/admin/users",
    label: "Usuários",
  },
];

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("aurora-storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("aurora-storage", callback);
  };
}

function getClientSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  const token = localStorage.getItem("@aurora:token");
  const user = localStorage.getItem("@aurora:user");

  return JSON.stringify({
    token,
    user,
  });
}

function getServerSnapshot() {
  return "";
}

function parseSession(snapshot: string): StoredSession {
  if (!snapshot) {
    return {
      token: null,
      user: null,
      isAuthorized: false,
    };
  }

  try {
    const parsed = JSON.parse(snapshot) as {
      token: string | null;
      user: string | null;
    };

    if (!parsed.token || !parsed.user) {
      return {
        token: null,
        user: null,
        isAuthorized: false,
      };
    }

    const user = JSON.parse(parsed.user) as AdminUser;

    return {
      token: parsed.token,
      user,
      isAuthorized: user.role === "ADMIN",
    };
  } catch {
    return {
      token: null,
      user: null,
      isAuthorized: false,
    };
  }
}

function notifyStorageChange() {
  window.dispatchEvent(new Event("aurora-storage"));
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const snapshot = useSyncExternalStore(
    subscribeToStorage,
    getClientSnapshot,
    getServerSnapshot
  );

  const session = useMemo(() => parseSession(snapshot), [snapshot]);

  useEffect(() => {
    if (!snapshot) {
      return;
    }

    if (!session.isAuthorized) {
      router.replace("/login");
    }
  }, [snapshot, session.isAuthorized, router]);

  function handleLogout() {
    localStorage.removeItem("@aurora:token");
    localStorage.removeItem("@aurora:user");
    notifyStorageChange();
    router.replace("/login");
  }

  if (!snapshot) {
    return (
      <main className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white">
        Carregando painel...
      </main>
    );
  }

  if (!session.isAuthorized) {
    return (
      <main className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white">
        Redirecionando para login...
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white grid grid-cols-[240px_1fr]">
      <aside className="bg-[#0E0E18] border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C3FCC] to-[#AAFF3E] flex items-center justify-center text-xl">
              ⚡
            </div>

            <div>
              <div className="font-extrabold text-lg leading-none">aurora</div>
              <div className="text-xs text-zinc-500 mt-1">Admin Flui</div>
            </div>
          </div>
        </div>

        <nav className="p-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  active
                    ? "bg-[#AAFF3E]/10 text-[#AAFF3E] border border-[#AAFF3E]/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 p-4 mb-3">
            <div className="text-sm font-bold">
              {session.user?.name || "Administrador"}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {session.user?.email || "admin@flui.com"}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-2xl border border-red-400/30 bg-red-500/10 text-red-300 py-3 text-sm font-bold hover:bg-red-500/20 transition"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="overflow-y-auto">{children}</main>
    </div>
  );
}