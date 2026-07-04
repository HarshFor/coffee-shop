/**
 * Bean & Brew - Main JavaScript
 * Handles: Mobile Nav, Scroll Navbar, Tab Switching, Scroll Reveal, Form Validation
 */

(() => {
    'use strict';

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const revealElements = document.querySelectorAll('.reveal');
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const toast = document.getElementById('toast');

    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const toggleMenu = () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
            hamburger.focus();
        }
    });

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    let lastScroll = 0;
    const handleScroll = () => {
        const currentScroll = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScroll > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ========================================
    // MENU TABS
    // ========================================
    const switchTab = (targetTab) => {
        tabButtons.forEach(btn => {
            const isActive = btn.dataset.tab === targetTab;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });

        tabPanels.forEach(panel => {
            const isActive = panel.id === `panel-${targetTab}`;
            panel.hidden = !isActive;
            panel.classList.toggle('active', isActive);
            if (isActive) {
                // Re-trigger reveal animations for new panel content
                panel.querySelectorAll('.reveal').forEach(el => {
                    el.classList.remove('active');
                    // Force reflow
                    void el.offsetWidth;
                    el.classList.add('active');
                });
            }
        });
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        
        // Keyboard navigation for tabs
        btn.addEventListener('keydown', (e) => {
            let index = Array.from(tabButtons).indexOf(btn);
            if (e.key === 'ArrowRight') index = (index + 1) % tabButtons.length;
            if (e.key === 'ArrowLeft') index = (index - 1 + tabButtons.length) % tabButtons.length;
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                tabButtons[index].click();
                tabButtons[index].focus();
            }
        });
    });

    // ========================================
    // SCROLL REVEAL (Intersection Observer)
    // ========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after animation to save performance
                // revealObserver.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================================
    // NEWSLETTER FORM VALIDATION
    // ========================================
    const validateEmail = (email) => {
        // Simple RFC 5322 compliant regex (simplified for demo)
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const showError = (message) => {
        emailInput.setAttribute('aria-invalid', 'true');
        emailError.textContent = message;
    };

    const clearError = () => {
        emailInput.removeAttribute('aria-invalid');
        emailError.textContent = '';
    };

    const showToast = () => {
        toast.hidden = false;
        // Force reflow for animation
        void toast.offsetWidth;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { toast.hidden = true; }, 300);
        }, 4000);
    };

    emailInput.addEventListener('input', clearError);
    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            showError('Please enter a valid email address');
        }
    });

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearError();

        const email = emailInput.value.trim();

        if (!email) {
            showError('Email address is required');
            emailInput.focus();
            return;
        }

        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            emailInput.focus();
            return;
        }

        // Simulate API call
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';

        setTimeout(() => {
            // Success simulation
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
            emailInput.value = '';
            showToast();
        }, 1000);
    });

    // ========================================
    // SMOOTH SCROLL POLYFILL / FOCUS MANAGEMENT
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                
                // Focus management for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });

    // ========================================
    // INITIALIZATION
    // ========================================
    // Set initial active tab panel reveal state
    document.querySelector('.tab-panel.active .reveal')?.classList.add('active');
    
    console.log('☕ Bean & Brew loaded successfully!');
})();
