import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { heroSlides } from "../lib/content";
import { ActionLink, Button } from "./site";

const SLIDE_DURATION = 6500;

export function HomeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const show = useCallback((index: number) => {
    setActive((index + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % heroSlides.length), SLIDE_DURATION);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="ACFLO community highlights"
      className="group/hero relative flex min-h-[620px] items-center overflow-hidden bg-deep text-primary-foreground md:min-h-[680px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") show(active - 1);
        if (event.key === "ArrowRight") show(active + 1);
      }}
    >
      <div className="absolute inset-0" aria-live="polite">
        {heroSlides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt={index === active ? slide.alt : ""}
            aria-hidden={index !== active}
            className={`hero-slide absolute inset-0 h-full w-full object-cover ${index === active ? "is-active" : ""}`}
          />
        ))}
      </div>
      <div className="hero-shade absolute inset-0" />
      <div className="hero-texture absolute inset-0" />

      <div className="container-site relative z-10 py-24">
        <div className="max-w-3xl animate-hero-copy">
          <span className="inline-flex items-center gap-2 border-l-2 border-lime pl-3 text-xs font-extrabold uppercase tracking-[.13em] text-lime">A flagship program of ZOZAC Community</span>
          <h1 className="mt-7 max-w-3xl font-display text-[clamp(2.8rem,5.4vw,5.75rem)] font-extrabold leading-[1.08] text-balance">Connecting Local Organizations. <span className="text-lime">Advancing Africa.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-8 opacity-90 md:text-lg">ACFLO brings local organizations and community-driven actors together to strengthen collaboration, build capacity and create lasting impact across Africa.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ActionLink to="/about" variant="light">Explore ACFLO <ArrowUpRight size={17}/></ActionLink>
            <ActionLink to="/join" className="!bg-lime !text-deep hover:!bg-accent">Join the Network <ArrowRight size={17}/></ActionLink>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 z-20">
        <div className="container-site flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose a slide">
            {heroSlides.map((slide, index) => (
              <Button
                key={slide.alt}
                variant="ghost"
                role="tab"
                aria-selected={index === active}
                aria-label={`Show slide ${index + 1}: ${slide.alt}`}
                onClick={() => show(index)}
                className={`!min-h-0 !rounded-full !p-0 transition-all ${index === active ? "!h-2 !w-9 !bg-lime" : "!size-2 !bg-primary-foreground/60 hover:!bg-primary-foreground"}`}
              ><span className="sr-only">Slide {index + 1}</span></Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" aria-label="Previous slide" onClick={() => show(active - 1)} className="hero-control !size-11 !rounded-full !border !border-primary-foreground/35 !bg-deep/45 !p-0 !text-primary-foreground"><ArrowLeft size={18}/></Button>
            <Button variant="ghost" aria-label={paused ? "Resume slideshow" : "Pause slideshow"} onClick={() => setPaused((value) => !value)} className="hero-control !size-11 !rounded-full !border !border-primary-foreground/35 !bg-deep/45 !p-0 !text-primary-foreground">{paused ? <Play size={17}/> : <Pause size={17}/>}</Button>
            <Button variant="ghost" aria-label="Next slide" onClick={() => show(active + 1)} className="hero-control !size-11 !rounded-full !border !border-primary-foreground/35 !bg-deep/45 !p-0 !text-primary-foreground"><ArrowRight size={18}/></Button>
          </div>
        </div>
      </div>
      <div className="hero-progress absolute inset-x-0 bottom-0 z-20 h-1 bg-lime" style={{ animationDuration: `${SLIDE_DURATION}ms`, animationPlayState: paused ? "paused" : "running" }} key={`${active}-${paused}`} />
    </section>
  );
}