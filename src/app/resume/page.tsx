'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileCode2,
  FolderGit2,
  Printer,
  X,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  Award,
  Terminal,
  Code2,
  Cpu,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import resumeJsonData from '@/data/resume.json';
import { resumePdfBase64 } from '@/data/resumePdf';
import { ResumeData } from '@/types/resume';

const initialResume = resumeJsonData as unknown as ResumeData;

const toHref = (value: string) => {
  if (value.includes('@')) return `mailto:${value}`;
  if (/^https?:\/\//.test(value)) return value;
  if (/^[+\d][\d\s-]+$/.test(value)) return `tel:${value.replace(/\s/g, '')}`;
  return `https://${value}`;
};

const getContactIcon = (key: string) => {
  const lower = key.toLowerCase();
  if (lower.includes('email')) return Mail;
  if (lower.includes('phone')) return Phone;
  if (lower.includes('location')) return MapPin;
  if (lower.includes('github')) return Github;
  if (lower.includes('linkedin')) return Linkedin;
  return Globe;
};

const DossierSectionHeading: React.FC<{ children: React.ReactNode; badge?: string }> = ({
  children,
  badge,
}) => (
  <div className="flex items-center justify-between border-b border-[var(--line)] pb-2 mb-3">
    <h3 className="flex items-center gap-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
      {children}
    </h3>
    {badge && (
      <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--muted)]">
        {badge}
      </span>
    )}
  </div>
);

export default function ResumePage() {
  const [data] = useState<ResumeData>(initialResume);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!showJsonModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowJsonModal(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showJsonModal]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] space-texture selection:bg-[var(--accent)] selection:text-[var(--bg)]">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="pb-24 pt-28 print:p-0">
        <div className="site-shell print:hidden">
          {/* Back navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to portfolio
          </Link>

          {/* Editorial Header */}
          <header className="mt-8 grid gap-8 border-b border-[var(--line)] pb-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="orbital-eyebrow text-[var(--accent)]">
                <span>01</span> / FLIGHT DOSSIER // CURRICULUM VITAE
              </p>
              <h1 className="display mt-4 text-[clamp(54px,9vw,110px)] leading-[0.84] text-[var(--text)]">
                <span>BEZALEEL</span> <span className="outline-text">PAUL.</span>
              </h1>
              <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                A structured, synchronized record of my engineering education, practical experience,
                and technical toolkit across mobile, web, and applied machine learning.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">
                <span className="flex items-center gap-1.5 text-[var(--accent)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] animate-pulse" />
                  SYS VERIFIED // PILOT 01
                </span>
                <span>BENGALURU, INDIA · 12°58&apos; N / 77°36&apos; E</span>
                <span>OPEN TO SWE INTERNSHIPS</span>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-4">
              <a
                href={`data:application/pdf;base64,${resumePdfBase64}`}
                download="Bezaleel-Paul-Resume.pdf"
                className="action-button primary w-full !justify-between"
              >
                <span>DOWNLOAD PDF</span>
                <Download className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={handlePrint}
                className="action-button secondary w-full !justify-between text-[var(--text)]"
              >
                <span>PRINT / SAVE PDF</span>
                <Printer className="h-4 w-4 text-[var(--accent)]" />
              </button>
              <button
                type="button"
                onClick={() => setShowJsonModal(true)}
                className="action-button secondary w-full !justify-between text-[var(--text)]"
              >
                <span>DATA MANIFEST (JSON)</span>
                <FileCode2 className="h-4 w-4 text-[var(--accent)]" />
              </button>
              <Link
                href="/projects"
                className="action-button secondary w-full !justify-between text-[var(--text)]"
              >
                <span>PROJECT ARCHIVE</span>
                <FolderGit2 className="h-4 w-4 text-[var(--accent)]" />
              </Link>
            </div>
          </header>
        </div>

        {/* The Dossier Sheet */}
        <div className="mt-12 flex justify-center px-3 sm:px-6 print:m-0 print:p-0">
          <article
            id="resume-canvas"
            className="resume-dossier w-full max-w-[1200px] overflow-hidden"
          >
            {/* Top Targeting Markers */}
            <div className="resume-dossier-topline print:hidden">
              <div className="flex items-center gap-3">
                <span className="text-[var(--accent)]">+</span>
                <span>DOSSIER // PILOT-01-BP</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline">AUTHENTICATION: BEZALEEL PAUL N</span>
                <span className="rounded bg-[var(--accent-soft)] px-2 py-0.5 text-[8px] text-[var(--accent)] border border-[rgba(215,255,0,0.3)]">
                  ACTIVE MANIFEST
                </span>
                <span className="text-[var(--accent)]">+</span>
              </div>
            </div>

            <div className="resume-dossier-grid">
              {/* ── Left Aside: Pilot Credentials & Telemetry ── */}
              <aside className="resume-dossier-aside flex flex-col gap-6 text-[10px] leading-relaxed">
                {/* Profile Card */}
                <div className="flex items-center gap-4 border-b border-[var(--line)] pb-5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[var(--accent)] bg-[var(--surface-raised)] shadow-[0_0_15px_rgba(215,255,0,0.15)]">
                    <img
                      src="/assets/portrait-processed.webp"
                      alt={data.name}
                      className="h-full w-full object-cover object-top filter brightness-[1.03] contrast-[1.05]"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="flex h-full w-full items-center justify-center bg-[var(--surface-raised)] font-mono text-xl font-bold text-[var(--accent)]">
                      BP
                    </div>
                  </div>
                  <div>
                    <h2 className="font-mono text-sm font-bold tracking-tight text-[var(--text)]">
                      {data.name} <span className="text-[var(--accent)]">{data.nameAccent}</span>
                    </h2>
                    <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
                      {data.tagline}
                    </p>
                    <span className="mt-1.5 inline-block font-mono text-[7.5px] text-[var(--accent)]">
                      CALLSIGN: BEZALEEL // 01
                    </span>
                  </div>
                </div>

                {/* Terminal Commands */}
                <div className="flex flex-col gap-1.5 rounded border border-[var(--line)] bg-[rgba(10,10,15,0.7)] p-2.5 font-mono text-[8px]">
                  {data.terminal.map((line) => (
                    <span
                      key={line}
                      className={
                        line.startsWith('$')
                          ? 'text-[var(--accent)] font-semibold'
                          : 'text-[var(--muted)] pl-2'
                      }
                    >
                      {line}
                    </span>
                  ))}
                </div>

                {/* Contact Telemetry */}
                <section>
                  <DossierSectionHeading badge="CHANNELS">CONTACT</DossierSectionHeading>
                  <div className="space-y-2">
                    {data.contact.map(([key, value]) => {
                      const Icon = getContactIcon(key);
                      return (
                        <div key={key} className="flex items-start gap-2.5">
                          <Icon className="h-3 w-3 mt-0.5 text-[var(--accent)] shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-mono text-[7px] uppercase tracking-[0.14em] text-[var(--muted)]">
                              {key}
                            </div>
                            <a
                              href={toHref(value)}
                              target={toHref(value).startsWith('http') ? '_blank' : undefined}
                              rel={toHref(value).startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="break-all font-mono text-[9px] font-medium text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                            >
                              {value}
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Education Orbit */}
                <section>
                  <DossierSectionHeading badge="01 — 02">EDUCATION</DossierSectionHeading>
                  <div className="space-y-3">
                    {data.education.map(([degree, institution, timeline], idx) => (
                      <div
                        key={degree}
                        className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.4)] p-2.5"
                      >
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-mono text-[7.5px] text-[var(--accent)] font-bold">
                            // 0{idx + 1}
                          </span>
                          <span className="font-mono text-[7px] text-[var(--muted)] uppercase">
                            {timeline}
                          </span>
                        </div>
                        <b className="mt-1 block font-mono text-[10px] font-bold text-[var(--text)]">
                          {institution}
                        </b>
                        <span className="block text-[9px] text-[var(--muted)]">{degree}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Skills Toolkit */}
                <section>
                  <DossierSectionHeading badge="STACK">ENGINEERING TOOLKIT</DossierSectionHeading>
                  <div className="space-y-3">
                    {data.skills.map(([category, items]) => (
                      <div key={category}>
                        <div className="mb-1.5 font-mono text-[7.5px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                          {category}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {items.map((skill) => (
                            <span
                              key={skill}
                              className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-2 py-0.5 font-mono text-[8px] font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Certifications */}
                <section>
                  <DossierSectionHeading badge="TRAINING">CERTIFICATIONS</DossierSectionHeading>
                  <ul className="space-y-1.5 text-[8.5px] text-[var(--muted)]">
                    {data.certifications.map((certification) => (
                      <li key={certification} className="flex gap-2 items-start">
                        <Award className="h-3 w-3 mt-0.5 text-[var(--accent)] shrink-0" />
                        <span>{certification}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Languages */}
                <section>
                  <DossierSectionHeading badge="COMMUNICATION">LANGUAGES</DossierSectionHeading>
                  <div className="space-y-1">
                    {data.languages.map(([language, level]) => (
                      <div
                        key={language}
                        className="flex items-baseline justify-between gap-2 font-mono text-[8.5px]"
                      >
                        <span className="font-semibold text-[var(--text)]">{language}</span>
                        <span className="text-[var(--muted)]">{level}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Coursework */}
                <section>
                  <DossierSectionHeading badge="CURRICULUM">CORE COURSEWORK</DossierSectionHeading>
                  <ul className="space-y-1 text-[8px] text-[var(--muted)]">
                    {data.coursework.map((course) => (
                      <li key={course} className="flex gap-1.5 items-center">
                        <span className="h-1 w-1 rounded-full bg-[var(--accent)] shrink-0" />
                        <span>{course}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>

              {/* ── Right Main: Field Experience & Mission Log ── */}
              <div className="resume-dossier-main flex flex-col gap-7">
                <header className="border-b border-[var(--line)] pb-5">
                  <p className="orbital-eyebrow text-[var(--accent)]">
                    ENGINEERING MANIFEST // MISSION SUMMARY
                  </p>
                  <h2 className="display mt-2 text-[clamp(26px,4vw,40px)] leading-[0.98] text-[var(--text)]">
                    {data.title}
                  </h2>
                </header>

                {/* Executive Summary */}
                <section>
                  <DossierSectionHeading badge="ORIENTATION">EXECUTIVE SUMMARY</DossierSectionHeading>
                  <p className="font-sans text-[11px] sm:text-[12px] leading-relaxed text-[rgba(255,255,255,0.85)]">
                    {data.summary}
                  </p>
                </section>

                {/* Experience & Leadership */}
                <section>
                  <DossierSectionHeading badge="CHRONOLOGY">
                    EXPERIENCE &amp; LEADERSHIP
                  </DossierSectionHeading>
                  <div className="mt-3 space-y-5">
                    {data.experience.map((experience) => (
                      <div
                        key={`${experience.role}-${experience.org}`}
                        className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.45)] p-4 transition-colors hover:border-[rgba(215,255,0,0.35)]"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <b className="font-mono text-[12px] font-bold text-[var(--accent)]">
                            {experience.role}
                          </b>
                          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[var(--muted)]">
                            {experience.place}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[10px] font-semibold text-[var(--text)]">
                          {experience.org}
                        </p>
                        <ul className="mt-2.5 space-y-1.5 text-[10px] leading-relaxed text-[var(--muted)]">
                          {experience.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2.5 items-start">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Selected Projects */}
                <section>
                  <DossierSectionHeading badge="SELECTED WORK">PROJECTS &amp; ENGINEERING</DossierSectionHeading>
                  <div className="space-y-4">
                    {data.projects.map((project) => (
                      <article key={project.name} className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.45)] p-3">
                        <h3 className="font-mono text-[11px] font-bold text-[var(--accent)]">{project.name}</h3>
                        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.08em] text-[var(--muted)]">{project.tech}</p>
                        <ul className="mt-2 space-y-1 text-[9.5px] leading-relaxed text-[var(--muted)]">
                          {project.bullets.map((bullet) => <li key={bullet} className="flex gap-2"><span className="text-[var(--accent)]">•</span><span>{bullet}</span></li>)}
                        </ul>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          {project.links.map((url) => (
                            <a key={url} href={url} target={url.startsWith('http') ? '_blank' : undefined} rel={url.startsWith('http') ? 'noopener noreferrer' : undefined} className="font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[var(--text)] underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)]">
                              {url.includes('/releases/') ? 'Latest releases ↗' : url.includes('github.com') ? 'Source repository ↗' : 'Live project ↗'}
                            </a>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* Competitive Problem Solving & Proof Metrics */}
                <section>
                  <DossierSectionHeading badge="VERIFIABLE SIGNALS">
                    COMPETITIVE PROBLEM SOLVING
                  </DossierSectionHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href="https://leetcode.com/u/BezaleelPaulN/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.45)] p-3 transition-colors hover:border-[var(--accent)]"
                    >
                      <div className="flex justify-between items-center text-[var(--muted)] font-mono text-[8px]">
                        <span>LEETCODE</span>
                        <ArrowUpRight className="h-3 w-3 text-[var(--accent)]" />
                      </div>
                      <strong className="display mt-1 block text-3xl text-[var(--accent)]">135</strong>
                      <span className="font-mono text-[8px] text-[var(--muted)]">
                        116 Easy · 17 Med · 2 Hard
                      </span>
                    </a>

                    <a
                      href="https://codeforces.com/profile/BezaleelPaulN2228"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.45)] p-3 transition-colors hover:border-[var(--accent)]"
                    >
                      <div className="flex justify-between items-center text-[var(--muted)] font-mono text-[8px]">
                        <span>CODEFORCES</span>
                        <ArrowUpRight className="h-3 w-3 text-[var(--accent)]" />
                      </div>
                      <strong className="display mt-1 block text-3xl text-[var(--accent)]">959</strong>
                      <span className="font-mono text-[8px] text-[var(--muted)]">
                        Continuous rated practice
                      </span>
                    </a>

                    <a
                      href="https://github.com/BezaleelPaul"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.45)] p-3 transition-colors hover:border-[var(--accent)]"
                    >
                      <div className="flex justify-between items-center text-[var(--muted)] font-mono text-[8px]">
                        <span>GITHUB</span>
                        <ArrowUpRight className="h-3 w-3 text-[var(--accent)]" />
                      </div>
                      <strong className="display mt-1 block text-3xl text-[var(--accent)]">34</strong>
                      <span className="font-mono text-[8px] text-[var(--muted)]">
                        Public repositories &amp; CI
                      </span>
                    </a>
                  </div>
                </section>

                {/* Software Archive QR Signal */}
                <section>
                  <DossierSectionHeading badge="SIGNAL ARCHIVE">
                    PROJECT ARCHIVE &amp; SOURCE REPOSITORIES
                  </DossierSectionHeading>
                  <a
                    href={data.projectsQR.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col sm:flex-row items-center gap-5 rounded border border-[var(--line)] bg-[rgba(10,10,15,0.6)] p-4 transition-all hover:border-[var(--accent)] hover:bg-[rgba(16,16,22,0.8)]"
                  >
                    <div className="shrink-0 rounded bg-white p-2.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      <img src="/project-archive-qr.svg" alt="QR code linking to the current project archive" className="h-20 w-20 object-contain" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <b className="font-mono text-[12px] font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                          {data.projectsQR.label}
                        </b>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[var(--accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <span className="mt-1 block font-mono text-[10px] font-semibold text-[var(--accent)]">
                        {data.projectsQR.display}
                      </span>
                      {data.projectsQR.note && (
                        <p className="mt-1.5 font-sans text-[10px] leading-relaxed text-[var(--muted)]">
                          {data.projectsQR.note}
                        </p>
                      )}
                    </div>
                  </a>
                </section>

                {data.extra?.map((group) => (
                  <section key={group.title}>
                    <DossierSectionHeading badge="CREATIVE PRACTICE">{group.title}</DossierSectionHeading>
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <article key={item.title} className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.45)] p-3">
                          <h4 className="font-mono text-[10px] font-bold text-[var(--accent)]">{item.title}</h4>
                          {item.meta && <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.08em] text-[var(--muted)]">{item.meta}</p>}
                          {item.bullets?.map((bullet) => <p key={bullet} className="mt-1 text-[9px] leading-relaxed text-[var(--muted)]">{bullet}</p>)}
                        </article>
                      ))}
                    </div>
                  </section>
                ))}

                {/* Dossier Bottom Mark */}
                <footer className="mt-auto border-t border-[var(--line)] pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  <span>BEZALEEL PAUL N. // BUILD WITH INTENT</span>
                  <span className="text-[var(--accent)]">
                    END OF TRANSMISSION // ALL SIGNALS VERIFIED
                  </span>
                </footer>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* JSON Modal */}
      {showJsonModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md print:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-json-title"
          onClick={() => setShowJsonModal(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-[var(--accent)]" />
                <h3 id="resume-json-title" className="font-mono text-sm font-bold text-[var(--text)]">
                  Resume Data Manifest (resume.json)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="rounded p-1 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <pre className="max-h-[60vh] overflow-auto rounded border border-[var(--line)] bg-[var(--bg)] p-4 font-mono text-xs leading-relaxed text-[var(--text)]">
              {JSON.stringify(data, null, 2)}
            </pre>

            <div className="flex justify-between items-center pt-2">
              <span className="font-mono text-[9px] text-[var(--muted)]">
                SOURCE: /src/data/resume.json
              </span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="action-button primary !min-h-[38px] !px-4"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'COPIED TO CLIPBOARD' : 'COPY JSON'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
