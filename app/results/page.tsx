"use client";

import { useEffect, useMemo, useState } from "react";
import { getRecommendations } from "@/lib/recommend";

type FlowState = {
  intent?: string;
  values?: string[];
  locationChoice?: "near_me" | "same_state" | "anywhere";
  userLat?: number;
  userLon?: number;
  radiusMiles?: number;
};
type GoogleEnrichment = {
  rating?: number;
  reviewCount?: number;
  mapsUrl?: string;
  openNow?: boolean;
};

type EnrichmentMap = Record<string, GoogleEnrichment>;

const KEY = "guided_discovery_flow";

function loadFlow(): FlowState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function prettyValue(v: string) {
  const map: Record<string, string> = {
    local: "Local",
    sustainable: "Sustainable",
    small_new: "Small / New",
    underrepresented: "Underrepresented",
    fast_delivery: "Fast Delivery",
  };
  return map[v] ?? v;
}
async function enrichWithGoogle(name: string, city: string, state: string) {
  const query = `${name} ${city} ${state}`;

  const searchRes = await fetch(
    `/api/google/textsearch?query=${encodeURIComponent(query)}`
  );
  if (!searchRes.ok) return null;
  const searchData = await searchRes.json();

  const placeId = searchData?.results?.[0]?.place_id;
  if (!placeId) return null;

  const detailsRes = await fetch(
    `/api/google/details?placeId=${encodeURIComponent(placeId)}`
  );
  if (!detailsRes.ok) return null;
  const detailsData = await detailsRes.json();

  const r = detailsData?.result;
  return {
    rating: r?.rating,
    reviewCount: r?.user_ratings_total,
    mapsUrl: r?.url,
    openNow: r?.opening_hours?.open_now,
  } as GoogleEnrichment;
}

export default function ResultsPage() {
  const [flow, setFlow] = useState<FlowState>({});
const [googleInfo, setGoogleInfo] = useState<EnrichmentMap>({});

  useEffect(() => {
    setFlow(loadFlow());
  }, []);

  const recs = useMemo(() => getRecommendations(flow), [flow]);
useEffect(() => {
  let cancelled = false;

  async function run() {

    if (!recs || recs.length === 0) {
      setGoogleInfo({});
      return;
    }

    const top = recs.slice(0, 6);

    const entries = await Promise.all(
      top.map(async ({ business }) => {
        const info = await enrichWithGoogle(business.name, business.city, business.state);
        return [business.id, info] as const;
      })
    );

    if (cancelled) return;

    const next: EnrichmentMap = {};
    for (const [id, info] of entries) {
      if (info) next[id] = info;
    }
    setGoogleInfo(next);
  }

  run();

  return () => {
    cancelled = true;
  };
}, [recs]);

  const summary = [
    flow.intent ? flow.intent : "—",
    ...(flow.values ?? []).slice(0, 2).map(prettyValue),
    flow.locationChoice === "near_me"
      ? `Within ${flow.radiusMiles ?? 20} miles`
      : flow.locationChoice === "same_state"
      ? "Same state"
      : flow.locationChoice === "anywhere"
      ? "Anywhere"
      : "—",
  ];

  return (
    <div className="min-h-screen bg-[#fabcce] text-amber-950">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href="/" className="text-lg font-semibold tracking-tight">HerMarket</a>
        <a href="/discover/step-1" className="text-sm text-amber-950 hover:text-zinc-900">
          Adjust preferences
        </a>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16">
        <div className="mb-6 rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
          <div className="text-sm text-zinc-600">Showing businesses that match:</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {summary.map((s, i) => (
              <span key={i} className="rounded-xl border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT */}
          <section className="lg:col-span-2">
            {recs.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 p-6">
                <p className="font-medium">No matches found.</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Try increasing your radius, switching to “Anywhere,” or removing a value.
                </p>
                <a href="/discover/step-1" className="mt-4 inline-block rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                  Adjust preferences
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {recs.map(({ business, why, distanceMiles }) => (
                  <div key={business.id} className="rounded-2xl border border-zinc-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold">{business.name}</h2>
                        <p className="mt-1 text-sm text-zinc-600">
                          {business.description} • {business.city}, {business.state}
                          {typeof distanceMiles === "number" && <> • {distanceMiles.toFixed(1)} mi</>}
                        </p>
{googleInfo[business.id]?.rating && (
  <p className="mt-2 text-sm text-zinc-700">
     {googleInfo[business.id]?.rating} ({googleInfo[business.id]?.reviewCount ?? 0} reviews)
    {typeof googleInfo[business.id]?.openNow === "boolean" && (
      <span className="ml-2 font-medium">
        · {googleInfo[business.id]!.openNow ? "Open now" : "Closed"}
      </span>
    )}
    {googleInfo[business.id]?.mapsUrl && (
      <a
        className="ml-2 underline"
        href={googleInfo[business.id]!.mapsUrl}
        target="_blank"
        rel="noreferrer"
      >
        View on Google
      </a>
    )}
  </p>
)}

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-xl border border-zinc-200 px-3 py-1 text-xs">Women-owned</span>
                          <span className="rounded-xl border border-zinc-200 px-3 py-1 text-xs">
                            {business.dataSource === "founder_verified"
                              ? "Founder-verified"
                              : business.dataSource === "community_verified"
                              ? "Community-verified"
                              : "Demo"}
                          </span>
                          {business.tags.slice(0, 3).map((t: string) => (
                            <span key={t} className="rounded-xl border border-zinc-200 px-3 py-1 text-xs text-zinc-700">
                              {prettyValue(t)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <a href={business.website} target="_blank" rel="noreferrer"
                        className="shrink-0 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                        Visit Website
                      </a>
                    </div>

                    <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                      <p className="text-xs font-semibold text-zinc-800">WHY THIS WAS RECOMMENDED</p>
                      <p className="mt-1 text-sm text-zinc-700">{why}</p>
                      <p className="mt-2 text-xs text-zinc-500">Verification: {business.verificationNote}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT (sticky) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold">Your impact today</h3>

              <div className="mt-4 space-y-2 text-sm text-zinc-700">
                <div>✔ Supporting women-owned businesses</div>
                {(flow.values ?? []).includes("local") && <div>✔ Prioritizing local founders</div>}
                {(flow.values ?? []).includes("sustainable") && <div>✔ Encouraging sustainable choices</div>}
              </div>

              <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                <p className="text-xs font-semibold text-zinc-800">Did you know?</p>
                <p className="mt-1 text-sm text-zinc-700">
                  This demo can later show category-specific stats with citations on funding gaps and representation.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

