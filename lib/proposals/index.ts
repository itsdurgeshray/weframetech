import type { Proposal } from './types';

/**
 * One entry per target account → /proposal/<slug>.
 * To add a company: copy an entry, change the slug, name, insights and pricing. The route appears on the next build.
 * The two entries below are SAMPLE data for the layout; replace them with the real accounts.
 */
const DEFAULT_PRICING: Proposal['pricing'] = {
  enquiries: { monthly: 6000, perEnquiry: 120 },
  automation: { oneTime: 30000 },
  channel: { oneTime: 50000 },
};

export const PROPOSALS: Proposal[] = [
  {
    slug: 'cys-lead-company-1',
    company: 'Northline Fasteners',
    sector: 'Industrial fasteners · B2B manufacturer',
    preparedFor: { name: 'Rahul Mehta', role: 'Managing Director' },
    date: '2026-11-25',
    validDays: 30,
    insights: [
      { title: 'Buyers can’t self-serve', text: 'The catalogue lives in PDFs. A procurement manager has to email or call to check a spec, a price or stock, which is where most B2B enquiries quietly die.' },
      { title: 'Demand depends on distributors', text: 'Most revenue flows through dealers. There is no direct channel to win repeat orders or to own customer data and margin.' },
      { title: 'Quotes are built by hand', text: 'Every RFQ is a spreadsheet and an email thread. Automating quoting and follow-ups alone can return hundreds of hours a year.' },
    ],
    pricing: DEFAULT_PRICING,
  },
  {
    slug: 'cys-lead-company-2',
    company: 'Arcwell Pumps',
    sector: 'Industrial pumps & valves · B2B manufacturer',
    preparedFor: { name: 'Anita Rao', role: 'Director, Sales' },
    date: '2026-11-25',
    validDays: 30,
    insights: [
      { title: 'The website undersells the product', text: 'Strong engineering, but the site reads like a brochure. It doesn’t rank for the searches buyers make, and AI search barely mentions the brand.' },
      { title: 'Service requests run on phone calls', text: 'Repairs, spares and warranty questions go through the same few people. An AI support layer can handle most of them instantly.' },
      { title: 'Export demand is untapped', text: 'The product already sells to EPC contractors abroad through agents. A repeatable market-entry system can turn that into owned revenue.' },
    ],
    pricing: { ...DEFAULT_PRICING, automation: { oneTime: 35000 } },
    recommended: ['enquiries', 'automation', 'channel', 'global'],
  },
];

export const getProposal = (slug: string) => PROPOSALS.find((p) => p.slug === slug);
export type { Proposal } from './types';
