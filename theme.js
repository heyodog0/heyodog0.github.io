function createThemeToggle() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle dark mode');

    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>`;

    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkInitially = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

    if (isDarkInitially) {
        document.documentElement.classList.add('dark-mode');
    }
    button.innerHTML = isDarkInitially ? sunIcon : moonIcon;

    let animating = false;

    function finishAnimation() {
        document.documentElement.classList.remove('no-transitions');
        animating = false;
    }

    function toggleTheme() {
        if (animating) return;
        animating = true;

        const isDark = document.documentElement.classList.contains('dark-mode');
        const willBeDark = !isDark;

        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Remove page-fade overlay if still animating, so it can't bleed through
        const pageFade = document.getElementById('page-fade');
        if (pageFade) pageFade.remove();

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: ${willBeDark ? '#1a1a1a' : '#ffffff'};
            clip-path: circle(0px at ${x}px ${y}px);
            pointer-events: none;
            transition: none;
        `;
        document.body.appendChild(overlay);

        // Force reflow before animating
        overlay.getBoundingClientRect();

        overlay.style.transition = 'clip-path 0.8s cubic-bezier(0.9, 0, 1, 1)';
        overlay.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;

        // Fallback in case transitionend never fires
        const fallback = setTimeout(() => {
            overlay.remove();
            finishAnimation();
        }, 1200);

        overlay.addEventListener('transitionend', () => {
            clearTimeout(fallback);

            // Freeze all transitions so the page snaps instantly to the new theme
            document.documentElement.classList.add('no-transitions');
            document.documentElement.classList.toggle('dark-mode');
            button.innerHTML = willBeDark ? sunIcon : moonIcon;
            localStorage.setItem('theme', willBeDark ? 'dark' : 'light');

            // Remove overlay — page is already correct underneath, no fade needed
            overlay.remove();

            // Restore transitions next frame once the snap has painted
            requestAnimationFrame(() => {
                requestAnimationFrame(finishAnimation);
            });
        }, { once: true });
    }

    button.addEventListener('click', toggleTheme);
    document.body.appendChild(button);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.add('dark-mode');
                button.innerHTML = sunIcon;
            } else {
                document.documentElement.classList.remove('dark-mode');
                button.innerHTML = moonIcon;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', createThemeToggle);
