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
        const words = ["PROPÓSITO", "MISSÃO", "VALORES"];
        let wordIndex = 0;

        // The CSS animation is 2s alternate. 
        // 0->100% (2s), 100%->0% (2s). Total cycle 4s.
        // We switch text when fully erased (every 4s).

        setInterval(() => {
            wordIndex = (wordIndex + 1) % words.length;
            const newWord = words[wordIndex];

            // Update Text
            typingElement.textContent = newWord;
            typingElement.setAttribute('data-text', newWord);

            // Optional: Adjust steps based on length to be perfect
            // But steps(10) in CSS is usually 'good enough' for 6-9 chars.

        }, 4000); // Syncs with 2s alternate animation * 2
    }

});
