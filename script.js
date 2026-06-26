// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Setup
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// --- Scroll Sequence Animation ---
const canvas = document.getElementById("scroll-canvas");
const context = canvas.getContext("2d");

canvas.width = 1920; // Default width
canvas.height = 1080; // Default height

const frameCount = 15;
const currentFrame = index => {
    if (index === 0) return `./scroll/download(0).png`;
    return `./scroll/download (${index}).png`;
};

const images = [];
const sequenceData = {
    frame: 0
};

// Preload images
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

const render = () => {
    const img = images[sequenceData.frame];
    if (!img || !img.complete) return;

    // Draw image with 'cover' logic
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};

const canvasContainer = document.querySelector(".canvas-container");

// Handle Resize
window.addEventListener("resize", () => {
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    render();
});

// Initial Resize
canvas.width = canvasContainer.offsetWidth;
canvas.height = canvasContainer.offsetHeight;

// ScrollTrigger sequence
images[0].onload = render; // Ensure first image is drawn

const sequenceTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".scroll-sequence",
        start: "top top",
        end: "+=8000", // Increased from 4000 to slow down the scroll
        scrub: 1, // Increased for smoother tracking
        pin: true,
        anticipatePin: 1,
    }
});

// Text Overlay Animations
const slides = gsap.utils.toArray(".sequence-slide");

slides.forEach((slide, i) => {
    // Fade in
    sequenceTl.to(slide, {
        opacity: 1,
        y: 0,
        duration: 2,
    }, i === 0 ? 0 : ">+1"); // ">+1" means 1s after the PREVIOUS tween ends

    // Fade out (except for the last one)
    if (i < slides.length - 1) {
        sequenceTl.to(slide, {
            opacity: 0,
            y: -30,
            duration: 2,
        }, ">+2"); // 2s after the fade-in ends
    }
});

// Image Sequence Animation - Span the entire timeline
sequenceTl.to(sequenceData, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    duration: sequenceTl.duration(), // Match the total text animation duration
    onUpdate: render
}, 0); // Start at time 0

// Sync Slide Classes for CSS transitions as well (optional)
ScrollTrigger.create({
    trigger: ".scroll-sequence",
    start: "top top",
    end: "+=8000", // Match the sequence timeline end
    onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.min(Math.floor(progress * slides.length), slides.length - 1);
        slides.forEach((s, i) => {
            if (i === index) s.classList.add("active");
            else s.classList.remove("active");
        });
    }
});

// --- Existing Animations ---

// Ship Journey Animation
const journeyTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".journey-section",
        start: "top top",
        end: "+=3000",
        scrub: 1,
        pin: true,
        anticipatePin: 1
    }
});

// 1. Initial State
gsap.set("#ship", { scale: 0.8, xPercent: -50, yPercent: -50 });
gsap.set(".container-box", { y: -150, opacity: 0 });

// 2. Animate Ship along the path
journeyTl.to("#ship", {
    motionPath: {
        path: "#ship-path",
        align: "#ship-path",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    scale: 1.2, // Scaling up for depth
    duration: 20,
    ease: "none"
});

// 3. Drop Containers at specific points
// Drop first container (around 25% of the path)
journeyTl.to("#c1", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "bounce.out"
}, 5); // Start at second 5 of 20

// Drop second container (around 50% of the path)
journeyTl.to("#c2", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "bounce.out"
}, 10);

// Drop third container (around 75% of the path)
journeyTl.to("#c3", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "bounce.out"
}, 15);

// 4. Content Fade Out (Optional cleanup)
journeyTl.to(".journey-header", {
    opacity: 0,
    y: -50,
    duration: 2
}, 18);

// Navbar and Mobile Menu
const nav = document.getElementById("navbar");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");
const megaTriggers = document.querySelectorAll(".nav-item.has-mega > a");

// Toggle Mobile Menu
mobileMenuBtn.addEventListener("click", () => {
    mobileMenuBtn.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.classList.toggle("menu-open");
});

// Mobile Accordion for Mega Menu
megaTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            const parent = trigger.parentElement;
            
            // Close other items
            document.querySelectorAll(".nav-item.has-mega").forEach(item => {
                if (item !== parent) item.classList.remove("active");
            });
            
            parent.classList.toggle("active");
        }
    });
});

// Mobile Accordion for Contact Dropdown
const dropdownTriggers = document.querySelectorAll(".nav-item.dropdown-item > a");
dropdownTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            const parent = trigger.parentElement;
            parent.classList.toggle("active");
        }
    });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

// Hero Parallax
gsap.to('#hero-bg img', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// Hero Content Fade
gsap.from('.hero-content > *', {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
});

// About Section Reveal
gsap.from('.about-text > *', {
    opacity: 0,
    x: -50,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
        trigger: '#about',
        start: 'top 80%'
    }
});

gsap.from('.about-image', {
    opacity: 0,
    x: 50,
    duration: 1,
    scrollTrigger: {
        trigger: '#about',
        start: 'top 80%'
    }
});

// Scrollytelling Logic (Services)
const serviceCards = gsap.utils.toArray('.service-card');
const sidebarItems = gsap.utils.toArray('.sidebar-item');

serviceCards.forEach((card, i) => {
    ScrollTrigger.create({
        trigger: card,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
        onLeave: () => { if (i === serviceCards.length - 1) card.classList.remove('active'); },
        onLeaveBack: () => { if (i === 0) card.classList.remove('active'); }
    });

    gsap.to(card, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true
        }
    });
});

function setActive(index) {
    sidebarItems.forEach(item => item.classList.remove('active'));
    serviceCards.forEach(card => card.classList.remove('active'));
    
    sidebarItems[index].classList.add('active');
    serviceCards[index].classList.add('active');
}

// Parallax Middle Section
gsap.to('#parallax-img', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
        trigger: '#parallax-mid',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

// Stats Counter Animation
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    
    ScrollTrigger.create({
        trigger: '#stats',
        start: 'top 80%',
        onEnter: () => {
            gsap.to(counter, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: 'power1.out'
            });
        }
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target);
        }
    });
});
