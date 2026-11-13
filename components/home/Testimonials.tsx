import Marquee from '@/components/ui/Marquee';

export default function Testimonials() {
  return (
    <section className="sec" aria-labelledby="r-title">
      <div className="wrap">
        <div className="head">
          <h2 className="h2 rv" id="r-title">What Client's Say About Us</h2>
          <p className="lede rv d1">We help industry-leading brands solve complex challenges and achieve measurable results</p>
        </div>
      </div>
      <Marquee className="marq tmarq rv d1" aria-label="Client testimonials" speed={34}>
          <article className="tcard glass sm"><div className="in">
            <blockquote>I highly recommend Bishen for any Builder.io and Next.js projects. Their work on our project was exceptional, delivering a high-quality, performant website that exceeded our expectations. They demonstrated excellent technical skills, clear communication, and a strong work ethic throughout the process. The developer's expertise in integrating Builder.io with Next.js resulted in a user-friendly, scalable solution that perfectly met our needs. Their proactive approach and ability to meet deadlines make them a valuable asset to any team. If you're looking for a skilled and reliable developer for your web projects, look no further!</blockquote>
            <div className="who"><img src="/assets/t-bernd.jpg" width={400} height={400} alt="" /><div><b>Bernd Holbein</b><span>CEO, Symbiofy &amp; Former Head of Engineering, Google</span></div></div>
          </div></article>
          <article className="tcard glass sm"><div className="in">
            <blockquote>Excellent communication and quality of work, they were very creative in their approach. They didn't just build what we told them to build, rather, they gave excellent advice on what to change, and why they were recommending it, which is extremely valuable to us. They acted as builders, but also consultants. They were also very fast! They have an amazing team that punches out work. We were going for a MVP, but basically had a fully baked product upon completion... it's been incredible working with them and we 100% plan to work with them again as we continue to build out other elements of our platform.</blockquote>
            <div className="who"><img src="/assets/t-ty.jpg" width={400} height={400} alt="" /><div><b>TY Robins</b><span>CEO, Comeata</span></div></div>
          </div></article>
          <article className="tcard glass sm"><div className="in">
            <blockquote>Bishen and the Weframe tech team have been fabulous to work with. They consulted with our team based on the needs of our site migration and directed us to a new CMS that best fit the requirements of the project. They are excellent with communication and adhering to deadlines. They have a robust team that can accommodate the needs of different CMS platforms, and have been able to guide us through every step of the process. We will continue to work with them in the future</blockquote>
            <div className="who"><img src="/assets/t-derin.jpg" width={400} height={400} alt="" /><div><b>Derin James Turner</b><span>Director of Content Development, Abaxx Technologies</span></div></div>
          </div></article>
          <article className="tcard glass sm"><div className="in">
            <blockquote>WeframeTech provided great communication and knowledge upfront when speaking about the scope of the project. This provided great confidence in skillset and allowed me to make an informed decision to go with him. The communication throughout was easy and concise. The timelines were accurate and on-time to project completion.</blockquote>
            <div className="who"><img src="/assets/t-jake.jpg" width={400} height={400} alt="" /><div><b>Jake Santerre</b><span>Sales Director @ ButterCMS</span></div></div>
          </div></article>
          <article className="tcard glass sm"><div className="in">
            <blockquote>I wanted to express my gratitude for your exceptional work on our SAAS project. Your expertise and dedication have surpassed our expectations. The project was delivered on time with innovative solutions, contributing significantly to its success. Your clear communication and professionalism made the collaboration seamless. We look forward to future projects with you and highly recommend your services.</blockquote>
            <div className="who"><img src="/assets/t-micha.jpg" width={400} height={500} alt="" /><div><b>Micha Bayer</b><span>Founder, Saley</span></div></div>
          </div></article>
          <article className="tcard glass sm"><div className="in">
            <blockquote>Overall, the team demonstrated great attention to detail, excellent communication, and a commitment to delivering high-quality results on time. I look forward to working with them again on future projects.</blockquote>
            <div className="who"><img src="/assets/t-ruggero.jpg" width={400} height={400} alt="" /><div><b>Ruggero Paternò</b><span>Head of Marketing at Catalyser</span></div></div>
          </div></article>
          <article className="tcard glass sm"><div className="in">
            <blockquote>First collaboration with Bishen and his team on the NextJS development of a landing page. Delighted with the work. Convinced that we can build a more fluid and recurring business model thanks to this collaboration and the quality of the work</blockquote>
            <div className="who"><img src="/assets/t-olivier.png" width={400} height={400} alt="" /><div><b>Olivier Rousseaux</b><span>Founder, Maastery</span></div></div>
          </div></article>
          <article className="tcard glass sm"><div className="in">
            <blockquote>Bishen and his team shared valuable insights regarding their vast experience with Directus. They are very capable</blockquote>
            <div className="who"><img src="/assets/t-carl.jpg" width={400} height={400} alt="" /><div><b>Carl-Johan Larsson</b><span>Senior Partnerships Manager, Velmie</span></div></div>
          </div></article>
      </Marquee>
    </section>
  );
}
