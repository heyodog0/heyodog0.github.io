document.addEventListener('DOMContentLoaded', () => {
    const aboutLink = document.getElementById('about-link');
    const cvLink = document.getElementById('cv-link');
    const gameSection = document.getElementById('game-section');
    const bioPanel = document.getElementById('bio-panel');
    const cvPanel = document.getElementById('cv-panel');
    const swapContainer = document.querySelector('.swap-container');
    const contentEl = document.querySelector('.content');
    let currentView = 'game';

    swapContainer.style.height = gameSection.scrollHeight + 'px';

    function showPanel(view) {
        currentView = view;

        gameSection.style.opacity = '0';
        gameSection.style.pointerEvents = 'none';
        gameSection.style.display = '';
        bioPanel.style.opacity = '0';
        bioPanel.style.pointerEvents = 'none';
        cvPanel.classList.remove('active');
        cvPanel.style.opacity = '0';
        contentEl.classList.remove('view-cv');

        aboutLink.textContent = 'About';
        cvLink.textContent = 'CV';

        if (view === 'game') {
            gameSection.style.opacity = '1';
            gameSection.style.pointerEvents = 'auto';
            swapContainer.style.height = gameSection.scrollHeight + 'px';
        } else if (view === 'about') {
            aboutLink.textContent = 'Back';
            bioPanel.style.opacity = '1';
            bioPanel.style.pointerEvents = 'auto';
            requestAnimationFrame(() => {
                swapContainer.style.height = bioPanel.scrollHeight + 'px';
            });
        } else if (view === 'cv') {
            cvLink.textContent = 'Back';
            gameSection.style.display = 'none';
            swapContainer.style.height = 'auto';
            cvPanel.classList.add('active');
            contentEl.classList.add('view-cv');
            requestAnimationFrame(() => {
                cvPanel.style.opacity = '1';
            });
        }
    }

    aboutLink.addEventListener('click', e => {
        e.preventDefault();
        showPanel(currentView === 'about' ? 'game' : 'about');
    });

    cvLink.addEventListener('click', e => {
        e.preventDefault();
        showPanel(currentView === 'cv' ? 'game' : 'cv');
    });

    window.addEventListener('pageshow', e => {
        if (e.persisted) showPanel('game');
    });
});
