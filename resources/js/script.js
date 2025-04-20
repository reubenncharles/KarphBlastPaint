/**
 * Karph Blast and Paint - Main JavaScript
 */

console.log("Script loaded and running");

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all components
        initMobileMenu();
        initActiveNavLinks();
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
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        
        if (mobileToggle && mainNav) {
            mobileToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                mainNav.classList.toggle('active');
            });
            
            // Handle dropdown toggles
            dropdownItems.forEach(item => {
                const link = item.querySelector('a');
                const dropdown = item.querySelector('.dropdown');
                
                // Remove any existing toggle buttons to avoid duplicates
                const existingToggle = link.querySelector('.dropdown-toggle');
                if (existingToggle) {
                    existingToggle.remove();
                }
                
                // Create dropdown toggle for mobile
                if (window.innerWidth <= 992) {
                    const dropdownToggle = document.createElement('span');
                    dropdownToggle.className = 'dropdown-toggle';
                    dropdownToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
                    link.appendChild(dropdownToggle);
                    
                    // Toggle dropdown on click
                    dropdownToggle.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        item.classList.toggle('dropdown-active');
                        
                        // Close other dropdowns
                        dropdownItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('dropdown-active');
                            }
                        });
                    });
                }
            });
            
            // For service pages on mobile, don't auto-expand the menu
            const currentPath = window.location.pathname;
            if (currentPath.includes('/services/') && window.innerWidth <= 992) {
                // If the dropdown is already active, leave it
                const servicesDropdown = document.getElementById('nav-services');
                if (servicesDropdown) {
                    const parentItem = servicesDropdown.closest('.has-dropdown');
                    if (parentItem) {
                        parentItem.classList.remove('dropdown-active');
                    }
                }
            }
            
            // Close menu when clicking on a link (except parent dropdown links)
            const navLinks = mainNav.querySelectorAll('.dropdown a');
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
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                // Remove mobile-specific elements and classes
                document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                    toggle.remove();
                });
                if (dropdownItems) {
                    dropdownItems.forEach(item => {
                        item.classList.remove('dropdown-active');
                    });
                }
            } else {
                // Re-add dropdown toggles if they don't exist
                if (dropdownItems) {
                    dropdownItems.forEach(item => {
                        const link = item.querySelector('a');
                        if (link && !link.querySelector('.dropdown-toggle')) {
                            const dropdownToggle = document.createElement('span');
                            dropdownToggle.className = 'dropdown-toggle';
                            dropdownToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
                            link.appendChild(dropdownToggle);
                        }
                    });
                }
            }
        });
    }

    /**
     * Set Active Navigation Links
     */
    function initActiveNavLinks() {
        // Get current page path
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        // Remove all active classes first
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Logic for setting active links
        if (currentPath.includes('/services/')) {
            // On a service page, set the services link as active
            const servicesNav = document.getElementById('nav-services');
            if (servicesNav) {
                servicesNav.classList.add('active');
                
                // Don't automatically show the dropdown on desktop
                if (window.innerWidth > 992) {
                    const parentItem = servicesNav.closest('.has-dropdown');
                    if (parentItem) {
                        parentItem.classList.remove('dropdown-active');
                    }
                }
            }
            
            // Also set the specific service link as active if it matches
            document.querySelectorAll('.dropdown a').forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });
        } else if (currentPath === '/locations.html') {
            // On the locations page
            const locationsNav = document.getElementById('nav-locations');
            if (locationsNav) {
                locationsNav.classList.add('active');
            }
        } else if (currentPath === '/index.html' || currentPath === '/' || currentPath === '') {
            // On the homepage, check for hash to determine active section
            if (currentHash) {
                const targetNav = document.getElementById('nav-' + currentHash.substring(1));
                if (targetNav) {
                    targetNav.classList.add('active');
                } else {
                    // Default to home when no hash match
                    const homeNav = document.getElementById('nav-home');
                    if (homeNav) {
                        homeNav.classList.add('active');
                    }
                }
            } else {
                // Default to home when no hash
                const homeNav = document.getElementById('nav-home');
                if (homeNav) {
                    homeNav.classList.add('active');
                }
            }
        }
    }

    // Also call this on hash change
    window.addEventListener('hashchange', initActiveNavLinks);

    /**
     * Navigation Active State on Scroll
     */
    window.addEventListener('scroll', function() {
        // Only apply this on homepage
        if (window.location.pathname === '/index.html' || window.location.pathname === '/' || window.location.pathname === '') {
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const scrollPosition = window.pageYOffset;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remove active class from all navigation links
                    document.querySelectorAll('.main-nav a').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to corresponding navigation link
                    const targetNav = document.getElementById('nav-' + sectionId);
                    if (targetNav) {
                        targetNav.classList.add('active');
                    }
                }
            });
        }
    });

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
    /**
 * FAQ Accordion
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length) {
        faqItems.forEach(item => {
            const questionElement = item.querySelector('.faq-question');
            
            if (questionElement) {
                questionElement.addEventListener('click', function() {
                    // Toggle active class on the clicked item
                    item.classList.toggle('active');
                    
                    // Optional: Close other items when one is opened
                    // Uncomment the following code if you want only one FAQ open at a time
                    /*
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    */
                });
            }
        });
    }
}

    /**
     * Testimonial Slider
     */
    function initTestimonialSlider() {
        // ... existing function, no changes needed
    }

    /**
     * Back to Top Button
     */
    function initBackToTop() {
        // ... existing function, no changes needed
    }

    /**
     * Scroll Animations
     */
    function initScrollAnimations() {
        // ... existing function, no changes needed
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        // ... existing function, no changes needed
    }

    /**
     * Form Submission Handling
     */
    const quoteForm = document.querySelector('.quote-form');
    if (quoteForm) {
        // ... existing code, no changes needed
    }
    
})();
