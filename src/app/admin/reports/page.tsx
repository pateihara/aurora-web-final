//src/app/admin/reports/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function AdminReportsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOverview() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("@aurora:token");

        if (!token) {
          throw new Error("Token não encontrado. Faça login novamente.");
        }

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
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar relatório."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  const unavailableChargers = useMemo(() => {
    if (!overview) {
      return 0;
    }

    return overview.occupiedChargers + overview.offlineChargers;
  }, [overview]);

  const availabilityRate = useMemo(() => {
    if (!overview || overview.totalChargers === 0) {
      return 0;
    }

    return Number(
      ((overview.availableChargers / overview.totalChargers) * 100).toFixed(1)
    );
  }, [overview]);

  const offlineRate = useMemo(() => {
    if (!overview || overview.totalChargers === 0) {
      return 0;
    }

    return Number(
      ((overview.offlineChargers / overview.totalChargers) * 100).toFixed(1)
    );
  }, [overview]);

  const occupiedRate = useMemo(() => {
    if (!overview || overview.totalChargers === 0) {
      return 0;
    }

    return Number(
      ((overview.occupiedChargers / overview.totalChargers) * 100).toFixed(1)
    );
  }, [overview]);

  return (
    <section className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Relatórios</h1>
          <p className="mt-1 text-zinc-500">
            Indicadores operacionais da rede Aurora by Flui.
          </p>
        </div>

        <div className="rounded-2xl border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 px-5 py-3 text-sm font-bold text-[#AAFF3E]">
          Dados em tempo real
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6 text-zinc-400">
          Carregando relatórios...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Pontos ativos"
              value={overview?.totalStations ?? 0}
              detail="eletropostos cadastrados"
            />

            <MetricCard
              label="Carregadores"
              value={overview?.totalChargers ?? 0}
              detail={`${overview?.availableChargers ?? 0} disponíveis`}
              green
            />

            <MetricCard
              label="Avaliação média"
              value={overview?.ratingAverage ?? 0}
              detail={`${overview?.totalReviews ?? 0} avaliações registradas`}
              purple
            />

            <MetricCard
              label="Usuários"
              value={overview?.totalUsers ?? 0}
              detail="motoristas e administradores"
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    Disponibilidade da rede
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Situação atual dos carregadores cadastrados.
                  </p>
                </div>

                <span className="rounded-full border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 px-4 py-2 text-sm font-bold text-[#AAFF3E]">
                  {availabilityRate}% livres
                </span>
              </div>

              <div className="mb-6">
                <div className="mb-2 flex justify-between text-xs text-zinc-500">
                  <span>Uso da rede</span>
                  <span>{overview?.totalChargers ?? 0} carregadores</span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full bg-[#AAFF3E]"
                    style={{ width: `${availabilityRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <StatusCard
                  label="Disponíveis"
                  value={overview?.availableChargers ?? 0}
                  detail={`${availabilityRate}% da rede`}
                  color="green"
                />

                <StatusCard
                  label="Ocupados"
                  value={overview?.occupiedChargers ?? 0}
                  detail={`${occupiedRate}% da rede`}
                  color="amber"
                />

                <StatusCard
                  label="Offline"
                  value={overview?.offlineChargers ?? 0}
                  detail={`${offlineRate}% da rede`}
                  color="red"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6">
              <h2 className="mb-5 text-xl font-extrabold text-white">
                Resumo executivo
              </h2>

              <div className="space-y-4">
                <InsightCard
                  title="Saúde operacional"
                  text={
                    availabilityRate >= 60
                      ? "A rede apresenta boa disponibilidade para os motoristas neste momento."
                      : "A disponibilidade está baixa. Verifique pontos ocupados ou offline."
                  }
                  good={availabilityRate >= 60}
                />

                <InsightCard
                  title="Atenção técnica"
                  text={
                    offlineRate > 20
                      ? "Há um percentual relevante de carregadores offline. A manutenção deve ser priorizada."
                      : "O percentual de carregadores offline está controlado."
                  }
                  good={offlineRate <= 20}
                />

                <InsightCard
                  title="Experiência do usuário"
                  text={
                    (overview?.ratingAverage ?? 0) >= 4
                      ? "As avaliações indicam boa percepção dos motoristas."
                      : "A avaliação média sugere oportunidade de melhoria na experiência."
                  }
                  good={(overview?.ratingAverage ?? 0) >= 4}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6">
              <h2 className="mb-5 text-xl font-extrabold text-white">
                Indicadores de uso
              </h2>

              <div className="space-y-4">
                <ReportRow
                  label="Histórico de recargas"
                  value={overview?.totalChargingHistory ?? 0}
                  detail="registros simulados de carregamento"
                />

                <ReportRow
                  label="Carregadores indisponíveis"
                  value={unavailableChargers}
                  detail="ocupados ou offline no momento"
                />

                <ReportRow
                  label="Avaliações registradas"
                  value={overview?.totalReviews ?? 0}
                  detail="feedbacks enviados por motoristas"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6">
              <h2 className="mb-5 text-xl font-extrabold text-white">
                Decisões técnicas do projeto
              </h2>

              <div className="space-y-3 text-sm leading-6 text-zinc-400">
                <p>
                  O painel web consome a mesma API REST que será usada pelo app
                  mobile, garantindo integração entre motorista e administração.
                </p>

                <p>
                  O banco Neon PostgreSQL centraliza usuários, pontos de recarga,
                  carregadores, avaliações, favoritos e histórico.
                </p>

                <p>
                  A autenticação diferencia motoristas e administradores por
                  perfil, protegendo rotas sensíveis do painel Flui.
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-[#B87DFF]/20 bg-[#7C3FCC]/10 p-4 text-sm font-semibold text-[#B87DFF]">
                Arquitetura pronta para integração com o mobile.
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
  green,
  purple,
}: {
  label: string;
  value: number;
  detail: string;
  green?: boolean;
  purple?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#13131A] p-5">
      <div className="mb-2 text-xs text-zinc-500">{label}</div>

      <div
        className={[
          "text-4xl font-extrabold",
          green ? "text-[#AAFF3E]" : "",
          purple ? "text-[#B87DFF]" : "",
          !green && !purple ? "text-white" : "",
        ].join(" ")}
      >
        {value}
      </div>

      <div className="mt-2 text-xs text-zinc-500">{detail}</div>
    </div>
  );
}

function StatusCard({
  label,
  value,
  detail,
  color,
}: {
  label: string;
  value: number;
  detail: string;
  color: "green" | "amber" | "red";
}) {
  const colorClasses = {
    green: "text-[#AAFF3E] bg-[#AAFF3E]/10 border-[#AAFF3E]/20",
    amber: "text-[#FFB23E] bg-[#FFB23E]/10 border-[#FFB23E]/20",
    red: "text-[#FF5F5F] bg-[#FF5F5F]/10 border-[#FF5F5F]/20",
  };

  return (
    <div className={`rounded-2xl border p-4 ${colorClasses[color]}`}>
      <div className="mb-1 text-xs opacity-80">{label}</div>
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="mt-1 text-xs opacity-80">{detail}</div>
    </div>
  );
}

function InsightCard({
  title,
  text,
  good,
}: {
  title: string;
  text: string;
  good: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-4",
        good
          ? "border-[#AAFF3E]/20 bg-[#AAFF3E]/10"
          : "border-[#FFB23E]/20 bg-[#FFB23E]/10",
      ].join(" ")}
    >
      <div
        className={[
          "mb-1 text-sm font-extrabold",
          good ? "text-[#AAFF3E]" : "text-[#FFB23E]",
        ].join(" ")}
      >
        {title}
      </div>

      <p className="text-sm leading-5 text-zinc-300">{text}</p>
    </div>
  );
}

function ReportRow({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <div>
        <div className="font-bold text-white">{label}</div>
        <div className="mt-1 text-xs text-zinc-500">{detail}</div>
      </div>

      <div className="text-2xl font-extrabold text-[#B87DFF]">{value}</div>
    </div>
  );
}