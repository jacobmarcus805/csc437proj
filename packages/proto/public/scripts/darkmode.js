// Relay the checkbox's change event as a custom darkmode:toggle event
const label = document.querySelector('label.theme-toggle');

label.onchange = (event) => {
    event.stopPropagation();

    document.body.dispatchEvent(new CustomEvent('darkmode:toggle', {
        bubbles: true,
        detail: { checked: event.target.checked }
    }));
};

// Listen for the custom event on the body and toggle the light-mode class
document.body.addEventListener('darkmode:toggle', (event) => {
    document.body.classList.toggle('light-mode', event.detail.checked);
});
