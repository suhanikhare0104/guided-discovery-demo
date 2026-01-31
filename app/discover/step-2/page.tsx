"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ValueTag =
  | "local"
  | "sustainable"
  | "small_new"
  | "underrepresented"
  | "fast_delivery";

type FlowState = {
  intent?: string;
  otherText?: string;
  values?: ValueTag[];
  locationChoice?: string;
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

export default function Step2Values() {
  const router = useRouter();
  const [values, setValues] = useState<ValueTag[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const flow = loadFlow();
    if (flow.values) setValues(flow.values);
    setReady(true);
  }, []);

  function toggle(v: ValueTag) {
    if (values.includes(v)) {
      setValues(values.filter((x) => x !== v));
    } else {
      if (values.length >= 2) return;
      setValues([...values, v]);
    }
  }

  function onNext() {
    const flow = loadFlow();
    saveFlow({
      ...flow,
      values,
    });
    router.push("/discover/step-3");
  }

  if (!ready) return null;

  const btnBase =
    "w-full rounded-2xl border px-5 py-4 text-left transition hover:bg-zinc-50";
  const selected =
    "border-zinc-900 bg-zinc-50";
  const unselected =
    "border-zinc-200 bg-white";

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href="/" className="text-lg font-semibold tracking-tight">
          HerMarket
        </a>
        <div className="text-sm text-zinc-500">Step 2 of 3</div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          What matters most to you?
        </h1>
        <p className="mt-3 text-zinc-600">
          Choose up to <strong>2</strong>. We’ll use these to rank results.
        </p>

        <div className="mt-8 grid gap-3">
          <button
            className={`${btnBase} ${values.includes("local") ? selected : unselected}`}
            onClick={() => toggle("local")}
          >
            📍 <strong>Local</strong>
            <div className="mt-1 text-sm text-zinc-600">Support founders near you</div>
          </button>

          <button
            className={`${btnBase} ${values.includes("sustainable") ? selected : unselected}`}
            onClick={() => toggle("sustainable")}
          >
            🌱 <strong>Sustainable</strong>
            <div className="mt-1 text-sm text-zinc-600">Eco-conscious practices</div>
          </button>

          <button
            className={`${btnBase} ${values.includes("small_new") ? selected : unselected}`}
            onClick={() => toggle("small_new")}
          >
            🆕 <strong>Small / New Business</strong>
            <div className="mt-1 text-sm text-zinc-600">Early-stage founders</div>
          </button>

          <button
            className={`${btnBase} ${values.includes("underrepresented") ? selected : unselected}`}
            onClick={() => toggle("underrepresented")}
          >
            ⚖️ <strong>Underrepresented Industry</strong>
            <div className="mt-1 text-sm text-zinc-600">Breaking into new spaces</div>
          </button>

          <button
            className={`${btnBase} ${values.includes("fast_delivery") ? selected : unselected}`}
            onClick={() => toggle("fast_delivery")}
          >
            🚚 <strong>Fast Delivery</strong>
            <div className="mt-1 text-sm text-zinc-600">Get it quickly</div>
          </button>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <a href="/discover/step-1" className="text-sm text-zinc-600 hover:text-zinc-900">
            ← Back
          </a>

          <button
            onClick={onNext}
            disabled={values.length === 0}
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-zinc-800"
          >
            Next →
          </button>
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          {values.length}/2 selected
        </p>
      </main>
    </div>
  );
}
