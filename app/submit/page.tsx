"use client";

import { useMemo, useState } from "react";

type Category = "gift" | "food" | "clothing" | "services" | "other";
type ValueTag = "local" | "sustainable" | "small_new" | "underrepresented" | "fast_delivery";

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
  const [tags, setTags] = useState<ValueTag[]>(["local", "small_new"]);
  const [story, setStory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      description.trim().length >= 10 &&
      city.trim().length >= 2 &&
      stateUS.trim().length >= 2 &&
      website.trim().length >= 8
    );
  }, [name, description, city, stateUS, website]);

  function toggleTag(t: ValueTag) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const looksLikeURL = /^https?:\/\/.+\..+/.test(website.trim());
    if (!looksLikeURL) {
      setError("Please enter a valid link starting with http:// or https://");
      return;
    }

    if (!canSubmit) {
      setError("Please fill out all required fields.");
      return;
    }

    const submission = {
      id: slugify(name),
      name: name.trim(),
      category,
      description: description.trim(),
      city: city.trim(),
      state: stateUS.trim().toUpperCase(),
      website: website.trim(),
      tags,
      story: story.trim() ? story.trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    // Demo: save locally
    try {
      const key = "hermarket_submissions";
      const existingRaw = localStorage.getItem(key);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem(key, JSON.stringify([submission, ...existing]));
    } catch {}

    setSuccess(true);
  }

  return (
    <div className="min-h-screen bg-[#fabcce] text-amber-950">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href="/" className="text-lg font-semibold tracking-tight">
          HerMarket
        </a>

        <nav className="flex items-center gap-5 text-sm text-amber-950">
          <a href="/about" className="hover:text-amber-950">
            About
          </a>
          <a href="/submit" className="hover:text-amber-950 underline underline-offset-4">
            Submit Business
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        <div className="card p-8">
          <p className="text-sm font-medium text-amber-950">Submit your business</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Add a women-owned business to HerMarket.
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-amber-950">
            Note: submissions are saved locally in your browser and can be reviewed later.
          </p>

          {success ? (
            <div className="mt-8 card p-6">
              <p className="text-sm font-semibold text-amber-950"> Submitted!</p>
              <p className="mt-2 text-sm text-amber-950">
                Thanks — your submission was saved (demo mode). You can submit another business below.
              </p>
              <button
                className="mt-4 rounded-xl bg-amber-950 px-5 py-3 text-sm font-medium text-white hover:bg-amber-950"
                onClick={() => {
                  setSuccess(false);
                  setName("");
                  setDescription("");
                  setCity("Blacksburg");
                  setStateUS("VA");
                  setWebsite("");
                  setTags(["local", "small_new"]);
                  setStory("");
                  setError(null);
                }}
              >
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
              {error && (
                <div className="card p-4">
                  <p className="text-sm font-semibold text-amber-950"> Fix this</p>
                  <p className="mt-1 text-sm text-amber-950">{error}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-amber-950">Business name *</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Bloom & Root Candles"
                    className="mt-2 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-amber-950">Category *</label>
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
                <label className="text-sm font-medium text-amber-950">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What do you sell or offer? (10+ characters)"
                  className="mt-2 w-full"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-amber-950">City *</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium text-amber-950">State *</label>
                  <input value={stateUS} onChange={(e) => setStateUS(e.target.value)} className="mt-2 w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium text-amber-950">Website link *</label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="mt-2 w-full"
                  />
                </div>
              </div>

              <div className="card p-5">
                <p className="text-sm font-semibold text-amber-950">Values</p>
                <p className="mt-1 text-sm text-amber-950">Select all that apply.</p>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(
                    [
                      ["local", " Local"],
                      ["sustainable", " Sustainable"],
                      ["small_new", " Small / New"],
                      ["underrepresented", " Underrepresented"],
                      ["fast_delivery", " Fast delivery"],
                    ] as [ValueTag, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleTag(key)}
                      className={`rounded-xl px-3 py-2 text-sm font-medium ${
                        tags.includes(key) ? "bg-amber-950 text-white" : "bg-white/70 text-amber-950"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-amber-950">Founder story (optional)</label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="2–3 lines (optional)"
                  className="mt-2 w-full"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`rounded-xl px-5 py-3 text-sm font-medium ${
                  canSubmit ? "bg-amber-950 text-white hover:bg-amber-950" : "bg-amber-950 text-white cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
