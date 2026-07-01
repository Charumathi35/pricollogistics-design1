/**
 * Cinematic Footer - Vanilla JS + GSAP
 * Ported from the React motion-footer.tsx component.
 * Requires: GSAP 3.x + ScrollTrigger (loaded via CDN before this script)
 */

(function () {
    "use strict";

    // Guard: only run if footer exists on page
    var curtain = document.querySelector(".cf-curtain");
    if (!curtain) return;

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ---------------------------------------------------------------
    // 1. PARALLAX + STAGGER REVEAL
    // ---------------------------------------------------------------
    var giantText = document.querySelector(".cf-giant-text");
    var cfHeading = document.querySelector(".cf-heading");
    var cfLinks   = document.querySelector(".cf-links");

    if (giantText) {
        gsap.fromTo(giantText,
            { y: "10vh", scale: 0.8, opacity: 0 },
            {
                y: "0vh", scale: 1, opacity: 1,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: curtain,
                    start: "top 80%",
                    end: "bottom bottom",
                    scrub: 1
                }
            }
        );
    }

    if (cfHeading) {
        gsap.fromTo(cfHeading,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: curtain,
                    start: "top 40%",
                    end: "bottom bottom",
                    scrub: 1
                }
            }
        );
    }

    if (cfLinks) {
        gsap.fromTo(cfLinks,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: curtain,
                    start: "top 35%",
                    end: "bottom bottom",
                    scrub: 1
                }
            }
        );
    }

    // ---------------------------------------------------------------
    // 2. MAGNETIC PILL BUTTONS
    // ---------------------------------------------------------------
    var magnetPills = document.querySelectorAll(".cf-magnet");

    magnetPills.forEach(function (el) {
        el.addEventListener("mousemove", function (e) {
            var rect = el.getBoundingClientRect();
            var h = rect.width  / 2;
            var w = rect.height / 2;
            var x = e.clientX - rect.left  - h;
            var y = e.clientY - rect.top   - w;

            gsap.to(el, {
                x: x * 0.38,
                y: y * 0.38,
                rotationX: -y * 0.12,
                rotationY:  x * 0.12,
                scale: 1.05,
                ease: "power2.out",
                duration: 0.4,
                transformPerspective: 600
            });
        });

        el.addEventListener("mouseleave", function () {
            gsap.to(el, {
                x: 0, y: 0,
                rotationX: 0, rotationY: 0,
                scale: 1,
                ease: "elastic.out(1, 0.3)",
                duration: 1.2
            });
        });
    });

    // ---------------------------------------------------------------
    // 3. BACK TO TOP
    // ---------------------------------------------------------------
    var scrollTopBtn = document.querySelector(".cf-scroll-top");
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
})();
