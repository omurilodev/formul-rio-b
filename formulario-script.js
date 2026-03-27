// ==========================================
// CONFIGURAÇÃO INICIAL
// ==========================================

let currentStep = 1;
const totalSteps = 6;

// Elementos do DOM
const slides = document.querySelectorAll('.form-slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const progressFill = document.getElementById('progressFill');
const currentStepEl = document.getElementById('currentStep');
const successMessage = document.getElementById('successMessage');
const form = document.getElementById('sliderForm');

// ==========================================
// CURSOR CUSTOMIZADO
// ==========================================

const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

document.addEventListener('mousemove', (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  cursorRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});

// Efeito hover em elementos interativos
const interactiveElements = document.querySelectorAll('button, input, select, textarea, .radio-option');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '16px';
    cursor.style.height = '16px';
    cursorRing.style.width = '50px';
    cursorRing.style.height = '50px';
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorRing.style.width = '36px';
    cursorRing.style.height = '36px';
  });
});

// ==========================================
// NAVEGAÇÃO DO FORMULÁRIO
// ==========================================

function updateProgress() {
  const progress = (currentStep / totalSteps) * 100;
  progressFill.style.width = `${progress}%`;
  currentStepEl.textContent = currentStep;
}

function validateCurrentSlide() {
  const currentSlide = document.querySelector(`.form-slide[data-step="${currentStep}"]`);
  const inputs = currentSlide.querySelectorAll('input[required], select[required], textarea[required]');
  
  let isValid = true;
  
  inputs.forEach(input => {
    if (input.type === 'radio') {
      const radioGroup = currentSlide.querySelectorAll(`input[name="${input.name}"]`);
      const isChecked = Array.from(radioGroup).some(radio => radio.checked);
      if (!isChecked) {
        isValid = false;
      }
    } else if (input.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value)) {
        isValid = false;
        input.style.borderColor = '#d63031';
      } else {
        input.style.borderColor = 'transparent';
      }
    } else {
      if (input.value.trim() === '') {
        isValid = false;
        input.style.borderColor = '#d63031';
      } else {
        input.style.borderColor = 'transparent';
      }
    }
  });
  
  return isValid;
}

function showSlide(step) {
  slides.forEach(slide => {
    const slideStep = parseInt(slide.getAttribute('data-step'));
    
    if (slideStep === step) {
      slide.classList.add('active');
      slide.classList.remove('exit-left');
    } else if (slideStep < step) {
      slide.classList.remove('active');
      slide.classList.add('exit-left');
    } else {
      slide.classList.remove('active', 'exit-left');
    }
  });
  
  // Atualizar botões
  prevBtn.disabled = step === 1;
  
  if (step === totalSteps) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'block';
  } else {
    nextBtn.style.display = 'block';
    submitBtn.style.display = 'none';
  }
  
  updateProgress();
}

// Evento: Botão "Próximo"
nextBtn.addEventListener('click', () => {
  if (validateCurrentSlide()) {
    if (currentStep < totalSteps) {
      currentStep++;
      showSlide(currentStep);
    }
  } else {
    // Shake animation para indicar erro
    const currentSlide = document.querySelector(`.form-slide[data-step="${currentStep}"]`);
    currentSlide.style.animation = 'shake 0.5s';
    setTimeout(() => {
      currentSlide.style.animation = '';
    }, 500);
  }
});

// Evento: Botão "Anterior"
prevBtn.addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    showSlide(currentStep);
  }
});

// Evento: Botão "Enviar"
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  if (validateCurrentSlide()) {
    // Coletar dados do formulário
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    console.log('Dados do formulário:', data);
    
    // Aqui você pode enviar os dados para o servidor
    // Exemplo usando fetch:
    /*
    fetch('/api/formulario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
      console.log('Sucesso:', result);
      showSuccessMessage();
    })
    .catch(error => {
      console.error('Erro:', error);
    });
    */
    
    // Por enquanto, apenas mostrar mensagem de sucesso
    showSuccessMessage();
  }
});

function showSuccessMessage() {
  successMessage.classList.add('show');
  
  // Opcional: Redirecionar após alguns segundos
  // setTimeout(() => {
  //   window.location.href = '/obrigado';
  // }, 3000);
}

// ==========================================
// NAVEGAÇÃO POR TECLADO
// ==========================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && currentStep < totalSteps) {
    e.preventDefault();
    nextBtn.click();
  }
  
  if (e.key === 'Enter' && currentStep === totalSteps) {
    e.preventDefault();
    submitBtn.click();
  }
});

// ==========================================
// ANIMAÇÃO DE SHAKE (para validação)
// ==========================================

const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
    20%, 40%, 60%, 80% { transform: translateX(8px); }
  }
`;
document.head.appendChild(style);

// ==========================================
// MÁSCARA DE TELEFONE (opcional)
// ==========================================

const telefoneInput = document.querySelector('input[name="telefone"]');

if (telefoneInput) {
  telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value.replace(/(\d{0,2})/, '($1');
      } else if (value.length <= 6) {
        value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
      } else if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
    }
    
    e.target.value = value;
  });
}

// ==========================================
// AUTO-FOCUS NO PRIMEIRO CAMPO
// ==========================================

window.addEventListener('load', () => {
  const firstInput = document.querySelector('.form-slide.active input, .form-slide.active select');
  if (firstInput) {
    setTimeout(() => {
      firstInput.focus();
    }, 300);
  }
});

// ==========================================
// FOCUS NO CAMPO AO MUDAR DE SLIDE
// ==========================================

const observer = new MutationObserver(() => {
  const activeSlide = document.querySelector('.form-slide.active');
  if (activeSlide) {
    const firstInput = activeSlide.querySelector('input, select, textarea');
    if (firstInput) {
      setTimeout(() => {
        firstInput.focus();
      }, 100);
    }
  }
});

slides.forEach(slide => {
  observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
});

// Inicialização
showSlide(currentStep);
