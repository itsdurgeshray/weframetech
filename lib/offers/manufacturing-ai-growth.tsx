import type { Answers, Next, Offer, Option } from './types';
import { site } from '@/lib/site';
import { consultIncludes } from './consult';

/**
 * Offer 4: AI-powered manufacturing growth system (copy: "offer 4").
 * The copy numbers questions "of 7" but has no Question 3, so the six real questions run "of 6".
 */
const o = (value: string, label: string): Option => ({ value, label });

function next(step: string, a: Answers): Next {
  const v = a[step];
  switch (step) {
    case 'business': return v === 'other' ? { notFit: 'business' } : { go: 'revenue' };
    case 'revenue': return v === 'lt20l' ? { notFit: 'revenue' } : { go: 'blockers' };
    case 'blockers': return { go: 'improve' };
    case 'improve': return { go: 'invest' };
    case 'invest': return v === 'exploring' || v === 'no' ? { notFit: 'invest' } : { go: 'invest2' };
    case 'invest2': return { go: 'start' };
    case 'start': return v === '3-6m' || v === 'exploring' ? { notFit: 'start' } : { go: 'contact' };
    default: return { go: 'contact' };
  }
}

export const manufacturingAiGrowth: Offer = {
  slug: 'manufacturing-ai-growth',
  path: '/manufacturing-ai-growth',
  thankYouPath: '/manufacturing-ai-growth/thank-you',
  meta: {
    title: 'WeframeTech | AI-Powered Manufacturing Growth System',
    description: 'For manufacturers doing ₹50 lakh-₹5 crore+ in monthly revenue who want more qualified B2B inquiries, fewer manual processes, a better customer experience and scalable revenue.',
  },
  video: {
    vslId: process.env.NEXT_PUBLIC_MFG_AI_VSL_ID ?? '',
    explainerId: process.env.NEXT_PUBLIC_MFG_AI_EXPLAINER_ID ?? '',
  },
  hero: {
    title: 'Scale Your Manufacturing Business to ₹100 Cr/Year',
    body: (
      <>
        <p className="lede rv d1">For manufacturers doing ₹50 lakh-₹5 crore+ in monthly revenue who want to generate more qualified B2B inquiries, eliminate manual processes, improve current customer experience, increase efficiency and operation and scale revenue.</p>
        <p className="lede hero-note rv d1"><b>Watch the free case-study video to see how leading manufacturers use AI, technology, marketing and automation to improve efficiency, attract more customers and build scalable growth systems.</b></p>
      </>
    ),
    meta: 'Takes 60 seconds. 6 quick questions.',
  },
  qualify: {
    intro: (
      <>
        <p className="lede rv d1">We partner with established manufacturing businesses that already have proven products, customers and revenue but are held back by manual processes, inefficient operations, inconsistent B2B inquiries or a poor digital buying experience.</p>
      </>
    ),
    note: (
      <div className="important rv d1">
        <p><b>You should have:</b></p>
        <ul className="checks">
          <li>An established manufacturing business</li>
          <li>Proven products and existing customers</li>
          <li>₹50 lakh+ in monthly revenue</li>
          <li>A clear ambition to scale</li>
          <li>Existing sales or customer acquisition processes</li>
          <li>The ability to invest in technology, marketing and execution</li>
        </ul>
        <p className="sm">If your business still depends heavily on <b>phone calls, emails, spreadsheets, sales representatives and manual processes</b>, there may be significant opportunities to improve efficiency and revenue.</p>
      </div>
    ),
    steps: [
      { title: 'Answer 6 Quick Questions', text: 'Tell us about your manufacturing business, current revenue, products, processes, customer acquisition and growth goals.' },
      { title: 'Get Your Eligibility Check', text: 'Find out whether your manufacturing business is suitable for our AI-powered growth partnership.' },
      { title: 'Book Your ₹199 Strategy Session', text: '30 minutes with our CEO on your operations, growth opportunities, technology requirements, case studies and execution roadmap.' },
    ],
    claim: {
      stacked: true,
      title: 'BUILD YOUR AI-POWERED MANUFACTURING GROWTH SYSTEM',
      lines: [
        'Technology, AI, marketing, automation and execution handled by our 50+ member team.',
        'You bring the manufacturing business, products and operational expertise. We help you build the systems that generate demand, improve customer experience, automate manual processes and convert more opportunities into revenue.',
      ],
    },
  },
  how: {
    title: 'Watch the Free 10-Minute Manufacturing Case Study',
    body: (
      <>
        <p className="lede rv d1">Before applying, watch the video to understand:</p>
        <ul className="learn rv d1">
          <li>How leading manufacturers improve customer experience</li>
          <li>How to generate more qualified B2B inquiries</li>
          <li>How AI can reduce repetitive manual operations</li>
          <li>How to automate customer and sales processes</li>
          <li>How to improve product discovery</li>
          <li>How to make it easier for customers to inquire and buy</li>
          <li>How technology can improve operational efficiency</li>
          <li>How to turn your digital presence into a stronger revenue channel</li>
        </ul>
        <p className="lede learn-note rv d1"><b>See the case studies. Understand the systems. Learn how the framework works.</b></p>
      </>
    ),
    timelineTitle: 'How Our Manufacturing Growth Partnership Works',
    steps: [
      { title: 'Business & Process Discovery', text: 'We analyse your current sales process, customer journey, operations, technology, marketing and manual workflows.' },
      { title: 'Growth & Customer Experience Strategy', text: "We identify where you're losing potential customers, where manual processes are slowing growth and where technology can create the biggest impact." },
      { title: 'Digital Product Discovery & Customer Experience', text: 'We improve how customers discover your products, understand your offerings, access information and submit inquiries.' },
      { title: 'AI & Process Automation', text: 'We identify repetitive manual processes and implement AI-powered systems and automation to reduce operational workload and improve efficiency.' },
      { title: 'B2B Demand Generation', text: 'We build marketing systems designed to generate more qualified inquiries and attract the right customers for your products with Meta ads.' },
      { title: 'Inquiry Management & Conversion', text: 'We improve how inquiries are captured, qualified, followed up and converted into actual orders.' },
      { title: 'Optimisation & Scaling', text: 'We continuously improve your systems based on data, customer behaviour and business performance.' },
    ],
  },
  team: {
    title: "We're Not Just a Tech or Marketing Company.",
    subtitle: "We're Your Manufacturing Growth & Automation Partner.",
    body: (
      <>
        <p>WeframeTech brings together <b>AI, technology, marketing, automation, strategy and execution</b> to help established manufacturers build more efficient and scalable businesses.</p>
        <p>We work with manufacturers that already have strong products and operational expertise but want to improve how they:</p>
        <p className="taglist">{['Generate Demand', 'Acquire Customers', 'Manage Inquiries', 'Serve Customers', 'Run Operations', 'Scale Revenue'].map((t) => <span key={t} className="chip on">{t}</span>)}</p>
        <p>Our 50+ member team works across <b>technology, AI, product, marketing, automation and growth</b> to build and implement the systems required to support your business.</p>
        <p>You don&apos;t need to hire separate technology, marketing and automation teams.</p>
        <p><b>We become the execution team behind your growth.</b></p>
      </>
    ),
    chip: '50+ in-house experts across technology, AI, marketing & growth',
    statsTitle: 'What You Can Build With Us',
    stats: [
      { value: '50+', label: 'In-house experts across technology, AI, marketing & growth' },
      { value: '3-4 Months', label: 'Initial system implementation and launch timeline' },
      { value: 'Up to 40%+', label: 'Potential revenue growth through improved demand generation, conversion and customer experience' },
      { value: '₹50L-₹2Cr+', label: 'Monthly revenue range we typically target' },
      { value: 'End-to-End', label: 'Strategy + AI + Technology + Marketing + Automation + Execution' },
    ],
  },
  shift: {
    kind: 'replace',
    title: "Your Manufacturing Business Doesn't Have To Run On Manual Processes.",
    subtitle: 'Build Systems That Work For You.',
    intro: <p className="lede rv d1">Replace:</p>,
    rows: [
      ['Phone Calls', 'Digital Customer Experience'],
      ['Spreadsheets', 'Automated Workflows'],
      ['Manual Follow-ups', 'Automated Communication'],
      ['Inconsistent Leads', 'B2B Demand Generation'],
      ['Poor Product Discovery', 'Digital Product Experience'],
      ['Manual Operations', 'AI-Powered Systems'],
      ['Low Efficiency', 'Scalable Processes'],
    ],
  },
  closing: {
    title: 'Ready To Build Your AI-Powered Manufacturing Growth System?',
    body: (
      <>
        <p className="lede rv d1">Already have a successful manufacturing business but struggling with manual operations, inconsistent B2B inquiries or customer experience?</p>
        <p className="lede rv d1">We bring the <b>AI, technology, marketing, automation and execution.</b> You bring the <b>products, manufacturing expertise and operational capability.</b></p>
        <p className="lede rv d1"><b>See if your manufacturing business qualifies for our growth partnership.</b></p>
      </>
    ),
  },
  stickyNote: 'Takes 60 seconds. For established manufacturers.',
  qualifier: {
    questions: [
      {
        id: 'business', bar: 1, count: 'Question 1 of 6', back: false,
        title: 'What best describes your business?',
        options: [
          o('owner', 'Manufacturer / Factory Owner'), o('founder', 'Manufacturing Company Founder'),
          o('ceo', 'CEO / Managing Director'), o('family', 'Family-Owned Manufacturing Business'),
          o('b2b', 'Industrial / B2B Manufacturer'), o('other', 'Other'),
        ],
      },
      {
        id: 'revenue', bar: 2, count: 'Question 2 of 6',
        title: 'What is your current monthly revenue?',
        help: 'Select your approximate average monthly revenue.',
        options: [
          o('lt20l', 'Below ₹20 lakh/month'), o('20-50l', '₹20-50 lakh/month'), o('50l-1cr', '₹50 lakh-₹1 crore/month'),
          o('1-2cr', '₹1-2 crore/month'), o('2-5cr', '₹2-5 crore/month'), o('5cr+', '₹5 crore+/month'),
        ],
      },
      {
        id: 'blockers', kind: 'multi', bar: 3, count: 'Question 3 of 6',
        title: 'What is currently holding your business back from reaching ₹100 Cr/year?',
        help: 'Select all that apply.',
        options: [
          o('few-inquiries', 'Not enough qualified B2B inquiries'), o('inconsistent-leads', 'Inconsistent lead generation'),
          o('referrals', 'Too dependent on referrals'), o('distributors', 'Too dependent on distributors / dealers'),
          o('sales-reps', 'Too dependent on sales representatives'), o('manual', 'Too many manual processes'),
          o('phone-orders', 'Orders managed through phone calls / WhatsApp / email'), o('spreadsheets', 'Heavy dependency on spreadsheets'),
          o('slow-follow-up', 'Slow inquiry follow-up'), o('poor-cx', 'Poor customer experience'),
          o('find-products', 'Customers struggle to find the right products'), o('product-info', 'Product information is difficult to access'),
          o('website-inquiries', 'Website generates very few inquiries'), o('digital-presence', 'Poor digital presence'),
          o('no-digital-channel', 'No effective digital sales channel'), o('retention', 'Existing customers are difficult to retain or re-engage'),
          o('sales-repetitive', 'Sales team spends too much time on repetitive work'), o('ops-manual', 'Operations team spends too much time on manual tasks'),
          o('no-automation', 'No automation'), o('no-ai', 'Not using AI effectively'),
          o('conversion', 'Difficulty converting inquiries into orders'), o('costs', 'High operational costs'), o('other', 'Other'),
        ],
      },
      {
        id: 'improve', kind: 'multi', max: 3, bar: 4, count: 'Question 4 of 6',
        title: 'What would you most like to improve?',
        help: 'Select up to 3.',
        options: [
          o('inquiries', 'Generate more qualified B2B inquiries'), o('new-customers', 'Attract new customers consistently'),
          o('cx', 'Improve customer experience'), o('automate', 'Automate manual processes'),
          o('ai', 'Implement AI across operations'), o('inquiry-mgmt', 'Automate inquiry management'),
          o('discovery', 'Improve product discovery'), o('website', 'Improve website / digital presence'),
          o('convert', 'Convert more inquiries into orders'), o('retention', 'Improve customer retention'),
          o('digital-channel', 'Build a digital sales channel'), o('costs', 'Reduce operational costs'),
          o('sales-efficiency', 'Improve sales-team efficiency'), o('headcount', 'Scale operations without significantly increasing headcount'),
          o('100cr', 'Build systems to support ₹100 Cr+ annual revenue'),
        ],
      },
      {
        id: 'invest', bar: 5, count: 'Question 5 of 6',
        title: 'Are you ready to invest in technology, AI, marketing and business execution?',
        options: [
          o('ready', "Yes, I'm ready to invest"), o('understand', 'I can invest, but I want to understand the model first'),
          o('exploring', "I'm exploring options before committing"), o('no', "No, I'm not ready to invest right now"),
        ],
      },
      {
        id: 'invest2', bar: 5, count: 'Question 5 of 6',
        title: 'What level of investment are you comfortable considering?',
        options: [o('10-15', '₹10-15 lakh'), o('15-25', '₹15-25 lakh'), o('25-50', '₹25-50 lakh'), o('50+', '₹50 lakh+'), o('understand', 'I need to understand the model first')],
      },
      {
        id: 'start', bar: 6, count: 'Question 6 of 6',
        title: 'When would you ideally like to start?',
        options: [o('now', 'Immediately'), o('30d', 'Within 30 days'), o('1-3m', 'Within 1-3 months'), o('3-6m', 'Within 3-6 months'), o('exploring', 'Just exploring for now')],
      },
    ],
    next,
    notFit: {
      business: { title: 'Not a Fit', text: 'Our growth partnership is designed specifically for established manufacturing businesses looking to improve operations, customer acquisition and revenue.' },
      revenue: { title: 'Not a Fit', text: 'Our current partnership is designed for established manufacturers with sufficient revenue, products and operational capacity to implement and scale these systems.' },
      invest: { title: 'Not a Fit', text: 'Building and implementing AI, technology, marketing and automation systems requires investment. Our partnership is designed for manufacturers who are ready to invest in improving and scaling their business.' },
      start: { title: 'Not a Fit Right Now', text: 'We currently work with manufacturers who are ready to actively improve their operations, customer acquisition and growth systems in the near term.' },
    },
    details: {
      intro: 'Based on your answers, your manufacturing business appears to fit the profile of the companies we partner with. Leave your details below and our team will review your information before reaching out.',
      fields: ['name', 'company', 'phone', 'email', 'website'],
    },
    summary: ['business', 'revenue', 'improve', 'invest2', 'start'],
    notFitCta: 'Watch the case study',
  },
  consult: {
    price: 199,
    name: 'AI Growth Strategy Session',
    includes: consultIncludes('manufacturing'),
    bookingUrl: process.env.NEXT_PUBLIC_MFG_AI_BOOKING_URL || site.bookingUrl,
  },
  thankYou: {
    badge: "Application received. You're one step closer.",
    ledes: [
      "We've received your application. Based on your answers, your manufacturing business may be a good fit for our growth partnership.",
      'A member of the WeframeTech team will review your application and reach out within 24 hours.',
    ],
    book: [
      <>Don&apos;t wait for our team to reach out. Choose a convenient time to speak with us and explore how you can scale your manufacturing business toward <b>₹100 Cr/year</b>.</>,
      "On the call, we'll discuss your current revenue, operational challenges, customer acquisition, manual processes, technology requirements, and growth goals.",
    ],
    next: [
      { title: 'We Review Your Application', text: 'Our team reviews your manufacturing business, products, current revenue, operational challenges, customer acquisition and growth goals.' },
      { title: 'Strategy Call', text: 'We discuss your current systems, manual processes, B2B inquiry generation, customer experience and the opportunities we see to improve efficiency and revenue.' },
      { title: 'Build Your Growth Roadmap', text: "If there's a strong fit, we outline how our 50+ person team can support your AI, technology, marketing, automation and execution requirements." },
    ],
    ready: {
      title: 'Ready To Scale Your Manufacturing Business?',
      body: <p><b>Your business already has the products and manufacturing expertise.</b><br />We bring the AI, technology, marketing, automation and execution to help you build the systems required to scale.</p>,
    },
  },
};
