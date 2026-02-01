export default function AboutPage() {
  return (
    <div className="min-h-screen text-amber-950">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href="/" className="text-lg font-semibold tracking-tight">
          HerMarket
        </a>

        <nav className="flex items-center gap-5 text-sm text-zinc-700">
          <a href="/about" className="hover:text-amber-950 underline underline-offset-4">
            About
          </a>
          <a href="/ethics" className="hover:text-amber-950">
            Ethics
          </a>
          <a href="/submit" className="hover:text-amber-950">
            Submit Business
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        <div className="card p-8">
          <p className="text-sm font-medium text-zinc-700">About</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            A calmer way to discover women-owned businesses.
          </h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-700">
            HerMarket helps people find women-owned businesses based on what they care about—like
            shopping local or supporting new founders—without ads or popularity bias.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-sm font-semibold text-amber-950">Guided discovery</p>
              <p className="mt-2 text-sm text-zinc-700">
                We ask 3 simple questions and rank results based on your intent + values.
              </p>
            </div>

            <div className="card p-5">
              <p className="text-sm font-semibold text-amber-950">Transparent recommendations</p>
              <p className="mt-2 text-sm text-zinc-700">
                Each result includes “Why this was recommended.”
              </p>
            </div>

            <div className="card p-5">
              <p className="text-sm font-semibold text-amber-950">Built to scale</p>
              <p className="mt-2 text-sm text-zinc-700">
                Businesses can submit directly and the dataset can expand region-by-region.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="/discover/step-1"
              className="rounded-xl bg-amber-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Start Discovering
            </a>
            <a
              href="/submit"
              className="rounded-xl border border-zinc-200 bg-white/70 px-5 py-3 text-sm font-medium text-zinc-800 hover:bg-white/80"
            >
              Submit a Business
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
