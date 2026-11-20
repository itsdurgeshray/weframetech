import type { Answers, Next, Offer, Option } from './types';
import { site } from '@/lib/site';
import { consultIncludes } from './consult';

/** Offer 3: build your own manufacturing sales channel (copy: "offer 3 copy"). */
const o = (value: string, label: string): Option => ({ value, label });

/* Q3 products. Values flagged `bulk` are commodities / raw or bulk materials / hard to sell direct. */
const PRODUCTS: (Option & { bulk?: boolean })[] = [
  o('consumer-electronics', 'Consumer electronics'), o('home-appliances', 'Home appliances'),
  o('kitchen', 'Kitchen equipment & appliances'), o('furniture', 'Furniture & home products'),
  o('power-tools', 'Power tools & hand tools'), o('welding', 'Welding equipment & machinery'),
  o('industrial-tools', 'Industrial tools & equipment'), o('construction-eq', 'Construction equipment'),
  o('agri-machinery', 'Agricultural equipment & machinery'), o('auto-parts', 'Automotive parts & accessories'),
  o('electrical', 'Electrical products & components'), o('lighting', 'Lighting products'),
  o('hardware', 'Hardware & fittings'), o('plumbing', 'Plumbing products & equipment'),
  o('safety', 'Safety equipment & products'), o('medical', 'Medical equipment & devices'),
  o('packaging', 'Packaging products'), o('textiles', 'Textiles & apparel'),
  o('footwear', 'Footwear & leather products'), o('sports', 'Sports & fitness equipment'),
  o('beauty', 'Beauty & personal care products'), o('food', 'Food & packaged food products'),
  o('fmcg', 'FMCG products'), o('specialty-chem', 'Chemicals & specialty chemicals'),
  o('paints', 'Paints & coatings'), o('building', 'Building materials'),
  { ...o('cement', 'Cement'), bulk: true }, { ...o('steel', 'Steel & metal'), bulk: true },
  { ...o('aluminium', 'Aluminium'), bulk: true }, { ...o('iron', 'Iron products'), bulk: true },
  { ...o('grains', 'Rice / grains / pulses'), bulk: true }, { ...o('flour', 'Flour / atta / agricultural commodities'), bulk: true },
  { ...o('fertilizers', 'Fertilizers / agricultural inputs'), bulk: true }, { ...o('raw', 'Raw materials'), bulk: true },
  { ...o('bulk-chem', 'Industrial chemicals / bulk materials'), bulk: true }, { ...o('mining', 'Mining / minerals'), bulk: true },
  { ...o('heavy-machinery', 'Large-scale industrial machinery'), bulk: true }, { ...o('custom-industrial', 'Custom / made-to-order industrial products'), bulk: true },
  o('other', 'Other'),
];
const BULK = new Set(PRODUCTS.filter((p) => p.bulk).map((p) => p.value));
/** "Primarily" commodity / bulk: at least half of the selected product types. */
const mostlyBulk = (v: string) => {
  const picked = v.split('|').filter(Boolean);
  return picked.length > 0 && picked.filter((x) => BULK.has(x)).length * 2 >= picked.length;
};

const REVENUE = [
  o('lt20l', 'Below ₹20 lakh/month'), o('20-50l', '₹20-50 lakh/month'), o('50l-1cr', '₹50 lakh-₹1 crore/month'),
  o('1-2cr', '₹1-2 crore/month'), o('2-5cr', '₹2-5 crore/month'), o('5cr+', '₹5 crore+/month'),
];

function next(step: string, a: Answers): Next {
  const v = a[step];
  switch (step) {
    case 'business': return v === 'other' ? { notFit: 'business' } : { go: 'goal' };
    case 'goal': return v === 'unsure' ? { notFit: 'goal' } : { go: 'products' };
    case 'products': return mostlyBulk(v) ? { notFit: 'products' } : { go: 'revenue' };
    case 'revenue': return v === 'lt20l' || v === '20-50l' ? { notFit: 'revenue' } : { go: 'channels' };
    case 'channels': return { go: 'middlemen' };
    case 'middlemen': return { go: 'invest' };
    case 'invest': return v === 'exploring' || v === 'no' ? { notFit: 'invest' } : { go: 'invest2' };
    case 'invest2': return { go: 'start' };
    case 'start': return v === '3-6m' || v === 'exploring' ? { notFit: 'start' } : { go: 'contact' };
    default: return { go: 'contact' };
  }
}

export const manufacturingSalesChannel: Offer = {
  slug: 'manufacturing-sales-channel',
  path: '/manufacturing-sales-channel',
  thankYouPath: '/manufacturing-sales-channel/thank-you',
  meta: {
    title: 'WeframeTech | Build Your Own Manufacturing Sales Channel',
    description: 'For manufacturers doing ₹50 lakh-₹5 crore+ in monthly revenue who want to build their own sales channel and reduce dependency on distributors, wholesalers and marketplaces.',
  },
  video: {
    vslId: process.env.NEXT_PUBLIC_MFG_SALES_VSL_ID ?? '',
    explainerId: process.env.NEXT_PUBLIC_MFG_SALES_EXPLAINER_ID ?? '',
  },
  hero: {
    title: 'Scale Your Manufacturing Business to ₹100 Cr/Year+ in 160 Days, Without Middlemen',
    body: (
      <>
        <p className="lede rv d1">For manufacturers doing ₹50 lakh-₹5 crore+ in monthly revenue who want to build their own sales channel and reduce dependency on distributors, wholesalers and marketplaces.</p>
        <p className="lede hero-note rv d1"><b>Watch the free case-study video to see how leading manufacturers build direct sales channels, increase efficiency, and scale revenue without relying entirely on middlemen.</b></p>
      </>
    ),
    meta: 'Takes 60 seconds. 7 quick questions.',
  },
  qualify: {
    intro: (
      <>
        <p className="lede rv d1">We work with established manufacturing businesses that already have a proven product, customers and operational capability, but want to build a stronger, more scalable sales channel of their own.</p>
        <div className="important rv d1">
          <p><b>You should already have:</b></p>
          <ul className="checks">
            <li>An established manufacturing business</li>
            <li>A proven product or product category</li>
            <li>Existing revenue and customers</li>
            <li>A clear ambition to scale</li>
            <li>The ability to fulfill increased demand</li>
          </ul>
          <p className="sm">If most of your revenue currently comes through distributors, wholesalers, marketplaces, sales representatives, phone calls, emails or manual processes, this framework may be a strong fit.</p>
        </div>
      </>
    ),
    steps: [
      { title: 'Answer 7 Quick Questions', text: 'Tell us about your manufacturing business, current revenue, sales channels, products and growth goals.' },
      { title: 'Get Your Eligibility Check', text: 'Find out whether your business is suitable for our direct-sales growth partnership.' },
      { title: 'Book Your ₹99 Strategy Session', text: '30 minutes with our CEO on your business model, growth opportunities, case studies and the roadmap for building your own sales channel.' },
    ],
    flow: ['Customers', 'Data', 'Buying Experience', 'Revenue'],
    claim: {
      stacked: true,
      title: 'BUILD YOUR OWN MANUFACTURING SALES CHANNEL',
      lines: [
        'Technology, marketing, strategy and execution handled by our 50+ member team.',
        'You bring the manufacturing business, products and operational expertise. We help you build the systems, technology and marketing engine required to create and scale your own sales channel.',
      ],
    },
  },
  how: {
    title: 'Watch the Free 10-Minute Manufacturing Case Study',
    body: (
      <>
        <p className="lede rv d1">Before applying, watch the video to understand:</p>
        <ul className="learn rv d1">
          <li>How leading manufacturers build direct sales channels</li>
          <li>How digital commerce can complement existing distributors</li>
          <li>How to improve the customer buying experience</li>
          <li>How technology can reduce operational friction</li>
          <li>How manufacturers can capture more customer data</li>
          <li>How to create an additional revenue channel</li>
          <li>The frameworks and systems behind successful manufacturing businesses</li>
        </ul>
        <p className="lede learn-note rv d1"><b>See the case studies. Understand the framework. Learn how the system works.</b></p>
      </>
    ),
    timelineTitle: 'How Our Manufacturing Growth Partnership Works',
    steps: [
      { title: 'Business & Sales Channel Discovery', text: 'We understand your products, customers, current revenue, distribution network, sales process and existing technology.' },
      { title: 'Growth Strategy & Business Model', text: 'We identify where direct sales can complement your existing distribution model and build a roadmap around your revenue and growth objectives.' },
      { title: 'Direct Sales Channel Development', text: 'We build the digital infrastructure required to sell directly including your website, commerce systems, customer experience, product infrastructure and technology.' },
      { title: 'Marketing & Customer Acquisition', text: 'We develop and execute marketing systems designed to attract qualified customers and create demand for your products.' },
      { title: 'Data, Automation & Operational Systems', text: 'We help improve product data, customer data, ordering workflows, automation and internal processes so your sales channel can scale efficiently.' },
      { title: 'Launch, Optimisation & Scaling', text: 'We continuously optimise the technology, marketing and sales systems based on performance and help you scale the channel over time.' },
    ],
  },
  team: {
    title: "We're Not Just a Tech or Marketing Company.",
    subtitle: "We're Your Manufacturing Growth & Execution Partner.",
    body: (
      <>
        <p>WeframeTech brings together <b>technology, marketing, strategy and execution</b> to help established manufacturers build their own scalable sales channels.</p>
        <p>We work with manufacturing businesses that already have the products, expertise and operational capabilities, but want greater control over how they acquire customers and generate revenue.</p>
        <p>Our 50+ member team works across:</p>
        <p className="flowline">{['Technology', 'Product', 'Marketing', 'Growth', 'Automation', 'Strategy'].map((t, i) => <span key={t}>{i > 0 && <i aria-hidden="true">→</i>}<b>{t}</b></span>)}</p>
        <p>You don&apos;t need to build an expensive technology and marketing team from scratch.</p>
        <p>We become the execution team behind your growth, helping you build a direct sales channel while continuing to work alongside your existing distribution network.</p>
      </>
    ),
    chip: '50+ in-house experts across technology, marketing & growth',
    statsTitle: 'What You Can Build With Us',
    stats: [
      { value: '50+', label: 'In-house experts across technology, marketing & growth' },
      { value: '3-4 Months', label: 'Initial sales-channel build & launch timeline' },
      { value: 'Up to 40%+', label: 'Potential additional revenue opportunity through your own sales channel' },
      { value: '₹50L-₹5Cr+', label: 'Monthly revenue range we are targeting' },
      { value: 'End-to-End', label: 'Strategy + Technology + Marketing + Automation + Execution' },
    ],
  },
  shift: {
    kind: 'flow',
    title: "The Goal Isn't To Replace Your Existing Sales Network.",
    subtitle: "It's To Build Another One.",
    intro: (
      <>
        <p className="lede rv d1">Your distributors and wholesalers can continue doing what they do best.</p>
        <p className="lede rv d1">At the same time, your business can develop its own:</p>
      </>
    ),
    items: ['Customer Acquisition', 'Digital Sales Channel', 'Customer Data', 'Better Buying Experience', 'Higher Control Over Revenue'],
  },
  closing: {
    title: 'Ready To Build Your Own Manufacturing Sales Channel?',
    body: (
      <>
        <p className="lede rv d1">Already have a successful manufacturing business but want more control over your growth?</p>
        <p className="lede rv d1">We bring the <b>technology, marketing, strategy and execution.</b> You bring the <b>products, manufacturing expertise and operational capability.</b></p>
        <p className="lede rv d1"><b>See if your manufacturing business qualifies for our growth partnership.</b></p>
      </>
    ),
  },
  stickyNote: 'Takes 60 seconds. For established manufacturers.',
  qualifier: {
    questions: [
      {
        id: 'business', bar: 1, count: 'Question 1 of 7', back: false,
        title: 'What best describes your business?',
        options: [
          o('owner', 'Manufacturer / Factory Owner'), o('founder', 'Manufacturing Company Founder'),
          o('md', 'Managing Director / CEO'), o('family', 'Family-Owned Manufacturing Business'),
          o('b2b', 'Industrial / B2B Manufacturer'), o('other', 'Other'),
        ],
      },
      {
        id: 'goal', bar: 2, count: 'Question 2 of 7',
        title: 'What would you ideally like to achieve?',
        help: 'What monthly revenue would you like to build?',
        options: [
          o('2-5cr', '₹2-5 crore/month'), o('5-10cr', '₹5-10 crore/month'), o('10-15cr', '₹10-15 crore/month'),
          o('15-25cr', '₹15-25 crore/month'), o('25cr+', '₹25 crore+/month'), o('unsure', "I'm not sure yet"),
        ],
      },
      {
        id: 'products', kind: 'multi', bar: 3, count: 'Question 3 of 7',
        title: 'What type of products does your company manufacture?',
        help: 'Select all that apply.',
        options: PRODUCTS.map(({ value, label }) => ({ value, label })),
      },
      {
        id: 'revenue', bar: 4, count: 'Question 4 of 7',
        title: 'What is your current monthly revenue?',
        help: 'Select your approximate average monthly revenue.',
        options: REVENUE,
      },
      {
        id: 'channels', bar: 5, count: 'Question 5 of 7',
        title: 'How do you currently generate most of your sales?',
        options: [
          o('distributors', 'Distributors'), o('wholesalers', 'Wholesalers'), o('dealers', 'Dealers / Retailers'),
          o('marketplaces', 'Marketplaces such as IndiaMART'), o('direct-team', 'Direct sales team'),
          o('own-site', 'Our own website / online sales'), o('combination', 'A combination of the above'),
        ],
      },
      {
        id: 'middlemen', bar: 5, count: 'Question 5 of 7',
        title: 'Approximately what percentage of your revenue currently comes through distributors, wholesalers or other middlemen?',
        options: [o('0-20', '0-20%'), o('20-40', '20-40%'), o('40-60', '40-60%'), o('60-80', '60-80%'), o('80+', '80%+')],
      },
      {
        id: 'invest', bar: 6, count: 'Question 6 of 7',
        title: 'Are you ready to invest in building your own sales channel?',
        options: [
          o('ready', "Yes, I'm ready to invest"), o('understand', 'I can invest, but I want to understand the model first'),
          o('exploring', "I'm exploring options before committing"), o('no', "No, I'm not ready to invest right now"),
        ],
      },
      {
        id: 'invest2', bar: 6, count: 'Question 6 of 7',
        title: 'What level of investment are you comfortable considering?',
        options: [o('10-15', '₹10-15 lakh'), o('15-25', '₹15-25 lakh'), o('25-50', '₹25-50 lakh'), o('50+', '₹50 lakh+'), o('understand', 'I need to understand the model first')],
      },
      {
        id: 'start', bar: 7, count: 'Question 7 of 7',
        title: 'When would you ideally like to start?',
        options: [o('now', 'Immediately'), o('30d', 'Within 30 days'), o('1-3m', 'Within 1-3 months'), o('3-6m', 'Within 3-6 months'), o('exploring', 'Just exploring for now')],
      },
    ],
    next,
    notFit: {
      business: { title: 'Not a Fit', text: 'Thanks for your interest. At this stage, our partnership is primarily designed for established manufacturing businesses looking to build their own sales channel and scale.' },
      goal: { title: 'Not a Fit', text: "We work with manufacturing businesses that have a clear ambition to scale. If you're still unsure about your growth target, we may not be the right fit at this stage." },
      products: { title: 'Not a Fit', text: 'Our model is designed for manufacturers whose products have a realistic opportunity to be sold directly to customers through a scalable D2C or digital sales channel. If your products are primarily sold in bulk, require distributors for fulfillment, or are not commercially suited for direct customer acquisition, our model may not be the right fit.' },
      revenue: { title: 'Not a Fit', text: 'Our current growth partnership is designed for established manufacturers with existing revenue, products and operational capacity who are ready to build an additional scalable sales channel.' },
      invest: { title: 'Not a Fit', text: "Building a direct sales channel requires investment in technology, marketing, systems and execution. If you're not currently ready to invest, it may be better to revisit this opportunity when you're ready." },
      start: { title: 'Not a Fit Right Now', text: "We currently work with manufacturers who are ready to actively build and scale their sales channel in the near term. You're welcome to come back when you're closer to starting." },
    },
    details: {
      intro: 'Based on your answers, your manufacturing business appears to fit the profile of the companies we partner with. Leave your details below and our team will review your information before reaching out.',
      fields: ['name', 'company', 'phone', 'email', 'website'],
    },
    summary: ['business', 'goal', 'revenue', 'channels', 'invest2', 'start'],
    notFitCta: 'Watch the case study',
  },
  consult: {
    price: 99,
    name: 'Direct Sales Strategy Session',
    includes: consultIncludes('manufacturing'),
    bookingUrl: process.env.NEXT_PUBLIC_MFG_SALES_BOOKING_URL || site.bookingUrl,
  },
  thankYou: {
    badge: "Application received. You're one step closer.",
    ledes: [
      "We've received your application. Based on your answers, your manufacturing business may be a good fit for our growth partnership.",
      'A member of the WeframeTech team will review your application and reach out within 24 hours.',
    ],
    book: [
      "Don't wait for our team to reach out. Choose a convenient time to speak with us and explore how you can build your own direct sales channel.",
      "On the call, we'll discuss your current revenue, products, existing sales channels, growth goals, and how we can help you build and scale a direct sales channel.",
    ],
    next: [
      { title: 'We Review Your Application', text: 'Our team reviews your manufacturing business, products, current revenue, sales channels, growth goals, and investment readiness.' },
      { title: 'Strategy Call', text: 'We discuss your current business model, dependency on distributors or wholesalers, revenue ambition, and the opportunity to build your own sales channel.' },
      { title: 'Build Your Growth Roadmap', text: "If there's a strong fit, we outline how our 50+ person team can support your technology, marketing, direct sales channel, and execution." },
    ],
    ready: {
      title: 'Ready To Build Your Own Sales Channel?',
      body: <p>You bring the <b>manufacturing business, products, and operational expertise.</b><br /><b>We bring the technology, marketing, strategy, and execution.</b></p>,
    },
  },
};
