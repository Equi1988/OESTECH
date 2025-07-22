function toggleMenu() {
    const menu = document.querySelector('.menu');
    const overlay = document.querySelector('.overlay');
    menu.classList.toggle('open');
    overlay.classList.toggle('show');
}