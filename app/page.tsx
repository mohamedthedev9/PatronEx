// @ts-nocheck
'use client';

import { useEffect, useRef, useState, forwardRef } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  Menu,
  X,
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  PenTool,
  LayoutGrid,
  ScanLine,
  Printer,
  SlidersHorizontal,
  ClipboardList,
  UploadCloud,
  Layers,
  Cpu,
  FileCheck2,
  Gauge,
  Clock,
  Scissors,
} from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-playfair' });

/* ------------------------------------------------------------------ */
/*  Brand tokens (Warm Luxury / Tailored Atelier Palette)             */
/* ------------------------------------------------------------------ */
const INK = '#1C1917'; // stone-900 (deep warm charcoal)
const SUB = '#78716C'; // stone-500
const BG = '#FAFAF9'; // stone-50 (warm luxury cream)
const CARD = '#FFFFFF';
const BORDER = '#E7E5E4'; // stone-200
const GOLD = '#9A6735'; // Sophisticated bronze/gold
const GOLD_LIGHT = '#D4AF37'; // Metallic gold accent
const BRONZE_ACCENT = '#78350F';
const GRADIENT = `linear-gradient(90deg, #78350F 0%, #B45309 50%, #D97706 100%)`;
const FONT_SERIF = "var(--font-playfair), Georgia, serif";
const FONT_SANS = "var(--font-inter), -apple-system, sans-serif";
const GALLERY_URL = 'https://patronex.my.canva.site/gallery';
const WHATSAPP_URL = 'https://wa.me/201150006003';

/* ------------------------------------------------------------------ */
/*  Content                                                             */
/* ------------------------------------------------------------------ */
const NAV_LINKS = [
  { id: 'services', label: 'Services' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'technology', label: 'Technology' },
  { id: 'contact', label: 'Contact' },
];

const SERVICES = [
  {
    icon: PenTool,
    title: 'Digital Pattern Making',
    desc: 'Precision-engineered digital patterns built to your exact specs, ready for grading and production.',
  },
  {
    icon: LayoutGrid,
    title: 'AI Fabric Nesting',
    desc: 'Neural nesting algorithms maximize marker efficiency and cut fabric waste by up to 15%.',
  },
  {
    icon: ScanLine,
    title: 'Paper-to-Digital Conversion',
    desc: 'Digitize legacy paper patterns into clean, fully editable digital files with full dimensional accuracy.',
  },
  {
    icon: Printer,
    title: 'Plotter Setup',
    desc: 'Print-ready marker files configured and optimized for your industrial plotter and cutting room.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Grading',
    desc: 'Full size-range grading across your entire size chart, engineered into every base pattern.',
  },
  {
    icon: ClipboardList,
    title: 'Tech Pack Development',
    desc: 'Comprehensive tech packs with specs, BOMs, and construction detail sheets built for manufacturers.',
  },
];

const STEPS = [
  {
    icon: UploadCloud,
    title: 'Submit Your Concept',
    desc: 'Send us sketches, measurements, or an existing paper pattern — however far along you are.',
  },
  {
    icon: Layers,
    title: 'Digital Pattern Development',
    desc: 'Our pattern makers build a precise, production-ready digital pattern to your exact specifications.',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Nesting',
    desc: 'Our neural nesting engine automatically optimizes your marker layout to minimize fabric waste.',
  },
  {
    icon: FileCheck2,
    title: 'Production Floor Delivery',
    desc: 'Receive plotter-ready files, graded sizes, and complete tech packs — cut-room ready.',
  },
];

const METRICS = [
  { icon: Gauge, value: 99.8, suffix: '%', decimals: 1, label: 'Precision Rate' },
  { icon: Scissors, value: 15, suffix: '%', decimals: 0, label: 'Fabric Savings' },
  { icon: Clock, value: 48, suffix: 'H', decimals: 0, label: 'Avg. Turnaround' },
];

const TECH_POINTS = [
  'Reduces fabric waste by up to 15% versus manual marker making',
  'Processes complex, multi-size markers in seconds, not hours',
  'Continuously learns from historical cutting data to keep improving',
];

/* ------------------------------------------------------------------ */
/*  Text scramble hook                                                  */
/* ------------------------------------------------------------------ */
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

function useScrambleText(finalText, opts) {
  const duration = opts?.duration ?? 900;
  const startDelay = opts?.startDelay ?? 150;
  const disabled = !!opts?.disabled;

  const [display, setDisplay] = useState(disabled ? finalText : '');

  useEffect(() => {
    if (disabled) {
      setDisplay(finalText);
      return;
    }

    let raf;
    let startTime = null;
    let lastFrame = 0;
    const frameDelay = 28;

    const tick = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (timestamp - lastFrame >= frameDelay) {
        lastFrame = timestamp;
        const progress = Math.min(elapsed / duration, 1);
        const revealCount = Math.floor(progress * finalText.length);

        let output = '';
        for (let i = 0; i < finalText.length; i++) {
          if (i < revealCount) {
            output += finalText[i];
          } else {
            output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }
        setDisplay(output);

        if (progress >= 1) {
          setDisplay(finalText);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const startTimer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [finalText, duration, startDelay, disabled]);

  return display;
}

/* ------------------------------------------------------------------ */
/*  Count-up hook                                                       */
/* ------------------------------------------------------------------ */
function useCountUp(target, { duration = 1600, decimals = 0, start = false } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf;
    let startTime = null;

    const animate = (ts) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Number((eased * target).toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => raf && cancelAnimationFrame(raf);
  }, [start, target, duration, decimals]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  Shared bits                                                         */
/* ------------------------------------------------------------------ */
function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-7xl px-6 lg:px-10 ${className}`}>{children}</div>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
};

const Reveal = forwardRef(function Reveal(
  { children, className = '', variants = staggerContainer, ...rest },
  ref
) {
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
});

function Eyebrow({ children }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
      <span
        className="text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color: GOLD }}
      >
        {children}
      </span>
    </div>
  );
}

function GradientText({ children, className = '' }) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: GRADIENT,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {children}
    </span>
  );
}

function GalleryLink({ className = '', iconClassName = 'h-3.5 w-3.5' }) {
  return (
    <a
      href={GALLERY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Gallery
      <ExternalLink className={iconClassName} />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                              */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [active, setActive] = useState('services');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    NAV_LINKS.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-stone-200 bg-white/80 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <Container className="flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-wider" style={{ color: INK, fontFamily: FONT_SERIF }}>
            PATRONEX
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-stone-200 bg-white/70 p-1 backdrop-blur-md md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="relative px-4 py-2 text-sm font-medium">
              {active === link.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: INK }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className={`relative z-10 ${active === link.id ? 'text-white' : 'text-stone-600'}`}>
                {link.label}
              </span>
            </a>
          ))}
          <GalleryLink className="relative z-10 flex items-center gap-1 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900" />
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, boxShadow: `0 12px 28px -10px rgba(120, 53, 15, 0.3)` }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundImage: GRADIENT, ['--tw-ring-color']: GOLD }}
          >
            Start a Project
          </motion.a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-stone-200 bg-white md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  {link.label}
                </a>
              ))}
              <GalleryLink className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50" />
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-full px-5 py-3 text-center text-sm font-bold text-white"
                style={{ backgroundImage: GRADIENT }}
              >
                Start a Project
              </a>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */
function MetricCard({ metric, start }) {
  const value = useCountUp(metric.value, { start, decimals: metric.decimals, duration: 1500 });
  const Icon = metric.icon;
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-1 items-center gap-4 rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundImage: GRADIENT }}
      >
        <Icon className="h-5 w-5 text-white" />
      </span>
      <div>
        <p className="text-2xl font-black tracking-tight" style={{ color: INK, fontFamily: FONT_SERIF }}>
          {value.toFixed(metric.decimals)}
          {metric.suffix}
        </p>
        <p className="text-sm font-medium text-stone-500">{metric.label}</p>
      </div>
    </motion.div>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const logoText = useScrambleText('PATRONEX', { duration: 900, startDelay: 100, disabled: !!reduceMotion });

  const metricsRef = useRef(null);
  const metricsInView = useInView(metricsRef, { once: true, amount: 0.4 });

  return (
    <section id="top" className="relative overflow-hidden" style={{ backgroundColor: BG }}>
      {/* Ambient gradient blobs */}
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
        style={{ backgroundImage: GRADIENT }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 left-[-15%] h-[380px] w-[380px] rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: GOLD_LIGHT }}
        aria-hidden="true"
      />
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: 'radial-gradient(#D6D3D1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(to bottom, black, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10 flex flex-col items-center gap-8 py-28 text-center sm:py-36">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold text-stone-600 shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GOLD }} />
          AI-Powered Digital Pattern Studio
        </motion.div>

        <h1
          className="select-none text-6xl font-black tracking-tight sm:text-8xl"
          style={{ color: INK, fontFamily: FONT_SERIF, fontVariantLigatures: 'none' }}
        >
          {logoText}
        </h1>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl"
          style={{ color: INK, fontFamily: FONT_SERIF }}
        >
          Precision digital patterns.{' '}
          <GradientText className="block sm:inline">Zero wasted fabric.</GradientText>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          className="max-w-2xl text-lg leading-relaxed text-stone-600"
        >
          PATRONEX turns your sketches, measurements, or paper patterns into production-ready
          digital patterns — nested by AI to cut fabric waste and get you to the cutting floor faster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, boxShadow: `0 16px 36px -10px rgba(120, 53, 15, 0.4)` }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundImage: GRADIENT, ['--tw-ring-color']: GOLD }}
          >
            Get a Free Consultation
            <ArrowRight className="h-4 w-4" />
          </motion.a>
          <motion.a
            href="#how-it-works"
            whileHover={{ scale: 1.05, boxShadow: `0 16px 36px -10px rgba(28, 25, 23, 0.1)` }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-stone-300 bg-white px-8 py-4 text-base font-bold text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ ['--tw-ring-color']: INK }}
          >
            See How It Works
          </motion.a>
        </motion.div>

        <Reveal
          ref={metricsRef}
          className="mt-6 flex w-full max-w-3xl flex-col gap-4 sm:flex-row"
        >
          {METRICS.map((m) => (
            <MetricCard key={m.label} metric={m} start={metricsInView} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                            */
/* ------------------------------------------------------------------ */
function ServiceCard({ service }) {
  const Icon = service.icon;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="group rounded-2xl border border-stone-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-stone-200/60"
    >
      <span
        className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundImage: GRADIENT }}
      >
        <Icon className="h-6 w-6 text-white" />
      </span>
      <h3 className="mb-2 text-xl font-bold" style={{ color: INK, fontFamily: FONT_SERIF }}>
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed text-stone-600">{service.desc}</p>
    </motion.div>
  );
}

function Services() {
  return (
    <section id="services" className="py-24 sm:py-32">
      <Container>
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <motion.div variants={fadeUp} className="flex justify-center">
            <Eyebrow>What We Do</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-black tracking-tight sm:text-5xl"
            style={{ color: INK, fontFamily: FONT_SERIF }}
          >
            Everything from first sketch to cutting floor
          </motion.h2>
        </Reveal>

        <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                        */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32" style={{ backgroundColor: BG }}>
      <Container>
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <motion.div variants={fadeUp} className="flex justify-center">
            <Eyebrow>The Process</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-black tracking-tight sm:text-5xl"
            style={{ color: INK, fontFamily: FONT_SERIF }}
          >
            From concept to production in four steps
          </motion.h2>
        </Reveal>

        <Reveal className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px lg:block"
            style={{ backgroundImage: GRADIENT, opacity: 0.25 }}
            aria-hidden="true"
          />
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.title} variants={fadeUp} className="relative flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 bg-white shadow-sm"
                    style={{ borderColor: BG }}
                  >
                    <span
                      className="flex h-full w-full items-center justify-center rounded-xl"
                      style={{ backgroundImage: GRADIENT }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </span>
                  </span>
                  <span className="text-sm font-mono font-bold text-stone-400">0{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold" style={{ color: INK, fontFamily: FONT_SERIF }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">{step.desc}</p>
              </motion.div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  AI Technology Showcase — nesting demo                               */
/* ------------------------------------------------------------------ */
const LOOSE_PIECES = [
  { x: 6, y: 14, w: 46, h: 34 },
  { x: 66, y: 8, w: 34, h: 40 },
  { x: 118, y: 20, w: 40, h: 30 },
  { x: 176, y: 10, w: 30, h: 44 },
  { x: 224, y: 24, w: 44, h: 28 },
  { x: 10, y: 96, w: 38, h: 46 },
  { x: 70, y: 100, w: 48, h: 36 },
  { x: 138, y: 92, w: 34, h: 48 },
  { x: 194, y: 104, w: 40, h: 32 },
];

const NESTED_PIECES = [
  { x: 4, y: 6, w: 46, h: 34 },
  { x: 4, y: 44, w: 34, h: 40 },
  { x: 42, y: 6, w: 40, h: 30 },
  { x: 42, y: 40, w: 30, h: 44 },
  { x: 86, y: 6, w: 44, h: 28 },
  { x: 76, y: 40, w: 38, h: 46 },
  { x: 134, y: 6, w: 48, h: 36 },
  { x: 118, y: 44, w: 34, h: 48 },
  { x: 156, y: 44, w: 40, h: 32 },
];

function NestingDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [nested, setNested] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setNested(true), 500);
    return () => clearTimeout(t);
  }, [inView]);

  const set = nested ? NESTED_PIECES : LOOSE_PIECES;

  return (
    <div ref={ref} className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
          {nested ? 'AI-Nested Marker' : 'Loading Marker…'}
        </span>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
          style={{ backgroundImage: GRADIENT }}
        >
          {nested ? '-15% Fabric' : 'Optimizing…'}
        </span>
      </div>

      <svg viewBox="0 0 280 150" className="w-full">
        <rect
          x="0"
          y="0"
          width="280"
          height="150"
          rx="8"
          fill="none"
          stroke={BORDER}
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        {nested && (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            x="196"
            y="0"
            width="84"
            height="150"
            fill={GOLD}
            opacity="0.08"
          />
        )}
        {set.map((p, i) => (
          <motion.rect
            key={i}
            animate={{ x: p.x, y: p.y, width: p.w, height: p.h }}
            transition={{ type: 'spring', stiffness: 90, damping: 16, delay: i * 0.03 }}
            rx="4"
            fill={i % 2 === 0 ? BRONZE_ACCENT : GOLD}
            opacity="0.85"
          />
        ))}
      </svg>

      {nested && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-4 text-center text-xs font-medium text-stone-400"
        >
          Highlighted zone = fabric reclaimed by AI nesting
        </motion.p>
      )}
    </div>
  );
}

function Technology() {
  return (
    <section id="technology" className="py-24 sm:py-32">
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <motion.div variants={fadeUp}>
            <Eyebrow>The Technology</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-6 text-3xl font-black tracking-tight sm:text-5xl"
            style={{ color: INK, fontFamily: FONT_SERIF }}
          >
            Neural nesting that thinks like a master cutter
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-8 text-lg leading-relaxed text-stone-600">
            Our nesting engine doesn't just place pieces on fabric — it evaluates thousands of
            possible layouts per marker, learning from every project to squeeze more garments
            out of every roll.
          </motion.p>
          <motion.ul variants={staggerContainer} className="space-y-4">
            {TECH_POINTS.map((point) => (
              <motion.li key={point} variants={fadeUp} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: GOLD }} />
                <span className="text-stone-700">{point}</span>
              </motion.li>
            ))}
          </motion.ul>
        </Reveal>

        <Reveal variants={fadeUp}>
          <NestingDemo />
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                              */
/* ------------------------------------------------------------------ */
function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32" style={{ backgroundColor: BG }}>
      <Container>
        <Reveal className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-10 text-center sm:p-16 shadow-sm">
          <motion.div variants={fadeUp} className="flex justify-center">
            <Eyebrow>Let's Talk</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-black tracking-tight sm:text-5xl"
            style={{ color: INK, fontFamily: FONT_SERIF }}
          >
            Ready to cut smarter?
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-stone-600">
            Tell us about your project and we'll follow up with a tailored quote and timeline —
            usually within one business day.
          </motion.p>

          <motion.div variants={staggerContainer} className="flex flex-col items-stretch justify-center gap-4 sm:flex-row">
            <motion.a
              variants={fadeUp}
              whileHover={{ scale: 1.05, boxShadow: `0 16px 36px -10px rgba(120, 53, 15, 0.4)` }}
              whileTap={{ scale: 0.96 }}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ backgroundImage: GRADIENT, ['--tw-ring-color']: GOLD }}
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </motion.a>
            <motion.a
              variants={fadeUp}
              whileHover={{ scale: 1.05, boxShadow: `0 16px 36px -10px rgba(28, 25, 23, 0.1)` }}
              whileTap={{ scale: 0.96 }}
              href="mailto:patronex.eg@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-stone-300 bg-white px-8 py-4 text-base font-bold text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ ['--tw-ring-color']: INK }}
            >
              <Mail className="h-5 w-5" />
              patronex.eg@gmail.com
            </motion.a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-2 text-sm text-stone-400">
            <Phone className="h-4 w-4" />
            <span>+20 115 000 6003</span>
          </motion.div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                               */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-stone-800 py-12" style={{ backgroundColor: INK }}>
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <a href="#top" className="mb-3 flex items-center gap-2">
            <span className="text-xl font-black tracking-wider text-white" style={{ fontFamily: FONT_SERIF }}>
              PATRONEX
            </span>
          </a>
          <p className="max-w-xs text-sm leading-relaxed text-stone-400">
            Digital pattern making and AI-powered fabric nesting for apparel brands and manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:flex sm:gap-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-400">Explore</p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="text-sm text-stone-300 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <GalleryLink className="inline-flex items-center gap-1.5 text-sm text-stone-300 transition-colors hover:text-white" />
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-400">Contact</p>
            <ul className="space-y-2">
              <li>
                <a href="mailto:patronex.eg@gmail.com" className="text-sm text-stone-300 transition-colors hover:text-white">
                  patronex.eg@gmail.com
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-300 transition-colors hover:text-white"
                >
                  +20 115 000 6003
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <Container className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-6 sm:flex-row">
        <p className="text-xs text-stone-400">© {new Date().getFullYear()} PATRONEX. All rights reserved.</p>
        <a
          href={GALLERY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 transition-colors hover:text-white"
        >
          View full gallery
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </Container>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                 */
/* ------------------------------------------------------------------ */
export default function Page() {
  return (
    <main className={`${inter.variable} ${playfair.variable}`} style={{ fontFamily: FONT_SANS, backgroundColor: BG, color: INK }}>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Technology />
      <Contact />
      <Footer />
    </main>
  );
}