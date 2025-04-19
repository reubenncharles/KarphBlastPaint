/**
 * Karph Blast and Paint - Main JavaScript
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all components
        initMobileMenu();
        initProjectFilters();
        initFaqAccordion();
        initTestimonialSlider();
        initBackToTop();
        initScrollAnimations();
        initSmoothScroll();
    });

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (mobileToggle && mainNav) {
            mobileToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                mainNav.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            const navLinks = mainNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                const isClickInsideNav = mainNav.contains(event.target);
                const isClickOnToggle = mobileToggle.contains(event.target);
                
                if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
                    mobileToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                }
            });
        }
    }

    /**
     * Project Filters
     */
    function initProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');
        
        if (filterBtns.length && projectItems.length) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterBtns.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Get filter value
                    const filter = this.getAttribute('data-filter');
                    
                    // Filter projects
                    projectItems.forEach(item => {
                        if (filter === '*') {
                            // Show all items
                            gsapFadeIn(item);
                        } else if (item.classList.contains(filter)) {
                            // Show items with matching class
                            gsapFadeIn(item);
                        } else {
                            // Hide items that don't match
                            gsapFadeOut(item);
                        }
                    });
                });
            });
        }
        
        // Helper functions for GSAP-like animations
        function gsapFadeIn(element) {
            element.style.display = 'block';
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 10);
        }
        
        function gsapFadeOut(element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                element.style.display = 'none';
            }, 300);
        }
    }

    /**
     * FAQ Accordion
     */
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        if (faqItems.length) {
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                const icon = item.querySelector('.faq-icon i');
                
                question.addEventListener('click', function() {
                    // Check if this item is already active
                    const isActive = item.classList.contains('active');
                    
                    // Close all FAQ items
                    faqItems.forEach(faqItem => {
                        faqItem.classList.remove('active');
                        const faqAnswer = faqItem.querySelector('.faq-answer');
                        const faqIcon = faqItem.querySelector('.faq-icon i');
                        
                        // Change icon back to plus
                        if (faqIcon) {
                            faqIcon.className = 'fas fa-plus';
                        }
                        
                        // Hide answer with animation
                        if (faqAnswer) {
                            faqAnswer.style.maxHeight = null;
                            faqAnswer.style.display = 'none';
                        }
                    });
                    
                    // If current item wasn't active before, open it
                    if (!isActive) {
                        item.classList.add('active');
                        
                        // Change icon to minus
                        if (icon) {
                            icon.className = 'fas fa-minus';
                        }
                        
                        // Show answer with animation
                        if (answer) {
                            answer.style.display = 'block';
                            answer.style.maxHeight = answer.scrollHeight + 'px';
                        }
                    }
                });
            });
        }
    }

    /**
     * Testimonial Slider
     */
    function initTestimonialSlider() {
        const sliderContainer = document.querySelector('.testimonials-slider');
        const testimonials = document.querySelectorAll('.testimonial-item');
        
        if (sliderContainer && testimonials.length > 1) {
            // Create navigation
            const sliderNav = document.createElement('div');
            sliderNav.className = 'slider-nav';
            
            // Create dots
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slider-dots';
            
            testimonials.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = index === 0 ? 'dot active' : 'dot';
                dot.setAttribute('data-index', index);
                dotsContainer.appendChild(dot);
            });
            
            sliderNav.appendChild(dotsContainer);
            
            // Create arrows
            const prevArrow = document.createElement('button');
            prevArrow.className = 'slider-arrow prev';
            prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
            
            const nextArrow = document.createElement('button');
            nextArrow.className = 'slider-arrow next';
            nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            sliderNav.appendChild(prevArrow);
            sliderNav.appendChild(nextArrow);
            
            // Append navigation to slider
            sliderContainer.appendChild(sliderNav);
            
            // Add slider functionality
            let currentSlide = 0;
            let autoSlideInterval;
            
            // Show specific slide
            function showSlide(index) {
                // Hide all slides
                testimonials.forEach(slide => {
                    slide.style.display = 'none';
                });
                
                // Remove active class from all dots
                const dots = document.querySelectorAll('.slider-dots .dot');
                dots.forEach(dot => {
                    dot.classList.remove('active');
                });
                
                // Show current slide and activate dot
                testimonials[index].style.display = 'block';
                dots[index].classList.add('active');
                
                // Update current slide index
                currentSlide = index;
            }
            
            // Initialize with first slide
            showSlide(0);
            
            // Previous slide
            prevArrow.addEventListener('click', function() {
                let prevSlide = currentSlide - 1;
                if (prevSlide < 0) {
                    prevSlide = testimonials.length - 1;
                }
                showSlide(prevSlide);
                resetAutoSlide();
            });
            
            // Next slide
            nextArrow.addEventListener('click', function() {
                let nextSlide = currentSlide + 1;
                if (nextSlide >= testimonials.length) {
                    nextSlide = 0;
                }
                showSlide(nextSlide);
                resetAutoSlide();
            });
            
            // Click on dots
            const dots = document.querySelectorAll('.slider-dots .dot');
            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    showSlide(index);
                    resetAutoSlide();
                });
            });
            
            // Auto slide
            function startAutoSlide() {
                autoSlideInterval = setInterval(function() {
                    let nextSlide = currentSlide + 1;
                    if (nextSlide >= testimonials.length) {
                        nextSlide = 0;
                    }
                    showSlide(nextSlide);
                }, 5000);
            }
            
            function resetAutoSlide() {
                clearInterval(autoSlideInterval);
                startAutoSlide();
            }
            
            // Start auto slide
            startAutoSlide();
            
            // Add slider styling
            const sliderStyles = document.createElement('style');
            sliderStyles.textContent = `
                .testimonials-slider {
                    position: relative;
                }
                .slider-nav {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 30px;
                }
                .slider-dots {
                    display: flex;
                    gap: 10px;
                }
                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.3);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .dot.active {
                    background-color: var(--secondary-color);
                }
                .slider-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    border: none;
                    border-radius: 50%;
                    background-color: var(--secondary-color);
                    color: var(--dark-color);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }
                .slider-arrow:hover {
                    background-color: var(--primary-color);
                    color: white;
                }
                .slider-arrow.prev {
                    left: 0;
                }
                .slider-arrow.next {
                    right: 0;
                }
                
                @media (max-width: 768px) {
                    .slider-arrow {
                        top: auto;
                        bottom: -50px;
                    }
                    .slider-arrow.prev {
                        left: 50%;
                        margin-left: -50px;
                    }
                    .slider-arrow.next {
                        right: 50%;
                        margin-right: -50px;
                    }
                    .slider-dots {
                        margin-bottom: 60px;
                    }
                }
            `;
            document.head.appendChild(sliderStyles);
        }
    }

    /**
     * Back to Top Button
     */
    function initBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top');
        
        if (backToTopBtn) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('active');
                } else {
                    backToTopBtn.classList.remove('active');
                }
            });
            
            // Scroll to top when clicked
            backToTopBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    /**
     * Scroll Animations
     */
    function initScrollAnimations() {
        // Add animation classes to elements
        const fadeElements = [
            '.service-card',
            '.benefit-card',
            '.project-item',
            '.testimonial-item',
            '.timeline-item',
            '.faq-item',
            '.info-item'
        ];
        
        // Add fade-in class to elements
        fadeElements.forEach(selector => {
            document.querySelectorAll(selector).forEach((element, index) => {
                element.classList.add('fade-in');
                // Add delay based on index for staggered animation
                element.style.transitionDelay = `${index * 0.1}s`;
            });
        });
        
        // Add fade-in-left class to left-side elements
        document.querySelectorAll('.about-content').forEach(element => {
            element.classList.add('fade-in-left');
        });
        
        // Add fade-in-right class to right-side elements
        document.querySelectorAll('.about-image, .contact-map').forEach(element => {
            element.classList.add('fade-in-right');
        });
        
        // Check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
                rect.bottom >= 0
            );
        }
        
        // Add appear class to elements in viewport
        function checkVisibility() {
            document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(element => {
                if (isInViewport(element)) {
                    element.classList.add('appear');
                }
            });
        }
        
        // Check visibility on load
        checkVisibility();
        
        // Check visibility on scroll
        window.addEventListener('scroll', checkVisibility);
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if href is just #
                if (href === '#') return;
                
                e.preventDefault();
                
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    /**
     * Navigation Active State on Scroll
     */
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.main-nav a');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const scrollPosition = window.pageYOffset;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    /**
     * Form Submission Handling
     */
    const quoteForm = document.querySelector('.quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            let isValid = true;
            const requiredFields = quoteForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Handle email validation
            const emailField = quoteForm.querySelector('#email');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            // Submit form if valid
            if (isValid) {
                // In a real implementation, you would send the form data to a server here
                console.log('Form is valid, would submit to server');
                
                // Show success message
                const formContainer = quoteForm.parentElement;
                
                // Store form height to prevent page jump
                const formHeight = formContainer.offsetHeight;
                formContainer.style.minHeight = formHeight + 'px';
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Thank You!</h3>
                    <p>Your quote request has been successfully submitted. We'll get back to you within 24 hours.</p>
                `;
                
                // Replace form with success message
                formContainer.innerHTML = '';
                formContainer.appendChild(successMessage);
                
                // Add success styles
                const successStyles = document.createElement('style');
                successStyles.textContent = `
                    .form-success {
                        text-align: center;
                        padding: 30px;
                    }
                    .success-icon {
                        font-size: 4rem;
                        color: #28a745;
                        margin-bottom: 20px;
                    }
                    .form-success h3 {
                        color: #28a745;
                        margin-bottom: 15px;
                    }
                `;
                document.head.appendChild(successStyles);
                
                // Scroll to success message
                window.scrollTo({
                    top: formContainer.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
        
        // Clear error state on input
        quoteForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
        
        // Add error styles
        const errorStyles = document.createElement('style');
        errorStyles.textContent = `
            .error {
                border-color: #dc3545 !important;
                background-color: rgba(220, 53, 69, 0.05);
            }
        `;
        document.head.appendChild(errorStyles);
    }
    
})();