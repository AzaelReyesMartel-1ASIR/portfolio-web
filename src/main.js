document.addEventListener('DOMContentLoaded', () => {
    /* Mouse Glow */
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth * 100;
        const y = e.clientY / window.innerHeight * 100;
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });

    /* Theme Toggle */
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    };

    // Dark mode by default
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme || 'dark');

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    /* Mobile Menu */
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            mainNav.classList.remove('active');
        }
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });
    });

    /* Section Highlight */
    const highlightSection = (section) => {
        section.classList.add('highlight-pulse');
        setTimeout(() => {
            section.classList.remove('highlight-pulse');
        }, 2000);
    };

    /* Intersection Observer */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#main-nav a');
    
    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSection = entry.target;
                navLinks.forEach(link => {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('href') === `#${currentSection.id}`) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));

    /* Universal Target Highlight */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                                if(!this.classList.contains('skip-link')) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                
                target.classList.remove('highlight-active');
                void target.offsetWidth; 
                target.classList.add('highlight-active');
                
                setTimeout(() => target.classList.remove('highlight-active'), 1500);
            }
        });
    });

    /* Back to Top */
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});