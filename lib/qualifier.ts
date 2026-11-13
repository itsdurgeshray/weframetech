/**
 * Telehealth qualification flow, copy from "offer 2 - VSL copy" (6 questions with gates).
 */

import type { Answers, Next, Option, Question } from '@/lib/offers/types';

const o = (value: string, label: string): Option => ({ value, label });

export const QUESTIONS: Question[] = [
  {
    id: 'background', bar: 1, count: 'Question 1 of 6', back: false,
    title: 'What best describes your professional background?',
    options: [
      o('doctor', 'Doctor / Medical Practitioner'),
      o('specialist', 'Specialist Doctor'),
      o('professional', 'Healthcare Professional / Entrepreneur'),
      o('clinic', 'Clinic / Hospital Owner'),
      o('wellness', 'Wellness / Healthcare Business Owner'),
      o('other', 'Other'),
    ],
  },
  {
    id: 'income', bar: 2, count: 'Question 2 of 6',
    title: 'What is your current monthly income?',
    help: 'Select your approximate monthly income.',
    options: [
      o('1', '₹1 lakh/month'),
      o('2-5', '₹2-5 lakh/month'),
      o('5-10', '₹5-10 lakh/month'),
      o('10-20', '₹10-20 lakh/month'),
      o('20+', '₹20 lakh+/month'),
      o('na', 'Prefer not to say'),
    ],
  },
  {
    id: 'idea', bar: 3, count: 'Question 3 of 6',
    title: 'Do you already have a clear idea of what you want to build?',
    options: [
      o('yes', 'Yes, I have a clear idea'),
      o('refine', 'I have an idea but need help refining it'),
      o('suggest', 'I want WeframeTech to suggest a business opportunity'),
      o('explore', "I'm just exploring my options"),
    ],
  },
  {
    id: 'idea2', kind: 'variant', bar: 3, count: 'Question 3 of 6', dependsOn: 'idea',
    variants: {
      yes: {
        title: 'What do you want to build?',
        options: [
          o('brand', 'My own healthcare brand'),
          o('telehealth', 'A telehealth company'),
          o('app', 'A healthcare app / platform'),
          o('custom', 'A custom healthcare business'),
          o('grow', 'Grow my existing healthcare business'),
          o('other', 'Other'),
        ],
      },
      refine: {
        title: 'What are you considering?',
        options: [
          o('telehealth', 'Telehealth'),
          o('brand', 'Healthcare / wellness brand'),
          o('app', 'Healthcare app / platform'),
          o('product', 'Healthcare product / service'),
          o('grow', 'Growing my existing healthcare business'),
        ],
      },
      suggest: {
        title: 'What would you expect from us?',
        options: [
          o('idea', 'Suggest a business idea based on my expertise'),
          o('opportunity', 'Identify a high-potential healthcare opportunity'),
          o('model', 'Help me choose the right business model'),
          o('expertise', 'Build a business around my existing expertise'),
          o('open', "I'm open to different opportunities"),
        ],
      },
      explore: {
        title: 'What are you mainly exploring?',
        options: [
          o('start', 'Starting my own healthcare business'),
          o('telehealth', 'Building a telehealth company'),
          o('brand', 'Creating my own healthcare brand'),
          o('grow', 'Growing my existing business'),
          o('different', 'Exploring different healthcare opportunities'),
        ],
      },
    },
  },
  {
    id: 'revenue', bar: 4, count: 'Question 4 of 6',
    title: 'What monthly revenue would you ideally like to build?',
    help: 'Your target helps us understand the scale of business you want to build and whether our partnership model is the right fit.',
    options: [
      o('10-25l', '₹10-25 lakh/month'),
      o('25-50l', '₹25-50 lakh/month'),
      o('50l-1cr', '₹50 lakh-₹1 crore/month'),
      o('1-5cr', '₹1-5 crore/month'),
      o('5-10cr', '₹5-10 crore+/month'),
      o('unsure', "I'm not sure yet"),
    ],
  },
  {
    id: 'invest', bar: 5, count: 'Question 5 of 6',
    title: 'Are you ready to invest in building this business?',
    options: [
      o('ready', "Yes, I'm ready to invest"),
      o('understand', 'I can invest, but I want to understand the model first'),
      o('exploring', "I'm exploring options before committing"),
      o('no', "No, I'm not ready to invest right now"),
    ],
  },
  {
    id: 'invest2', bar: 5, count: 'Question 5 of 6',
    title: 'What level of investment are you comfortable considering?',
    options: [
      o('15-20', '₹15-20 lakh'),
      o('20-30', '₹20-30 lakh'),
      o('30-50', '₹30-50 lakh'),
      o('50+', '₹50 lakh+'),
      o('discuss', 'I need to discuss this first'),
    ],
  },
  {
    id: 'start', bar: 6, count: 'Question 6 of 6',
    title: 'When would you ideally like to start?',
    options: [
      o('now', 'Immediately'),
      o('30d', 'Within 30 days'),
      o('1-3m', 'Within 1-3 months'),
      o('3-6m', 'Within 3-6 months'),
      o('exploring', 'Just exploring for now'),
    ],
  },
];

export const NOT_FIT: Record<string, { title: string; text: string }> = {
  background: { title: 'Not a Fit', text: 'Thanks for your interest. At this stage, our partnership is primarily designed for doctors and healthcare professionals looking to build or scale a healthcare business.' },
  income: { title: 'Not a Fit', text: 'Our current partnership model is designed for healthcare professionals with an established income and the ability to invest in building a new venture.' },
  idea2: { title: 'Not a Fit', text: 'We currently focus on healthcare ventures where our technology, marketing and execution capabilities can directly support the business.' },
  revenue: { title: 'Not a Fit', text: "We work with partners who have a clear ambition to build a meaningful healthcare business. If you're still unsure about your business goals, we may not be the right fit at this stage." },
  invest: { title: 'Not a Fit', text: "Our partnership requires investment in technology, marketing and business execution. If you're not currently ready to invest, it may be better to revisit this opportunity when you're ready." },
  start: { title: 'Not a Fit Right Now', text: "We currently work with partners who are ready to actively start building their venture in the near term. You're welcome to come back when you're closer to starting." },
};


/** Where to go after answering `step`. */
export function nextStep(step: string, a: Answers): Next {
  const v = a[step];
  switch (step) {
    case 'background': return v === 'other' ? { notFit: 'background' } : { go: 'income' };
    case 'income': return v === '1' || v === 'na' ? { notFit: 'income' } : { go: 'idea' };
    case 'idea': return { go: 'idea2' };
    case 'idea2': return a.idea === 'yes' && v === 'other' ? { notFit: 'idea2' } : { go: 'revenue' };
    case 'revenue': return v === 'unsure' ? { notFit: 'revenue' } : { go: 'invest' };
    case 'invest': return v === 'exploring' || v === 'no' ? { notFit: 'invest' } : { go: 'invest2' };
    case 'invest2': return { go: 'start' };
    case 'start': return v === '3-6m' || v === 'exploring' ? { notFit: 'start' } : { go: 'contact' };
    default: return { go: 'contact' };
  }
}
