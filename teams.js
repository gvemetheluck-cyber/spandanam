// ----------------------------------------------------
// Madarasathul Hasaniya - Team Standings & Leaderboard Script
// ----------------------------------------------------

let meeladResults = [];

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  loadResultsFromStorage();
  setupNavigation();
  renderTeamLeaderboard();
  renderCategoryBreakdown();
  renderRecentContributions();
  setupCategoryFilter();
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

function calculateTeamScores(categoryFilter = 'all') {
  const teams = [
    { name: 'Samarkhand', totalPoints: 0, gold: 0, silver: 0, bronze: 0, wins: [] },
    { name: 'Granada', totalPoints: 0, gold: 0, silver: 0, bronze: 0, wins: [] },
    { name: 'Kairo', displayName: 'Cairo (Kairo)', totalPoints: 0, gold: 0, silver: 0, bronze: 0, wins: [] }
  ];

  meeladResults.forEach(res => {
    if (categoryFilter !== 'all' && res.category !== categoryFilter) return;

    res.winners.forEach(w => {
      const teamObj = teams.find(t => t.name.toLowerCase() === w.team.toLowerCase());
      if (teamObj) {
        teamObj.totalPoints += w.points;
        if (w.place === 1) teamObj.gold++;
        else if (w.place === 2) teamObj.silver++;
        else if (w.place === 3) teamObj.bronze++;

        teamObj.wins.push({ winner: w, result: res });
      }
    });
  });

  teams.sort((a, b) => b.totalPoints - a.totalPoints);
  return teams;
}

function renderTeamLeaderboard() {
  const grid = document.getElementById('teamsPodiumGrid');
  if (!grid) return;

  const teams = calculateTeamScores('all');
  const maxPoints = teams[0].totalPoints || 1;

  grid.innerHTML = '';

  teams.forEach((t, idx) => {
    const rank = idx + 1;
    const progressPercent = Math.round((t.totalPoints / maxPoints) * 100);

    let rankBadgeText = `${rank}st Place`;
    if (rank === 2) rankBadgeText = '2nd Place';
    if (rank === 3) rankBadgeText = '3rd Place';

    const card = document.createElement('div');
    card.className = `standalone-team-card rank-${rank} team-${t.name}`;

    card.innerHTML = `
      <div class="team-top-ribbon">
        <span class="rank-crown-badge rank-${rank}">
          <i data-lucide="${rank === 1 ? 'crown' : rank === 2 ? 'award' : 'shield'}"></i> ${rankBadgeText}
        </span>
        <span class="team-house-name">${t.displayName || `Team ${t.name}`}</span>
      </div>

      <div class="team-score-hero">
        <span class="team-points-big">${t.totalPoints}</span>
        <span class="team-points-label">Total Championship Points</span>
      </div>

      <div class="team-progress-wrapper">
        <div class="team-progress-bar">
          <div class="team-progress-fill rank-${rank}" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="progress-percent-label">${progressPercent}% of Leader</div>
      </div>

      <div class="medals-tally-grid">
        <div class="medal-tally-box gold">
          <span class="tally-count">${t.gold}</span>
          <span class="tally-label">1st Places</span>
        </div>
        <div class="medal-tally-box silver">
          <span class="tally-count">${t.silver}</span>
          <span class="tally-label">2nd Places</span>
        </div>
        <div class="medal-tally-box bronze">
          <span class="tally-count">${t.bronze}</span>
          <span class="tally-label">3rd Places</span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  initIcons();
}

function setupCategoryFilter() {
  const select = document.getElementById('teamCatFilterSelect');
  if (select) {
    select.addEventListener('change', (e) => {
      renderCategoryBreakdown(e.target.value);
    });
  }
}

function renderCategoryBreakdown(selectedCat = 'all') {
  const container = document.getElementById('categoryComparisonGrid');
  if (!container) return;

  container.innerHTML = '';

  const teams = calculateTeamScores(selectedCat);
  const maxPts = teams[0].totalPoints || 1;

  teams.forEach(t => {
    const percent = Math.round((t.totalPoints / maxPts) * 100);
    const row = document.createElement('div');
    row.className = 'cat-comparison-row';

    row.innerHTML = `
      <div class="cat-team-name-col">
        <span class="team-badge-pill team-${t.name}">${t.displayName || t.name}</span>
        <span class="cat-pts-badge">${t.totalPoints} Pts</span>
      </div>
      <div class="cat-bar-col">
        <div class="cat-bar-bg">
          <div class="cat-bar-fill team-${t.name}" style="width: ${percent}%;"></div>
        </div>
      </div>
      <div class="cat-medals-col">
        <span class="mini-medal gold">${t.gold} 1st</span>
        <span class="mini-medal silver">${t.silver} 2nd</span>
        <span class="mini-medal bronze">${t.bronze} 3rd</span>
      </div>
    `;

    container.appendChild(row);
  });

  initIcons();
}

function renderRecentContributions() {
  const container = document.getElementById('recentContributionsList');
  if (!container) return;

  container.innerHTML = '';

  if (meeladResults.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--color-muted); padding: 20px;">No published competition results found.</p>`;
    return;
  }

  const items = meeladResults.slice(0, 8);
  items.forEach(res => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'contribution-item-card';

    const winnersBadges = res.winners.map(w => `
      <span class="contrib-winner-badge place-${w.place}">
        <strong>${w.place === 1 ? '1st' : w.place === 2 ? '2nd' : '3rd'}</strong> ${w.name} (${w.team})
      </span>
    `).join('');

    itemDiv.innerHTML = `
      <div class="contrib-item-info">
        <h4>${res.item}</h4>
        <span class="contrib-cat-pill">${res.category}</span>
      </div>
      <div class="contrib-winners-row">
        ${winnersBadges}
      </div>
    `;

    container.appendChild(itemDiv);
  });

  initIcons();
}
