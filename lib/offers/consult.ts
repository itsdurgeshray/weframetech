import type { ConsultItem } from './types';

/** What every paid strategy session includes. `industry` tailors the wording. */
export const consultIncludes = (industry: string): ConsultItem[] => [
  { title: '30-minute call with our CEO', text: 'A direct one-on-one with our CEO, not a sales rep. Bring your idea, your numbers and your questions.' },
  { title: 'Planning for your business', text: `A clear plan for your ${industry} business: the model, the priorities and the next steps, in order.` },
  { title: 'Proposal, research and audit', text: 'A written proposal backed by market research and an audit of where your business stands today.' },
  { title: 'Marketing strategy and reports', text: 'The channels, campaigns and numbers we would use to grow it, in reports you keep.' },
  { title: 'Case studies + 5-min industry video', text: `Real client case studies, plus a 5-minute YouTube case study from the ${industry} industry.` },
];

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
