import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef, useState } from "react";
import {
  TiChevronLeft,
  TiChevronRight,
  TiArrowMaximise,
  TiArrowMinimise,
  TiLocationArrow,
} from "react-icons/ti";

import { Button } from "./button";
import { VIDEO_LINKS } from "@/constants";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFullScreen, setIsMobileFullScreen] = useState(true);
  const touchStartX = useRef(0);

  const VIDEO_KEYS = ["hero1", "hero2", "hero3", "hero4"] as const;
  const getVideoSrc = (i: number) => {
    const key = VIDEO_KEYS[i - 1]; // Subtract 1 because the array is 0-indexed, but the video indices are 1-based
    return VIDEO_LINKS[key];
  };

  const changeSlide = (direction: 1 | -1) => {
    setIsLoading(true);
    setCurrentIndex((index) => ((index - 1 + direction + 4) % 4) + 1);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const distance = event.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(distance) < 50) return;
    changeSlide(distance > 0 ? 1 : -1);
  };

  useGSAP(
    () => {
      gsap.fromTo(
        "#hero-video",
        { x: "100%" },
        { x: "0%", duration: 0.7, ease: "power2.out" }
      );
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <section id="hero" className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center pointer-events-none absolute z-100 h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}

      <div
        id="video-frame"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="bg-blue-75 relative z-10 h-dvh w-screen overflow-hidden rounded-lg"
      >
        <div>
          <video
            key={currentIndex}
            id="hero-video"
            src={getVideoSrc(currentIndex)}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`hero-video absolute top-0 left-0 size-full object-center md:object-contain ${isMobileFullScreen ? "object-cover" : "object-contain"}`}
            onLoadedData={() => setIsLoading(false)}
          />
        </div>

        <div className="pointer-events-none absolute top-1/2 right-5 left-5 z-[110] flex -translate-y-1/2 justify-between">
          <button
            type="button"
            onClick={() => changeSlide(-1)}
            aria-label="Previous video"
            title="Previous video"
            className="pointer-events-auto flex size-12 items-center justify-center rounded-full bg-black/60 text-3xl text-white backdrop-blur-sm transition hover:bg-black/80"
          >
            <TiChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => changeSlide(1)}
            aria-label="Next video"
            title="Next video"
            className="pointer-events-auto flex size-12 items-center justify-center rounded-full bg-black/60 text-3xl text-white backdrop-blur-sm transition hover:bg-black/80"
          >
            <TiChevronRight />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 z-[110] flex -translate-x-1/2 gap-2">
          {VIDEO_KEYS.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setIsLoading(true);
                setCurrentIndex(index + 1);
              }}
              aria-label={`Go to video ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === index + 1
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileFullScreen((isFullScreen) => !isFullScreen)}
          aria-label={
            isMobileFullScreen
              ? "Restore video format"
              : "Fill mobile screen with video"
          }
          title={
            isMobileFullScreen
              ? "Restore video format"
              : "Fill mobile screen with video"
          }
          className="pointer-events-auto absolute top-24 right-5 z-[110] flex size-11 items-center justify-center rounded-full bg-black/60 text-2xl text-white backdrop-blur-sm transition hover:bg-black/80 md:hidden"
        >
          {isMobileFullScreen ? <TiArrowMinimise /> : <TiArrowMaximise />}
        </button>

        <h1 className="special-font hero-heading text-blue-75 absolute right-5 bottom-5 z-40">
          G<b>a</b>ming
        </h1>

        <div className="absolute top-0 left-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
              Redefi<b>n</b>ed
            </h1>

            <p className="font-robert-regular mb-5 max-w-64 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]">
              Enter the Metagame Layer <br />
              Unleash the Play Economy
            </p>

            <Button
              id="watch-trailer"
              leftIcon={TiLocationArrow}
              containerClass="bg-yellow-300 flex-center gap-1"
            >
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>

      <h1 className="special-font hero-heading absolute right-5 bottom-5 text-black">
        G<b>a</b>ming
      </h1>
    </section>
  );
};
