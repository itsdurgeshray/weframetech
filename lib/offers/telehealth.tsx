import type { Offer } from './types';
import { QUESTIONS, NOT_FIT, nextStep } from '@/lib/qualifier';

/** Offer 2: telehealth venture partnership for doctors (copy: "offer 2 - VSL copy"). */
export const telehealth: Offer = {
  slug: 'telehealth',
  path: '/telehealth',
  thankYouPath: '/telehealth/thank-you',
  meta: {
    title: 'WeframeTech | Build Your Own Telehealth Business',
    description: 'For doctors and healthcare professionals earning ₹2-10 lakh per month. Watch real client proof, case studies, and see how the WeframeTech telehealth venture partnership works.',
  },
  video: {
    vslId: process.env.NEXT_PUBLIC_VSL_YOUTUBE_ID ?? '',
    explainerId: process.env.NEXT_PUBLIC_EXPLAINER_YOUTUBE_ID ?? '',
  },
  hero: {
    title: 'Build a ₹1-10 Crore/Month Telehealth Business of Your Own',
    body: <p className="lede rv d1">For doctors and healthcare professionals earning <b>₹2-10 lakh per month.</b> Watch real client proof, case studies, and see how this partnership works.</p>,
    meta: 'Takes 60 seconds. 6 quick questions.',
  },
  qualify: {
    intro: (
      <>
        <p className="lede rv d1">We partner with doctors and healthcare professionals who already have a clear vision for building their own healthcare business.</p>
        <div className="important rv d1">
          <p><b>Important:</b> You must have your own business idea, brand, product, software concept or telehealth business plan. You should know what you want to build and have a clear direction. We provide the technology, development and marketing expertise to help you execute and grow it.</p>
          <p className="sm">If you don&apos;t have a clear business idea or plan yet, this partnership may not be the right fit.</p>
        </div>
      </>
    ),
    steps: [
      { title: 'Answer 6 quick questions', text: 'Tell us about your healthcare expertise, business idea, current income, goals and investment readiness.' },
      { title: 'Get an instant eligibility check', text: 'Find out if you qualify for our telehealth business partnership.' },
      { title: 'Book your strategy call', text: 'Discuss the business model, investment, case studies and end-to-end execution roadmap with our team.' },
    ],
    claim: {
      title: 'BUILD YOUR OWN TELEHEALTH BUSINESS',
      lines: [
        'Technology, platform development and marketing handled by our team of 50+ experts.',
        'You bring the business idea, healthcare expertise and manage operations. We help you build and grow it.',
      ],
    },
  },
  how: {
    title: 'Watch the 7-Minute Video Before Applying',
    body: <p className="lede rv d1">Get answers to all your FAQs, see real client case studies, live proof, revenue results, and understand exactly how our telehealth business partnership works from start to finish.</p>,
    timelineTitle: 'How Our Partnership Works',
    steps: [
      { title: 'Discovery & Business Strategy', text: 'Understand your healthcare expertise, business idea, target market, goals and investment plan.' },
      { title: 'Business Model & Roadmap', text: 'Define your brand positioning, product offering, revenue model and launch strategy.' },
      { title: 'Technology & Platform Development', text: 'We build your telehealth platform, website, software and essential technology infrastructure.' },
      { title: 'Marketing & Customer Acquisition', text: 'We implement marketing systems to generate awareness, attract customers and drive revenue.' },
      { title: 'Launch, Operations & Scaling', text: 'You manage healthcare operations while we support technology, marketing and continuous growth.' },
    ],
  },
  team: {
    title: "We're Not Just A Tech Or Marketing Company. We're Your Venture-Building Partner.",
    body: (
      <>
        <p>WeframeTech brings together technology, marketing, strategy, and execution to help healthcare professionals build their own digital healthcare businesses.</p>
        <p>We partner with doctors, healthcare professionals, and healthcare founders who bring the healthcare expertise and manage operations. Our 50+ member team works across technology, product, marketing, and growth to build and launch your business.</p>
        <p>You don&apos;t need to build a technology or marketing team from scratch. We become the execution team behind your venture, helping turn your healthcare expertise into a scalable digital healthcare business.</p>
      </>
    ),
    chip: '50+ in-house experts across technology, product & marketing',
    stats: [
      { value: '50+', label: 'Experts across technology, marketing & growth' },
      { value: '3-4 Months', label: 'Target launch timeline' },
      { value: '₹1-10 Cr', label: 'Monthly revenue ambition' },
      { value: '₹10-15 Lakh', label: 'Starting investment' },
      { value: 'End-to-End', label: 'Strategy + Technology + Marketing + Execution' },
    ],
  },
  closing: {
    title: 'Ready To Build Your Own Telehealth Business?',
    body: (
      <>
        <p className="lede rv d1"><b>Have the healthcare expertise but need the right team to build and grow the business?</b> We bring the technology, marketing, and execution. You bring your expertise and lead operations.</p>
        <p className="lede rv d1">See if you qualify for our telehealth venture partnership.</p>
      </>
    ),
  },
  stickyNote: 'Takes 60 seconds. For doctors and healthcare professionals.',
  qualifier: {
    questions: QUESTIONS,
    next: nextStep,
    notFit: NOT_FIT,
    details: {
      intro: 'Based on your answers, you appear to fit the profile of the healthcare professionals we partner with. Leave your details below and our team will review your information before reaching out.',
      fields: ['name', 'phone', 'email', 'contactPref'],
    },
    summary: ['background', 'income', 'idea2', 'revenue', 'invest2', 'start'],
    notFitCta: 'Watch the 7-minute video',
  },
  thankYou: {
    badge: "Application received. You're one step closer.",
    ledes: [
      "We've received your application. Based on your answers, you may be a good fit for our healthcare venture partnership.",
      'A member of the WeframeTech team will review your application and reach out within 24 hours.',
    ],
    book: [
      "Don't wait for our team to reach out. Choose a convenient time to speak with us and explore your healthcare business opportunity.",
      "On the call, we'll discuss your business idea, revenue goals, investment, and how we can help you build and launch.",
    ],
    next: [
      { title: 'We Review Your Application', text: 'Our team reviews your healthcare experience, business goals, investment readiness, and answers.' },
      { title: 'Strategy Call', text: 'We discuss your idea, business model, revenue ambition, and the opportunity we see for your venture.' },
      { title: 'Build Your Roadmap', text: "If there's a strong fit, we outline how our 50+ person team can support your technology, marketing, and execution." },
    ],
    ready: {
      title: 'Ready To Build Your Healthcare Business?',
      body: <p>You bring the healthcare expertise.<br /><b>We bring the team, technology, marketing, and execution.</b></p>,
    },
  },
};
