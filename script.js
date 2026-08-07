// Année dynamique dans le footer
document.getElementById('year').textContent = new Date().getFullYear();

// =========================================================
// Séquence terminal — EDIT: personnalise les lignes ci-dessous
// =========================================================
const lines = [
  { text: '$ whoami', pause: 300 },
  { text: 'amael.lavaysse — chargé SSI & support N2, futur admin sys & réseaux', pause: 400 },
  { text: '', pause: 100 },
  { text: '$ cat parcours.txt', pause: 300 },
  { text: 'BTS SIO SISR (diplômé) -> Bac+4 Admin Sys & Réseaux, ENI School Niort (sept. 2026)', pause: 250 },
  { text: 'Alternance : Chargé SSI & Support N2 — Territoria Prévoyance', pause: 400 },
  { text: '', pause: 100 },
  { text: '$ ls skills/', pause: 300 },
  { text: 'windows.sh  linux.sh  python.sh n8n.sh  powershell.sh  active-directory/  virtualisation/', pause: 400 },
  { text: '', pause: 100 },
  { text: '$ status', pause: 300 },
  { text: '[OK] en poste — Bac+4 admin sys & réseaux, Niort, dès septembre 2026', pause: 0 },
];

const target = document.getElementById('typewriter');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const completedLines = [];

function render(partial) {
  target.textContent = completedLines.concat(partial).join('\n');
}

async function typeSequence() {
  if (reduceMotion) {
    target.textContent = lines.map(l => l.text).join('\n');
    return;
  }
  for (const line of lines) {
    await typeLine(line.text);
    completedLines.push(line.text);
    render('');
    if (line.pause) await sleep(line.pause);
  }
}

function typeLine(text) {
  return new Promise(resolve => {
    const speed = 18;
    let i = 0;
    function step() {
      render(text.slice(0, i));
      if (i <= text.length) {
        i++;
        setTimeout(step, speed);
      } else {
        resolve();
      }
    }
    step();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

typeSequence();
