//src/app/admin/stations/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type ConnectorType = "CCS2" | "CHADEMO" | "TYPE2" | "AC" | "GBT";

type ChargerStatus = "AVAILABLE" | "OCCUPIED" | "OFFLINE" | "MAINTENANCE";

type Charger = {
  id: string;
  label: string;
  connector: ConnectorType;
  powerKw: number;
  status: ChargerStatus;
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  availabilityScore: number;
  qualityScore: number;
  amenitiesScore: number;
  signageScore: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
};

type Station = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isOpen24h: boolean;
  amenities: string[];
  chargers: Charger[];
  reviews: Review[];
  totalChargers: number;
  availableChargers: number;
  totalReviews: number;
  ratingAverage: number;
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

export default function StationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStation, setSavingStation] = useState(false);
  const [deletingStation, setDeletingStation] = useState(false);
  const [savingChargerId, setSavingChargerId] = useState<string | null>(null);
  const [deletingChargerId, setDeletingChargerId] = useState<string | null>(
    null
  );
  const [creatingCharger, setCreatingCharger] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isOpen24h, setIsOpen24h] = useState(true);
  const [amenities, setAmenities] = useState<string[]>([]);

  const [newChargerLabel, setNewChargerLabel] = useState("Novo ponto");
  const [newChargerConnector, setNewChargerConnector] =
    useState<ConnectorType>("CCS2");
  const [newChargerPowerKw, setNewChargerPowerKw] = useState(150);
  const [newChargerStatus, setNewChargerStatus] =
    useState<ChargerStatus>("AVAILABLE");

  const loadStation = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/stations/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar ponto.");
      }

      const stationData = data as Station;

      setStation(stationData);
      setName(stationData.name);
      setAddress(stationData.address);
      setCity(stationData.city);
      setState(stationData.state);
      setIsOpen24h(stationData.isOpen24h);
      setAmenities(stationData.amenities ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar ponto.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (!params.id) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadStation();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [params.id, loadStation]);

  const availableChargers = useMemo(() => {
    if (!station) {
      return 0;
    }

    return station.chargers.filter((charger) => charger.status === "AVAILABLE")
      .length;
  }, [station]);

  const addressChanged = useMemo(() => {
    if (!station) {
      return false;
    }

    return (
      station.address !== address ||
      station.city !== city ||
      station.state !== state
    );
  }, [station, address, city, state]);

  function toggleAmenity(amenity: string) {
    setAmenities((current) => {
      if (current.includes(amenity)) {
        return current.filter((item) => item !== amenity);
      }

      return [...current, amenity];
    });
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

  async function handleSaveStation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSavingStation(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("@aurora:token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (!name || !address || !city || !state) {
        throw new Error("Preencha nome, endereço, cidade e estado.");
      }

      let latitude = station?.latitude;
      let longitude = station?.longitude;

      if (addressChanged) {
        const coordinates = await getCoordinatesByAddress();
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      }

      const response = await fetch(`/api/stations/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          address,
          city,
          state,
          latitude,
          longitude,
          isOpen24h,
          amenities,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar ponto.");
      }

      const updatedStation = data as Station;

      setStation(updatedStation);
      setName(updatedStation.name);
      setAddress(updatedStation.address);
      setCity(updatedStation.city);
      setState(updatedStation.state);
      setIsOpen24h(updatedStation.isOpen24h);
      setAmenities(updatedStation.amenities ?? []);

      setSuccessMessage(
        addressChanged
          ? "Ponto atualizado com novas coordenadas."
          : "Ponto atualizado com sucesso."
      );

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar ponto.");
    } finally {
      setSavingStation(false);
    }
  }

  async function handleUpdateCharger(charger: Charger) {
    try {
      setSavingChargerId(charger.id);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("@aurora:token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const response = await fetch(`/api/chargers/${charger.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label: charger.label,
          connector: charger.connector,
          powerKw: charger.powerKw,
          status: charger.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar carregador.");
      }

      setSuccessMessage("Carregador atualizado com sucesso.");
      await loadStation();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar carregador."
      );
    } finally {
      setSavingChargerId(null);
    }
  }

  async function handleDeleteCharger(chargerId: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja remover este carregador?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingChargerId(chargerId);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("@aurora:token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const response = await fetch(`/api/chargers/${chargerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao remover carregador.");
      }

      setSuccessMessage("Carregador removido com sucesso.");
      await loadStation();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao remover carregador."
      );
    } finally {
      setDeletingChargerId(null);
    }
  }

  function updateLocalCharger<K extends keyof Charger>(
    chargerId: string,
    field: K,
    value: Charger[K]
  ) {
    setStation((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        chargers: current.chargers.map((charger) =>
          charger.id === chargerId
            ? {
                ...charger,
                [field]: value,
              }
            : charger
        ),
      };
    });
  }

  async function handleCreateCharger(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setCreatingCharger(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("@aurora:token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (!newChargerLabel || !newChargerPowerKw) {
        throw new Error("Preencha nome e potência do novo carregador.");
      }

      const response = await fetch(`/api/stations/${params.id}/chargers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label: newChargerLabel,
          connector: newChargerConnector,
          powerKw: newChargerPowerKw,
          status: newChargerStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar carregador.");
      }

      setNewChargerLabel("Novo ponto");
      setNewChargerConnector("CCS2");
      setNewChargerPowerKw(150);
      setNewChargerStatus("AVAILABLE");

      setSuccessMessage("Carregador criado com sucesso.");
      await loadStation();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar carregador.");
    } finally {
      setCreatingCharger(false);
    }
  }

  async function handleDeleteStation() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este ponto? Essa ação não poderá ser desfeita."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingStation(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("@aurora:token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const response = await fetch(`/api/stations/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao excluir ponto.");
      }

      router.push("/admin/stations");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir ponto.");
    } finally {
      setDeletingStation(false);
    }
  }

  if (loading) {
    return (
      <section className="p-8">
        <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6 text-zinc-400">
          Carregando ponto...
        </div>
      </section>
    );
  }

  if (!station) {
    return (
      <section className="p-8">
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-red-300">
          {error || "Ponto não encontrado."}
        </div>
      </section>
    );
  }

  return (
    <section className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">{station.name}</h1>
          <p className="mt-1 text-zinc-500">
            Gerencie dados, carregadores e avaliações deste ponto.
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

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard
          label="Carregadores"
          value={station.chargers.length}
          detail="total cadastrado"
        />

        <MetricCard
          label="Disponíveis"
          value={availableChargers}
          detail="livres agora"
          green
        />

        <MetricCard
          label="Avaliação"
          value={station.ratingAverage}
          detail={`${station.totalReviews} avaliações`}
          purple
        />

        <MetricCard
          label="Funcionamento"
          value={station.isOpen24h ? "24h" : "Limitado"}
          detail={`${station.city}/${station.state}`}
        />
      </div>

      {(error || successMessage) && (
        <div className="mb-6">
          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-2xl border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 p-4 text-sm text-[#AAFF3E]">
              {successMessage}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <form
            onSubmit={handleSaveStation}
            className="rounded-3xl border border-white/10 bg-[#13131A] p-6"
          >
            <h2 className="mb-5 text-xl font-extrabold text-white">
              Informações do ponto
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
                Se endereço, cidade ou estado forem alterados, latitude e
                longitude serão recalculadas automaticamente ao salvar.
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

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-extrabold text-zinc-300">
                Comodidades
              </h3>

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

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={savingStation}
                className="rounded-2xl bg-[#AAFF3E] px-5 py-3 font-extrabold text-[#0A1400] transition hover:opacity-90 disabled:opacity-60"
              >
                {savingStation
                  ? addressChanged
                    ? "Atualizando coordenadas..."
                    : "Salvando..."
                  : "Salvar alterações"}
              </button>

              <button
                type="button"
                disabled={deletingStation}
                onClick={handleDeleteStation}
                className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 font-extrabold text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
              >
                {deletingStation ? "Excluindo..." : "Excluir ponto"}
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6">
            <h2 className="mb-5 text-xl font-extrabold text-white">
              Carregadores
            </h2>

            <div className="space-y-4">
              {station.chargers.map((charger) => (
                <div
                  key={charger.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <Field label="Nome">
                      <input
                        className="aurora-input"
                        value={charger.label}
                        onChange={(event) =>
                          updateLocalCharger(
                            charger.id,
                            "label",
                            event.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Conector">
                      <select
                        className="aurora-input"
                        value={charger.connector}
                        onChange={(event) =>
                          updateLocalCharger(
                            charger.id,
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
                          updateLocalCharger(
                            charger.id,
                            "powerKw",
                            Number(event.target.value)
                          )
                        }
                      />
                    </Field>

                    <Field label="Status">
                      <select
                        className="aurora-input"
                        value={charger.status}
                        onChange={(event) =>
                          updateLocalCharger(
                            charger.id,
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

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={savingChargerId === charger.id}
                      onClick={() => handleUpdateCharger(charger)}
                      className="rounded-2xl border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 px-4 py-2 text-sm font-bold text-[#AAFF3E] transition hover:bg-[#AAFF3E]/20 disabled:opacity-60"
                    >
                      {savingChargerId === charger.id
                        ? "Salvando..."
                        : "Salvar carregador"}
                    </button>

                    <button
                      type="button"
                      disabled={deletingChargerId === charger.id}
                      onClick={() => handleDeleteCharger(charger.id)}
                      className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
                    >
                      {deletingChargerId === charger.id
                        ? "Removendo..."
                        : "Remover"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleCreateCharger}
              className="mt-6 rounded-2xl border border-[#B87DFF]/20 bg-[#7C3FCC]/10 p-4"
            >
              <h3 className="mb-4 text-sm font-extrabold text-[#B87DFF]">
                Adicionar novo carregador
              </h3>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <Field label="Nome">
                  <input
                    className="aurora-input"
                    value={newChargerLabel}
                    onChange={(event) => setNewChargerLabel(event.target.value)}
                    required
                  />
                </Field>

                <Field label="Conector">
                  <select
                    className="aurora-input"
                    value={newChargerConnector}
                    onChange={(event) =>
                      setNewChargerConnector(
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
                    value={newChargerPowerKw}
                    onChange={(event) =>
                      setNewChargerPowerKw(Number(event.target.value))
                    }
                    required
                  />
                </Field>

                <Field label="Status">
                  <select
                    className="aurora-input"
                    value={newChargerStatus}
                    onChange={(event) =>
                      setNewChargerStatus(event.target.value as ChargerStatus)
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

              <button
                type="submit"
                disabled={creatingCharger}
                className="mt-4 rounded-2xl bg-[#B87DFF] px-5 py-3 font-extrabold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {creatingCharger ? "Criando..." : "Criar carregador"}
              </button>
            </form>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6">
            <h2 className="mb-5 text-xl font-extrabold text-white">
              Localização
            </h2>

            <div className="rounded-2xl border border-white/10 bg-[#1C1C28] p-4 text-sm text-zinc-300">
              <div className="font-bold text-white">{station.address}</div>
              <div className="mt-1 text-zinc-500">
                {station.city}/{station.state}
              </div>

              <div className="mt-4 rounded-2xl border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 p-4 text-xs text-[#AAFF3E]">
                <div>Latitude: {station.latitude}</div>
                <div className="mt-1">Longitude: {station.longitude}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#13131A] p-6">
            <h2 className="mb-5 text-xl font-extrabold text-white">
              Avaliações recentes
            </h2>

            {station.reviews.length === 0 ? (
              <div className="text-sm text-zinc-500">
                Este ponto ainda não possui avaliações.
              </div>
            ) : (
              <div className="space-y-4">
                {station.reviews.slice(0, 5).map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white">
                        {review.user.name}
                      </div>
                      <div className="font-bold text-[#B87DFF]">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {review.comment ||
                        "Motorista não deixou comentário textual."}
                    </p>

                    <div className="mt-3 text-xs text-zinc-600">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
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

function MetricCard({
  label,
  value,
  detail,
  green,
  purple,
}: {
  label: string;
  value: string | number;
  detail: string;
  green?: boolean;
  purple?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#13131A] p-5">
      <div className="mb-2 text-xs text-zinc-500">{label}</div>

      <div
        className={[
          "text-3xl font-extrabold",
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

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}