import businesses from "@/data/businesses.json";
import { milesBetween } from "./distance";

type Biz = (typeof businesses)[number];

type FlowState = {
  intent?: string;
  values?: string[];
  locationChoice?: "near_me" | "same_state" | "anywhere";
  userLat?: number;
  userLon?: number;
  radiusMiles?: number;
};

export function getRecommendations(flow: FlowState) {
  const radius = flow.radiusMiles ?? 20;

  const rows = (businesses as Biz[]).map((b) => {
    let score = 0;

    if (flow.intent && b.category === flow.intent) score += 5;

    const vals = (flow.values ?? []).slice(0, 2);
    for (const v of vals) if (b.tags.includes(v)) score += 3;

    let distanceMiles: number | null = null;
    if (
      flow.locationChoice === "near_me" &&
      typeof flow.userLat === "number" &&
      typeof flow.userLon === "number"
    ) {
      distanceMiles = milesBetween(flow.userLat, flow.userLon, b.lat, b.lon);
      if (distanceMiles <= radius) score += 4;
      else score = -9999; 
    }

    const whyParts: string[] = [];
    if (flow.intent && b.category === flow.intent) whyParts.push("matches your intent");
    const matchedValues = vals.filter((v) => b.tags.includes(v));
    if (matchedValues.length) whyParts.push(`aligns with: ${matchedValues.join(", ")}`);
    if (flow.locationChoice === "near_me" && distanceMiles !== null) whyParts.push(`within ${radius} miles`);

    return { business: b, score, distanceMiles, why: whyParts.join("; ") || "a strong overall match" };
  });

  return rows
    .filter((r) => r.score > 0)
    .sort((a, c) => c.score - a.score)
    .slice(0, 12);
}
