(function () {
  /* Visual smooth scroll */
  const visual = new Visual({
    duration: 1.15,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2
  });

  visual.on("scroll", ScrollTrigger.update);

  gsap.ticker.add(function (time) {
    visual.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  function initVizLandingCover() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("[VIZTIZED COVER] GSAP or ScrollTrigger is missing.");
      return;
    }

    const cover = document.querySelector("[data-viz-cover]");
    if (!cover || cover.dataset.ready === "true") return;

    cover.dataset.ready = "true";

    gsap.registerPlugin(ScrollTrigger);

    if (typeof CustomEase !== "undefined") {
      gsap.registerPlugin(CustomEase);
      CustomEase.create("vizCoverEase", "0.6, 0.01, 0.05, 1");
      CustomEase.create("vizCoverSoft", "0.16, 1, 0.3, 1");
      CustomEase.create("vizCoverSnap", "0.77, 0, 0.175, 1");
    }

    const videoFrame = cover.querySelector(".viz-cover-video-frame");
    const video = cover.querySelector(".viz-cover-video");
    const darkOverlay = cover.querySelector(".viz-cover-dark-overlay");
    const overlay = cover.querySelector(".viz-cover-overlay");
    const overlayInner = cover.querySelector(".viz-cover-overlay-inner");

    const introCopy = cover.querySelector(".viz-cover-center-copy");
    const introOverline = cover.querySelector(".viz-cover-overline");
    const introText = cover.querySelector(".viz-cover-intro-text");

    const prelude = cover.querySelector(".viz-cover-prelude");
    const sideLeft = cover.querySelector(".viz-cover-sidecopy-left");
    const sideRight = cover.querySelector(".viz-cover-sidecopy-right");
    const sideLeftItems = cover.querySelectorAll(".viz-cover-sidecopy-left span");
    const sideRightItems = cover.querySelectorAll(".viz-cover-sidecopy-right span");

    const frameLabels = cover.querySelectorAll(".viz-cover-frame-label");
    const progressBar = cover.querySelector(".viz-cover-progress-bar");
    const bottomNote = cover.querySelector(".viz-cover-bottom-note");
    const dateElement = cover.querySelector(".viz-cover-date");

    if (!videoFrame || !video || !darkOverlay || !overlay || !overlayInner) {
      console.warn("[VIZTIZED COVER] Missing cover elements.");
      return;
    }

    video.muted = true;
    video.playsInline = true;

    video.play().catch(function (error) {
      console.log("[VIZTIZED COVER] Video autoplay failed:", error);
    });


    let splitIntro = null;
    let splitOverlay = null;

    if (typeof SplitType !== "undefined") {
      const introTitle = cover.querySelector(".viz-cover-intro-title[data-split]");
      const overlayTitle = cover.querySelector(".viz-cover-overlay-title[data-split]");

      if (introTitle) {
        splitIntro = new SplitType(introTitle, {
          types: "chars, words"
        });
      }

      if (overlayTitle) {
        splitOverlay = new SplitType(overlayTitle, {
          types: "chars, words"
        });
      }
    } 

    const introChars = splitIntro
      ? cover.querySelectorAll(".viz-cover-intro-title .char")
      : [];

    const overlayChars = splitOverlay
      ? cover.querySelectorAll(".viz-cover-overlay-title .char")
      : [];

    /* Video frame */
    gsap.set(videoFrame, {
      width: "300px",
      height: "300px",
      x: 0,
      y: 0,
      rotate: 0.001,
      transformOrigin: "50% 50%"
    });

    gsap.set(video, {
      scale: 1
    });

    gsap.set(overlay, {
      opacity: 0,
      clipPath: "inset(100% 0 0 0)"
    });

    gsap.set(overlayInner, {
      filter: "blur(14px)",
      scale: 1.06
    });

    gsap.set(progressBar, {
      width: "0%"
    });

    if (introChars.length) {
      gsap.set(introChars, {
        yPercent: 120,
        opacity: 0,
        rotateX: -40,
        filter: "blur(8px)"
      });

      gsap.to(introChars, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        filter: "blur(0px)",
        stagger: 0.018,
        duration: 1,
        ease: "vizCoverSoft"
      });
    }

    gsap.set(overlayChars, {
      yPercent: 120,
      opacity: 0,
      rotateX: -22,
      filter: "blur(8px)"
    });

    gsap.set([introOverline, introText], {
      y: 18,
      opacity: 0,
      filter: "blur(8px)"
    });

    gsap.to([introOverline, introText], {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.9,
      stagger: 0.08,
      ease: "vizCoverSoft"
    });

    gsap.to(videoFrame, {
      scale: 1.035,
      duration: 2.4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cover,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.45,
        markers: false,
        invalidateOnRefresh: true,
        onEnter: function () {
          video.play().catch(function () {});
        },
        onEnterBack: function () {
          video.play().catch(function () {});
        },
        onUpdate: function (self) {
          if (progressBar) {
            gsap.set(progressBar, {
              width: self.progress * 100 + "%"
            });
          }
        }
      }
    });

    tl
      .to(
        sideLeftItems,
        {
          xPercent: -260,
          opacity: 0.9,
          stagger: 0.06,
          ease: "none",
          duration: 0.28
        },
        0
      )
      .to(
        sideRightItems,
        {
          xPercent: 260,
          opacity: 0.9,
          stagger: 0.06,
          ease: "none",
          duration: 0.28
        },
        0
      )
      .to(
        prelude,
        {
          y: -18,
          opacity: 0.55,
          ease: "none",
          duration: 0.2
        },
        0
      )
      .to(
        bottomNote,
        {
          y: 18,
          opacity: 0.6,
          ease: "none",
          duration: 0.2
        },
        0
      )
      .to(
        introCopy,
        {
          y: -36,
          scale: 0.96,
          filter: "blur(2px)",
          ease: "none",
          duration: 0.22
        },
        0.02
      )
      .to(
        introChars,
        {
          x: function (i) {
            return i % 2 === 0 ? -18 : 18;
          },
          y: function (i) {
            return i % 3 === 0 ? -28 : 18;
          },
          rotate: function (i) {
            return i % 2 === 0 ? -4 : 4;
          },
          opacity: 0.82,
          filter: "blur(1px)",
          stagger: {
            each: 0.004,
            from: "center"
          },
          ease: "none",
          duration: 0.24
        },
        0.04
      )

      .to(
        videoFrame,
        {
          width: "380px",
          height: "380px",
          rotate: 1080,
          x: 56,
          y: -42,
          ease: "none",
          duration: 0.26
        },
        0.05
      )
      .to(
        video,
        {
          scale: 1.16,
          ease: "none",
          duration: 0.26
        },
        0.05
      )
      .to(
        frameLabels,
        {
          y: function (i) {
            return i === 0 ? 14 : -14;
          },
          opacity: 0.75,
          ease: "none",
          duration: 0.2
        },
        0.06
      )

      /* text visualizer */
      .to(
        introChars,
        {
          x: function (i) {
            return (i - introChars.length / 2) * 7;
          },
          y: function (i) {
            return i % 2 === 0 ? -120 : 120;
          },
          rotate: function (i) {
            return i % 2 === 0 ? -18 : 18;
          },
          opacity: 0,
          filter: "blur(10px)",
          stagger: {
            each: 0.003,
            from: "edges"
          },
          ease: "power2.inOut",
          duration: 0.22
        },
        0.22
      )
      .to(
        introOverline,
        {
          x: -80,
          opacity: 0,
          filter: "blur(8px)",
          ease: "power2.inOut",
          duration: 0.18
        },
        0.24
      )
      .to(
        introText,
        {
          x: 80,
          opacity: 0,
          filter: "blur(8px)",
          ease: "power2.inOut",
          duration: 0.18
        },
        0.24
      )
      .to(
        sideLeft,
        {
          x: -120,
          opacity: 0,
          filter: "blur(8px)",
          ease: "power2.inOut",
          duration: 0.18
        },
        0.3
      )
      .to(
        sideRight,
        {
          x: 120,
          opacity: 0,
          filter: "blur(8px)",
          ease: "power2.inOut",
          duration: 0.18
        },
        0.3
      )
      .to(
        prelude,
        {
          opacity: 0,
          y: -38,
          filter: "blur(6px)",
          ease: "power2.inOut",
          duration: 0.16
        },
        0.32
      )

      .to(
        videoFrame,
        {
          rotate: 1440,
          x: 0,
          y: 0,
          width: "420px",
          height: "420px",
          ease: "power3.inOut",
          duration: 0.16
        },
        0.34
      )

      .to(
        videoFrame,
        {
          width: "100vw",
          height: "100svh",
          rotate: 1440,
          x: 0,
          y: 0,
          borderColor: "rgba(255,255,255,0)",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          ease: "expo.out",
          duration: 0.5
        },
        0.42
      )
      .to(
        video,
        {
          scale: 1.42,
          ease: "expo.out",
          duration: 0.5
        },
        0.42
      )
      .to(
        frameLabels,
        {
          opacity: 0,
          ease: "power2.out",
          duration: 0.12
        },
        0.46
      )
      .to(
        darkOverlay,
        {
          backgroundColor: "rgba(0,0,0,0.6)",
          ease: "power3.inOut",
          duration: 0.38
        },
        0.56
      )

      .to(
        overlay,
        {
          opacity: 1,
          clipPath: "inset(0% 0 0 0)",
          ease: "expo.out",
          duration: 0.32
        },
        0.7
      )
      .to(
        overlayInner,
        {
          filter: "blur(0px)",
          scale: 1,
          ease: "expo.out",
          duration: 0.34
        },
        0.72
      )
      .to(
        overlayChars,
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          filter: "blur(0px)",
          stagger: {
            each: 0.012,
            from: "center"
          },
          ease: "expo.out",
          duration: 0.38
        },
        0.74
      )
      .to(
        bottomNote,
        {
          opacity: 0,
          y: 26,
          ease: "power2.out",
          duration: 0.12
        },
        0.82
      );

    gsap.to(sideLeftItems, {
      scrollTrigger: {
        trigger: cover,
        start: "top top",
        end: "45% top",
        scrub: true
      },
      xPercent: -120,
      stagger: 0.04,
      ease: "none"
    });

    gsap.to(sideRightItems, {
      scrollTrigger: {
        trigger: cover,
        start: "top top",
        end: "45% top",
        scrub: true
      },
      xPercent: 120,
      stagger: 0.04,
      ease: "none"
    });

    setTimeout(function () {
      ScrollTrigger.refresh();
    }, 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVizLandingCover);
  } else {
    initVizLandingCover();
  }

  window.addEventListener("load", function () {
    setTimeout(initVizLandingCover, 300);
  });
})();