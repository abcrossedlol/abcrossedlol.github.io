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
  { text: 'windows.sh  linux.sh  python.sh  n8n.sh  powershell.sh  active-directory/  virtualisation/', pause: 400 },
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

// =========================================================
// Navigation par commandes façon terminal Linux
// EDIT : ajoute une ligne dans `fs` si tu ajoutes une section
// =========================================================
const fs = {
  about:      { id: 'about',      type: 'dir',  label: 'about' },
  experience: { id: 'experience', type: 'dir',  label: 'experience' },
  projets:    { id: 'projects',   type: 'dir',  label: 'projets' },
  thm:        { id: 'thm',        type: 'dir',  label: 'thm' },
  contact:    { id: 'contact',    type: 'dir',  label: 'contact' },
  cv:         { id: 'cv',         type: 'file', label: 'cv.pdf' },
};
const alias = { whoami: 'about', parcours: 'experience', projects: 'projets', tryhackme: 'thm' };

const cmdInput = document.getElementById('cmdInput');
const cmdOutput = document.getElementById('cmdOutput');

function printLine(text, cls) {
  const p = document.createElement('p');
  if (cls) p.className = cls;
  p.textContent = text;
  cmdOutput.appendChild(p);
  cmdOutput.scrollTop = cmdOutput.scrollHeight;
}

function resolve(name) {
  const key = alias[name] || name;
  return fs[key] || null;
}

function goTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function runCommand(raw) {
  const input = raw.trim();
  if (!input) return;
  printLine('$ ' + input);

  const [cmdRaw, ...args] = input.split(/\s+/);
  const cmd = cmdRaw.toLowerCase();
  const arg = (args[0] || '').toLowerCase().replace(/^\/+/, '').replace(/\/$/, '');

  if (cmd === 'help') {
    printLine('Commandes : ls, cd <dossier>, cat <fichier>, clear');
    printLine('Essaie : cd projets, cat cv');
    return;
  }

  if (cmd === 'clear') {
    cmdOutput.textContent = '';
    return;
  }

  if (cmd === 'ls') {
    const listing = Object.values(fs)
      .map(e => e.type === 'dir' ? e.label + '/' : e.label)
      .join('  ');
    printLine(listing);
    return;
  }

  if (cmd === 'cd') {
    if (!arg || arg === '..' || arg === '/' || arg === '~') {
      goTo('top');
      return;
    }
    const entry = resolve(arg);
    if (!entry) {
      printLine(`bash: cd: ${arg}: dossier introuvable`, 'cmdbar__error');
    } else if (entry.type === 'file') {
      printLine(`bash: cd: ${entry.label}: n'est pas un dossier (essaie 'cat ${arg}')`, 'cmdbar__error');
    } else {
      goTo(entry.id);
    }
    return;
  }

  if (cmd === 'cat') {
    if (!arg) {
      printLine('usage : cat <fichier>', 'cmdbar__error');
      return;
    }
    const entry = resolve(arg);
    if (!entry) {
      printLine(`cat: ${arg}: fichier introuvable`, 'cmdbar__error');
    } else if (entry.type === 'dir') {
      goTo(entry.id);
    } else {
      goTo(entry.id);
      window.open('cv.pdf', '_blank');
    }
    return;
  }

  const direct = resolve(cmd.replace(/^\/+/, ''));
  if (direct) {
    if (direct.type === 'file') window.open('cv.pdf', '_blank');
    goTo(direct.id);
    return;
  }

  printLine(`bash: ${cmdRaw}: commande introuvable (tape 'help')`, 'cmdbar__error');
}

if (cmdInput) {
  cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runCommand(cmdInput.value);
      cmdInput.value = '';
    }
  });
}
