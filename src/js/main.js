console.log("main.js loaded");

// Инициализация карусели отзывов
document.addEventListener('DOMContentLoaded', function() {
  const testimonialsCarousel = document.getElementById('testimonialsCarousel');
  if (testimonialsCarousel) {
    const carousel = new bootstrap.Carousel(testimonialsCarousel, {
      interval: 4000, // Интервал автопрокрутки (4 секунды)
      wrap: true,     // Зацикливание
      keyboard: false // Отключить управление с клавиатуры
    });
  }
});
