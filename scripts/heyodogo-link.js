/* The heyodogo.com link under the icons: each letter hops when pointed at, like
   that site's own title. Restarting the animation needs a reflow in between. */
document.querySelectorAll('.heyodogo i').forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.classList.remove('hop');
        void el.offsetWidth;
        el.classList.add('hop');
    });
    el.addEventListener('animationend', () => el.classList.remove('hop'));
});
