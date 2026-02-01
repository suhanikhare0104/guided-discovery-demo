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
  const [geoStatus, setGeoStatus] =
    useState<"idle" | "loading" | "granted" | "denied">("idle");
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
        alert("Location permission denied.");
      }
    );
  }

  function onShowResults() {
    if (!choice) return;

    if (choice === "near_me" && (lat == null || lon == null)) {
      alert("Please allow location to use Near me.");
      return;
    }

    const flow = loadFlow();
    saveFlow({ ...flow, locationChoice: choice, radiusMiles: radius });
    router.push("/results");
  }

  if (!ready) return null;

  const btnBase =
    "w-full rounded-2xl border px-5 py-4 text-left transition";
  const selected = "border-amber-950 bg-[#fde2e8]";
  const unselected = "border-amber-950 bg-[#fde2e8]";

  const radiusOptions = [5, 10, 15, 20];

  return (
    <div className="min-h-screen bg-[#fabcce] text-amber-950">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href="/" className="text-lg font-semibold tracking-tight">
          HerMarket
        </a>
        <div className="text-sm">Step 3 of 3</div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Where should it be?
        </h1>

        <div className="mt-6 grid gap-3">
          <button
            className={`${btnBase} ${choice === "near_me" ? selected : unselected}`}
            onClick={() => setChoice("near_me")}
          >
            <strong>Near me</strong>
          </button>

          <button
            className={`${btnBase} ${choice === "same_state" ? selected : unselected}`}
            onClick={() => setChoice("same_state")}
          >
            <strong>Same state</strong>
          </button>

          <button
            className={`${btnBase} ${choice === "anywhere" ? selected : unselected}`}
            onClick={() => setChoice("anywhere")}
          >
            <strong>Anywhere</strong>
          </button>
        </div>

        {choice === "near_me" && (
          <div className="mt-6 rounded-2xl border border-amber-950 bg-[#fde2e8] p-5">
            <button
              onClick={requestLocation}
              className="rounded-xl bg-amber-950 px-4 py-2 text-sm font-medium text-white"
            >
              Allow location
            </button>

            <div className="mt-4 flex flex-wrap gap-2">
              {radiusOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`rounded-xl border px-4 py-2 text-sm border-amber-950 bg-[#fde2e8]`}
                >
                  {r} miles
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <a
            href="/discover/step-2"
            className="rounded-xl bg-[#fde2e8] border border-amber-950 px-5 py-3 text-sm font-medium hover:bg-amber-950 hover:text-white transition"
          >
            ← Back
          </a>

          <button
            onClick={onShowResults}
            disabled={!choice}
            className="rounded-xl bg-[#fde2e8] border border-amber-950 px-5 py-3 text-sm font-medium hover:bg-amber-950 hover:text-white transition"
          >
            Show Results →
          </button>
        </div>
      </main>
    </div>
  );
}
