export default function Home() {
  return (
    <div className="min-h-screen font-serif text-zinc-900">
      {/* Top Navigation */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="text-lg font-semibold tracking-tight">
          HerMarket
        </div>

        <nav className="flex items-center gap-5 text-sm text-zinc-600">
          <a href="/about" className="hover:text-zinc-900">About</a>
          <a href="/submit" className="hover:text-zinc-900">Submit Business</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-20 text-center">
        <p className="text-sm font-medium text-zinc-500">
          Where you spend matters.
        </p>

        <h1 className="mt-3 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-center">
          Businesses run by women, chosen by you{" "}
          <span className="underline decoration-zinc-300">you</span> care about.
        </h1>

        <p className="mt-4 max-w-2xl text-base text-zinc-600">
          No ads. No popularity bias. Just guided discovery that ranks results by your values.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <a
            href="/discover/step-1"
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Start Discovering
          </a>
        </div>

        {/* Info Card */}
        <div className="mt-16 w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white/70 p-6 text-left">
          <p className="text-sm font-semibold text-zinc-800">How it works</p>
          <ol className="mt-3 space-y-2 text-sm text-zinc-600">
            <li>1) Choose what you’re looking for</li>
            <li>2) Pick up to two values you care about</li>
            <li>3) Get curated results with clear explanations</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
