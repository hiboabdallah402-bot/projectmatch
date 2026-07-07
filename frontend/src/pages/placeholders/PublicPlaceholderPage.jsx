function PublicPlaceholderPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-4">
      <p className="inline-flex w-fit rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
        Phase 2
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Public layout is ready</h1>
      <p className="text-base leading-7 text-slate-600">
        Navbar and footer are now part of the shared public shell. Home page content will be implemented in Phase 3.
      </p>
    </section>
  )
}

export default PublicPlaceholderPage
