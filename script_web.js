// ============================================
// GLOBAL VARIABLES & DOM ELEMENTS
// ============================================

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const scrollToTopBtn = document.getElementById('scrollToTop');
const contactForm = document.getElementById('contactForm');
const langToggle = document.getElementById('langToggle');

let currentLanguage = 'fa';
const translations = {
    fa: {
        navHome: 'خانه',
        navServices: 'خدمات',
        navPortfolio: 'نمونه کارها',
        navAbout: 'درباره ما',
        navContact: 'تماس',
        heroTitle1: 'طراحی',
        heroTitle2: 'و توسعه',
        heroTitle3: 'وب حرفه‌ای',
        successMessage: 'پیام شما با موفقیت ارسال شد! ✓',
        errorMessage: 'لطفا تمام فیلدها را پر کنید'
    },
    en: {
        navHome: 'Home',
        navServices: 'Services',
        navPortfolio: 'Portfolio',
        navAbout: 'About',
        navContact: 'Contact',
        heroTitle1: 'Professional',
        heroTitle2: 'Web Design',
        heroTitle3: '& Development',
        successMessage: 'Your message sent successfully! ✓',
        errorMessage: 'Please fill all fields'
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    observeElements();
    startCountAnimation();
});

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    // Mobile Menu Toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Nav Links Click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                closeMobileMenu();
            }
        });
    });
    
    // Scroll to Top Button
    window.addEventListener('scroll', handleScrollToTop);
    scrollToTopBtn.addEventListener('click', scrollToTop);
    
    // Contact Form
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Language Toggle
    langToggle.addEventListener('click', toggleLanguage);
    
    // Prevent body scroll on mobile menu
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

// ============================================
// MOBILE MENU FUNCTIONS
// ============================================

function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
}

function closeMobileMenu() {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
}

// ============================================
// SCROLL TO TOP FUNCTIONS
// ============================================

function handleScrollToTop() {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================================
// SMOOTH SCROLL TO SECTION
// ============================================

function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        closeMobileMenu();
    }
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

function validateForm() {
    let isValid = true;
    const formGroups = contactForm.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const error = group.querySelector('.form-error');
        
        // Remove previous error state
        group.classList.remove('error');
        error.textContent = '';
        
        // Validate
        if (!input.value.trim()) {
            group.classList.add('error');
            error.textContent = 'این فیلد الزامی است';
            isValid = false;
            return;
        }
        
        // Email validation
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                group.classList.add('error');
                error.textContent = 'آدرس ایمیل معتبر نیست';
                isValid = false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel') {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(input.value.trim())) {
                group.classList.add('error');
                error.textContent = 'شماره تلفن معتبر نیست';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showNotification(translations[currentLanguage].errorMessage, 'error');
        return;
    }
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'در حال ارسال...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        showNotification(translations[currentLanguage].successMessage, 'success');
        contactForm.reset();
        
        // Log form data (in real scenario, send to server)
        console.log('Form Data:', formData);
        
    } catch (error) {
        showNotification('خطا در ارسال پیام', 'error');
        console.error('Form Error:', error);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#43e97b' : type === 'error' ? '#f5576c' : '#667eea'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 2000;
        animation: slideInUp 0.4s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.dataset.animation || 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.service-card, .portfolio-card, .stat-item, .step, .info-card').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// ANIMATED NUMBER COUNTER
// ============================================

function startCountAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// LANGUAGE TOGGLE
// ============================================

function toggleLanguage() {
    currentLanguage = currentLanguage === 'fa' ? 'en' : 'fa';
    
    // Update button text
    langToggle.textContent = currentLanguage === 'fa' ? 'EN' : 'FA';
    
    // Update HTML direction
    document.documentElement.dir = currentLanguage === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // Animate change
    langToggle.style.transform = 'scale(0.8)';
    setTimeout(() => {
        langToggle.style.transform = 'scale(1)';
    }, 300);
    
    // Save preference
    localStorage.setItem('preferredLanguage', currentLanguage);
    
    console.log('Language changed to:', currentLanguage);
}

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

// Add animation to page load
window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 0.6s ease';
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// SMOOTH SCROLL POLYFILL
// ============================================

function smoothScroll(target) {
    const element = document.querySelector(target);
    if (!element) return;
    
    const start = window.scrollY;
    const end = element.offsetTop;
    const distance = end - start;
    const duration = 1000;
    let progress = 0;
    
    const easeInOutQuad = (t) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };
    
    const scroll = () => {
        progress += 50 / duration;
        if (progress < 1) {
            window.scrollY = start + distance * easeInOutQuad(progress);
            requestAnimationFrame(scroll);
        } else {
            window.scrollY = end;
        }
    };
    
    scroll();
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Ctrl+Home to scroll to top
    if (e.ctrlKey && e.key === 'Home') {
        scrollToTop();
    }
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

if ('PerformanceObserver' in window) {
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
            }
        });
        observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
        console.log('Performance monitoring not supported');
    }
}

// ============================================
// RESTORE LANGUAGE PREFERENCE
// ============================================

window.addEventListener('load', () => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && savedLanguage !== currentLanguage) {
        currentLanguage = savedLanguage;
        langToggle.textContent = currentLanguage === 'fa' ? 'EN' : 'FA';
        document.documentElement.dir = currentLanguage === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLanguage;
    }
});

// ============================================
// DYNAMIC FORM FIELD STYLING
// ============================================

document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    field.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ============================================
// PARALLAX EFFECT (Optional Enhancement)
// ============================================

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(el => {
        const speed = el.dataset.parallax || 0.5;
        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// ============================================
// CONSOLE MESSAGES
// ============================================

console.log('%c🎨 WebCoding Studio', 'font-size: 20px; color: #1a73e8; font-weight: bold;');
console.log('%c✨ Welcome to our portfolio!', 'font-size: 14px; color: #667eea;');
console.log('%c📧 Contact: info@webcoding.ir', 'font-size: 12px; color: #666;');
