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

      // If you blow hard enough
      if (volume > 80 && blownCount < 9) {
        const flame = flames[blownCount];
        flame.classList.add('extinguished');
        
        // Add smoke
        const smoke = document.createElement('div');
        smoke.classList.add('smoke');
        flame.parentElement.appendChild(smoke);
        
        blownCount++;
        
        if (blownCount === 9) {
          setTimeout(() => {
            document.getElementById('wishMessage').classList.add('show');
            document.querySelector('.cake').style.animation = 'none';
          }, 1500);
        }
      }
      requestAnimationFrame(detectBlow);
    }
    detectBlow();
  } catch (err) {
    alert("Please allow microphone access to blow out the candles! 🎤");
  }
}

// Start when page loads
window.onload = () => {
  setTimeout(startBlowingDetection, 2000);
};

// Optional: click on flame to blow it out (for phones without mic)
flames.forEach((flame, index) => {
  flame.addEventListener('click', () => {
    if (blownCount === index) {
      flame.classList.add('extinguished');
      blownCount++;
      if (blownCount === 9) {
        setTimeout(() => {
          document.getElementById('wishMessage').classList.add('show');
        }, 1000);
      }
    }
  });
});
