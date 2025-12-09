import './style.css'
import { initMural } from './mural.js'
import { initParticles } from './particles.js'

// Initialize the 3D Mural
initMural();

// Initialize Particle System
initParticles();

// Scroll Animation Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.feature-card, .section-title, .section-subtitle, .video-wrapper, .anatomy-grid').forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Mouse parallax effect for hero
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const modelViewer = document.querySelector('model-viewer');
        if (modelViewer) {
            modelViewer.style.transform = `translateX(${x * 20}px) translateY(${y * 20}px)`;
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initParallax();
});
