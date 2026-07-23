import { Link, useNavigate } from 'react-router-dom'
import { 
  Zap, 
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Brain,
  Users2,
  Search,
  Users,
  Calendar
} from 'lucide-react'
import { getAccessToken } from '../utils/auth'

// Background image
const heroBackground = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80'

const featureItems = [
  {
    title: 'Find the right project faster',
    description: 'Search and compare opportunities that match your skills, interests, and academic goals without clutter.',
    icon: Search,
  },
  {
    title: 'Collaborate with clarity',
    description: 'Team owners can describe project requirements clearly so students know where they fit before applying.',
    icon: Users,
  },
  {
    title: 'Track progress in one place',
    description: 'Keep project, application, and profile information aligned through a structured workflow built for teams.',
    icon: BarChart3,
  },
]

const statistics = [
  { value: '100+', label: 'Projects ready to discover' },
  { value: '24/7', label: 'Access to opportunities' },
  { value: '3 steps', label: 'From discovery to application' },
]

const heroHighlights = [
  'Find projects faster',
  'Match team needs clearly',
  'Apply with confidence',
  'Track progress in one workspace',
]

const benefits = [
  {
    title: 'Smart Matching',
    description: 'AI-powered recommendations connect you with the right projects and teams.',
    icon: Brain
  },
  {
    title: 'Real-Time Updates',
    description: 'Stay informed with instant notifications for applications and project changes.',
    icon: Zap
  },
  {
    title: 'Team Collaboration',
    description: 'Workspaces with discussions, file sharing, and task management.',
    icon: Users2
  },
  {
    title: 'Progress Tracking',
    description: 'Visual dashboards to monitor project milestones and completion.',
    icon: Calendar
  },
]

const testimonials = [
  {
    name: 'Emma Thompson',
    role: 'Computer Science Student',
    quote: 'ProjectMatch made finding my final year project team so much easier. The recommendations were incredibly accurate!',
    rating: 5,
    avatar: 'ET'
  },
  {
    name: 'Dr. James Wilson',
    role: 'Senior Academic Supervisor',
    quote: 'I can now oversee multiple student projects efficiently. The progress tracking system is game-changing.',
    rating: 5,
    avatar: 'JW'
  },
  {
    name: 'Maria Garcia',
    role: 'Project Team Lead',
    quote: 'Managing our team\'s tasks and deadlines has never been smoother. Exactly what we needed.',
    rating: 5,
    avatar: 'MG'
  },
]

function HomePage() {
  const navigate = useNavigate()

  const handleExploreClick = () => {
    const isAuthenticated = Boolean(getAccessToken())
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/app/projects' } } })
    } else {
      navigate('/app/projects')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroBackground})`,
            filter: 'brightness(0.35)'
          }}
        />
        
        {/* Gradient Overlay - Navy/Indigo */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/75 to-slate-950/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.1),_transparent_50%)]" />
        
        {/* Content */}
        <div className="relative px-6 pt-6 pb-12 sm:pt-8 sm:px-10 lg:px-14 lg:pt-10 lg:pb-16">
          <div className="mx-auto max-w-5xl text-center">
            {/* Main Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block">Collaborate, Build, and Manage</span>
              <span className="block mt-2 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Academic Projects in One Platform
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              ProjectMatch is an AI-assisted collaboration platform that helps students discover projects, 
              form teams, manage tasks, and track progress from idea to completion.
            </p>

            {/* CTA Buttons - Indigo/Purple */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={handleExploreClick}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/40 cursor-pointer"
              >
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-500/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500/20"
              >
                Get Started
                <Sparkles className="h-4 w-4" />
              </Link>
            </div>

            {/* Rating */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-violet-400 text-violet-400" />
                ))}
              </div>
              <span className="text-sm text-slate-300">
                Trusted by students and supervisors worldwide
              </span>
            </div>

            {/* Highlights Cards - Indigo */}
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {heroHighlights.map((item) => (
                <div 
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 transition hover:bg-white/10"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-white">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Indigo */}
      <section id="features" className="scroll-mt-28 px-6 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A focused experience for students and project owners
            </h2>
            <p className="mt-3 text-base text-slate-600">
              The landing page introduces the core value of ProjectMatch without pulling in unfinished auth or dashboard flows.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featureItems.map((item) => {
              const Icon = item.icon
              return (
                <article 
                  key={item.title} 
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-indigo-200"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section - Indigo */}
      <section className="px-6 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {statistics.map((stat) => (
              <div 
                key={stat.label} 
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md hover:border-indigo-200"
              >
                <p className="text-3xl font-bold text-indigo-600 sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="how-it-works" className="scroll-mt-28 px-6 py-12 sm:px-10 lg:px-14 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Our platform combines powerful features to make your academic project journey seamless.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div 
                  key={benefit.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-md hover:border-indigo-200"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What our users are saying
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md border border-slate-200 hover:border-indigo-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-28 px-6 py-12 sm:px-10 lg:px-14 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                question: 'Who can use ProjectMatch?',
                answer: 'ProjectMatch is designed for university students, project supervisors, and academic coordinators.'
              },
              {
                question: 'Is ProjectMatch free to use?',
                answer: 'Yes, ProjectMatch is completely free for students and supervisors.'
              },
              {
                question: 'How does the AI matching work?',
                answer: 'Our AI analyzes your skills, interests, and project requirements to suggest the best matches.'
              },
              {
                question: 'Can I join multiple projects?',
                answer: 'Absolutely! Students can participate in multiple projects simultaneously.'
              },
            ].map((faq) => (
              <div 
                key={faq.question}
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-sm hover:border-indigo-200"
              >
                <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="px-6 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 text-center sm:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.2),_transparent_50%)]" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to discover your next project?
              </h2>
              <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
                Join thousands of students already collaborating on ProjectMatch.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/40"
                >
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500/10"
                >
                  Browse projects
                </Link>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                  Free for students
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                  No credit card required
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage