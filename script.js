const flames = document.querySelectorAll('.flame');
let blown = 0;

// Simple function to blow out the next flame
function blowOutNext() {
  if (blown >= 3) return;
  
  const currentFlame = flames[blown];
  currentFlame.classList.add('extinguished');
  
  // Add smoke
  const smoke = document.createElement('div');
  smoke.classList.add('smoke');
  currentFlame.parentElement.appendChild(smoke);
  
  blown++;
  
  console.log('Flame blown:', blown); // Debug - ignore this
  
  if (blown === 3) {
    console.log('All blown - showing message!'); // Debug
    setTimeout(() => {
      const message = document.getElementById('wishMessage');
      if (message) {
        message.classList.add('show');
        message.style.display = 'block'; // Force show
      }
      const toilet = document.querySelector('.toilet');
      if (toilet) {
        toilet.style.animationPlayState = 'paused';
      }
    }, 1500);
  }
}

// Mic detection (simplified, one request only)
async function initMic() {
  if (!navigator.mediaDevices || blown >= 3) return;
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    
    const checkBlow = () => {
      if (blown >= 3) return;
      analyser.getByteFrequencyData(data);
      const volume = data.reduce((a, b) => a + b) / data.length;
      
      if (volume > 100) { // Higher threshold for real blows
        blowOutNext();
      }
      requestAnimationFrame(checkBlow);
    };
    checkBlow();
    console.log('Mic working'); // Debug
  } catch (e) {
    console.log('Mic failed - use taps'); // Debug
  }
}

// Load everything
window.addEventListener('load', () => {
  console.log('Page loaded, starting...'); // Debug
  setTimeout(initMic, 1000);
  
  // Tap support (works on phone/desktop)
  flames.forEach((flame, index) => {
    flame.addEventListener('click', (e) => {
      e.preventDefault();
      if (blown === index) {
        blowOutNext();
      }
    });
    flame.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (blown === index) {
        blowOutNext();
      }
    });
  });
});
