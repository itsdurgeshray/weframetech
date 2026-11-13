import type { Offer } from './types';
import { telehealth } from './telehealth';
import { manufacturingSalesChannel } from './manufacturing-sales-channel';
import { manufacturingAiGrowth } from './manufacturing-ai-growth';

/** Every offer gets /<slug> and /<slug>/thank-you. "/" serves the telehealth offer. */
export const OFFERS: Offer[] = [telehealth, manufacturingSalesChannel, manufacturingAiGrowth];

export const getOffer = (slug: string) => OFFERS.find((o) => o.slug === slug);
export const DEFAULT_OFFER = telehealth;
export type { Offer } from './types';
