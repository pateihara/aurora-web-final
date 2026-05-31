//src/app/admin/stations/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ConnectorType = "CCS2" | "CHADEMO" | "TYPE2" | "AC" | "GBT";

type ChargerStatus = "AVAILABLE" | "OCCUPIED" | "OFFLINE" | "MAINTENANCE";

type ChargerInput = {
  label: string;
  connector: ConnectorType;
  powerKw: number;
  status: ChargerStatus;
};

type GeocodeResponse = {
  latitude: number;
  longitude: number;
  displayName: string;
};

const amenityOptions = [
  "Café",
  "Wi-Fi",
  "Estacionamento",
  "Shopping",
  "Banheiro",
  "Acessível",
  "Hospedagem",
];

const connectorOptions: { value: ConnectorType; label: string }[] = [
  { value: "CCS2", label: "CCS2" },
  { value: "CHADEMO", label: "CHAdeMO" },
  { value: "TYPE2", label: "Type 2" },
  { value: "AC", label: "AC" },
  { value: "GBT", label: "GB/T" },
];

const statusOptions: { value: ChargerStatus; label: string }[] = [
  { value: "AVAILABLE", label: "Livre" },
  { value: "OCCUPIED", label: "Ocupado" },
  { value: "OFFLINE", label: "Offline" },
  { value: "MAINTENANCE", label: "Manutenção" },
];

export default function NewStationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("Flui Novo Ponto");
  const [address, setAddress] = useState("R. Marechal Deodoro, 630");
  const [city, setCity] = useState("Curitiba");
  const [state, setState] = useState("PR");
  const [isOpen24h, setIsOpen24h] = useState(true);
  const [amenities, setAmenities] = useState<string[]>([
    "Wi-Fi",
    "Estacionamento",
  ]);

  const [lastCoordinates, setLastCoordinates] =
    useState<GeocodeResponse | null>(null);

  const [chargers, setChargers] = useState<ChargerInput[]>([
    {
      label: "Ponto 1",
      connector: "CCS2",
      powerKw: 150,
      status: "AVAILABLE",
    },
  ]);

  function toggleAmenity(amenity: string) {
    setAmenities((current) => {
      if (current.includes(amenity)) {
        return current.filter((item) => item !== amenity);
      }

      return [...current, amenity];
    });
  }

  function updateCharger<K extends keyof ChargerInput>(
    index: number,
    field: K,
    value: ChargerInput[K]
  ) {
    setChargers((current) =>
      current.map((charger, chargerIndex) => {
        if (chargerIndex !== index) {
          return charger;
        }

        return {
          ...charger,
          [field]: value,
        };
      })
    );
  }

  function addCharger() {
    setChargers((current) => [
      ...current,
      {
        label: `Ponto ${current.length + 1}`,
        connector: "CCS2",
        powerKw: 150,
        status: "AVAILABLE",
      },
    ]);
  }

  function removeCharger(index: number) {
    setChargers((current) =>
      current.filter((_, chargerIndex) => chargerIndex !== index)
    );
  }

  async function getCoordinatesByAddress() {
    const response = await fetch("/api/geocode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        city,
        state,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao buscar coordenadas.");
    }

    return data as GeocodeResponse;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("@aurora:token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (!name || !address || !city || !state) {
        throw new Error("Preencha nome, endereço, cidade e estado.");
      }

      if (chargers.length === 0) {
        throw new Error("Cadastre pelo menos um carregador.");
      }

      const coordinates = await getCoordinatesByAddress();

      setLastCoordinates(coordinates);

      const response = await fetch("/api/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          address,
          city,
          state,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          isOpen24h,
          amenities,
          chargers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar ponto.");
      }

      router.push("/admin/stations");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar ponto.");
    } finally {
      setLoading(false);
    }
  }

  const availableChargers = chargers.filter(
    (charger) => charger.status === "AVAILABLE"
  ).length;

  return (
    <section className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Novo ponto</h1>
          <p className="mt-1 text-zinc-500">
            Cadastre um novo eletroposto na rede Aurora.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/stations")}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
        >
          Voltar
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]"
      >
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6">
            <h2 className="mb-5 text-xl font-extrabold text-white">
              Informações básicas
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nome do ponto">
                <input
                  className="aurora-input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>

              <Field label="Cidade">
                <input
                  className="aurora-input"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  required
                />
              </Field>

              <Field label="Endereço">
                <input
                  className="aurora-input"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                />
              </Field>

              <Field label="Estado">
                <input
                  className="aurora-input"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="mt-5 rounded-2xl border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 p-4">
              <p className="text-sm font-bold text-[#AAFF3E]">
                Coordenadas automáticas
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Ao salvar, o sistema buscará latitude e longitude usando
                endereço, cidade e estado.
              </p>
            </div>

            <div className="mt-5">
              <label className="flex items-center gap-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={isOpen24h}
                  onChange={(event) => setIsOpen24h(event.target.checked)}
                  className="h-4 w-4 accent-[#AAFF3E]"
                />
                Funciona 24 horas
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6">
            <h2 className="mb-5 text-xl font-extrabold text-white">
              Comodidades
            </h2>

            <div className="flex flex-wrap gap-3">
              {amenityOptions.map((amenity) => {
                const active = amenities.includes(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-bold transition",
                      active
                        ? "border-[#AAFF3E] bg-[#AAFF3E] text-[#0A1400]"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white">
                Carregadores
              </h2>

              <button
                type="button"
                onClick={addCharger}
                className="rounded-2xl border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 px-4 py-2 text-sm font-bold text-[#AAFF3E] transition hover:bg-[#AAFF3E]/20"
              >
                Adicionar carregador
              </button>
            </div>

            <div className="space-y-4">
              {chargers.map((charger, index) => (
                <div
                  key={`${charger.label}-${index}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <Field label="Nome">
                      <input
                        className="aurora-input"
                        value={charger.label}
                        onChange={(event) =>
                          updateCharger(index, "label", event.target.value)
                        }
                        required
                      />
                    </Field>

                    <Field label="Conector">
                      <select
                        className="aurora-input"
                        value={charger.connector}
                        onChange={(event) =>
                          updateCharger(
                            index,
                            "connector",
                            event.target.value as ConnectorType
                          )
                        }
                      >
                        {connectorOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Potência kW">
                      <input
                        className="aurora-input"
                        type="number"
                        min={1}
                        value={charger.powerKw}
                        onChange={(event) =>
                          updateCharger(
                            index,
                            "powerKw",
                            Number(event.target.value)
                          )
                        }
                        required
                      />
                    </Field>

                    <Field label="Status">
                      <select
                        className="aurora-input"
                        value={charger.status}
                        onChange={(event) =>
                          updateCharger(
                            index,
                            "status",
                            event.target.value as ChargerStatus
                          )
                        }
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {chargers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCharger(index)}
                      className="mt-3 text-xs font-bold text-red-300 transition hover:text-red-200"
                    >
                      Remover carregador
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#AAFF3E] py-4 font-extrabold text-[#0A1400] transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Buscando coordenadas e salvando..." : "Salvar ponto"}
          </button>
        </div>

        <aside className="h-fit rounded-3xl border border-white/10 bg-[#13131A] p-6 xl:sticky xl:top-8">
          <h2 className="mb-4 text-xl font-extrabold text-white">
            Prévia do ponto
          </h2>

          <div className="rounded-2xl border border-white/10 bg-[#1C1C28] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold text-white">{name}</div>
                <div className="mt-1 text-xs text-zinc-500">
                  {address} · {city}/{state}
                </div>
              </div>

              <span className="rounded-full border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 px-3 py-1 text-xs font-bold text-[#AAFF3E]">
                {isOpen24h ? "24h" : "Limitado"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <PreviewStat label="Carregadores" value={chargers.length} />
              <PreviewStat label="Livres" value={availableChargers} green />
            </div>

            <div className="mt-5">
              <div className="mb-2 text-xs text-zinc-500">Coordenadas</div>

              {lastCoordinates ? (
                <div className="rounded-2xl border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 p-4 text-xs text-zinc-300">
                  <div>Latitude: {lastCoordinates.latitude}</div>
                  <div className="mt-1">
                    Longitude: {lastCoordinates.longitude}
                  </div>
                  <div className="mt-2 text-[#AAFF3E]">
                    Local encontrado automaticamente.
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-zinc-500">
                  As coordenadas serão preenchidas automaticamente ao salvar.
                </div>
              )}
            </div>

            <div className="mt-5">
              <div className="mb-2 text-xs text-zinc-500">Comodidades</div>

              <div className="flex flex-wrap gap-2">
                {amenities.length > 0 ? (
                  amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
                    >
                      {amenity}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-600">
                    Nenhuma comodidade selecionada
                  </span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-zinc-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function PreviewStat({
  label,
  value,
  green,
}: {
  label: string;
  value: number;
  green?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-1 text-xs text-zinc-500">{label}</div>
      <div
        className={[
          "text-2xl font-extrabold",
          green ? "text-[#AAFF3E]" : "text-white",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}