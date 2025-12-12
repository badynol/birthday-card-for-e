const flames = document.querySelectorAll('.flame');
let blownCount = 0;

async function startBlowingDetection() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      if (volume > 78 && blownCount < 9) {
        const flame = flames[blownCount];
        flame.classList.add('extinguished');
        
        const smoke = document.createElement('div');
        smoke.classList.add('smoke');
        flame.parentElement.appendChild(smoke);
        
        blownCount++;

        if (blownCount === 9) {
          setTimeout(() => {
            document.getElementById('wishMessage').classList.add('show');
            document.getElementById('poopCake').style.animation = 'none';
          }, 1800);
        }
      }
      requestAnimationFrame(detectBlow);
    }
    detectBlow();
  } catch (err) {
    alert("Mic access needed to blow out the candles! Otherwise just tap them 😄");
  }
}

window.onload = () => setTimeout(startBlowingDetection, 1500);

// Tap fallback for phones
flames.forEach((flame, i) => {
  flame.addEventListener('click', () => {
    if (blownCount === i) {
      flame.classList.add('extinguished');
      blownCount++;
      if (blownCount === 9) {
        setTimeout(() => document.getElementById('wishMessage').classList.add('show'), 1200);
      }
    }
  });
});
