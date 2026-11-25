import type { CommercialModel, OutcomeId, Proposal } from './types';

/** The four-part $5M Growth Plan. Shared copy; prices come from each proposal. */
export type Outcome = {
  id: OutcomeId;
  n: string;
  title: string;
  short: string;
  /** "What we do" */
  intro: string;
  listLabel: string;
  items: string[];
  extra?: string;
  target: { label: string; value: string; note?: string };
  roi: { label: string; value: string; note: string };
  /** builder: months of the initial build this outcome needs */
  months: number;
  timeline: string;
};

export const OUTCOMES: Outcome[] = [
  {
    id: 'enquiries',
    n: '01',
    title: 'Get 80–100 B2B Enquiries Every Month',
    short: '80–100 B2B enquiries',
    intro: 'WeframeTech handles the complete acquisition system, end to end.',
    listLabel: 'The acquisition system',
    items: ['Strategy', 'Positioning', 'Creative', 'Ad campaigns', 'Landing pages', 'Website redesign', 'Lead generation', 'Lead qualification', 'Tracking', 'Conversion optimization', 'Sales funnel', 'Ongoing optimization'],
    extra: "We also rebuild the current website where required and strengthen the company's brand, Google visibility and AI search visibility.",
    target: { label: 'Target', value: '80–100', note: 'qualified B2B enquiries every month' },
    roi: { label: 'Potential ROI', value: 'Predictable pipeline', note: 'Converting even a portion of those enquiries into high-value orders creates a pipeline capable of supporting significant revenue growth.' },
    months: 3,
    timeline: 'Live from month 3',
  },
  {
    id: 'automation',
    n: '02',
    title: 'Automate 80% of Manual Work',
    short: 'Automate operations',
    intro: 'We identify repetitive work across sales, customer service and operations and replace it with software and AI.',
    listLabel: 'Potential systems',
    items: ['AI customer support', 'Product enquiries', 'Repair requests', 'Quote generation', 'Proposal generation', 'Stock checks', 'Pricing requests', 'Customer follow-ups', 'Dealer/distributor management', 'CRM automation', 'Internal workflows', 'Reporting', 'B2B portal'],
    target: { label: 'Target', value: 'Up to 80%', note: 'of identified repetitive workflows automated' },
    roi: { label: 'ROI', value: '1,000–2,000 hrs', note: 'of potential annual capacity recovered, so the team spends more time selling, serving customers and growing the business.' },
    months: 2,
    timeline: 'Live from month 2',
  },
  {
    id: 'channel',
    n: '03',
    title: 'Build Your Own Sales Channel',
    short: 'Build direct sales channel',
    intro: "A direct digital sales channel so the company isn't completely dependent on distributors, dealers or third-party buyers.",
    listLabel: 'We can build',
    items: ['B2B commerce', 'B2C commerce', 'Dealer portal', 'Distributor portal', 'Product catalogue', 'Online ordering', 'Customer accounts', 'Payments', 'CRM', 'Marketing automation', 'Analytics', 'Customer data infrastructure'],
    extra: 'The goal is a direct revenue engine owned by the company.',
    target: { label: 'Target after the 4-month build', value: '$200K/mo', note: 'in direct sales. A target based on demand, product economics, traffic, conversion and sales capacity, not a guaranteed outcome.' },
    roi: { label: 'Target ROI', value: '$2.4M/yr', note: "Potential annualised run-rate. Modelled against your actual AOV, gross margin and conversion rate." },
    months: 4,
    timeline: 'Launch after month 4',
  },
  {
    id: 'global',
    n: '04',
    title: 'Go Global',
    short: 'Global expansion',
    intro: 'Once the growth engine works in your current market, we help build the infrastructure required to enter new markets.',
    listLabel: 'Support can include',
    items: ['Market research', 'Country selection', 'Company registration', 'Compliance', 'Warehouses', 'Local teams', 'Distributor networks', 'Sales partners', 'Local websites', 'Local marketing', 'Lead generation', 'Technology infrastructure', 'International operations'],
    extra: 'A repeatable system for entering additional countries, instead of rebuilding the business from scratch each time.',
    target: { label: 'Objective', value: 'Repeatable entry', note: 'into new countries, on infrastructure you already own' },
    roi: { label: 'ROI', value: 'New revenue streams', note: "New international revenue and a larger addressable market for the company." },
    months: 0,
    timeline: 'Phase 2, after month 4',
  },
];

export const GLOBAL_FACTORS = ['Number of countries', 'Infrastructure', 'Team', 'Warehousing', 'Compliance', 'Technology', 'Marketing'];

export const FLOW = [
  '80–100 B2B enquiries/month',
  'Higher conversion + stronger brand',
  '80% operational automation',
  'Direct B2B/B2C sales channel',
  '$200K/month target direct sales',
  'International expansion',
];

export const SCOPE = ['Strategy', 'Brand', 'Website', 'Creative', 'Advertising', 'SEO', 'AI Search', 'Lead Generation', 'CRM', 'Automation', 'AI', 'B2B Portal', 'B2C Commerce', 'Sales Infrastructure', 'Global Expansion'];

export const BUILD = [
  { title: 'Foundations', text: 'Strategy, research, positioning, brand and architecture.' },
  { title: 'Build the systems', text: 'Website, systems, automation, CRM and sales infrastructure.' },
  { title: 'Launch', text: 'Acquisition, SEO, AI visibility and the direct sales channel go live.' },
  { title: 'Optimise & scale', text: 'Optimise, scale and establish the operating system for continued growth.' },
];

export const MODELS: { id: CommercialModel; label: string; hint: string }[] = [
  { id: 'retainer', label: 'Monthly retainer', hint: 'Fixed monthly fee + ad spend' },
  { id: 'per-enquiry', label: 'Per qualified enquiry', hint: 'Pay only for qualified leads' },
  { id: 'performance', label: 'Performance-based', hint: 'Base + share of revenue we drive' },
];

export const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
export const usdK = (n: number) => (n >= 1000 ? `$${+(n / 1000).toFixed(1)}K` : usd(n));

/** Price line for an outcome on the outcome card. */
export function priceOf(id: OutcomeId, p: Proposal['pricing']) {
  switch (id) {
    case 'enquiries': return { value: `${usdK(p.enquiries.monthly)}/mo`, note: `+ ad spend · or ${usd(p.enquiries.perEnquiry)} per qualified enquiry · or performance-based` };
    case 'automation': return { value: usdK(p.automation.oneTime), note: 'one-time + applicable software/infrastructure costs' };
    case 'channel': return { value: `~${usdK(p.channel.oneTime)}`, note: 'one-time build and launch' };
    case 'global': return { value: 'Custom', note: `Based on ${GLOBAL_FACTORS.join(', ').toLowerCase()}` };
  }
}
