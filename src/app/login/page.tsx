//src/app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "DRIVER" | "ADMIN";
  };
};

function notifyStorageChange() {
  window.dispatchEvent(new Event("aurora-storage"));
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@flui.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login.");
      }

      const loginData = data as LoginResponse;

      if (loginData.user.role !== "ADMIN") {
        throw new Error("Apenas administradores podem acessar o painel web.");
      }

      localStorage.setItem("@aurora:token", loginData.token);
      localStorage.setItem("@aurora:user", JSON.stringify(loginData.user));
      notifyStorageChange();

      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <section className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#7C3FCC] to-[#AAFF3E] flex items-center justify-center text-4xl mb-4">
            ⚡
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            aurora
          </h1>

          <p className="text-[#B87DFF] text-sm mt-1">Painel Flui</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-[#13131A] border border-white/10 rounded-3xl p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Entrar no painel
          </h2>

          <p className="text-sm text-zinc-400 mb-6">
            Acesse como administrador para gerenciar pontos de recarga,
            disponibilidade e avaliações.
          </p>

          <div className="mb-4">
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              E-mail
            </label>
            <input
              className="w-full rounded-2xl bg-[#1C1C28] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#AAFF3E]"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="admin@flui.com"
            />
          </div>

          <div className="mb-5">
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              Senha
            </label>
            <input
              className="w-full rounded-2xl bg-[#1C1C28] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#AAFF3E]"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="admin123"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#AAFF3E] text-[#0A1400] font-extrabold py-3 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-xs text-zinc-500 text-center mt-5">
            Usuário padrão: admin@flui.com / admin123
          </p>
        </form>
      </section>
    </main>
  );
}