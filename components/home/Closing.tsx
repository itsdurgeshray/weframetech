import QualifyLink from '@/components/ui/QualifyLink';

export default function Closing() {
  return (
    <section className="closing" aria-labelledby="cl-title">
      <div className="wrap">
        <h2 className="h2 rv" id="cl-title">Ready To Build Your Own Telehealth Business?</h2>
        <p className="lede rv d1"><b>Have the healthcare expertise but need the right team to build and grow the business?</b> We bring the technology, marketing, and execution. You bring your expertise and lead operations.</p>
        <p className="lede rv d1">See if you qualify for our telehealth venture partnership.</p>
        <QualifyLink className="btn rv d2">See if you qualify <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></QualifyLink>
      </div>
    </section>
  );
}
