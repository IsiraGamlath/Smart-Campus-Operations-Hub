import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Data structures
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Bookings', href: '#bookings' },
  { label: 'Tickets', href: '#tickets' },
];

const FEATURES = [
  {
    id: 1,
    icon: 'ðŸ“š',
    title: 'Facilities Catalogue',
    desc: 'Browse lecture halls, labs, meeting rooms, and equipment with real-time availability.',
  },
  {
    id: 2,
    icon: 'ðŸ“…',
    title: 'Smart Booking',
    desc: 'Request resources with date, time range, and purpose. Automated conflict detection.',
  },
  {
    id: 3,
    icon: 'âœ“',
    title: 'Approval Workflow',
    desc: 'Bookings flow through PENDING â†’ APPROVED / REJECTED with structured reasoning.',
  },
  {
    id: 4,
    icon: 'ðŸ”§',
    title: 'Incident Tickets',
    desc: 'Report facility issues with image evidence. Track from OPEN to RESOLVED.',
  },
  {
    id: 5,
    icon: 'ðŸ””',
    title: 'Live Notifications',
    desc: 'Instant alerts for booking changes, ticket updates, and new comments.',
  },
  {
    id: 6,
    icon: 'ðŸ”',
    title: 'Role-Based Access',
    desc: 'OAuth 2.0 with USER, ADMIN, and TECHNICIAN roles. Protected by design.',
  },
];

const STATS = [
  { value: '50+', label: 'Bookable Resources' },
  { value: '99%', label: 'Uptime' },
  { value: '<2min', label: 'Response Time' },
  { value: '3', label: 'Role Levels' },
];

const WORKFLOW_STEPS = [
  { number: '01', title: 'Browse & Filter', desc: 'Search resources by type, capacity, or location.' },
  { number: '02', title: 'Submit Request', desc: 'Choose date, time, purpose, and attendees.' },
  { number: '03', title: 'Await Approval', desc: 'Admin reviews and approves or rejects with reason.' },
  { number: '04', title: 'Confirmed Ready', desc: 'Receive notification and your booking is confirmed.' },
];

// Intersection observer hook for fade-in animations
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// Fade-in component
function FadeInUp({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: '#fafafa' }}>
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-40 border-b" style={{ borderColor: '#e2e8f0', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}>
        <div className="mx-auto max-w-6xl px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                SC
              </div>
              <span className="text-sm font-semibold" style={{ color: '#111827' }}>Smart Campus</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium transition hover:text-slate-900"
                  style={{ color: '#64748b' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button className="md:hidden" style={{ color: '#64748b' }} onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="mt-4 space-y-2 border-t" style={{ borderColor: '#e2e8f0', paddingTop: '1rem' }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm font-medium"
                  style={{ color: '#64748b' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section
        className={`border-b transition-opacity duration-700 py-16 sm:py-24`}
        style={{ borderColor: '#e2e8f0', background: '#ffffff', opacity: mounted ? 1 : 0 }}
      >
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <FadeInUp>
            <p className="mb-4 text-xs tracking-widest" style={{ color: '#64748b', textTransform: 'uppercase' }}>
              Campus Resource Management Platform
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: '#111827', lineHeight: 1.2 }}>
              Smart Campus System
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg" style={{ color: '#475569', lineHeight: 1.6 }}>
              Manage facilities, bookings, incidents, and notifications in one calm, unified workspace. Streamline campus operations with confidence.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Get Started
            </Link>
          </FadeInUp>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="border-b py-12 sm:py-16" style={{ borderColor: '#e2e8f0' }}>
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((stat, idx) => (
              <FadeInUp key={idx} delay={idx * 0.05}>
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold" style={{ color: '#111827' }}>{stat.value}</div>
                  <div className="text-sm" style={{ color: '#64748b' }}>{stat.label}</div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="border-b bg-white py-16 sm:py-24" style={{ borderColor: '#e2e8f0' }}>
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold" style={{ color: '#111827' }}>Core Features</h2>
              <p style={{ color: '#64748b' }}>Everything you need to manage campus resources efficiently</p>
            </div>
          </FadeInUp>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, idx) => (
              <FadeInUp key={feature.id} delay={idx * 0.05}>
                <div
                  className="rounded-lg border bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
                  style={{ borderColor: '#e2e8f0' }}
                >
                  <div className="mb-3 text-2xl">{feature.icon}</div>
                  <h3 className="mb-2 font-semibold" style={{ color: '#111827' }}>{feature.title}</h3>
                  <p className="text-sm" style={{ color: '#64748b' }}>{feature.desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WORKFLOW SECTION ===== */}
      <section id="workflow" className="border-b py-16 sm:py-24" style={{ borderColor: '#e2e8f0' }}>
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold" style={{ color: '#111827' }}>How It Works</h2>
              <p style={{ color: '#64748b' }}>A simple four-step process to manage your bookings</p>
            </div>
          </FadeInUp>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step, idx) => (
              <FadeInUp key={idx} delay={idx * 0.08}>
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {step.number}
                  </div>
                  <h3 className="font-semibold" style={{ color: '#111827' }}>{step.title}</h3>
                  <p className="text-sm" style={{ color: '#64748b' }}>{step.desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOOKINGS SECTION ===== */}
      <section id="bookings" className="border-b bg-white py-16 sm:py-24" style={{ borderColor: '#e2e8f0' }}>
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <FadeInUp>
            <h2 className="mb-3 text-3xl font-bold" style={{ color: '#111827' }}>Smart Booking System</h2>
            <p className="mb-8 text-lg" style={{ color: '#475569' }}>
              Request facilities and equipment with automatic conflict detection. Track approvals in real-time.
            </p>
            <div className="space-y-3 rounded-lg border p-6" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
              <div className="flex gap-3 text-left">
                <span style={{ color: '#cbd5e1' }}>âœ“</span>
                <span style={{ color: '#475569' }}>Real-time availability checking</span>
              </div>
              <div className="flex gap-3 text-left">
                <span style={{ color: '#cbd5e1' }}>âœ“</span>
                <span style={{ color: '#475569' }}>Automated conflict prevention</span>
              </div>
              <div className="flex gap-3 text-left">
                <span style={{ color: '#cbd5e1' }}>âœ“</span>
                <span style={{ color: '#475569' }}>Admin approval workflows</span>
              </div>
              <div className="flex gap-3 text-left">
                <span style={{ color: '#cbd5e1' }}>âœ“</span>
                <span style={{ color: '#475569' }}>Instant status notifications</span>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ===== TICKETS SECTION ===== */}
      <section id="tickets" className="border-b py-16 sm:py-24" style={{ borderColor: '#e2e8f0' }}>
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <FadeInUp>
            <h2 className="mb-3 text-3xl font-bold" style={{ color: '#111827' }}>Incident Management</h2>
            <p className="mb-8 text-lg" style={{ color: '#475569' }}>
              Report equipment damage or facility issues with photo evidence. Track resolution status.
            </p>
            <div className="rounded-lg border bg-white p-6" style={{ borderColor: '#e2e8f0' }}>
              <div className="space-y-4">
                <div className="border-b pb-4 text-left" style={{ borderColor: '#e2e8f0' }}>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>Ticket ID</div>
                  <div className="font-medium" style={{ color: '#111827' }}>TICKET-2024-001</div>
                </div>
                <div className="border-b pb-4 text-left" style={{ borderColor: '#e2e8f0' }}>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>Issue</div>
                  <div className="font-medium" style={{ color: '#111827' }}>Projector malfunction in Hall A</div>
                </div>
                <div className="text-left">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>Status</div>
                  <div className="inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ background: '#fef3c7', color: '#b45309' }}>
                    In Progress
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="border-b bg-white py-16 sm:py-24" style={{ borderColor: '#e2e8f0' }}>
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <FadeInUp>
            <h2 className="mb-4 text-3xl font-bold" style={{ color: '#111827' }}>Ready to simplify campus operations?</h2>
            <p className="mb-8 text-lg" style={{ color: '#475569' }}>
              Join your institution in using Smart Campus to manage facilities and bookings efficiently.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Sign In with Google
            </Link>
          </FadeInUp>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t py-8 sm:py-12" style={{ borderColor: '#e2e8f0' }}>
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-xs font-bold text-white">
                SC
              </div>
              <span className="text-sm font-medium" style={{ color: '#374151' }}>Smart Campus</span>
            </div>
            <p className="text-sm" style={{ color: '#64748b' }}>Â© 2024 Smart Campus Operations Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
