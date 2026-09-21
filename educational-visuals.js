/* Reusable, curriculum-focused visuals for the Study Buddy AI tutor. */
(() => {
  "use strict";

  const visuals = {
    "solar-system": {
      title: "Sistem Suria",
      keywords: ["sistem suria", "planet", "matahari", "solar system"],
      description: "Susunan planet dari Matahari. Saiz dan jarak tidak mengikut skala.",
      render: () => `
        <figure class="edu-visual" aria-labelledby="solar-title">
          <figcaption id="solar-title"><b>Sistem Suria</b><span>Susunan dari Matahari — saiz dan jarak tidak mengikut skala.</span></figcaption>
          <div class="solar-track">
            <div class="solar-object sun"><span>☀️</span><b>Matahari</b></div>
            ${[
              ["Utarid", "mercury"], ["Zuhrah", "venus"], ["Bumi", "earth"],
              ["Marikh", "mars"], ["Musytari", "jupiter"], ["Zuhal", "saturn"],
              ["Uranus", "uranus"], ["Neptun", "neptune"]
            ].map(([name, cls], index) => `<div class="solar-arrow" aria-hidden="true">→</div><div class="solar-object ${cls}"><span class="planet-dot" aria-hidden="true"></span><b>${index + 1}. ${name}</b></div>`).join("")}
          </div>
          <p class="visual-note">Planet bergerak mengelilingi Matahari pada orbit masing-masing.</p>
        </figure>`
    },
    "heat-sources": {
      title: "Sumber Haba",
      keywords: ["sumber haba", "haba", "panas", "heat source"],
      description: "Contoh benda yang menghasilkan atau memberikan haba.",
      render: () => `
        <figure class="edu-visual" aria-labelledby="heat-title">
          <figcaption id="heat-title"><b>Sumber Haba</b><span>Sumber haba menghasilkan atau memberikan haba.</span></figcaption>
          <div class="visual-card-grid">
            <div><span>☀️</span><b>Matahari</b><small>Memberikan haba kepada Bumi</small></div>
            <div><span>🔥</span><b>Api</b><small>Menghasilkan haba semasa pembakaran</small></div>
            <div><span>🍳</span><b>Dapur</b><small>Memberikan haba untuk memasak</small></div>
            <div><span>💡</span><b>Mentol menyala</b><small>Sebahagian tenaga menjadi haba</small></div>
          </div>
        </figure>`
    },
    "light-sources": {
      title: "Sumber Cahaya",
      keywords: ["sumber cahaya", "cahaya", "light source"],
      description: "Bezakan sumber cahaya dengan benda yang hanya memantulkan cahaya.",
      render: () => `
        <figure class="edu-visual" aria-labelledby="light-title">
          <figcaption id="light-title"><b>Sumber Cahaya</b><span>Sumber cahaya menghasilkan cahaya sendiri.</span></figcaption>
          <div class="compare-visual">
            <section><h4>Menghasilkan cahaya</h4><p>☀️ Matahari</p><p>🔥 Api</p><p>🔦 Lampu suluh</p></section>
            <section><h4>Memantulkan cahaya</h4><p>🌙 Bulan</p><p>🪞 Cermin</p><p>📖 Buku</p></section>
          </div>
        </figure>`
    },
    "basic-circuit": {
      title: "Litar Elektrik Asas",
      keywords: ["litar elektrik", "litar asas", "electric circuit", "bateri mentol suis"],
      description: "Litar lengkap membolehkan arus elektrik mengalir.",
      render: () => `
        <figure class="edu-visual" aria-labelledby="circuit-title">
          <figcaption id="circuit-title"><b>Litar Elektrik Asas</b><span>Litar mesti lengkap supaya mentol menyala.</span></figcaption>
          <svg class="diagram-svg" viewBox="0 0 720 270" role="img" aria-label="Litar lengkap dengan bateri, suis tertutup dan mentol">
            <path d="M130 70 H310 M410 70 H590 V205 H130 V70" fill="none" stroke="#184f57" stroke-width="8" stroke-linecap="round"/>
            <line x1="310" y1="70" x2="405" y2="70" stroke="#184f57" stroke-width="8"/>
            <circle cx="600" cy="137" r="45" fill="#fff5ba" stroke="#184f57" stroke-width="7"/>
            <path d="M580 117 L620 157 M620 117 L580 157" stroke="#d69d00" stroke-width="7"/>
            <line x1="600" y1="92" x2="600" y2="70" stroke="#184f57" stroke-width="8"/>
            <line x1="600" y1="182" x2="600" y2="205" stroke="#184f57" stroke-width="8"/>
            <line x1="130" y1="110" x2="130" y2="165" stroke="#184f57" stroke-width="8"/>
            <line x1="105" y1="120" x2="155" y2="120" stroke="#e05252" stroke-width="8"/>
            <line x1="115" y1="152" x2="145" y2="152" stroke="#184f57" stroke-width="8"/>
            <text x="78" y="225">Bateri</text><text x="322" y="45">Suis tertutup</text><text x="565" y="245">Mentol</text>
          </svg>
          <p class="visual-note">Bateri → wayar → suis tertutup → mentol → kembali ke bateri.</p>
        </figure>`
    },
    "plant-parts": {
      title: "Bahagian Tumbuhan",
      keywords: ["bahagian tumbuhan", "akar batang daun bunga", "plant parts"],
      description: "Bahagian asas tumbuhan dan fungsinya.",
      render: () => `
        <figure class="edu-visual" aria-labelledby="plant-title">
          <figcaption id="plant-title"><b>Bahagian Tumbuhan</b><span>Setiap bahagian mempunyai fungsi.</span></figcaption>
          <div class="plant-layout">
            <div class="plant-picture" aria-hidden="true"><span class="flower">🌼</span><span class="leaves">🍃</span><span class="stem"></span><span class="roots">╱╲╱╲</span></div>
            <ul>
              <li><b>Bunga</b> — membantu pembiakan.</li>
              <li><b>Daun</b> — membuat makanan melalui fotosintesis.</li>
              <li><b>Batang</b> — menyokong tumbuhan dan mengangkut air.</li>
              <li><b>Akar</b> — menyerap air dan memegang tumbuhan.</li>
            </ul>
          </div>
        </figure>`
    },
    "human-body": {
      title: "Organ Asas Manusia",
      keywords: ["badan manusia", "organ manusia", "jantung paru-paru perut", "human body"],
      description: "Kedudukan anggaran organ utama untuk pembelajaran asas.",
      render: () => `
        <figure class="edu-visual" aria-labelledby="body-title">
          <figcaption id="body-title"><b>Organ Asas Manusia</b><span>Kedudukan ini ialah gambaran ringkas.</span></figcaption>
          <div class="body-grid">
            <div><span>🧠</span><b>Otak</b><small>Mengawal badan dan pemikiran</small></div>
            <div><span>🫁</span><b>Peparu</b><small>Membantu pernafasan</small></div>
            <div><span>🫀</span><b>Jantung</b><small>Mengepam darah</small></div>
            <div><span>🥣</span><b>Perut</b><small>Membantu mencerna makanan</small></div>
          </div>
        </figure>`
    }
  };

  function match(query) {
    const normalized = String(query || "").toLowerCase();
    return Object.entries(visuals).find(([, item]) => item.keywords.some(keyword => normalized.includes(keyword)))?.[0] || null;
  }

  function render(id) {
    return visuals[id]?.render() || "";
  }

  window.StudyBuddyVisuals = {
    match,
    render,
    list: () => Object.entries(visuals).map(([id, item]) => ({ id, title: item.title, description: item.description }))
  };
})();
