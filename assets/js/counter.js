// Increment and display visit count
if (!localStorage.getItem('intuch_visits')) {
    localStorage.setItem('intuch_visits', '0');
}
document.getElementById('count').textContent = localStorage.getItem('intuch_visits');

document.addEventListener('click', () => {
    let count = parseInt(localStorage.getItem('intuch_visits') || '0');
    count++;
    localStorage.setItem('intuch_visits', count.toString());
    document.getElementById('count').textContent = count;
}, { once: true });