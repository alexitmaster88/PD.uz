"use client";

import { useRef, useEffect, useCallback } from "react";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Image from "next/image";

interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  descriptionKey: string;
}

export default function PartnersSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const partners: Partner[] = [
    { id: "telc", name: "telc gGmbH", logo: "/images/logos/telc.svg", website: "https://www.telc.net/en/", descriptionKey: "partner_telc_desc" },
    { id: "duwk", name: "DUWK Büro", logo: "/images/logos/duwk.svg", website: "https://duwk.de/en/main-page/", descriptionKey: "partner_duwk_desc" },
    { id: "ssp", name: "SSP", logo: "/images/logos/ssp.svg", website: "https://chamber.uz/oz", descriptionKey: "partner_ssp_desc" },
    { id: "tashvil", name: "Toshkent viloyat hokimligi", logo: "/images/logos/tashvil.svg", website: "https://toshkentviloyati.uz/ru", descriptionKey: "partner_tavi_desc" },
    { id: "xb", name: "Xalq Banki", logo: "/images/logos/xb.svg", website: "https://xb.uz/", descriptionKey: "partner_xb_desc" },
    { id: "yosh", name: "Yoshlar ishlari agentligi", logo: "/images/logos/yosh.svg", website: "https://gov.uz/oz/yoshlar", descriptionKey: "partner_yosh_desc" },
    { id: "edu", name: "Oliy taʼlim, fan va innovatsiyalar vazirligi", logo: "/images/logos/edu.svg", website: "https://gov.uz/oz/edu", descriptionKey: "partner_edu_desc" },
    { id: "uzedu", name: "Maktabgacha va maktab taʼlimi vazirligi", logo: "/images/logos/uzedu.svg", website: "https://gov.uz/oz/uzedu", descriptionKey: "partner_uzedu_desc" },
  ];

  const handlePartnerClick = (website: string): void => {
    window.open(website, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    let rafId: number | null = null;
    let lastTime = 0;
    const speed = 80;
    let paused = false;
    let offset = 0;
    let groupWidth = 0;

    const updateWidths = () => {
      const firstGroup = inner.querySelector('.partners-group') as HTMLElement | null;
      if (!firstGroup) { groupWidth = 0; return; }
      const items = Array.from(firstGroup.children) as HTMLElement[];
      const totalCardsWidth = items.reduce((sum, el) => sum + el.offsetWidth, 0);
      const containerWidth = container.clientWidth || 0;
      let gap = 24;
      if (totalCardsWidth + gap * (items.length - 1) < containerWidth && items.length > 1) {
        gap = (containerWidth - totalCardsWidth) / (items.length - 1);
      }
      inner.querySelectorAll('.partners-group').forEach(g => { (g as HTMLElement).style.gap = `${gap}px`; });
      groupWidth = firstGroup.offsetWidth;
      inner.style.transform = `translateX(0px)`;
    };

    const animate = (time: number) => {
      if (!inner) return;
      if (!lastTime) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;
      if (!paused && groupWidth > 0) {
        offset += (speed * dt) / 1000;
        if (offset >= groupWidth) offset -= groupWidth;
        inner.style.transform = `translateX(${-offset}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    const pause = () => { paused = true; };
    const resume = () => { paused = false; lastTime = 0; };

    container.addEventListener('pointerenter', pause);
    container.addEventListener('pointerleave', resume);
    container.addEventListener('pointerdown', pause);
    window.addEventListener('pointerup', resume);
    container.addEventListener('touchstart', pause, { passive: true } as AddEventListenerOptions);
    window.addEventListener('touchend', resume);

    const ro = new ResizeObserver(() => { updateWidths(); });
    ro.observe(inner);
    ro.observe(container);
    updateWidths();
    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
      container.removeEventListener('pointerenter', pause);
      container.removeEventListener('pointerleave', resume);
      container.removeEventListener('pointerdown', pause);
      window.removeEventListener('pointerup', resume);
      container.removeEventListener('touchstart', pause as EventListenerOrEventListenerObject);
      window.removeEventListener('touchend', resume);
    };
  }, []);

  const PartnerCard = ({ partner }: { partner: Partner }) => (
    <div
      className="min-w-[260px] w-[260px] flex-shrink-0 flex flex-col h-[340px] rounded-2xl border border-white/30 bg-white/8 backdrop-blur-md shadow-md hover:shadow-lg hover:bg-white/20 transition-all cursor-pointer overflow-hidden"
      onClick={() => handlePartnerClick(partner.website)}
    >
      {/* Logo area */}
      <div className="flex items-center justify-center h-[130px] bg-white/60 border-b border-white/40 p-5">
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={130}
          height={80}
          className="object-contain max-h-full max-w-full w-auto h-auto"
        />
      </div>
      {/* Info */}
      <div className="flex flex-col flex-1 p-5 text-center">
        <h3 className="font-bold text-[#130080] text-sm mb-1.5 leading-snug">{partner.name}</h3>
        <p className="text-xs text-[#130080]/60 leading-relaxed flex-1 overflow-hidden">{t(partner.descriptionKey)}</p>
        <button
          className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-[#130080]/25 bg-white/50 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-[#130080] hover:bg-[#130080] hover:text-white transition-colors"
          onClick={e => { e.stopPropagation(); handlePartnerClick(partner.website); }}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t("visit_website")}
        </button>
      </div>
    </div>
  );

  return (
    <section id="partners" className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 -z-10">
        <Image src="/images/partners-bg.png" alt="" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
      </div>

      <div className="container relative">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#130080] md:text-4xl">{t("our_partners")}</h2>
        </div>

        <div className="relative">
          <div ref={scrollContainerRef} className="overflow-hidden pb-4">
            <div ref={innerRef} className="flex gap-6 will-change-transform">
              <div className="partners-group flex gap-6">
                {partners.map((p, i) => <PartnerCard key={`${p.id}-a-${i}`} partner={p} />)}
              </div>
              <div className="partners-group flex gap-6" aria-hidden>
                {partners.map((p, i) => <PartnerCard key={`${p.id}-b-${i}`} partner={p} />)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#130080]/60">{t("partnership_interest")}</p>
        </div>
      </div>
    </section>
  );
}
