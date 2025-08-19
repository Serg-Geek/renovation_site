console.log("main.js loaded");

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  
  // Инициализация анимаций для секции контактов
  initContactAnimations();
  
  // Инициализация формы контактов
  initContactForm();
  
  // Инициализация анимаций для секции услуг
  initServicesAnimations();
  
  // Инициализация отзывов
  initTestimonials();
  
  // Инициализация масок для телефонов
  initPhoneMasks();
  
  // Инициализация SimpleLightbox для портфолио
  initSimpleLightbox();
});

// Анимации для секции контактов
function initContactAnimations() {
  const contactItems = document.querySelectorAll('.contact-item');
  const contactForm = document.querySelector('.contact-form-wrapper');
  
  // Анимация появления элементов при скролле
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, observerOptions);
  
  // Наблюдаем за контактными элементами
  contactItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
  
  // Наблюдаем за формой
  if (contactForm) {
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateY(30px)';
    contactForm.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(contactForm);
  }
  
  // Убираем эффект параллакса, который может вызывать проблемы с позиционированием
  // window.addEventListener('scroll', () => {
  //   const scrolled = window.pageYOffset;
  //   const contactsSection = document.querySelector('.contacts-section');
  //   
  //   if (contactsSection) {
  //     const rect = contactsSection.getBoundingClientRect();
  //     if (rect.top < window.innerHeight && rect.bottom > 0) {
  //       const parallax = scrolled * 0.1;
  //       contactsSection.style.transform = `translateY(${parallax}px)`;
  //     }
  //   }
  // });
}

// Инициализация формы контактов
function initContactForm() {
  const form = document.getElementById('form');
  if (!form) return;
  
  // Валидация в реальном времени
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
  });
  
  // Обработка отправки формы
  form.addEventListener('submit', handleFormSubmit);
  
  // Анимация кнопки при фокусе на полях
  const submitBtn = form.querySelector('button[type="submit"]');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      submitBtn.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
      submitBtn.style.transform = 'scale(1)';
    });
  });
}

// Валидация поля
function validateField(event) {
  const field = event.target;
  const value = field.value.trim();
  const fieldName = field.name;
  
  // Удаляем предыдущие ошибки
  clearFieldError(event);
  
  let isValid = true;
  let errorMessage = '';
  
  switch (fieldName) {
    case 'name':
      if (value.length < 2) {
        isValid = false;
        errorMessage = 'Имя должно содержать минимум 2 символа';
      }
      break;
      
    case 'phone':
      const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Введите корректный номер телефона';
      }
      break;
      
    case 'message':
      if (value.length < 10) {
        isValid = false;
        errorMessage = 'Сообщение должно содержать минимум 10 символов';
      }
      break;
  }
  
  if (!isValid) {
    showFieldError(field, errorMessage);
  }
  
  return isValid;
}

// Показать ошибку поля
function showFieldError(field, message) {
  field.classList.add('is-invalid');
  
  // Создаем элемент с ошибкой
  const errorDiv = document.createElement('div');
  errorDiv.className = 'invalid-feedback';
  errorDiv.textContent = message;
  
  // Добавляем после поля
  field.parentNode.appendChild(errorDiv);
  
  // Анимация появления ошибки
  errorDiv.style.opacity = '0';
  errorDiv.style.transform = 'translateY(-10px)';
  
  setTimeout(() => {
    errorDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    errorDiv.style.opacity = '1';
    errorDiv.style.transform = 'translateY(0)';
  }, 10);
}

// Очистить ошибку поля
function clearFieldError(event) {
  const field = event.target;
  field.classList.remove('is-invalid');
  
  const errorDiv = field.parentNode.querySelector('.invalid-feedback');
  if (errorDiv) {
    errorDiv.style.opacity = '0';
    errorDiv.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      errorDiv.remove();
    }, 300);
  }
}

// Обработка отправки формы
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const inputs = form.querySelectorAll('input, textarea');
  let isValid = true;
  
  // Валидируем все поля
  inputs.forEach(input => {
    if (!validateField({ target: input })) {
      isValid = false;
    }
  });
  
  if (!isValid) {
    // Показываем общую ошибку
    showFormError('Пожалуйста, исправьте ошибки в форме');
    return;
  }
  
  // Анимация отправки
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Отправляем...';
  submitBtn.disabled = true;
  
  // Имитация отправки (замените на реальную отправку)
  setTimeout(() => {
    showFormSuccess('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в течение 30 минут.');
    form.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

// Показать ошибку формы
function showFormError(message) {
  const form = document.getElementById('form');
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-danger mt-3';
  alertDiv.innerHTML = `<i class="bi bi-exclamation-triangle"></i> ${message}`;
  
  form.appendChild(alertDiv);
  
  // Анимация появления
  alertDiv.style.opacity = '0';
  alertDiv.style.transform = 'translateY(-10px)';
  
  setTimeout(() => {
    alertDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    alertDiv.style.opacity = '1';
    alertDiv.style.transform = 'translateY(0)';
  }, 10);
  
  // Автоматическое удаление через 5 секунд
  setTimeout(() => {
    alertDiv.style.opacity = '0';
    alertDiv.style.transform = 'translateY(-10px)';
    setTimeout(() => alertDiv.remove(), 300);
  }, 5000);
}

// Показать успешную отправку
function showFormSuccess(message) {
  const form = document.getElementById('form');
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success mt-3';
  alertDiv.innerHTML = `<i class="bi bi-check-circle"></i> ${message}`;
  
  form.appendChild(alertDiv);
  
  // Анимация появления
  alertDiv.style.opacity = '0';
  alertDiv.style.transform = 'translateY(-10px)';
  
  setTimeout(() => {
    alertDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    alertDiv.style.opacity = '1';
    alertDiv.style.transform = 'translateY(0)';
  }, 10);
  
  // Автоматическое удаление через 8 секунд
  setTimeout(() => {
    alertDiv.style.opacity = '0';
    alertDiv.style.transform = 'translateY(-10px)';
    setTimeout(() => alertDiv.remove(), 300);
  }, 8000);
}

// Анимации для секции услуг
function initServicesAnimations() {
  const serviceItems = document.querySelectorAll('.service-item');
  
  // Анимация появления элементов при скролле
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, index * 150); // Задержка для каскадного эффекта
      }
    });
  }, observerOptions);
  
  // Наблюдаем за карточками услуг
  serviceItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px) scale(0.95)';
    item.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(item);
  });
  
  // Добавляем эффект "волны" при клике
  serviceItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Создаем эффект волны
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Инициализация отзывов
function initTestimonials() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const indicators = document.querySelectorAll('.testimonials-indicators .indicator');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  // Проверяем, что элементы найдены
  if (testimonialCards.length === 0) {
    console.log('Testimonial cards not found');
    return;
  }
  
  console.log('Found testimonial cards:', testimonialCards.length);
  console.log('Found indicators:', indicators.length);
  console.log('Found prev button:', !!prevBtn);
  console.log('Found next button:', !!nextBtn);
  
  let currentIndex = 0;
  let isAnimating = false;
  
  // Функция для показа отзыва
  function showTestimonial(index) {
    if (isAnimating) return;
    isAnimating = true;
    
    // Определяем направление анимации
    const direction = index > currentIndex ? 1 : -1;
    
    // Убираем активный класс со всех карточек и индикаторов
    testimonialCards.forEach(card => {
      card.classList.remove('active');
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Анимация исчезновения текущей карточки
    if (testimonialCards[currentIndex]) {
      testimonialCards[currentIndex].style.opacity = '0';
      testimonialCards[currentIndex].style.transform = `translateX(${-50 * direction}px) scale(0.9)`;
    }
    
    // Подготавливаем новую карточку
    testimonialCards[index].style.opacity = '0';
    testimonialCards[index].style.transform = `translateX(${50 * direction}px) scale(0.9)`;
    
    // Добавляем активный класс к новой карточке и индикатору
    testimonialCards[index].classList.add('active');
    indicators[index].classList.add('active');
    
    // Анимация появления новой карточки
    setTimeout(() => {
      testimonialCards[index].style.opacity = '1';
      testimonialCards[index].style.transform = 'translateX(0) scale(1)';
      
      setTimeout(() => {
        isAnimating = false;
      }, 600);
    }, 100);
    
    currentIndex = index;
  }
  
  // Обработчики для кнопок навигации
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const newIndex = currentIndex > 0 ? currentIndex - 1 : testimonialCards.length - 1;
      showTestimonial(newIndex);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const newIndex = currentIndex < testimonialCards.length - 1 ? currentIndex + 1 : 0;
      showTestimonial(newIndex);
    });
  }
  
  // Обработчики для индикаторов
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      if (index !== currentIndex) {
        showTestimonial(index);
      }
    });
  });
  
  // Автоматическое переключение каждые 5 секунд
  let autoPlayInterval = setInterval(() => {
    const newIndex = currentIndex < testimonialCards.length - 1 ? currentIndex + 1 : 0;
    showTestimonial(newIndex);
  }, 5000);
  
  // Останавливаем автопереключение при наведении
  const testimonialsContainer = document.querySelector('.testimonials-container');
  if (testimonialsContainer) {
    testimonialsContainer.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
    
    testimonialsContainer.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(() => {
        const newIndex = currentIndex < testimonialCards.length - 1 ? currentIndex + 1 : 0;
        showTestimonial(newIndex);
      }, 5000);
    });
  }
  
  // Анимация появления при скролле
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const testimonialsSection = entry.target;
        testimonialsSection.style.opacity = '0';
        testimonialsSection.style.transform = 'translateY(30px)';
        testimonialsSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
          testimonialsSection.style.opacity = '1';
          testimonialsSection.style.transform = 'translateY(0)';
        }, 200);
        
        observer.unobserve(testimonialsSection);
      }
    });
  }, observerOptions);
  
  const testimonialsSection = document.querySelector('.testimonials-section');
  if (testimonialsSection) {
    observer.observe(testimonialsSection);
  }
}

// Инициализация масок для телефонов
function initPhoneMasks() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    IMask(input, {
      mask: '+{7} (000) 000-00-00'
    });
  });
}

// Инициализация SimpleLightbox для портфолио
function initSimpleLightbox() {
  document.addEventListener('DOMContentLoaded', function() {
    new SimpleLightbox('#portfolio-gallery .portfolio-link', {
      captions: true,
      captionSelector: 'img',
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      animationSpeed: 250,
      fadeSpeed: 300,
      overlayOpacity: 0.9,
      showCounter: true,
      swipeClose: true,
      closeOnOverlayClick: true,
      closeOnEscape: true
    });
  });
}
