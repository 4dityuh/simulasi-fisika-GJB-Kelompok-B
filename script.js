(() => {
  const $ = (id) => document.getElementById(id);
  const heightInput = $('heightInput');
  const gravityInput = $('gravityInput');
  const playButton = $('playButton');
  const playLabel = $('playLabel');
  const playIcon = $('playIcon');
  const resetButton = $('resetButton');
  const stepButton = $('stepButton');
  const timeSlider = $('timeSlider');
  const chartSelect = $('chartSelect');
  const themeToggle = $('themeToggle');
  const themeIcon = $('themeIcon');
  const themeLabel = $('themeLabel');
  const canvas = $('chartCanvas');
  const ctx = canvas.getContext('2d');

  let height = 20;
  let gravity = 9.8;
  let elapsed = 0;
  let running = false;
  let lastFrame = null;
  let animationId = null;
  let chartSize = { width: 0, height: 0 };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const fmt = (value, digits = 2) => value.toLocaleString('id-ID', {
    minimumFractionDigits: digits, maximumFractionDigits: digits
  });
  const totalTime = () => Math.sqrt((2 * height) / gravity);
  const finalVelocity = () => Math.sqrt(2 * gravity * height);

  function currentValues() {
    const t = Math.min(elapsed, totalTime());
    const distance = Math.min(height, 0.5 * gravity * t * t);
    return {
      t,
      distance,
      position: Math.max(0, height - distance),
      velocity: gravity * t,
      acceleration: gravity
    };
  }

  function setRunning(value) {
    running = value;
    playLabel.textContent = running ? 'Jeda simulasi' : (elapsed >= totalTime() ? 'Ulangi simulasi' : 'Mulai simulasi');
    playIcon.textContent = running ? 'Ⅱ' : '▶';
    $('statusText').textContent = running ? 'Berjalan' : (elapsed >= totalTime() ? 'Selesai' : (elapsed > 0 ? 'Dijeda' : 'Siap'));
    $('scene').classList.toggle('is-running', running);
    $('scene').parentElement.querySelector('.live-pill').classList.toggle('running', running);
    if (running) {
      lastFrame = null;
      animationId = requestAnimationFrame(animate);
    } else if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function updateScene(values) {
    const scene = $('scene');
    const ball = $('ball');
    const top = 24;
    const bottom = 31;
    const travel = Math.max(0, scene.clientHeight - top - bottom - ball.offsetHeight);
    const progress = height > 0 ? values.distance / height : 0;
    ball.style.top = `${top + travel * clamp(progress, 0, 1)}px`;
    $('heightLabel').textContent = `${fmt(height, 1)} m`;
  }

  function mathNumber(value, digits = 2) {
    // Keep Indonesian decimal commas visually correct inside mathematical notation.
    return fmt(value, digits).replace(',', '{,}');
  }

  function updateCalculations(values) {
    const t = values.t;
    $('timeFormula').innerHTML =
      `\\(t = \\sqrt{\\frac{2 \\times ${mathNumber(height)} }{${mathNumber(gravity)}}} = ${mathNumber(totalTime())}\\,\\text{s}\\)`;
    $('velocityFormula').innerHTML =
      `\\(v = \\sqrt{2 \\times ${mathNumber(gravity)} \\times ${mathNumber(height)}} = ${mathNumber(finalVelocity())}\\,\\text{m/s}\\)`;
    $('distanceFormula').innerHTML =
      `\\(s = \\frac{1}{2} \\times ${mathNumber(gravity)} \\times ${mathNumber(t)}^2 = ${mathNumber(values.distance)}\\,\\text{m}\\)`;
    $('positionFormula').innerHTML =
      `\\(h = ${mathNumber(height)} - \\frac{1}{2} \\times ${mathNumber(gravity)} \\times ${mathNumber(t)}^2 = ${mathNumber(values.position)}\\,\\text{m}\\)`;

    renderMath($('timeFormula'));
    renderMath($('velocityFormula'));
    renderMath($('distanceFormula'));
    renderMath($('positionFormula'));
  }

  function renderMath(element) {
    if (window.renderMathInElement && element) {
      window.renderMathInElement(element, {
        delimiters: [
          { left: '\\(', right: '\\)', display: false },
          { left: '$$', right: '$$', display: true }
        ],
        throwOnError: false
      });
    }
  }

  function updateReadouts() {
    const v = currentValues();
    $('positionValue').innerHTML = `${fmt(v.position)} <small>m</small>`;
    $('distanceValue').innerHTML = `${fmt(v.distance)} <small>m</small>`;
    $('velocityValue').innerHTML = `${fmt(v.velocity)} <small>m/s</small>`;
    $('accelerationValue').innerHTML = `${fmt(v.acceleration)} <small>m/s²</small>`;
    $('totalTimeValue').textContent = `${fmt(totalTime())} s`;
    $('finalVelocityValue').textContent = `${fmt(finalVelocity())} m/s`;
    $('timeReadout').textContent = `${fmt(v.t)} s`;
    $('totalTimeLabel').textContent = `${fmt(totalTime())} s (waktu jatuh)`;
    timeSlider.max = String(totalTime());
    timeSlider.value = String(v.t);
    updateScene(v);
    updateCalculations(v);
    drawChart();
  }

  function animate(timestamp) {
    if (!running) return;
    if (lastFrame === null) lastFrame = timestamp;
    const delta = Math.min((timestamp - lastFrame) / 1000, 0.05);
    lastFrame = timestamp;
    elapsed += delta;
    if (elapsed >= totalTime()) {
      elapsed = totalTime();
      updateReadouts();
      setRunning(false);
      return;
    }
    updateReadouts();
    animationId = requestAnimationFrame(animate);
  }

  function drawChart() {
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const width = rect.width;
    const heightPx = rect.height;
    ctx.clearRect(0, 0, width, heightPx);

    const type = chartSelect.value;
    const total = totalTime();
    const pad = { left: 48, right: 16, top: 16, bottom: 31 };
    const plotW = width - pad.left - pad.right;
    const plotH = heightPx - pad.top - pad.bottom;
    if (plotW <= 0 || plotH <= 0) return;

    let maxY, yLabel, valueAt;
    if (type === 'position') {
      maxY = height;
      yLabel = 'Ketinggian (m)';
      valueAt = t => Math.max(0, height - 0.5 * gravity * t * t);
      $('chartNote').textContent = 'Ketinggian berkurang secara kuadratik terhadap waktu.';
    } else if (type === 'velocity') {
      maxY = finalVelocity();
      yLabel = 'Kecepatan (m/s)';
      valueAt = t => gravity * t;
      $('chartNote').textContent = 'Kecepatan bertambah secara linear seiring waktu.';
    } else {
      maxY = gravity;
      yLabel = 'Percepatan (m/s²)';
      valueAt = () => gravity;
      $('chartNote').textContent = 'Percepatan bernilai konstan selama benda jatuh.';
    }
    maxY = maxY || 1;
    const niceMax = maxY * 1.08;
    const x = t => pad.left + (t / total) * plotW;
    const y = val => pad.top + plotH - (val / niceMax) * plotH;

    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const val = niceMax * i / 4;
      const yy = y(val);
      ctx.strokeStyle = '#e9edf4';
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.stroke();
      ctx.fillStyle = '#7d8798';
      ctx.textAlign = 'right';
      ctx.fillText(fmt(val, val < 10 ? 1 : 0), pad.left - 8, yy);
    }
    for (let i = 0; i <= 4; i++) {
      const t = total * i / 4;
      const xx = x(t);
      ctx.strokeStyle = '#f0f2f6';
      ctx.beginPath(); ctx.moveTo(xx, pad.top); ctx.lineTo(xx, pad.top + plotH); ctx.stroke();
      ctx.fillStyle = '#7d8798';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(fmt(t, 1), xx, pad.top + plotH + 8);
    }

    ctx.strokeStyle = '#3569e8';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const samples = 100;
    for (let i = 0; i <= samples; i++) {
      const t = total * i / samples;
      const xx = x(t);
      const yy = y(valueAt(t));
      if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
    }
    ctx.stroke();

    const now = currentValues();
    const currentX = x(now.t);
    const currentY = y(valueAt(now.t));
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#8da8e8';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(currentX, pad.top); ctx.lineTo(currentX, pad.top + plotH); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#2454c5';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(currentX, currentY, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#58657a';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.fillText(yLabel, pad.left, 10);
    ctx.textAlign = 'right';
    ctx.fillText('Waktu (s)', width - pad.right, heightPx - 3);
  }

  function applyParameters() {
    const h = Number(heightInput.value);
    const g = Number(gravityInput.value);
    if (!Number.isFinite(h) || h < 1 || h > 500) {
      heightInput.setCustomValidity('Masukkan ketinggian antara 1 hingga 500 meter.');
      heightInput.reportValidity();
      return false;
    }
    heightInput.setCustomValidity('');
    if (!Number.isFinite(g) || g < 0.1 || g > 30) {
      gravityInput.setCustomValidity('Masukkan gravitasi antara 0,1 hingga 30 m/s².');
      gravityInput.reportValidity();
      return false;
    }
    gravityInput.setCustomValidity('');
    height = h;
    gravity = g;
    elapsed = 0;
    setRunning(false);
    updateReadouts();
    return true;
  }

  playButton.addEventListener('click', () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (elapsed >= totalTime()) elapsed = 0;
    setRunning(true);
  });
  resetButton.addEventListener('click', () => {
    heightInput.value = '20';
    gravityInput.value = '9.8';
    height = 20; gravity = 9.8; elapsed = 0;
    setRunning(false);
    updateReadouts();
  });
  stepButton.addEventListener('click', () => {
    setRunning(false);
    elapsed = Math.min(totalTime(), elapsed + 0.1);
    updateReadouts();
  });
  timeSlider.addEventListener('input', () => {
    setRunning(false);
    elapsed = Number(timeSlider.value);
    updateReadouts();
  });
  heightInput.addEventListener('change', applyParameters);
  gravityInput.addEventListener('change', applyParameters);
  chartSelect.addEventListener('change', drawChart);
  themeToggle.addEventListener('click', () => {
    const dark = !document.body.classList.contains('dark');
    document.body.classList.toggle('dark', dark);
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
    themeIcon.textContent = dark ? '☀' : '☾';
    themeLabel.textContent = dark ? 'Mode terang' : 'Mode gelap';
    try { localStorage.setItem('gjb-theme', dark ? 'dark' : 'light'); } catch (_) {}
    drawChart();
  });
  try {
    const savedTheme = localStorage.getItem('gjb-theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.setAttribute('aria-label', 'Aktifkan mode terang');
      themeIcon.textContent = '☀';
      themeLabel.textContent = 'Mode terang';
    }
  } catch (_) {}
  window.addEventListener('resize', drawChart);

  updateReadouts();
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '\\(', right: '\\)', display: false },
        { left: '$$', right: '$$', display: true }
      ],
      throwOnError: false
    });
  }
})();
