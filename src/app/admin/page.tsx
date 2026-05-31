//src/app/admin/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Overview = {
  totalUsers: number;
  totalStations: number;
  totalChargers: number;
  availableChargers: number;
  occupiedChargers: number;
  offlineChargers: number;
  totalReviews: number;
  totalChargingHistory: number;
  ratingAverage: number;
};

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const token = localStorage.getItem("@aurora:token");

        const response = await fetch("/api/reports/overview", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar relatório.");
        }

        setOverview(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  return (
    <section className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-zinc-500 mt-1">
            Visão geral da rede Aurora by Flui.
          </p>
        </div>

        <Link
          href="/admin/stations"
          className="rounded-2xl bg-[#AAFF3E] text-[#0A1400] font-extrabold px-5 py-3"
        >
          Ver pontos
        </Link>
      </div>

      {loading ? (
        <div className="text-zinc-400">Carregando indicadores...</div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Pontos"
              value={overview?.totalStations ?? 0}
              detail="eletropostos cadastrados"
            />

            <MetricCard
              label="Carregadores"
              value={overview?.totalChargers ?? 0}
              detail={`${overview?.availableChargers ?? 0} livres agora`}
              highlight
            />

            <MetricCard
              label="Avaliações"
              value={overview?.totalReviews ?? 0}
              detail={`média ${overview?.ratingAverage ?? 0}/5`}
              purple
            />

            <MetricCard
              label="Usuários"
              value={overview?.totalUsers ?? 0}
              detail="motoristas e admins"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-[#13131A] border border-white/10 p-6">
              <h2 className="font-extrabold text-xl mb-4 text-white">
                Status da rede
              </h2>

              <div className="space-y-3">
                <StatusRow
                  label="Disponíveis"
                  value={overview?.availableChargers ?? 0}
                  color="bg-[#AAFF3E]"
                />
                <StatusRow
                  label="Ocupados"
                  value={overview?.occupiedChargers ?? 0}
                  color="bg-[#FFB23E]"
                />
                <StatusRow
                  label="Offline"
                  value={overview?.offlineChargers ?? 0}
                  color="bg-[#FF5F5F]"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-[#13131A] border border-white/10 p-6">
              <h2 className="font-extrabold text-xl mb-4 text-white">
                Resumo operacional
              </h2>

              <p className="text-zinc-400 text-sm leading-6">
                A rede Aurora está integrada ao banco Neon e à API REST do
                projeto. O app mobile usará esses mesmos endpoints para login,
                mapa, ficha dos pontos e avaliações.
              </p>

              <div className="mt-5 rounded-2xl bg-[#AAFF3E]/10 border border-[#AAFF3E]/20 p-4 text-[#AAFF3E] text-sm font-semibold">
                API pronta para consumo mobile.
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function MetricCard({
  label,
  value,
  detail,
  highlight,
  purple,
}: {
  label: string;
  value: number;
  detail: string;
  highlight?: boolean;
  purple?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-[#13131A] border border-white/10 p-5">
      <div className="text-xs text-zinc-500 mb-2">{label}</div>
      <div
        className={[
          "text-4xl font-extrabold",
          highlight ? "text-[#AAFF3E]" : "",
          purple ? "text-[#B87DFF]" : "",
          !highlight && !purple ? "text-white" : "",
        ].join(" ")}
      >
        {value}
      </div>
      <div className="text-xs text-zinc-500 mt-2">{detail}</div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-zinc-300 text-sm">{label}</span>
      </div>

      <span className="font-extrabold text-white">{value}</span>
    </div>
  );
}