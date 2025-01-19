function createThemeToggle() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.innerHTML = '🌙'; // Default to moon icon

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark-mode');
        button.innerHTML = '☀️'; // Switch to sun icon
    }

    // Toggle theme function
    function toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark-mode');
        button.innerHTML = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    button.addEventListener('click', toggleTheme);
    document.body.appendChild(button);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { // Only if user hasn't manually set theme
            if (e.matches) {
                document.documentElement.classList.add('dark-mode');
                button.innerHTML = '☀️';
            } else {
                document.documentElement.classList.remove('dark-mode');
                button.innerHTML = '🌙';
            }
        }
    });
}

// Create toggle button when DOM is loaded
document.addEventListener('DOMContentLoaded', createThemeToggle);