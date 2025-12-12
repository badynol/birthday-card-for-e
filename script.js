const flames = document.querySelectorAll('.flame');
let blown = 0;
let micAllowed = false;

// Один-единственный запрос микрофона
async function initMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micAllowed = true;

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const checkBlow = () => {
      if (blown >= 3) return;
      analyser.getByteFrequencyData(data);
      const volume = data.reduce((a,b) => a+b) / data.length;

      if (volume > 95) {           // чуть поднял порог, чтобы не срабатывало от шума
        blowOutNext();
      }
      requestAnimationFrame(checkBlow);
    };
    checkBlow();

  } catch (e) {
    micAllowed = false;
    console.log("Микрофон заблокирован — будет работать только тап");
  }
}

// Зажечь следующую свечу
function blowOutNext() {
  if (blown >= 3) return;

  flames[blown].classList.add('extinguished');

  // дым
  const smoke = document.createElement('div');
  smoke.classList.add('smoke');
  flames[blown].parentElement.appendChild(smoke);

  blown++;

  if (blown === 3) {
    setTimeout(() => {
      document.getElementById('wishMessage').classList.add('show');
      document.querySelector('.toilet').style.animationPlayState = 'paused';
    }, 1800);
  }
}

// Запуск при загрузке страницы
window.addEventListener('load', () => {
  setTimeout(initMic, 1000);

  // Тап по пламени (работает даже без микрофона)
  flames.forEach((flame, i) => {
    flame.addEventListener('click', () => {
      if (blown === i) blowOutNext();
    });
    flame.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (blown === i) blowOutNext();
    });
  });
});
