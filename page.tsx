"use client";

import { useMemo, useState } from "react";

type Category = "gift" | "food" | "clothing" | "services" | "other";
type ValueTag = "local" | "sustainable" | "small_new" | "underrepresented" | "fast_delivery";
type WomenOwnedStatus = "claimed" | "unknown";

type Submission = {
  id: string;
  name: string;
  category: Category;
  description: string;
  city: string;
  state: string;
  website: string;
  womenOwnedStatus: WomenOwnedStatus;
  tags: ValueTag[];
  story?: string;
  createdAt: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SubmitBusinessPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("gift");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Blacksburg");
  const [stateUS, setStateUS] = useState("VA");
  const [website, setWebsite] = useState("");
  const [womenOwnedStatus, setWomenOwnedStatus] = useState<WomenOwnedStatus>("claimed");
  const [tags, setTags] = useState<ValueTag[]>(["local", "small_new"]);
  const [story, setStory] = useState("");

  const [submitted, setSubmitted] = useState<Submission | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      description.trim().length >= 10 &&
      city.trim().length >= 2 &&
      stateUS.trim().length >= 2 &&
      website.trim().length >= 5 &&
      tags.length >= 1
    );
  }, [name, description, city, stateUS, website, tags.length]);

  function toggleTag(t: ValueTag) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function downloadJSON(obj: unknown, filename: string) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Minimal URL sanity (demo-safe)
    const looksLikeURL = /^https?:\/\/.+\..+/.test(website.trim());
    if (!looksLikeURL) {
      setError("Please enter a valid website link starting with http:// or https://");
      return;
    }

    if (!canSubmit) {
      setError("Please fill out all required fields.");
      return;
    }

    const id = slugify(name);
    const submission: Submission = {
      id,
      name: name.trim(),
      category,
      description: description.trim(),
      city: city.trim(),
      state: stateUS.trim().toUpperCase(),
      website: website.trim(),
      womenOwnedStatus,
      tags,
      story: story.trim() ? story.trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    // Save for demo (local only)
    try {
      const key = "hermarket_submissions";
      const existingRaw = localStorage.getItem(key);
      const existing: Submission[] = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem(key, JSON.stringify([submission, ...existing]));
    } catch {
      // If localStorage blocked, still show success
    }

    setSubmitted(submission);
  }

  return (
    <div className="min-h-screen text-zinc-900">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href="/" className="text-lg font-semibold tracking-tight">
          HerMarket
        </a>

        <nav className="flex items-center gap-5 text-sm text-zinc-700">
          <a href="/about" className="hover:text-zinc-900">
            About
          </a>
          <a href="/ethics" className="hover:text-zinc-900">
            Ethics
          </a>
          <a href="/submit" className="hover:text-zinc-900 underline underline-offset-4">
            Submit Business
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        <div className="card p-8">
          <p className="text-sm font-medium text-zinc-700">Submit your business</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Help people discover women-owned businesses.
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-zinc-700">
            Submissions are reviewed before being added. For the demo, this form stores entries locally in your browser.
          </p>

          {submitted ? (
            <div className="mt-8">
              <div className="card p-6">
                <p className="text-sm font-semibold text-zinc-900">✅ Submission received</p>
                <p className="mt-2 text-sm text-zinc-700">
                  Thanks! Here’s what we saved (demo format). You can download it as JSON to paste into your dataset.
                </p>

                <div className="mt-4 grid gap-2 text-sm text-zinc-800">
                  <div><span className="font-medium">Name:</span> {submitted.name}</div>
                  <div><span className="font-medium">Category:</span> {submitted.category}</div>
                  <div><span className="font-medium">Location:</span> {submitted.city}, {submitted.state}</div>
                  <div><span className="font-medium">Website:</span> {submitted.website}</div>
                  <div><span className="font-medium">Tags:</span> {submitted.tags.join(", ")}</div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => downloadJSON(submitted, `${submitted.id}.json`)}
                    className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Download JSON
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(null);
                      setName("");
                      setCategory("gift");
                      setDescription("");
                      setCity("Blacksburg");
                      setStateUS("VA");
                      setWebsite("");
                      setWomenOwnedStatus("claimed");
                      setTags(["local", "small_new"]);
                      setStory("");
                      setError(null);
                    }}
                    className="rounded-xl border border-zinc-200 bg-white/70 px-5 py-3 text-sm font-medium text-zinc-800 hover:bg-white/80"
                  >
                    Submit another
                  </button>

                  <a
                    href="/discover/step-1"
                    className="rounded-xl border border-zinc-200 bg-white/70 px-5 py-3 text-sm font-medium text-zinc-800 hover:bg-white/80"
                  >
                    Back to discovery
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
              {error && (
                <div className="card p-4">
                  <p className="text-sm font-semibold text-zinc-900">⚠️ Fix this</p>
                  <p className="mt-1 text-sm text-zinc-700">{error}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-800">Business name *</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Bloom & Root Candles"
                    className="mt-2 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-800">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="mt-2 w-full"
                  >
                    <option value="gift">Gifts</option>
                    <option value="food">Food</option>
                    <option value="clothing">Clothing</option>
                    <option value="services">Services</option>
                    <option value="other">Something else</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-800">What do you sell? *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of your products/services (10+ chars)"
                  className="mt-2 w-full"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-zinc-800">City *</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Blacksburg"
                    className="mt-2 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-800">State *</label>
                  <input
                    value={stateUS}
                    onChange={(e) => setStateUS(e.target.value)}
                    placeholder="VA"
                    className="mt-2 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-800">Website / official link *</label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="mt-2 w-full"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="card p-5">
                  <p className="text-sm font-semibold text-zinc-900">Ownership representation</p>
                  <p className="mt-1 text-sm text-zinc-700">
                    For the demo, this is self-reported. You can refine verification later.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setWomenOwnedStatus("claimed")}
                      className={`rounded-xl px-4 py-2 text-sm font-medium ${
                        womenOwnedStatus === "claimed"
                          ? "bg-zinc-900 text-white"
                          : "bg-white/70 text-zinc-800"
                      }`}
                    >
                      Self-reported women-owned
                    </button>

                    <button
                      type="button"
                      onClick={() => setWomenOwnedStatus("unknown")}
                      className={`rounded-xl px-4 py-2 text-sm font-medium ${
                        womenOwnedStatus === "unknown"
                          ? "bg-zinc-900 text-white"
                          : "bg-white/70 text-zinc-800"
                      }`}
                    >
                      Not sure / prefer not to say
                    </button>
                  </div>
                </div>

                <div className="card p-5">
                  <p className="text-sm font-semibold text-zinc-900">Values (choose any)</p>
                  <p className="mt-1 text-sm text-zinc-700">
                    These help us match people to your business.
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {(
                      [
                        ["local", "📍 Local"],
                        ["sustainable", "🌱 Sustainable"],
                        ["small_new", "🆕 Small / New"],
                        ["underrepresented", "⚖️ Underrepresented"],
                        ["fast_delivery", "🚚 Fast delivery"],
                      ] as [ValueTag, string][]
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleTag(key)}
                        className={`rounded-xl px-3 py-2 text-sm font-medium ${
                          tags.includes(key) ? "bg-zinc-900 text-white" : "bg-white/70 text-zinc-800"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-800">
                  Short founder story (optional)
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="2–3 lines (optional)"
                  className="mt-2 w-full"
                  rows={3}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`rounded-xl px-5 py-3 text-sm font-medium ${
                    canSubmit ? "bg-zinc-900 text-white hover:bg-zinc-800" : "bg-zinc-400 text-white cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>

                <a
                  href="/"
                  className="rounded-xl border border-zinc-200 bg-white/70 px-5 py-3 text-sm font-medium text-zinc-800 hover:bg-white/80"
                >
                  Back to home
                </a>
              </div>

              <p className="text-xs text-zinc-600">
                Demo note: This stores submissions in your browser’s localStorage and lets you download a JSON entry
                for your dataset.
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
