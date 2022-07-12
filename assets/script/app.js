'use strict'

console.info('Source: https://github.com/disktree/stritter.audio');

const THEME = {
    bg: "black",
    fg: "white",
};

window.addEventListener('load', _ => {
    const style = window.getComputedStyle(document.querySelector(':root'));
    THEME.bg = style.getPropertyValue('--bg');
    THEME.fg = style.getPropertyValue('--fg');
});

