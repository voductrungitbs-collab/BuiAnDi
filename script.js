// Script xử lý tương tác trang tỏ tình
const startButton = document.getElementById('startButton');
const pageIntro = document.getElementById('pageIntro');
const pageStory = document.getElementById('pageStory');
const pageCelebrate = document.getElementById('pageCelebrate');
const bgMusic = document.getElementById('bgMusic');
const typingText = document.getElementById('typingText');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const canvas = document.getElementById('celebrateCanvas');
const ctx = canvas.getContext('2d');

// Nội dung tỏ tình sẽ được gõ chữ từng chữ một
const loveMessage = `Di à....\n\nTừ lúc gặp em, mỗi ngày đều trở nên vui hơn.\n\nAnh nghĩ là anh không chờ được nữa rồi.\n\nHôm nay a muốn tỏ tình với em.\n\Anh muốn dành tình cảm thật lòng của anh dành cho em. \n\nEm có đồng ý cùng anh viết tiếp câu chuyện này không?`;

// trạng thái tránh nút suy nghĩ
let avoidClicks = 0;
const maxAvoids = 5;

// Khởi tạo canvas fireworks
let fireworks = [];
let animationFrame;

function setCanvasSize() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function fadeToPage(fromPage, toPage) {
  fromPage.classList.remove('active');
  setTimeout(() => {
    toPage.classList.add('active');
  }, 350);
}

function typeMessage(text, target, speed = 40) {
  let index = 0;
  target.textContent = '';
  const interval = setInterval(() => {
    target.textContent += text.charAt(index);
    index += 1;
    if (index >= text.length) {
      clearInterval(interval);
    }
  }, speed);
}

function playBackgroundMusic() {
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {
    // Nếu người dùng ngăn âm thanh, không có lỗi nặng
  });
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createFirework() {
  const x = randomBetween(0.1, 0.9) * window.innerWidth;
  const y = randomBetween(0.1, 0.4) * window.innerHeight;
  const hue = randomBetween(280, 340);
  const particles = [];
  const count = 24;

  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count;
    particles.push({
      x,
      y,
      radius: randomBetween(1.8, 3.8),
      vx: Math.cos(angle) * randomBetween(1.4, 4.5),
      vy: Math.sin(angle) * randomBetween(1.4, 4.5),
      alpha: 1,
      decay: randomBetween(0.008, 0.016),
      hue,
      life: 1,
    });
  }

  fireworks.push({ particles });
}

function renderFireworks() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  fireworks = fireworks.filter(firework => {
    firework.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.06;
      particle.alpha -= particle.decay;
      particle.life -= particle.decay;
      const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 8);
      glow.addColorStop(0, `hsla(${particle.hue}, 96%, 78%, ${particle.alpha})`);
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `hsla(${particle.hue}, 92%, 72%, ${particle.alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    return firework.particles.some(p => p.alpha > 0.02);
  });
  animationFrame = requestAnimationFrame(renderFireworks);
}

function startCelebration() {
  pageStory.classList.remove('active');
  pageCelebrate.classList.add('active');
  document.body.style.background = 'radial-gradient(circle at top, #ffe7f8, transparent 20%), linear-gradient(180deg, #fff2f9 0%, #ffdde4 100%)';
  document.body.style.transition = 'background 1s ease';
  for (let i = 0; i < 18; i += 1) createFirework();
  cancelAnimationFrame(animationFrame);
  renderFireworks();
  setTimeout(() => {
    createFirework();
  }, 300);
  setTimeout(() => {
    createFirework();
  }, 650);
  showMemoryGallery();
}

const memories = [
  { src: 'memory1.jpg', caption: 'Lần đầu mình gặp nhau, hơi ngại nhưng mà cũng thích' },
  { src: 'memory2.jpg', caption: 'Kỷ niệm buổi hẹn đầu tiên' },
  { src: 'memory3.jpg', caption: 'Cùng nhau cười thật nhiều' },
  { src: 'memory4.jpg', caption: 'Đêm đèn lấp lánh bên nhau' },
  { src: 'memory5.jpg', caption: 'Chụp hình kỉ yếu chung nè' },
  { src: 'memory6.jpg', caption: 'Khoảnh khắc tay trong tay' },
  { src: 'memory7.jpg', caption: 'Lâu rồi mình vẫn nhớ' },
  { src: 'memory8.jpg', caption: 'Ảnh mình trêu nhau dễ thương' },
  { src: 'memory9.jpg', caption: 'Ẻm dựa vai anh nè' },
  { src: 'memory10.jpg', caption: 'Nhìn ẻm dễ thương quá, Anh Trung bị đơ ròi' },
  { src: 'memory11.jpg', caption: 'Hai đứa mình núp mưa nè' },
  { src: 'memory12.jpg', caption: 'Tự nhiên muốn giữ mãi' }
];

function showMemoryGallery() {
  const gallery = document.getElementById('memoryGallery');
  if (!gallery) return;
  gallery.innerHTML = '';
  memories.forEach((memory, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.style.animationDelay = `${index * 0.08}s`;
    card.style.setProperty('--rotate', `${randomBetween(-4, 4)}deg`);

    const image = document.createElement('img');
    image.src = memory.src;
    image.alt = memory.caption;

    const caption = document.createElement('span');
    caption.textContent = memory.caption;

    card.appendChild(image);
    card.appendChild(caption);
    gallery.appendChild(card);
  });
}

function moveNoButton() {
  if (avoidClicks >= maxAvoids) {
    noButton.style.transform = 'translate(0, 0)';
    return;
  }

  const offsetX = randomBetween(-85, 85);
  const offsetY = randomBetween(-40, 40);
  noButton.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  avoidClicks += 1;
}

startButton.addEventListener('click', () => {
  playBackgroundMusic();
  fadeToPage(pageIntro, pageStory);
  setTimeout(() => {
    typeMessage(loveMessage, typingText, 42);
  }, 350);
});

yesButton.addEventListener('click', () => {
  startCelebration();
});

noButton.addEventListener('mouseenter', moveNoButton);
noButton.addEventListener('click', moveNoButton);

window.addEventListener('resize', setCanvasSize);
window.addEventListener('load', () => {
  setCanvasSize();
});

// Kích hoạt hiệu ứng rung nhẹ sau khi chuyển sang trang celebration
pageCelebrate.addEventListener('transitionstart', () => {
  document.querySelector('.celebrate-content').animate([
    { transform: 'scale(0.95) rotate(0deg)' },
    { transform: 'scale(1.02) rotate(0.4deg)' },
    { transform: 'scale(1) rotate(0deg)' }
  ], {
    duration: 800,
    iterations: 1,
    easing: 'ease-out'
  });
});
