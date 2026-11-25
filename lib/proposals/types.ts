/** One personalised proposal page: /proposal/<slug>. Everything company-specific lives here. */

export type OutcomeId = 'enquiries' | 'automation' | 'channel' | 'global';
export type CommercialModel = 'retainer' | 'per-enquiry' | 'performance';

export type Insight = { title: string; text: string };

export type Proposal = {
  slug: string;
  company: string;
  /** shown under the hero title, e.g. "Industrial fasteners · Pune, India" */
  sector: string;
  /** contact the proposal is addressed to */
  preparedFor?: { name: string; role?: string };
  /** ISO date the proposal was sent */
  date: string;
  /** days the pricing holds */
  validDays: number;
  /** "Where we see the opportunity": what we found when we studied the company */
  insights: Insight[];
  /** the homepage we redesigned for them (images in /public). Section hides when absent. */
  redesign?: { before?: string; after: string; caption?: string; previewUrl?: string };
  /** USD pricing per outcome. Change per company; the plan builder recalculates. */
  pricing: {
    enquiries: { monthly: number; perEnquiry: number };
    automation: { oneTime: number };
    channel: { oneTime: number };
  };
  /** which outcomes start ticked in the plan builder (default: all four) */
  recommended?: OutcomeId[];
};
