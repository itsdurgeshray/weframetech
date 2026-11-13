import Marquee from '@/components/ui/Marquee';

export default function Clients() {
  return (
    <section className="sec" aria-labelledby="c-title">
      <div className="wrap">
        <div className="head" style={{ marginBottom: '48px' }}>
          <h2 className="h2 rv" id="c-title"><span className="accent">Global Companies</span> Trust &amp; Work With Us</h2>
        </div>
      </div>
      <Marquee className="marq rv d1">
            <img src="/assets/cl-1.svg" width={155.259} height={32.0002} alt="Insta360" />
            <img src="/assets/cl-2.svg" width={84.0328} height={32} alt="Visit Dubai" />
            <img src="/assets/cl-3.svg" width={102.798} height={32} alt="Bentley" />
            <img src="/assets/cl-4.svg" width={142.222} height={32} alt="OnePlus" />
            <img src="/assets/cl-5.svg" width={174.08} height={32} alt="Keeway" />
            <img className="png tall" src="/assets/l-ferrari.png" width={40} height={62} alt="Ferrari" />
            <img className="png tall" src="/assets/l-lamborghini.png" width={55} height={62} alt="Lamborghini" />
      </Marquee>
      <Marquee className="marq rev rv d2">
            <img className="png short" src="/assets/l-samsung.png" width={131} height={21} alt="Samsung" />
            <img className="png" src="/assets/l-abaxx.png" width={190} height={37} alt="Abaxx Exchange" />
            <img className="png short" src="/assets/l-unimig.png" width={168} height={18} alt="Unimig" />
            <img className="png" src="/assets/l-lulu.png" width={128} height={49} alt="Lulu Mall" />
            <img className="png" src="/assets/l-benelli.png" width={138} height={42} alt="Benelli" />
            <img className="png" src="/assets/l-relynk.png" width={430} height={99} alt="Relynk" />
      </Marquee>
    </section>
  );
}
