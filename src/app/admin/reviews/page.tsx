//src/app/admin/reviews/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

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
    email: string;
  };
  station: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
  };
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingFilter, setRatingFilter] = useState<"ALL" | "POSITIVE" | "LOW">(
    "ALL"
  );

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("@aurora:token");

        const response = await fetch("/api/reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar avaliações.");
        }

        setReviews(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar avaliações."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    if (ratingFilter === "POSITIVE") {
      return reviews.filter((review) => review.rating >= 4);
    }

    if (ratingFilter === "LOW") {
      return reviews.filter((review) => review.rating <= 3);
    }

    return reviews;
  }, [reviews, ratingFilter]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);

    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  const positiveCount = reviews.filter((review) => review.rating >= 4).length;
  const lowCount = reviews.filter((review) => review.rating <= 3).length;

  return (
    <section className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Avaliações</h1>
          <p className="mt-1 text-zinc-500">
            Acompanhe a percepção dos motoristas sobre os pontos de recarga.
          </p>
        </div>

        <div className="rounded-2xl border border-[#AAFF3E]/20 bg-[#AAFF3E]/10 px-5 py-3 text-sm font-bold text-[#AAFF3E]">
          Média geral: {averageRating}/5
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard
          label="Total de avaliações"
          value={reviews.length}
          detail="comentários recebidos"
        />

        <MetricCard
          label="Média geral"
          value={averageRating}
          detail="nota média da rede"
          purple
        />

        <MetricCard
          label="Positivas"
          value={positiveCount}
          detail="nota 4 ou 5"
          green
        />

        <MetricCard label="Críticas" value={lowCount} detail="nota até 3" red />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <FilterButton
          active={ratingFilter === "ALL"}
          onClick={() => setRatingFilter("ALL")}
        >
          Todas
        </FilterButton>

        <FilterButton
          active={ratingFilter === "POSITIVE"}
          onClick={() => setRatingFilter("POSITIVE")}
        >
          Positivas
        </FilterButton>

        <FilterButton
          active={ratingFilter === "LOW"}
          onClick={() => setRatingFilter("LOW")}
        >
          Críticas
        </FilterButton>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#13131A]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="font-bold text-white">Avaliações recentes</span>
          <span className="text-sm text-zinc-500">
            {filteredReviews.length} registros
          </span>
        </div>

        {loading ? (
          <div className="p-6 text-zinc-400">Carregando avaliações...</div>
        ) : error ? (
          <div className="p-6 text-red-300">{error}</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-6 text-zinc-400">
            Nenhuma avaliação encontrada para este filtro.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="p-5 transition hover:bg-white/[0.03]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#B87DFF]/20 bg-[#7C3FCC]/20 text-sm font-extrabold text-[#B87DFF]">
          {getInitials(review.user.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white">{review.user.name}</div>
              <div className="text-xs text-zinc-500">{review.user.email}</div>
            </div>

            <div className="text-right">
              <div className="font-extrabold text-[#B87DFF]">
                {renderStars(review.rating)}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                {formatDate(review.createdAt)}
              </div>
            </div>
          </div>

          <div className="mb-3 text-sm text-zinc-400">
            <span className="font-bold text-zinc-300">
              {review.station.name}
            </span>{" "}
            · {review.station.address} · {review.station.city}/
            {review.station.state}
          </div>

          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300">
            {review.comment || "Motorista não deixou comentário textual."}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <ScorePill label="Disponibilidade" value={review.availabilityScore} />
            <ScorePill label="Qualidade" value={review.qualityScore} />
            <ScorePill label="Comodidades" value={review.amenitiesScore} />
            <ScorePill label="Sinalização" value={review.signageScore} />
          </div>
        </div>
      </div>
    </article>
  );
}

function MetricCard({
  label,
  value,
  detail,
  green,
  purple,
  red,
}: {
  label: string;
  value: number;
  detail: string;
  green?: boolean;
  purple?: boolean;
  red?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#13131A] p-5">
      <div className="mb-2 text-xs text-zinc-500">{label}</div>

      <div
        className={[
          "text-4xl font-extrabold",
          green ? "text-[#AAFF3E]" : "",
          purple ? "text-[#B87DFF]" : "",
          red ? "text-[#FF5F5F]" : "",
          !green && !purple && !red ? "text-white" : "",
        ].join(" ")}
      >
        {value}
      </div>

      <div className="mt-2 text-xs text-zinc-500">{detail}</div>
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

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-1 text-xs text-zinc-500">{label}</div>
      <div
        className={[
          "text-lg font-extrabold",
          value >= 4
            ? "text-[#AAFF3E]"
            : value === 3
            ? "text-[#FFB23E]"
            : "text-[#FF5F5F]",
        ].join(" ")}
      >
        {value}/5
      </div>
    </div>
  );
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