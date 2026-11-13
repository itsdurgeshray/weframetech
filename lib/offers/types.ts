import type { ReactNode } from 'react';

/* ---------- qualifier ---------- */
export type Option = { value: string; label: string };

type Base = { id: string; bar: number; count: string; back?: boolean };

/** One answer, auto-advances. */
export type SingleQuestion = Base & { kind?: 'single'; title: string; help?: string; options: Option[] };
/** Chips with a Continue button. `max` caps the selection ("Select up to 3"). */
export type MultiQuestion = Base & { kind: 'multi'; title: string; help?: string; options: Option[]; max?: number };
/** Follow-up whose wording/options depend on an earlier answer. */
export type VariantQuestion = Base & {
  kind: 'variant';
  dependsOn: string;
  variants: Record<string, { title: string; help?: string; options: Option[] }>;
};
export type Question = SingleQuestion | MultiQuestion | VariantQuestion;

/** Answers: single = value, multi = values joined by "|". */
export type Answers = Record<string, string>;
export type Next = { go: string } | { notFit: string };

export type DetailField = 'name' | 'company' | 'phone' | 'email' | 'website' | 'contactPref';

export type QualifierConfig = {
  questions: Question[];
  next: (step: string, answers: Answers) => Next;
  notFit: Record<string, { title: string; text: string }>;
  details: { intro: string; fields: DetailField[] };
  /** answer keys shown as chips on the thank-you page */
  summary: string[];
  /** button on the Not a Fit screen (links to the explainer video) */
  notFitCta?: string;
};

/* ---------- page ---------- */
export type Step = { title: string; text: string };
export type Stat = { value: string; label: string };

export type Offer = {
  slug: string;
  path: string;              // landing page URL
  thankYouPath: string;
  meta: { title: string; description: string };
  video: { vslId: string; explainerId: string };
  hero: { title: ReactNode; body: ReactNode; meta: string };
  qualify: {
    intro: ReactNode;
    steps: Step[];
    /** optional chip chain under the steps, e.g. Customers → Data → Revenue */
    flow?: string[];
    /** stacked = photo band on top, text below (for long copy) */
    claim: { title: string; lines: ReactNode[]; stacked?: boolean };
  };
  how: { title: string; body: ReactNode; timelineTitle: string; steps: Step[] };
  team: {
    title: string;
    subtitle?: string;
    body: ReactNode;
    chip: string;
    statsTitle?: string;
    stats: Stat[];
  };
  /** optional extra section after the team (offer-specific) */
  shift?:
    | { kind: 'flow'; title: string; subtitle: string; intro: ReactNode; items: string[] }
    | { kind: 'replace'; title: string; subtitle: string; intro: ReactNode; rows: [string, string][] };
  closing: { title: string; body: ReactNode };
  stickyNote: string;
  qualifier: QualifierConfig;
  thankYou: {
    badge: string;
    ledes: ReactNode[];
    book: ReactNode[];
    next: Step[];
    ready: { title: string; body: ReactNode };
  };
};
