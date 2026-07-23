import { Link } from 'react-router-dom'
import { 
  Users, 
  Rocket, 
  Shield, 
  Award, 
  TrendingUp, 
  MessageSquare,
  CheckCircle,
  Clock,
  BarChart3,
  Users2,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Star,
  Target,
  Zap
} from 'lucide-react'

const principles = [
  {
    title: 'Clarity first',
    detail: 'Project requirements and team expectations are visible before students apply.',
    icon: Target,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    title: 'Reusable workflows',
    detail: 'Projects, applications, and profile updates share consistent patterns across the app.',
    icon: Zap,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    title: 'Collaboration-ready',
    detail: 'Owners and applicants can track status updates without page reload friction.',
    icon: Users2,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
]

const features = [
  {
    title: 'Smart Team Formation',
    description: 'AI-powered recommendations help project owners find the perfect team members based on skills and experience.',
    icon: Sparkles,
    color: 'text-indigo-600'
  },
  {
    title: 'Real-time Collaboration',
    description: 'Workspaces with live updates, discussions, and file sharing keep everyone on the same page.',
    icon: MessageSquare,
    color: 'text-indigo-600'
  },
  {
    title: 'Progress Tracking',
    description: 'Visual dashboards and progress metrics help teams stay on track and meet deadlines.',
    icon: BarChart3,
    color: 'text-indigo-600'
  },
  {
    title: 'Supervisor Integration',
    description: 'Supervisors can monitor project progress, provide feedback, and approve milestones seamlessly.',
    icon: Users,
    color: 'text-indigo-600'
  },
]

const stats = [
  { label: 'Active Projects', value: '500+', icon: Rocket },
  { label: 'Students Connected', value: '2,000+', icon: Users },
  { label: 'Success Rate', value: '94%', icon: Award },
  { label: 'Satisfaction Score', value: '4.8/5', icon: Star },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Computer Science Student',
    quote: 'ProjectMatch made it so easy to find the right team for my final year project. The AI recommendations were spot on!',
    avatar: 'SJ'
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Senior Supervisor',
    quote: 'The platform has streamlined how I oversee student projects. The progress tracking features are invaluable.',
    avatar: 'MC'
  },
  {
    name: 'Alex Rivera',
    role: 'Project Owner',
    quote: 'I found amazing team members within days. The collaboration tools made our project delivery smooth and efficient.',
    avatar: 'AR'
  }
]

function AboutPage() {
  return (
    <section className="space-y-8">
      {/* Hero Section */}
      <header className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Built for final year teams to{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                discover and deliver
              </span>{' '}
              better projects.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              ProjectMatch is a focused collaboration platform for students and project owners. It helps teams discover
              opportunities, apply with context, and manage delivery workflows with a clean, modern interface.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300 px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
              >
                Explore projects
              </Link>
            </div>
          </div>
          
          <div className="relative flex-1">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200 hover:border-indigo-200 transition">
                  <stat.icon className="h-5 w-5 text-indigo-600" />
                  <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Principles Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Our Core Principles</h2>
          <p className="mt-2 text-sm text-slate-600">The foundation of how we build and operate</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((item) => {
            const Icon = item.icon
            return (
              <article 
                key={item.title} 
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className={`inline-flex rounded-xl ${item.bg} p-3 ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Key Features</h2>
          <p className="mt-2 text-sm text-slate-600">Everything you need to succeed with your projects</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div 
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-indigo-200"
              >
                <div className={`${feature.color}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
          <p className="mt-2 text-sm text-slate-600">Get started in three simple steps</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Create Profile',
              description: 'Set up your student or supervisor profile with your skills, interests, and experience.',
              icon: Users
            },
            {
              step: '02',
              title: 'Find Projects',
              description: 'Browse available projects, apply to ones that match your skills and interests.',
              icon: Target
            },
            {
              step: '03',
              title: 'Collaborate & Deliver',
              description: 'Join teams, collaborate in workspaces, and deliver successful projects together.',
              icon: Rocket
            }
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-lg font-bold text-indigo-600">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">What Our Users Say</h2>
          <p className="mt-2 text-sm text-slate-600">Real experiences from real people</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">"{testimonial.quote}"</p>
              <div className="mt-3 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center shadow-sm sm:p-12">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Ready to get started?
        </h2>
        <p className="mt-3 text-base text-slate-300">
          Join thousands of students already collaborating on ProjectMatch.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-400/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600/10"
          >
            Browse projects
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          No credit card required • Free to use
        </p>
      </section>

      {/* Footer note */}
      <div className="text-center">
        <p className="text-sm text-slate-500">
          Built with ❤️ for students and project owners
        </p>
      </div>
    </section>
  )
}

export default AboutPage
