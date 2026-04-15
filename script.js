document.addEventListener('DOMContentLoaded', () => {

    // --- 0. FORCE SCROLL TO TOP ON REFRESH ---
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- 1. MOBILE NAVBAR TOGGLE ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksList = document.getElementById('nav-links');
    
    mobileToggle.addEventListener('click', () => {
        navLinksList.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navLinksList.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // --- 2. NAVIGATION LOGIC (Scroll & Click) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.getElementById('navbar').offsetHeight;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (window.innerWidth <= 768) {
                navLinksList.classList.remove('active');
                mobileToggle.querySelector('i').classList.remove('fa-times');
                mobileToggle.querySelector('i').classList.add('fa-bars');
            }

            const targetId = link.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. INTERSECTION OBSERVER FOR FADE-IN & NAV HIGHLIGHT ---
    const observerOptions = {
        root: null,
        rootMargin: `-${navbarHeight}px 0px 0px 0px`,
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => observer.observe(section));

   // --- 4. CONTACT FORM HANDLING (Static Hosting Ready) ---
    const contactForm = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    const successModal = document.getElementById('contact-success-modal');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;
            statusMsg.innerText = ''; 

            // Send via EmailJS (Requires your Service ID and Template ID)
            emailjs.sendForm('service_oogw4w1', 'template_20saj8p', contactForm)
                .then(function() {
                    // Success! Show the popup modal
                    if (successModal) {
                        successModal.classList.remove('hidden');
                        successModal.classList.add('active'); 
                        document.body.classList.add('no-scroll');
                    }
                    contactForm.reset();
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, function(error) {
                    // Failed
                    console.error("EmailJS error:", error);
                    statusMsg.style.color = 'red';
                    statusMsg.innerText = "❌ Failed to send message. Please try again.";
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

    // Handle closing the success modal
    const closeSuccessBtn = document.querySelector('.close-contact-feedback');
    if (closeSuccessBtn && successModal) {
        closeSuccessBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- 5. MODAL POPUP LOGIC (WITH SCROLL FREEZE) ---
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const closeButtons = document.querySelectorAll('.close-btn');
    const overlays = document.querySelectorAll('.modal-overlay');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('no-scroll'); // Freezes background
            }
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll'); // Unfreezes background
            }
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.classList.remove('no-scroll'); 
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.classList.remove('no-scroll'); 
            }
        }
    });

    // --- 6. RESUME MODAL SPECIFIC LOGIC (WITH SCROLL FREEZE) ---
    window.openResumeSelection = function() {
        document.getElementById('resume-choice-modal').classList.add('active');
        document.body.classList.add('no-scroll'); 
    }

    window.openResumePreview = function() {
        document.getElementById('resume-choice-modal').classList.remove('active');
        document.getElementById('resume-preview-modal').classList.add('active');
        // Body is already frozen from the selection modal
    }

    window.closeResumeModals = function() {
        document.getElementById('resume-choice-modal').classList.remove('active');
        document.getElementById('resume-preview-modal').classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});
