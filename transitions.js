document.addEventListener('DOMContentLoaded', () => {
    // Create a fixed overlay that covers the page, then fades out on load (enter effect)
    const overlay = document.createElement('div');
    overlay.id = 'page-fade';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 9998;
        background: var(--bg-color);
        opacity: 1;
        pointer-events: none;
        transition: none;
    `;
    document.body.appendChild(overlay);

    // Fade in: let the page render one frame, then transition to transparent
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.style.transition = 'opacity 0.2s ease';
            overlay.style.opacity = '0';
            overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
        });
    });

    // Fade out on internal link clicks
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.target === '_blank') return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;

        link.addEventListener('click', e => {
            e.preventDefault();
            const exitOverlay = document.createElement('div');
            exitOverlay.style.cssText = `
                position: fixed;
                inset: 0;
                z-index: 9998;
                background: var(--bg-color);
                opacity: 0;
                pointer-events: all;
                transition: none;
            `;
            document.body.appendChild(exitOverlay);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    exitOverlay.style.transition = 'opacity 0.25s cubic-bezier(0.4, 0, 1, 1)';
                    exitOverlay.style.opacity = '1';
                    exitOverlay.addEventListener('transitionend', () => {
                        window.location = href;
                    }, { once: true });
                });
            });
        });
    });
});
