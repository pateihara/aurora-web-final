//src/app/api/geocode/route.ts
import { error, success } from "@/lib/responses";

type NominatimResult = {
  lat: string;
  lon: string;
  display_name?: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { address, city, state } = body;

    if (!address || !city || !state) {
      return error("Endereço, cidade e estado são obrigatórios.", 400);
    }

    const fullAddress = `${address}, ${city}, ${state}, Brasil`;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        fullAddress
      )}`,
      {
        headers: {
          "User-Agent": "AuroraByFlui/1.0",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return error("Erro ao buscar coordenadas.", 500);
    }

    const data = (await response.json()) as NominatimResult[];

    if (!data || data.length === 0) {
      return error(
        "Não foi possível encontrar coordenadas para esse endereço.",
        404
      );
    }

    const result = data[0];

    return success({
      latitude: Number(result.lat),
      longitude: Number(result.lon),
      displayName: result.display_name || fullAddress,
    });
  } catch (err) {
    console.error(err);
    return error("Erro ao buscar coordenadas do endereço.", 500);
  }
}