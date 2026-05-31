//src/app/admin/stations/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Charger = {
  id: string;
  label: string;
  connector: string;
  powerKw: number;
  status: "AVAILABLE" | "OCCUPIED" | "OFFLINE" | "MAINTENANCE";
};

type Station = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  amenities: string[];
  chargers: Charger[];
  totalChargers: number;
  availableChargers: number;
  totalReviews: number;
  ratingAverage: number;
};

export default function AdminStationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStations() {
      try {
        const response = await fetch("/api/stations");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar pontos.");
        }

        setStations(data);
      } catch (error) {
        console.error("Erro ao carregar pontos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStations();
  }, []);

  return (
    <section className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Pontos de recarga
          </h1>
          <p className="mt-1 text-zinc-500">
            Gerencie os eletropostos cadastrados na plataforma.
          </p>
        </div>

        <Link
          href="/admin/stations/new"
          className="rounded-2xl bg-[#AAFF3E] px-5 py-3 font-extrabold text-[#0A1400] transition hover:opacity-90"
        >
          Novo ponto
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#13131A]">
        <div className="flex justify-between border-b border-white/10 px-5 py-4">
          <span className="font-bold text-white">Lista de pontos</span>
          <span className="text-sm text-zinc-500">
            {stations.length} registros
          </span>
        </div>

        {loading ? (
          <div className="p-6 text-zinc-400">Carregando pontos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-zinc-500">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold">Ponto</th>
                  <th className="px-5 py-4 text-left font-semibold">Status</th>
                  <th className="px-5 py-4 text-left font-semibold">
                    Carregadores
                  </th>
                  <th className="px-5 py-4 text-left font-semibold">
                    Avaliação
                  </th>
                  <th className="px-5 py-4 text-left font-semibold">
                    Conectores
                  </th>
                  <th className="px-5 py-4 text-left font-semibold">Ações</th>
                </tr>
              </thead>

              <tbody>
                {stations.map((station) => (
                  <tr
                    key={station.id}
                    className="border-t border-white/5 hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{station.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {station.address} · {station.city}/{station.state}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StationStatus station={station} />
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-[#AAFF3E]">
                        {station.availableChargers}
                      </span>
                      <span className="text-zinc-500">
                        {" "}
                        / {station.totalChargers}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-[#B87DFF]">
                        ★ {station.ratingAverage}
                      </span>
                      <div className="text-xs text-zinc-500">
                        {station.totalReviews} avaliações
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {Array.from(
                          new Set(
                            station.chargers.map((charger) => charger.connector)
                          )
                        ).map((connector) => (
                          <span
                            key={connector}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
                          >
                            {connector}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/stations/${station.id}`}
                        className="rounded-xl border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 px-3 py-2 text-xs font-bold text-[#AAFF3E] transition hover:bg-[#AAFF3E]/20"
                      >
                        Gerenciar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {stations.length === 0 && (
              <div className="p-6 text-zinc-400">
                Nenhum ponto cadastrado ainda.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function StationStatus({ station }: { station: Station }) {
  const hasOffline = station.chargers.some(
    (charger) => charger.status === "OFFLINE"
  );

  if (hasOffline && station.availableChargers === 0) {
    return (
      <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300">
        Offline
      </span>
    );
  }

  if (station.availableChargers === 0) {
    return (
      <span className="rounded-full border border-[#FFB23E]/20 bg-[#FFB23E]/10 px-3 py-1 text-xs font-bold text-[#FFB23E]">
        Ocupado
      </span>
    );
  }

  if (station.availableChargers < station.totalChargers) {
    return (
      <span className="rounded-full border border-[#FFB23E]/20 bg-[#FFB23E]/10 px-3 py-1 text-xs font-bold text-[#FFB23E]">
        Parcial
      </span>
    );
  }

  return (
    <span className="rounded-full border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 px-3 py-1 text-xs font-bold text-[#AAFF3E]">
      Livre
    </span>
  );
}