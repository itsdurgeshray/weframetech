import type { ConsultItem } from './types';

/** What every paid strategy session delivers (the 30-min CEO call itself is the card's headline). */
export const consultIncludes = (industry: string): ConsultItem[] => [
  { title: 'A plan for your business', text: `The model, the priorities and the next steps for your ${industry} business, in order.` },
  { title: 'Proposal, research & audit', text: 'A written proposal backed by market research and an audit of where you stand today.' },
  { title: 'Marketing strategy & reports', text: 'The channels, campaigns and numbers we would use to grow it, in reports you keep.' },
  { title: 'Case studies + 5-min industry video', text: `Real client results, plus a 5-minute YouTube case study from the ${industry} industry.` },
];

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
