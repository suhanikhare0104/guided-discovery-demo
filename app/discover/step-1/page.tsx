"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Intent = "gift" | "food" | "clothing" | "services" | "other";

type FlowState = {
  intent?: Intent;
  otherText?: string;
  values?: string[];
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

export default function Step1Intent() {
  const router = useRouter();
  const [intent, setIntent] = useState<Intent | undefined>(undefined);
  const [otherText, setOtherText] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const flow = loadFlow();
    if (flow.intent) setIntent(flow.intent);
    if (flow.otherText) setOtherText(flow.otherText);
    setReady(true);
  }, []);

  function choose(i: Intent) {
    setIntent(i);
  }

  function onNext() {
    if (!intent) return;
    const flow = loadFlow();
    saveFlow({
      ...flow,
      intent,
      otherText: intent === "other" ? otherText.trim() : "",
    });
    router.push("/discover/step-2");
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
        <div className="text-sm text-zinc-500">Step 1 of 3</div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          What are you looking for today?
        </h1>
        <p className="mt-3 text-zinc-600">
          Pick one to start. We’ll rank results based on your values in the next step.
        </p>

        <div className="mt-8 grid gap-3">
          <button
            className={`${btnBase} ${intent === "gift" ? selected : unselected}`}
            onClick={() => choose("gift")}
          >
            <div className="text-lg font-medium">🎁 Gift</div>
            <div className="mt-1 text-sm text-zinc-600">Candles, cards, accessories, treats</div>
          </button>

          <button
            className={`${btnBase} ${intent === "food" ? selected : unselected}`}
            onClick={() => choose("food")}
          >
            <div className="text-lg font-medium">🍽 Food</div>
            <div className="mt-1 text-sm text-zinc-600">Bakeries, catering, snacks, coffee</div>
          </button>

          <button
            className={`${btnBase} ${intent === "clothing" ? selected : unselected}`}
            onClick={() => choose("clothing")}
          >
            <div className="text-lg font-medium">👕 Clothing</div>
            <div className="mt-1 text-sm text-zinc-600">Apparel, jewelry, vintage, handmade</div>
          </button>

          <button
            className={`${btnBase} ${intent === "services" ? selected : unselected}`}
            onClick={() => choose("services")}
          >
            <div className="text-lg font-medium">🛠 Services</div>
            <div className="mt-1 text-sm text-zinc-600">Photography, salons, tutoring, wellness</div>
          </button>

          <button
            className={`${btnBase} ${intent === "other" ? selected : unselected}`}
            onClick={() => choose("other")}
          >
            <div className="text-lg font-medium">✏️ Something else</div>
            <div className="mt-1 text-sm text-zinc-600">Type what you want (optional)</div>

            {intent === "other" && (
              <div className="mt-3">
                <input
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="e.g., 'plants', 'home decor', 'kids books'…"
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                />
              </div>
            )}
          </button>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <a href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
            ← Back
          </a>

          <button
            onClick={onNext}
            disabled={!intent || (intent === "other" && otherText.trim().length === 0)}
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-zinc-800"
          >
            Next →
          </button>
        </div>

        {intent === "other" && (
          <p className="mt-3 text-xs text-zinc-500">
            Tip: type something to enable Next.
          </p>
        )}
      </main>
    </div>
  );
}
