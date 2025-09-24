
import React, { useEffect } from 'react';
import './Home.css';

// Lenis smooth scroll (assume installed via npm install @studio-freight/lenis)
import Lenis from 'lenis';

const journeyCards = [
  {
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    alt: 'คาเฟ่ในนิมมาน',
    title: 'ทริปคาเฟ่ในนิมมาน',
    desc: 'สายชิลล์ห้ามพลาด! รวมคาเฟ่สุดชิคในย่านนิมมานฯ เดินเล่น ถ่ายรูป จิบกาแฟ ชมงานอาร์ต',
  },
  {
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    alt: 'วัดในเมืองเก่า',
    title: 'วันเดียวเที่ยววัดในเมืองเก่า',
    desc: 'เส้นทางสายบุญ เที่ยววัดดังกลางเมืองเก่าเชียงใหม่ สัมผัสศิลปะล้านนาและวิถีชีวิตท้องถิ่น',
  },
  {
    img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    alt: 'ธรรมชาติป่าเขา',
    title: 'สายธรรมชาติป่าเขา',
    desc: 'หนีเมืองขึ้นดอย! สูดอากาศบริสุทธิ์ เที่ยวป่า น้ำตก จุดชมวิวธรรมชาติรอบเชียงใหม่',
  },
  {
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    alt: 'ร้านอาหารพื้นเมือง',
    title: 'ย่านร้านอาหารพื้นเมือง',
    desc: 'ตะลุยกินอาหารเหนือแท้ๆ ร้านเด็ดในเชียงใหม่ รสชาติแบบดั้งเดิมที่ต้องลอง!',
  },
  {
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    alt: 'Hidden Gems',
    title: 'Hidden Gems: ที่เที่ยวลับ',
    desc: 'รวมสถานที่ลับ ไม่ซ้ำใครในเชียงใหม่ ที่คนท้องถิ่นแนะนำให้ไป!',
  },
];

function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smooth: true,
      direction: 'vertical',
      gestureOrientation: 'vertical',
      smoothTouch: false,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Chiang Mai Unlocked:</h1>
          <h2>Curated Journeys & Hidden Gems</h2>
          <p>
            ค้นพบเชียงใหม่ในมุมใหม่! เส้นทางเที่ยวที่คัดสรรและสถานที่ลับที่คุณไม่เคยรู้จัก พร้อมไอเดียแผนเที่ยวสุดพิเศษสำหรับสายเที่ยวตัวจริง
          </p>
          <button className="home-btn" onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}>
            สำรวจเส้นทางแนะนำ
          </button>
        </div>
      </section>

      {/* Featured Journeys Section */}
      <section className="featured-journeys-section">
        <h3>เส้นทางแนะนำสำหรับคุณ</h3>
        <div className="journeys-grid">
          {journeyCards.map((card, idx) => (
            <div className="journey-card" key={idx} tabIndex={0} role="button" aria-label={card.title}>
              <img src={card.img} alt={card.alt} loading="lazy" />
              <h4>{card.title}</h4>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;