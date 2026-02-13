"use client";

import { useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollingRef = useRef<boolean>(false);
  const { t } = useLanguage();

  const partners: Partner[] = [
    {
      id: "goethe-institut",
      name: "TELC gGmbH",
      logo: "/images/logos/telc.svg",
      website: "https://www.telc.net/en/",
      descriptionKey: "partner_telc_desc",
    },
    {
      id: "daad",
      name: "DUWK Büro",
      logo: "/images/logos/duwk.svg",
      website: "https://duwk.de/en/main-page/",
      descriptionKey: "partner_duwk_desc",
    },
    {
      id: "bmz",
      name: "SSP",
      logo: "/images/logos/ssp.svg",
      website: "https://chamber.uz/oz",
      descriptionKey: "partner_ssp_desc",
    },
    {
      id: "giz",
      name: "GIZ",
      logo: "/images/logos/tashvil.svg",
      website: "https://toshkentviloyati.uz/ru",
      descriptionKey: "partner_tavi_desc",
    },
    {
      id: "siemens",
      name: "Xalq Banki",
      logo: "/images/logos/xb.svg",
      website: "https://xb.uz/",
      descriptionKey: "partner_xb_desc",
    },
    {
      id: "volkswagen",
      name: "Yoshlar ishlari agentligi",
      logo: "/images/logos/yosh.svg",
      website: "https://gov.uz/oz/yoshlar",
      descriptionKey: "partner_yosh_desc",
    },
    {
      id: "bosch",
      name: "Oliy taʼlim, fan va innovatsiyalar vаzirligi",
      logo: "/images/logos/edu.svg",
      website: "https://gov.uz/oz/edu",
      descriptionKey: "partner_edu_desc",
    },
    {
      id: "sap",
      name: "Maktabgacha va maktab ta’limi vazirligi",
      logo: "/images/logos/uzedu.svg",
      website: "https://gov.uz/oz/uzedu",
      descriptionKey: "partner_uzedu_desc",
    },
    {
      id: "lufthansa",
      name: "Lufthansa",
      logo: "/images/logos/lufthansalogo.svg",
      website: "https://www.lufthansa.com",
      descriptionKey: "partner_lufthansa_desc",
    },
  ];

  const handleScroll = useCallback((direction: 'left' | 'right'): void => {
    if (scrollContainerRef.current && !scrollingRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280;
      const gapWidth = 24;
      const scrollAmount = cardWidth + gapWidth;
      container.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: "smooth" 
      });
    }
  }, []);

  const handlePartnerClick = (website: string): void => {
    window.open(website, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    let rafId: number | null = null;
    let lastTime = 0;
    const speed = 80; // px per second
    let paused = false;
    let offset = 0;
    let groupWidth = 0; // width of one partners group

    const updateWidths = () => {
      const firstGroup = inner.querySelector('.partners-group') as HTMLElement | null;
      if (!firstGroup) {
        groupWidth = 0;
        return;
      }

      const items = Array.from(firstGroup.children) as HTMLElement[];
      const totalCardsWidth = items.reduce((sum, el) => sum + el.offsetWidth, 0);
      const containerWidth = container.clientWidth || 0;

      const minGap = 24; // fallback gap
      let gap = minGap;

      // If cards fit within container, distribute remaining space equally between them
      if (totalCardsWidth + minGap * (items.length - 1) < containerWidth && items.length > 1) {
        gap = (containerWidth - totalCardsWidth) / (items.length - 1);
      }

      // Apply computed gap to both groups (inline style overrides tailwind class)
      const groups = inner.querySelectorAll('.partners-group');
      groups.forEach((g) => {
        (g as HTMLElement).style.gap = `${gap}px`;
      });

      // Recompute group width after applying gap
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
        if (offset >= groupWidth) {
          // loop seamlessly
          offset -= groupWidth;
        }
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

    const ro = new ResizeObserver(() => {
      updateWidths();
    });
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

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/partners-section.tsx/photo-1654442137037-fe784a7189af.png"
          alt="Business partnership background"
          fill
          className="object-cover opacity-85 filter blur-[1.5px]"
          priority
        />
        <div className="absolute inset-0 bg-[#aef2ea]/50" />
      </div>
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            {t("our_partners")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {/* {t("partners_description")} */}
          </p>
        </div>

        <div className="relative group">
          <div ref={scrollContainerRef} className="overflow-hidden pb-6">
            <div ref={innerRef} className="flex gap-6 will-change-transform">
              <div className="partners-group flex">
                {partners.map((partner, index) => (
                  <Card
                    key={`${partner.id}-a-${index}`}
                    className="min-w-[280px] w-[280px] flex-shrink-0 overflow-hidden shadow-md hover:shadow-lg transition-shadow h-[380px] flex flex-col"
                  >
                    <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                      <div>
                        <div className="h-[120px] w-full mb-4 bg-white rounded-lg p-4 flex items-center justify-center overflow-hidden">
                          <Image
                            src={partner.logo || "/placeholder.svg"}
                            alt={`${partner.name} logo`}
                            width={120}
                            height={80}
                            className="object-contain max-h-full max-w-full w-auto h-auto"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg?height=80&width=120";
                            }}
                          />
                        </div>
                        <h3 className="font-semibold text-lg mb-2 h-[28px] flex items-center justify-center">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 h-[60px] overflow-hidden">{t(partner.descriptionKey)}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-auto bg-transparent" onClick={() => handlePartnerClick(partner.website)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("visit_website")}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="partners-group flex" aria-hidden>
                {partners.map((partner, index) => (
                  <Card
                    key={`${partner.id}-b-${index}`}
                    className="min-w-[280px] w-[280px] flex-shrink-0 overflow-hidden shadow-md hover:shadow-lg transition-shadow h-[380px] flex flex-col"
                  >
                    <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                      <div>
                        <div className="h-[120px] w-full mb-4 bg-white rounded-lg p-4 flex items-center justify-center overflow-hidden">
                          <Image
                            src={partner.logo || "/placeholder.svg"}
                            alt={`${partner.name} logo`}
                            width={120}
                            height={80}
                            className="object-contain max-h-full max-w-full w-auto h-auto"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg?height=80&width=120";
                            }}
                          />
                        </div>
                        <h3 className="font-semibold text-lg mb-2 h-[28px] flex items-center justify-center">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 h-[60px] overflow-hidden">{t(partner.descriptionKey)}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-auto bg-transparent" onClick={() => handlePartnerClick(partner.website)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("visit_website")}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <Button
            size="icon"
            variant="secondary"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={() => handleScroll('left')}
            aria-label={t("previous_partners")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={() => handleScroll('right')}
            aria-label={t("next_partners")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">{t("partnership_interest")}</p>
        </div>
      </div>
    </section>
  );
}
