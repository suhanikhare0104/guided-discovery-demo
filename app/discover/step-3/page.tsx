"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LocationChoice = "near_me" | "same_state" | "anywhere";

type FlowState = {
  intent?: string;
  otherText?: string;
  values?: string[];
  locationChoice?: LocationChoice;

  userCity?: string;
  userState?: string;

  userLat?: number;
  userLon?: number;

  radiusMiles?: number;
};

const KEY = "guided_discovery_flow";

function loadFlow(): FlowState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveFlow(flow: FlowState) {
  localStorage.setItem(KEY, JSON.stringify(flow));
}

export default function Step3Location() {
  const router = useRouter();

  const [choice, setChoice] = useState<LocationChoice | undefined>(undefined);
  const [radius, setRadius] = useState<number>(20);

  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lon, setLon] = useState<number | undefined>(undefined);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const flow = loadFlow();
    if (flow.locationChoice) setChoice(flow.locationChoice);
    if (flow.radiusMiles) setRadius(flow.radiusMiles);
    if (typeof flow.userLat === "number") setLat(flow.userLat);
    if (typeof flow.userLon === "number") setLon(flow.userLon);
    setReady(true);
  }, []);

  function requestLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }
    setGeoStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLon(longitude);
        setGeoStatus("granted");

        const flow = loadFlow();
        saveFlow({ ...flow, userLat: latitude, userLon: longitude });
      },
      () => {
        setGeoStatus("denied");
        alert("Location permission denied. You can still use Same state or Anywhere.");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }

  function onShowResults() {
    if (!choice) return;

    const flow = loadFlow();

    // If user chose near_me, require location
    if (choice === "near_me" && (typeof lat !== "number" || typeof lon !== "number")) {
      alert("Please allow location to use Near me + radius.");
      return;
    }

    saveFlow({
      ...flow,
      locationChoice: choice,
      radiusMiles: radius,
      userLat: lat,
      userLon: lon,
    });

    router.push("/results");
  }

  if (!ready) return null;

  const btnBase =
    "w-full rounded-2xl border px-5 py-4 text-left transition hover:bg-amber-950";
  const selected = "border-amber-950 bg-amber-950";
  const unselected = "border-amber-950 bg-white";

  const radiusOptions = [5, 10, 15, 20];

  return (
    <div className="min-h-screen bg-[#fabcce] text-amber-950">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href="/" className="text-lg font-semibold tracking-tight">
          HerMarket
        </a>
        <div className="text-sm text-amber-950">Step 3 of 3</div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Where should it be?
        </h1>
        <p className="mt-3 text-amber-950">
          Choose a location preference. If you pick “Near me,” we’ll ask for your location and filter by radius.
        </p>

        <div className="mt-6 grid gap-3">
          <button
            className={`${btnBase} ${choice === "near_me" ? selected : unselected}`}
            onClick={() => setChoice("near_me")}
          >
             <strong>Near me</strong>
            <div className="mt-1 text-sm text-amber-950">
              Filter within a radius you choose
            </div>
          </button>

          <button
            className={`${btnBase} ${choice === "same_state" ? selected : unselected}`}
            onClick={() => setChoice("same_state")}
          >
             <strong>Same state</strong>
            <div className="mt-1 text-sm text-amber-950">
              Prioritize businesses in your state (demo)
            </div>
          </button>

          <button
            className={`${btnBase} ${choice === "anywhere" ? selected : unselected}`}
            onClick={() => setChoice("anywhere")}
          >
            <strong>Anywhere</strong>
            <div className="mt-1 text-sm text-amber-950">
              Show best matches across all locations
            </div>
          </button>
        </div>

        {/* Near me extras */}
        {choice === "near_me" && (
          <div className="mt-6 rounded-2xl border border-amber-950 bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Use your current location</p>
                <p className="text-xs text-amber-950">
                  We use this only to compute distance for results.
                </p>
              </div>

              <button
                onClick={requestLocation}
                className="rounded-xl bg-amber-950 px-4 py-2 text-sm font-medium text-white hover:bg-amber-950"
              >
                {geoStatus === "loading" ? "Requesting…" : "Allow location"}
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium">Radius</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {radiusOptions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`rounded-xl border px-4 py-2 text-sm ${
                      radius === r ? "border-amber-950 bg-amber-950" : "border-amber-950 bg-bg-soft-pink hover:bg-amber-950"
                    }`}
                  >
                    {r} miles
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-amber-950">
                Selected: {radius} miles
              </p>
            </div>

            <div className="mt-4 text-xs text-amber-950">
              Status:{" "}
              {geoStatus === "granted"
                ? "Location granted "
                : geoStatus === "denied"
                ? "Denied "
                : geoStatus === "loading"
                ? "Requesting…"
                : "Not requested yet"}
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <a href="/discover/step-2" className="text-sm text-amber-950 hover:text-amber-950">
            ← Back
          </a>

          <button
            onClick={onShowResults}
            disabled={!choice}
            className="rounded-xl bg-amber-950 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-amber-950"
          >
            Show Results →
          </button>
        </div>
      </main>
    </div>
  );
}
