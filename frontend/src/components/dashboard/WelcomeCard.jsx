function WelcomeCard({ userName, isLoading }) {
  const greeting = isLoading ? 'Loading' : `Welcome back${userName ? `, ${userName.split(' ')[0]}` : ''}`
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <section className="rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 px-8 py-8 text-white shadow-lg sm:py-10">
      <div className="space-y-4">
        {isLoading ? (
          <div className="h-10 w-48 animate-pulse rounded-lg bg-white/20"></div>
        ) : (
          <>
            <h1 className="text-4xl font-bold tracking-tight">{greeting}</h1>
            <p className="text-emerald-100">Today is {today}</p>
          </>
        )}
      </div>
    </section>
  )
}

export default WelcomeCard
