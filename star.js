// ----------------------------------------------------
// Madarasathul Hasaniya - Star of the Fest Individual Leaderboard
// ----------------------------------------------------

const TEAM_STUDENTS = {
  Samarkhand: {
    boys: ["Mirzan", "Amen", "Ramzan", "Faizy", "Faizan", "Ziyan", "Muhammed", "Ehan Abdulla", "Fadi", "Zidan", "Aboobacker", "Zayan k.p", "Nishad", "Shazin", "Raid", "Sheezan", "Razal", "Abdulla", "Adhil Musthafa", "Mufara", "Nikshan", "Muhammed am", "Sinad vc", "Rufaid"],
    girls: ["Barza khaleel", "Dua", "Shaziyq shaheer", "Raya Rasheed", "Layya Mariyam", "Kunhamina", "Maryambee", "Janna Ali", "Amana Fathima", "Dhana Fathima", "Zuha beevi", "Ayisha.kv", "Fathima.k", "Kenza", "Shaza shamseer", "Riza Fathima", "Riza shukoor", "Nashwa", "Rimsha"]
  },
  Granada: {
    boys: ["Faizan", "Adeeb", "Muhammed Kk", "Razin", "Faizan noufal", "Razeen", "Ramin Ali", "Fadil k", "Imran t.k", "Rayan shakeer", "Shuhaib", "Fidan", "Najwan", "Shahabas", "Rizwan", "Binas", "Fadil", "Abdulla", "Hanan.s", "Adinan.o", "Shaz.ap", "Zainul Abid"],
    girls: ["Inaaya binth Ali", "Inaaya Fathima", "Kenza", "Nafeesath", "Ridha", "Mazwa", "Fathima.Kk", "Zuhara", "Izwa", "Jadwa", "Rana Fathima", "Aliya shabeer", "Minha mehrin", "Hazza Fathima", "Thanha", "Rita Fathima", "Afeefa", "Diya Shirin", "Fathima ashraf"]
  },
  Kairo: {
    boys: ["Ifras", "Aydin", "Hamdan", "Zayan", "Noor Muhammed", "Thufail", "Salman", "Musthafa.BC", "Abshir", "Faizay binshad", "Danish", "Jinas", "Shaz", "Zamil", "Ajilan", "Sharbeen", "Rayan rahman", "Bishrul Hafi", "Razin.k", "Shan", "Musthafa kV", "Safeer"],
    girls: ["Thanha fathiam", "Ayzal", "Fathima tp", "rasmiya", "Rifa", "Nafeesath", "Noora shabeer", "ayisha", "Zahra", "Rana", "Sherin", "Heena mehrin", "Riya rashid", "Manha beegam", "Fathima Kp", "Luthfiya", "Minha Fathima", "Fadiya"]
  }
};

let meeladResults = [];
let activeGenderTab = 'all';
let starSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  loadResultsFromStorage();
  setupNavigation();
  renderStarSpotlights();
  renderCategoryChampions();
  renderIndividualRankings();
  setupFilterEvents();
  setupCertificateModal();
});

function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function loadResultsFromStorage() {
  const saved = localStorage.getItem('hasaniya_published_results');
  if (saved) {
    try {
      meeladResults = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse meelad results:", e);
    }
  }
}

function setupNavigation() {
  const mobileBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

function detectStudentGender(name, team) {
  if (TEAM_STUDENTS[team]) {
    if (TEAM_STUDENTS[team].boys.some(b => b.toLowerCase() === name.toLowerCase())) return 'boy';
    if (TEAM_STUDENTS[team].girls.some(g => g.toLowerCase() === name.toLowerCase())) return 'girl';
  }
  for (const tKey in TEAM_STUDENTS) {
    if (TEAM_STUDENTS[tKey].boys.some(b => b.toLowerCase() === name.toLowerCase())) return 'boy';
    if (TEAM_STUDENTS[tKey].girls.some(g => g.toLowerCase() === name.toLowerCase())) return 'girl';
  }
  return 'boy'; // default
}

function computeIndividualParticipantScores() {
  const participantsMap = {};

  meeladResults.forEach(res => {
    res.winners.forEach(w => {
      const key = `${w.name}_${w.team}`.toLowerCase();
      if (!participantsMap[key]) {
        participantsMap[key] = {
          name: w.name,
          team: w.team,
          gender: detectStudentGender(w.name, w.team),
          totalPoints: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
          placements: []
        };
      }

      participantsMap[key].totalPoints += w.points;
      if (w.place === 1) participantsMap[key].gold++;
      else if (w.place === 2) participantsMap[key].silver++;
      else if (w.place === 3) participantsMap[key].bronze++;

      participantsMap[key].placements.push({ winner: w, result: res });
    });
  });

  const list = Object.values(participantsMap);
  list.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.gold !== a.gold) return b.gold - a.gold;
    if (b.silver !== a.silver) return b.silver - a.silver;
    return b.bronze - a.bronze;
  });

  return list;
}

function renderStarSpotlights() {
  const grid = document.getElementById('championsSpotlightGrid');
  if (!grid) return;

  const participants = computeIndividualParticipantScores();
  const topBoy = participants.find(p => p.gender === 'boy') || (participants.length > 0 ? participants[0] : null);
  const topGirl = participants.find(p => p.gender === 'girl') || (participants.length > 1 ? participants[1] : null);

  grid.innerHTML = '';

  // Kalaprathibha Card
  const prathibhaCard = document.createElement('div');
  prathibhaCard.className = 'champion-title-card kalaprathibha-card glass-card';

  if (topBoy) {
    const itemsList = topBoy.placements.map(p => `• ${p.result.item} (${p.winner.grade})`).join('<br>');

    prathibhaCard.innerHTML = `
      <div class="champion-card-ribbon gold">
        KALAPRATHIBHA 2026
      </div>
      <div class="champion-card-content">
        <div class="champion-avatar-box">
          <div class="champion-avatar-glow gold">
            <span>${topBoy.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div class="champion-info-box">
          <span class="team-badge-pill team-${topBoy.team}">${topBoy.team}</span>
          <h2 class="champion-name">${topBoy.name}</h2>
          <p class="champion-title-tag">Kalaprathibha | Best Overall Male Participant</p>

          <div class="champion-stats-row">
            <div class="stat-pill"><strong style="font-size:1.3rem; color:#0f172a;">${topBoy.totalPoints}</strong> Points</div>
            <div class="stat-pill">${topBoy.gold} 1st Place &nbsp;|&nbsp; ${topBoy.silver} 2nd Place</div>
          </div>

          <div class="champion-items-box">
            <strong>Winning Performances:</strong>
            <p>${itemsList}</p>
          </div>
        </div>
      </div>
    `;
  } else {
    prathibhaCard.innerHTML = `<div style="padding:40px; text-align:center; color:#64748b;">No published results for Kalaprathibha title yet.</div>`;
  }

  // Kalathilakam Card
  const thilakamCard = document.createElement('div');
  thilakamCard.className = 'champion-title-card kalathilakam-card glass-card';

  if (topGirl) {
    const itemsList = topGirl.placements.map(p => `• ${p.result.item} (${p.winner.grade})`).join('<br>');

    thilakamCard.innerHTML = `
      <div class="champion-card-ribbon rose">
        KALATHILAKAM 2026
      </div>
      <div class="champion-card-content">
        <div class="champion-avatar-box">
          <div class="champion-avatar-glow rose">
            <span>${topGirl.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div class="champion-info-box">
          <span class="team-badge-pill team-${topGirl.team}">${topGirl.team}</span>
          <h2 class="champion-name">${topGirl.name}</h2>
          <p class="champion-title-tag">Kalathilakam | Best Overall Female Participant</p>

          <div class="champion-stats-row">
            <div class="stat-pill"><strong style="font-size:1.3rem; color:#0f172a;">${topGirl.totalPoints}</strong> Points</div>
            <div class="stat-pill">${topGirl.gold} 1st Place &nbsp;|&nbsp; ${topGirl.silver} 2nd Place</div>
          </div>

          <div class="champion-items-box">
            <strong>Winning Performances:</strong>
            <p>${itemsList}</p>
          </div>
        </div>
      </div>
    `;
  } else {
    thilakamCard.innerHTML = `<div style="padding:40px; text-align:center; color:#64748b;">No published results for Kalathilakam title yet.</div>`;
  }

  grid.appendChild(prathibhaCard);
  grid.appendChild(thilakamCard);

  initIcons();
}

function renderCategoryChampions() {
  const container = document.getElementById('catChampionsCardsGrid');
  if (!container) return;

  container.innerHTML = '';

  const categories = ['Kids Boys', 'Kids Girls', 'LP Boys', 'LP Girls', 'UP Boys', 'UP Girls', 'HS Boys', 'HS Girls', 'General Boys', 'General Girls'];
  
  categories.forEach(cat => {
    let bestWinner = null;
    let maxPts = -1;

    meeladResults.forEach(res => {
      if (res.category.toLowerCase() === cat.toLowerCase()) {
        res.winners.forEach(w => {
          if (w.points > maxPts) {
            maxPts = w.points;
            bestWinner = { winner: w, result: res };
          }
        });
      }
    });

    if (bestWinner) {
      const card = document.createElement('div');
      card.className = 'cat-champion-card';

      card.innerHTML = `
        <div class="cat-champion-top">
          <span class="cat-champion-tag">${cat}</span>
          <span class="team-badge-pill team-${bestWinner.winner.team}">${bestWinner.winner.team}</span>
        </div>
        <h4 class="cat-champion-name">${bestWinner.winner.name}</h4>
        <p class="cat-champion-item">${bestWinner.result.item} • Grade ${bestWinner.winner.grade}</p>
        <div class="cat-champion-pts"><i data-lucide="star"></i> ${bestWinner.winner.points} Points</div>
      `;

      container.appendChild(card);
    }
  });

  initIcons();
}

function setupFilterEvents() {
  const searchInput = document.getElementById('starSearchInput');
  const tabs = document.querySelectorAll('.star-tab-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      starSearchQuery = e.target.value.toLowerCase().trim();
      renderIndividualRankings();
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeGenderTab = tab.getAttribute('data-tab');
      renderIndividualRankings();
    });
  });
}

function renderIndividualRankings() {
  const container = document.getElementById('starRankingsGrid');
  if (!container) return;

  container.innerHTML = '';

  let participants = computeIndividualParticipantScores();

  if (activeGenderTab === 'boys') {
    participants = participants.filter(p => p.gender === 'boy');
  } else if (activeGenderTab === 'girls') {
    participants = participants.filter(p => p.gender === 'girl');
  }

  if (starSearchQuery) {
    participants = participants.filter(p => p.name.toLowerCase().includes(starSearchQuery));
  }

  if (participants.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--color-muted); grid-column: 1/-1; padding: 40px;">No individual participants found matching your criteria.</p>`;
    return;
  }

  participants.forEach((p, idx) => {
    const rank = idx + 1;
    const card = document.createElement('div');
    card.className = `star-ranking-card ${rank <= 3 ? `top-rank rank-${rank}` : ''}`;

    let rankBadgeText = `#${rank}`;
    if (rank === 1) rankBadgeText = '1st';
    if (rank === 2) rankBadgeText = '2nd';
    if (rank === 3) rankBadgeText = '3rd';

    const itemsSummary = p.placements.map(pl => pl.result.item).join(', ');

    card.innerHTML = `
      <div class="star-rank-left">
        <span class="star-rank-number rank-${rank}">${rankBadgeText}</span>
        <div class="star-participant-info">
          <h4>${p.name}</h4>
          <span class="star-team-text">Team ${p.team} • ${p.placements.length} Placement${p.placements.length === 1 ? '' : 's'}</span>
          <p class="star-items-summary">${itemsSummary}</p>
        </div>
      </div>
      <div class="star-rank-right">
        <span class="star-total-points-badge">${p.totalPoints} Points</span>
        <button class="btn btn-sm btn-outline view-star-cert-btn">View Certificate</button>
      </div>
    `;

    card.querySelector('.view-star-cert-btn').addEventListener('click', () => {
      if (p.placements.length > 0) {
        openResultModal(p.placements[0].winner, p.placements[0].result);
      }
    });

    container.appendChild(card);
  });

  initIcons();
}

function setupCertificateModal() {
  const modal = document.getElementById('resultModal');
  const closeBtn = document.getElementById('closeResultModal');
  const downloadBtn = document.getElementById('downloadJpgBtn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const certCard = document.getElementById('certificateCard');
      const studentName = document.getElementById('certStudentName')?.textContent || 'Result';
      const itemName = document.getElementById('certItemName')?.textContent || 'Certificate';
      if (!certCard) return;

      showToast("Generating high quality JPG image...", "success");

      if (typeof html2canvas !== 'undefined') {
        html2canvas(certCard, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff'
        }).then(canvas => {
          const imageJpeg = canvas.toDataURL('image/jpeg', 0.95);
          const link = document.createElement('a');
          link.download = `Result_${studentName.replace(/\s+/g, '_')}_${itemName.replace(/\s+/g, '_')}.jpg`;
          link.href = imageJpeg;
          link.click();
          showToast("Downloaded JPG Result Card!", "success");
        }).catch(err => {
          console.error("HTML2Canvas Error:", err);
          showToast("Failed to render JPG image.", "error");
        });
      } else {
        window.print();
      }
    });
  }
}

function openResultModal(winner, result) {
  const modal = document.getElementById('resultModal');
  if (!modal) return;

  document.getElementById('certStudentName').textContent = winner.name;
  const teamBadge = document.getElementById('certTeamBadge');
  if (teamBadge) {
    teamBadge.textContent = winner.team;
    teamBadge.className = `team-badge-pill team-${winner.team}`;
  }

  document.getElementById('certItemName').textContent = result.item;
  document.getElementById('certCategory').textContent = result.category;
  document.getElementById('certGrade').textContent = winner.grade;
  document.getElementById('certPoints').textContent = `${winner.points} Points`;

  let rankTitle = 'FIRST PLACE';
  if (winner.place === 2) { rankTitle = 'SECOND PLACE'; }
  if (winner.place === 3) { rankTitle = 'THIRD PLACE'; }

  document.getElementById('certRankIcon').textContent = '';
  document.getElementById('certRankTitle').textContent = rankTitle;

  modal.classList.add('active');
  initIcons();
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const iconName = type === 'error' ? 'alert-triangle' : 'check-circle';

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  initIcons();

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
