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
    "w-full rounded-2xl border px-5 py-4 text-left transition font-medium";
  const selected =
    "border-[color:var(--outline)] bg-[color:var(--outline)] text-white hover:bg-[color:var(--outline)/90]";
  const unselected =
    "border-[color:var(--outline)] bg-white text-[color:var(--outline)] hover:bg-[color:var(--outline)/10]";

  return (
    <div className="min-h-screen bg-[#fabcce] text-[color:var(--outline)] font-serif">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="text-3xl font-bold tracking-tight">HerMarket</div>
        <div className="text-sm text-[color:var(--outline)]">Step 1 of 3</div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          What are you looking for today?
        </h1>
        <p className="mt-3 text-[color:var(--outline)]">
          Pick one to start. We’ll rank results based on your values in the next step.
        </p>

        <div className="mt-8 grid gap-3">
          {["gift", "food", "clothing", "services", "other"].map((i) => (
            <button
              key={i}
              className={`${btnBase} ${intent === i ? selected : unselected}`}
              onClick={() => choose(i as Intent)}
            >
              <div className="text-lg">
                {i === "other" ? "Something else" : i.charAt(0).toUpperCase() + i.slice(1)}
              </div>
              <div className="mt-1 text-sm text-[color:var(--outline)]">
                {{
                  gift: "Candles, cards, accessories, treats",
                  food: "Bakeries, catering, snacks, coffee",
                  clothing: "Apparel, jewelry, vintage, handmade",
                  services: "Photography, salons, tutoring, wellness",
                  other: "Type what you want (optional)",
                }[i]}
              </div>

              {i === "other" && intent === "other" && (
                <div className="mt-3">
                  <input
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="e.g., 'plants', 'home decor', 'kids books'…"
                    className="w-full rounded-xl border border-[color:var(--outline)] px-3 py-2 text-sm outline-none focus:border-[color:var(--outline)]"
                  />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">

          <a
            href="/"
            className="rounded-xl border-4 border-[color:var(--outline)] px-5 py-3 text-sm font-medium text-[color:var(--outline)] 
                       bg-[rgba(255,209,220,0.9)] hover:bg-[rgba(255,209,220,1)] 
                       focus-visible:outline-none focus-visible:ring-4 
                       focus-visible:ring-[color:var(--outline)/50] focus-visible:ring-offset-2 transition"
          >
            ← Back

          {/* Back button — styled IDENTICAL to Next */}
          <a
            href="/"
            className="rounded-xl bg-white border border-amber-950 px-5 py-3 text-sm font-medium text-amber-950 hover:bg-amber-950 hover:text-white transition"
          >
            <span>← Back</span>

          </a>

          <button
            onClick={onNext}
            disabled={!intent || (intent === "other" && otherText.trim().length === 0)}

            className="rounded-xl bg-[color:var(--outline)] px-5 py-3 text-sm font-medium text-white 
                      disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[color:var(--outline)/90] transition"
            className="rounded-xl bg-white border border-amber-950 px-5 py-3 text-sm font-medium text-amber-950 hover:bg-amber-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 transition"

          >
            <span>Next →</span>
          </button>
        </div>

        {intent === "other" && (
          <p className="mt-3 text-xs text-[color:var(--outline)]">
            Tip: type something to enable Next.
          </p>
        )}
      </main>
    </div>
  );
}
