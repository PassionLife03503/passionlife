document.addEventListener('DOMContentLoaded', () => {

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for Fade-in effects
    const fadeObserverOptions = { threshold: 0.1 };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        fadeObserver.observe(el);
    });

    // Simple Cursor Glow Follower
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
        cursorGlow.style.display = 'block';
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // Header
    const header = document.querySelector('.glass-header');
    const hero = document.querySelector('#hero');

    // ✅ efeito de transparência enquanto está no hero (opcional)
    const updateHeaderOnScroll = () => {
        if (!header) return;
        const threshold = 80;

        if (window.scrollY > threshold) header.classList.add('is-transparent');
        else header.classList.remove('is-transparent');
    };

    updateHeaderOnScroll();
    window.addEventListener('scroll', updateHeaderOnScroll);

    // ✅ esconder o header quando sair do hero
    if (header && hero) {
        const heroObserver = new IntersectionObserver(
            ([entry]) => {
                header.classList.toggle('hide-header', !entry.isIntersecting);
            },
            { threshold: 0.15 }
        );

        heroObserver.observe(hero);
    }

    // ✅ Mobile Menu Toggle Logic
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Optional: Animate icon or change to 'X'
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons(); // Re-render icons
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // ✅ Dynamic Word Cycling (Purpose -> Mission -> Values)
    const typingElement = document.querySelector('.highlight-text-purpose');
    if (typingElement) {
        const words = ["Nosso propósito", "Nossa missão", "Nossos valores"];
        let wordIndex = 0;

        setInterval(() => {
            wordIndex = (wordIndex + 1) % words.length;
            const newWord = words[wordIndex];

            typingElement.textContent = newWord;
            typingElement.setAttribute('data-text', newWord);

        }, 4000);
    }

    // ✅ Form Validation & Masks
    const cepInput = document.getElementById('cep');
    const cnpjInput = document.getElementById('cnpj');
    const phoneInput = document.getElementById('telefone');

    const restrictToNumbers = (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    };

    if (cepInput) {
        cepInput.addEventListener('input', restrictToNumbers);
    }

    if (cnpjInput) {
        cnpjInput.addEventListener('input', restrictToNumbers);
    }

    // Simple Phone Mask (DDD) 99999-9999
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 2) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            }
            if (value.length > 9) {
                value = `${value.substring(0, 10)}-${value.substring(10)}`;
            }

            e.target.value = value;
        });
    }

    // ✅ Infinite Loop Carousel Logic (Arrows + Drag)
    const initCarousel = () => {
        document.querySelectorAll('.line-card').forEach(card => {
            const roller = card.querySelector('.image-roller');
            const leftBtn = card.querySelector('.scroll-left');
            const rightBtn = card.querySelector('.scroll-right');

            if (!roller) return;

            const items = [...roller.children];
            if (items.length === 0) return;

            // Clone items for infinite feel
            items.forEach(item => {
                const cloneBefore = item.cloneNode(true);
                const cloneAfter = item.cloneNode(true);
                roller.insertBefore(cloneBefore, roller.firstChild);
                roller.appendChild(cloneAfter);
            });

            const getItemWidth = () => {
                const firstItem = roller.querySelector('.vertical-img, .roller-item');
                if (!firstItem) return 0;
                return firstItem.offsetWidth + parseInt(getComputedStyle(roller).gap || 0);
            };

            let itemWidth = 0;
            let totalOriginalWidth = 0;

            const resetPosition = () => {
                itemWidth = getItemWidth();
                totalOriginalWidth = itemWidth * items.length;
                roller.scrollLeft = totalOriginalWidth;
            };

            setTimeout(resetPosition, 100);

            roller.addEventListener('scroll', () => {
                if (itemWidth === 0) resetPosition();

                if (roller.scrollLeft <= 0) {
                    roller.scrollLeft = totalOriginalWidth;
                } else if (roller.scrollLeft >= totalOriginalWidth * 2) {
                    roller.scrollLeft = totalOriginalWidth;
                }
            });

            if (leftBtn && rightBtn) {
                leftBtn.addEventListener('click', () => {
                    roller.scrollBy({ left: -itemWidth, behavior: 'smooth' });
                });

                rightBtn.addEventListener('click', () => {
                    roller.scrollBy({ left: itemWidth, behavior: 'smooth' });
                });
            }

            // Drag / Touch Events
            let isDown = false;
            let isMoving = false;
            let startX;
            let scrollLeft;

            const startDragging = (e) => {
                isDown = true;
                isMoving = true;
                roller.classList.add('active');
                startX = (e.pageX || e.touches[0].pageX) - roller.offsetLeft;
                scrollLeft = roller.scrollLeft;
                roller.style.scrollBehavior = 'auto';
            };

            const moveDragging = (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = (e.pageX || e.touches[0].pageX) - roller.offsetLeft;
                const walk = (x - startX) * 1.5;
                roller.scrollLeft = scrollLeft - walk;
            };

            const stopDragging = () => {
                if (!isDown) return;
                isDown = false;
                setTimeout(() => { isMoving = false; }, 50);
                roller.classList.remove('active');
                roller.style.scrollBehavior = 'smooth';
            };

            roller.addEventListener('mousedown', startDragging);
            roller.addEventListener('mousemove', moveDragging);
            roller.addEventListener('mouseup', stopDragging);
            roller.addEventListener('mouseleave', stopDragging);

            roller.addEventListener('touchstart', startDragging, { passive: false });
            roller.addEventListener('touchmove', moveDragging, { passive: false });
            roller.addEventListener('touchend', stopDragging);

            window.addEventListener('resize', resetPosition);
        });
    };

    initCarousel();

    // ✅ Google Sheets Form Integration + Success Pop-up
    const signupForm = document.querySelector('.signup-form');
    const formMessage = document.querySelector('.form-message');
    const submitBtn = signupForm ? signupForm.querySelector('.submit-btn') : null;
    const successPopup = document.getElementById('success-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQd2Rshz22eMn_C0qWVnpU1BXFpB61CS-pvvoyDheCvI5t46WkpwBalw1s3c9UnZwf/exec';

    if (signupForm && submitBtn && successPopup) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'ENVIANDO.';
            submitBtn.disabled = true;
            if (formMessage) formMessage.style.display = 'none';

            const formData = new FormData(signupForm);
            const params = new URLSearchParams();
            formData.forEach((value, key) => {
                params.append(key, value);
            });

            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    body: params.toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                successPopup.classList.add('show');
                signupForm.reset();

            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                if (formMessage) {
                    formMessage.textContent = '❌ Ocorreu um erro ao enviar. Por favor, tente novamente mais tarde.';
                    formMessage.style.color = '#77031d';
                    formMessage.style.display = 'block';
                }
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });

        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', () => {
                successPopup.classList.remove('show');
            });
        }

        successPopup.addEventListener('click', (e) => {
            if (e.target === successPopup) {
                successPopup.classList.remove('show');
            }
        });
    }

});
