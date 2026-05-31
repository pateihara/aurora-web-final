//src/app/admin/users/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type UserRole = "DRIVER" | "ADMIN";

type Vehicle = {
  id: string;
  model: string;
  connector: string;
  rangeKm: number;
  maxPowerKw: number;
};

type UserReview = {
  id: string;
  rating: number;
  createdAt: string;
  station: {
    id: string;
    name: string;
  };
};

type ChargingHistory = {
  id: string;
  kwh: number;
  minutes: number;
  cost: number;
  createdAt: string;
  station: {
    id: string;
    name: string;
  };
};

type Favorite = {
  id: string;
  station: {
    id: string;
    name: string;
  };
};

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  vehicles: Vehicle[];
  reviews: UserReview[];
  chargingHistory: ChargingHistory[];
  favorites: Favorite[];
  totalReviews: number;
  totalCharges: number;
  totalKwh: number;
  totalSpent: number;
  totalFavorites: number;
  averageRating: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("@aurora:token");

        if (!token) {
          throw new Error("Token não encontrado. Faça login novamente.");
        }

        const response = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar usuários.");
        }

        setUsers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar usuários."
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (roleFilter === "ALL") {
      return users;
    }

    return users.filter((user) => user.role === roleFilter);
  }, [users, roleFilter]);

  const drivers = users.filter((user) => user.role === "DRIVER");
  const admins = users.filter((user) => user.role === "ADMIN");

  const totalVehicles = users.reduce(
    (sum, user) => sum + user.vehicles.length,
    0
  );

  const totalCharges = users.reduce(
    (sum, user) => sum + user.totalCharges,
    0
  );

  return (
    <section className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Usuários</h1>
          <p className="mt-1 text-zinc-500">
            Visualize motoristas e administradores cadastrados na plataforma.
          </p>
        </div>

        <div className="rounded-2xl border border-[#B87DFF]/20 bg-[#7C3FCC]/10 px-5 py-3 text-sm font-bold text-[#B87DFF]">
          Autenticação por perfil
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard
          label="Usuários totais"
          value={users.length}
          detail="contas cadastradas"
        />

        <MetricCard
          label="Motoristas"
          value={drivers.length}
          detail="perfil DRIVER"
          green
        />

        <MetricCard
          label="Administradores"
          value={admins.length}
          detail="perfil ADMIN"
          purple
        />

        <MetricCard
          label="Veículos"
          value={totalVehicles}
          detail={`${totalCharges} recargas registradas`}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <FilterButton
          active={roleFilter === "ALL"}
          onClick={() => setRoleFilter("ALL")}
        >
          Todos
        </FilterButton>

        <FilterButton
          active={roleFilter === "DRIVER"}
          onClick={() => setRoleFilter("DRIVER")}
        >
          Motoristas
        </FilterButton>

        <FilterButton
          active={roleFilter === "ADMIN"}
          onClick={() => setRoleFilter("ADMIN")}
        >
          Administradores
        </FilterButton>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#13131A]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="font-bold text-white">Lista de usuários</span>
            <span className="text-sm text-zinc-500">
              {filteredUsers.length} registros
            </span>
          </div>

          {loading ? (
            <div className="p-6 text-zinc-400">Carregando usuários...</div>
          ) : error ? (
            <div className="p-6 text-red-300">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-zinc-400">
              Nenhum usuário encontrado para este filtro.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUser(user)}
                  className={[
                    "w-full p-5 text-left transition hover:bg-white/[0.03]",
                    selectedUser?.id === user.id ? "bg-white/[0.04]" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={[
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-sm font-extrabold",
                        user.role === "ADMIN"
                          ? "border-[#B87DFF]/20 bg-[#7C3FCC]/20 text-[#B87DFF]"
                          : "border-[#AAFF3E]/20 bg-[#AAFF3E]/10 text-[#AAFF3E]",
                      ].join(" ")}
                    >
                      {getInitials(user.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="mt-1 text-xs text-zinc-500">
                            {user.email}
                          </div>
                        </div>

                        <RoleBadge role={user.role} />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                        <SmallStat
                          label="Veículos"
                          value={user.vehicles.length}
                        />
                        <SmallStat
                          label="Avaliações"
                          value={user.totalReviews}
                        />
                        <SmallStat
                          label="Recargas"
                          value={user.totalCharges}
                        />
                        <SmallStat
                          label="Favoritos"
                          value={user.totalFavorites}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-white/10 bg-[#13131A] p-6 xl:sticky xl:top-8">
          {selectedUser ? (
            <UserDetails user={selectedUser} />
          ) : (
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Detalhes do usuário
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Selecione um usuário na lista para visualizar veículos,
                avaliações, favoritos e histórico de recarga.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function UserDetails({ user }: { user: User }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-4">
        <div
          className={[
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-lg font-extrabold",
            user.role === "ADMIN"
              ? "border-[#B87DFF]/20 bg-[#7C3FCC]/20 text-[#B87DFF]"
              : "border-[#AAFF3E]/20 bg-[#AAFF3E]/10 text-[#AAFF3E]",
          ].join(" ")}
        >
          {getInitials(user.name)}
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
          <p className="mt-1 text-xs text-zinc-500">{user.email}</p>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div>
          <div className="text-xs text-zinc-500">Perfil</div>
          <div className="mt-1 font-bold text-white">
            {user.role === "ADMIN" ? "Administrador Flui" : "Motorista"}
          </div>
        </div>

        <RoleBadge role={user.role} />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <DetailStat label="Recargas" value={user.totalCharges} />
        <DetailStat label="kWh" value={user.totalKwh} />
        <DetailStat label="Gasto" value={`R$ ${user.totalSpent}`} />
        <DetailStat label="Nota média" value={user.averageRating} />
      </div>

      <Section title="Veículos">
        {user.vehicles.length === 0 ? (
          <EmptyText>Nenhum veículo cadastrado.</EmptyText>
        ) : (
          <div className="space-y-3">
            {user.vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="font-bold text-white">{vehicle.model}</div>
                <div className="mt-1 text-xs text-zinc-500">
                  {vehicle.connector} · {vehicle.rangeKm} km ·{" "}
                  {vehicle.maxPowerKw} kW
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Avaliações recentes">
        {user.reviews.length === 0 ? (
          <EmptyText>Nenhuma avaliação enviada.</EmptyText>
        ) : (
          <div className="space-y-3">
            {user.reviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white">
                    {review.station.name}
                  </div>
                  <div className="font-bold text-[#B87DFF]">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="mt-2 text-xs text-zinc-500">
                  {formatDate(review.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Favoritos">
        {user.favorites.length === 0 ? (
          <EmptyText>Nenhum ponto favoritado.</EmptyText>
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.favorites.map((favorite) => (
              <span
                key={favorite.id}
                className="rounded-full border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 px-3 py-1 text-xs font-bold text-[#AAFF3E]"
              >
                {favorite.station.name}
              </span>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-4 py-2 text-sm font-bold transition",
        active
          ? "border-[#AAFF3E] bg-[#AAFF3E] text-[#0A1400]"
          : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
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

function SmallStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 text-lg font-extrabold text-white">{value}</div>
    </div>
  );
}

function DetailStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 text-xl font-extrabold text-[#B87DFF]">{value}</div>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "ADMIN") {
    return (
      <span className="rounded-full border border-[#B87DFF]/20 bg-[#7C3FCC]/10 px-3 py-1 text-xs font-bold text-[#B87DFF]">
        ADMIN
      </span>
    );
  }

  return (
    <span className="rounded-full border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 px-3 py-1 text-xs font-bold text-[#AAFF3E]">
      DRIVER
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-extrabold text-zinc-300">{title}</h3>
      {children}
    </div>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-500">{children}</p>;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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