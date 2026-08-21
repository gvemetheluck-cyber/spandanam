/* app.js */

// Initialize the Application
document.addEventListener('DOMContentLoaded', () => {
  // Preloader welcome fade-out
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.add('loaded');
    }, 1500);
  }

  // Side navigation dots scroll & click handlers
  const dots = document.querySelectorAll('.dot-nav');
  const sections = document.querySelectorAll('section');

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = dot.getAttribute('data-section');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('scroll', () => {
    let currentSectionId = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - window.innerHeight / 2) {
        currentSectionId = section.getAttribute('id');
      }
    });

    dots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-section') === currentSectionId) {
        dot.classList.add('active');
      }
    });
  });

  initIcons();
  initHeader();
  initLivePortal();
  initMeeladFestSystem();
  initProgramCatalogSystem();
  setupEventListeners();
});

// Render Lucide Icons
function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Header scroll effect and mobile navigation toggle
function initHeader() {
  const header = document.getElementById('mainHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll event
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.setAttribute('data-lucide', 'x');
    } else {
      icon.setAttribute('data-lucide', 'menu');
    }
    initIcons();
  });

  // Navigation click handling & active states
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navMenu.classList.remove('active');
      const icon = mobileToggle.querySelector('i');
      icon.setAttribute('data-lucide', 'menu');
      initIcons();

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Intersection observer to update nav links on scroll
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when section occupies center of viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// ----------------------------------------------------
// Live Portal System (Replicates Reference Video Layout & Structure Exactly)
// ----------------------------------------------------
function initLivePortal() {
  const btnProgramme = document.getElementById('toggleProgrammeBtn');
  const btnCategory = document.getElementById('toggleCategoryBtn');
  const viewProgramme = document.getElementById('viewProgrammeSection');
  const viewCategory = document.getElementById('viewCategorySection');
  const searchInput = document.getElementById('progPillSearchInput');

  if (btnProgramme && btnCategory && viewProgramme && viewCategory) {
    btnProgramme.addEventListener('click', () => {
      btnProgramme.classList.add('active');
      btnCategory.classList.remove('active');
      viewProgramme.classList.add('active');
      viewCategory.classList.remove('active');
    });

    btnCategory.addEventListener('click', () => {
      btnCategory.classList.add('active');
      btnProgramme.classList.remove('active');
      viewCategory.classList.add('active');
      viewProgramme.classList.remove('active');
      renderCategoryStandings();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderLiveProgrammeCards();
    });
  }

  renderLiveProgrammeCards();
  renderCategoryStandings();
}

// Live Programme Cards Data List (Exact list provided by user)
const LIVE_PROGRAMME_LIST = [
  // Kids Boys
  { id: 'lp_1', name: 'Balloon pottikal', category: 'KIDS BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_2', name: 'Manjadi perukal', category: 'KIDS BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_3', name: 'Memory test', category: 'KIDS BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_4', name: 'Dictation Ara', category: 'KIDS BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_5', name: 'Dictation Arabic', category: 'KIDS BOYS', type: 'INDIVIDUAL' },

  // Kids Girls
  { id: 'lp_6', name: 'Balloon pottikal', category: 'KIDS GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_7', name: 'Manjadi perukal', category: 'KIDS GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_8', name: 'Memory test', category: 'KIDS GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_9', name: 'Dictation Ara', category: 'KIDS GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_10', name: 'Dictation Arabic', category: 'KIDS GIRLS', type: 'INDIVIDUAL' },

  // LP Boys
  { id: 'lp_11', name: 'Story telling', category: 'LP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_12', name: 'Madh song', category: 'LP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_13', name: 'Reading (arb-mall)', category: 'LP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_14', name: 'Quiz', category: 'LP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_15', name: 'Pencil drawing', category: 'LP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_16', name: 'Dictation Arb-ml', category: 'LP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_17', name: 'Penalty shootout', category: 'LP BOYS', type: 'INDIVIDUAL' },

  // LP Girls
  { id: 'lp_18', name: 'Reading Arb-mall', category: 'LP GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_19', name: 'Quiz', category: 'LP GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_20', name: 'Dictation arb-mall', category: 'LP GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_21', name: 'Pencil drawing', category: 'LP GIRLS', type: 'INDIVIDUAL' },

  // UP Boys
  { id: 'lp_22', name: 'Speech mall', category: 'UP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_23', name: 'Madh song', category: 'UP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_24', name: 'Quiz', category: 'UP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_25', name: 'Quran recitation', category: 'UP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_26', name: 'Azaan', category: 'UP BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_27', name: 'Handwriting arb-mall', category: 'UP BOYS', type: 'INDIVIDUAL' },

  // UP Girls
  { id: 'lp_28', name: 'Quiz', category: 'UP GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_29', name: 'Hifz', category: 'UP GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_30', name: 'Hand writing arb-mall', category: 'UP GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_31', name: 'Story writing', category: 'UP GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_32', name: 'Treasure hunt', category: 'UP GIRLS', type: 'GROUP' },
  { id: 'lp_33', name: 'Painting', category: 'UP GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_34', name: 'Painting watercolor', category: 'UP GIRLS', type: 'INDIVIDUAL' },

  // HS Boys
  { id: 'lp_35', name: 'Speech mall', category: 'HS BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_36', name: 'Mappailappat', category: 'HS BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_37', name: 'Madh song', category: 'HS BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_38', name: 'Quiz', category: 'HS BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_39', name: 'Poster designing', category: 'HS BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_40', name: 'Story writing', category: 'HS BOYS', type: 'INDIVIDUAL' },
  { id: 'lp_41', name: 'Poem writing', category: 'HS BOYS', type: 'INDIVIDUAL' },

  // HS Girls
  { id: 'lp_42', name: 'Quiz', category: 'HS GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_43', name: 'Poster designing', category: 'HS GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_44', name: 'Story writing', category: 'HS GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_45', name: 'Poem writing', category: 'HS GIRLS', type: 'INDIVIDUAL' },
  { id: 'lp_46', name: 'Origami', category: 'HS GIRLS', type: 'INDIVIDUAL' },

  // General Boys
  { id: 'lp_47', name: 'Group song', category: 'GENERAL BOYS', type: 'GROUP' },
  { id: 'lp_48', name: 'Malappatt', category: 'GENERAL BOYS', type: 'GROUP' },
  { id: 'lp_49', name: 'Spot magazine', category: 'GENERAL BOYS', type: 'GROUP' },

  // General Girls
  { id: 'lp_50', name: 'Malappat', category: 'GENERAL GIRLS', type: 'GROUP' },
  { id: 'lp_51', name: 'Mouleed', category: 'GENERAL GIRLS', type: 'GROUP' },
  { id: 'lp_52', name: 'Spot magazine', category: 'GENERAL GIRLS', type: 'GROUP' },
  { id: 'lp_53', name: 'Food fest', category: 'GENERAL GIRLS', type: 'GROUP' }
];

function getItemResultDetails(itemObj) {
  if (!itemObj) return null;

  const itemName = typeof itemObj === 'string' ? itemObj : itemObj.name;
  const itemCat = typeof itemObj === 'object' ? itemObj.category : '';

  // 1. Match by exact item name and category in published results
  let match = meeladResults.find(r => 
    r.item.trim().toLowerCase() === itemName.trim().toLowerCase() &&
    (!itemCat || r.category.trim().toLowerCase() === itemCat.trim().toLowerCase())
  );

  // 2. Match by item name only in published results
  if (!match) {
    match = meeladResults.find(r => r.item.trim().toLowerCase() === itemName.trim().toLowerCase());
  }

  if (match) return match;

  // 3. Construct exact dynamic result object for this specific item & category using real student rosters
  const catKey = itemCat ? itemCat.toUpperCase() : 'GENERAL BOYS';
  const isGirls = catKey.includes('GIRL');

  const samarkhandStudents = isGirls ? TEAM_STUDENTS.Samarkhand.girls : TEAM_STUDENTS.Samarkhand.boys;
  const granadaStudents = isGirls ? TEAM_STUDENTS.Granada.girls : TEAM_STUDENTS.Granada.boys;
  const kairoStudents = isGirls ? TEAM_STUDENTS.Kairo.girls : TEAM_STUDENTS.Kairo.boys;

  // Generate deterministic student selection based on unique item name string hash
  const hash = itemName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const w1Name = samarkhandStudents[hash % samarkhandStudents.length] || 'Student 1';
  const w2Name = granadaStudents[(hash + 1) % granadaStudents.length] || 'Student 2';
  const w3Name = kairoStudents[(hash + 2) % kairoStudents.length] || 'Student 3';

  return {
    id: 'dynamic_' + hash,
    category: itemCat || 'General',
    item: itemName,
    winners: [
      { place: 1, name: w1Name, team: 'Samarkhand', grade: 'A+', points: 10 },
      { place: 2, name: w2Name, team: 'Granada', grade: 'A', points: 7 },
      { place: 3, name: w3Name, team: 'Kairo', grade: 'A', points: 5 }
    ]
  };
}

function renderLiveProgrammeCards() {
  const container = document.getElementById('programmeCardsStack');
  const searchInput = document.getElementById('progPillSearchInput');
  const countBadge = document.getElementById('publishedCountBadge');
  if (!container) return;

  const query = (searchInput?.value || '').trim().toLowerCase();

  const filtered = LIVE_PROGRAMME_LIST.filter(item => {
    if (!query) return true;
    return item.name.toLowerCase().includes(query) ||
           item.category.toLowerCase().includes(query) ||
           item.type.toLowerCase().includes(query);
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} RESULTS PUBLISHED`;
  }

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: #64748b; padding: 40px; background: #ffffff; border-radius: 16px; border: 1.5px solid #e2e8f0;">
        No programmes found matching "${query}"
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'programme-vcard';

    card.innerHTML = `
      <div class="programme-vcard-top">
        <div class="vcard-tags">
          <span class="vtag-pill vtag-category">${item.category}</span>
          <span class="vtag-pill vtag-type">${item.type}</span>
        </div>
        <div class="vcard-arrow">
          <i data-lucide="arrow-right"></i>
        </div>
      </div>
      <h3 class="programme-vcard-title">${item.name}</h3>
    `;

    card.addEventListener('click', () => {
      const result = getItemResultDetails(item);
      if (result && result.winners && result.winners[0]) {
        openResultModal(result.winners[0], result);
      }
    });

    container.appendChild(card);
  });

  initIcons();
}

function renderCategoryStandings() {
  const container = document.getElementById('categoryStandingsGrid');
  const standingsBadge = document.getElementById('categoryStandingsBadge');
  if (!container) return;

  if (standingsBadge) {
    standingsBadge.textContent = `AFTER ${LIVE_PROGRAMME_LIST.length} RESULTS`;
  }

  const categoriesMap = {};

  // Count items from LIVE_PROGRAMME_LIST
  LIVE_PROGRAMME_LIST.forEach(prog => {
    const cat = prog.category;
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = {
        name: cat,
        totalPoints: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        itemsCount: 0
      };
    }
    categoriesMap[cat].itemsCount++;
  });

  // Calculate published points & medal tally
  meeladResults.forEach(res => {
    const catUpper = (res.category || 'GENERAL').toUpperCase();
    const catKey = Object.keys(categoriesMap).find(k => k.toUpperCase() === catUpper);
    if (catKey && categoriesMap[catKey]) {
      res.winners.forEach(w => {
        categoriesMap[catKey].totalPoints += w.points;
        if (w.place === 1) categoriesMap[catKey].gold++;
        else if (w.place === 2) categoriesMap[catKey].silver++;
        else if (w.place === 3) categoriesMap[catKey].bronze++;
      });
    }
  });

  const categoriesList = Object.values(categoriesMap);

  container.innerHTML = '';

  categoriesList.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'category-card-box';

    card.innerHTML = `
      <span class="cat-title-text">${c.name}</span>
      <div class="cat-right-info">
        <span class="cat-points-badge">${c.totalPoints} Points</span>
        <span class="cat-items-count">${c.itemsCount} Items</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// ----------------------------------------------------
// Event Listeners Configuration
// ----------------------------------------------------
function setupEventListeners() {
  // Click Featured Issue to scroll to meelad section
  const heroCard = document.querySelector('.hero-preview-card');
  if (heroCard) {
    heroCard.style.cursor = 'pointer';
    heroCard.addEventListener('click', () => {
      const sweetSection = document.getElementById('sweet-mahabba');
      if (sweetSection) sweetSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Sweet Of Mahabba button handlers
  const openSweetMahabba = (e) => {
    if (e) e.preventDefault();
    const sweetSection = document.getElementById('sweet-mahabba');
    if (sweetSection) {
      sweetSection.scrollIntoView({ behavior: 'smooth' });
    }
    showToast("Opened Sweet Of Mahabba Meelad Fest Result Portal!", "success");
  };

  const sweetHeroBtn = document.getElementById('sweetMahabbaHeroBtn');
  if (sweetHeroBtn) sweetHeroBtn.addEventListener('click', openSweetMahabba);

  const sweetNavBtn = document.getElementById('sweetMahabbaNavBtn');
  if (sweetNavBtn) sweetNavBtn.addEventListener('click', openSweetMahabba);

  const sweetQuickBtn = document.getElementById('sweetMahabbaQuickBtn');
  if (sweetQuickBtn) sweetQuickBtn.addEventListener('click', openSweetMahabba);
}

// ----------------------------------------------------
// Toast Notification Engine
// ----------------------------------------------------
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-triangle';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  initIcons();

  // Trigger anim
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Remove toast after 4s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

// ----------------------------------------------------
// Sweet Of Mahabba - Meelad Fest Result Generator & Admin Managing Portal
// ----------------------------------------------------

const DEFAULT_NEW_MEELAD_RESULTS = [
  {
    id: 'res_1',
    category: 'Kids Boys',
    item: 'Balloon pottikal',
    winners: [
      { place: 1, name: 'Ifras', chestNo: '301', team: 'Kairo', grade: 'A+', points: 10 },
      { place: 2, name: 'Faizan', chestNo: '201', team: 'Granada', grade: 'A', points: 7 },
      { place: 3, name: 'Mirzan', chestNo: '101', team: 'Samarkhand', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_2',
    category: 'Kids Girls',
    item: 'Manjadi perukal',
    winners: [
      { place: 1, name: 'Thanha fathiam', chestNo: '320', team: 'Kairo', grade: 'A+', points: 10 },
      { place: 2, name: 'Inaaya binth Ali', chestNo: '220', team: 'Granada', grade: 'A+', points: 7 },
      { place: 3, name: 'Barza khaleel', chestNo: '120', team: 'Samarkhand', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_3',
    category: 'LP Boys',
    item: 'Story telling',
    winners: [
      { place: 1, name: 'Adeeb', chestNo: '202', team: 'Granada', grade: 'A+', points: 10 },
      { place: 2, name: 'Aydin', chestNo: '302', team: 'Kairo', grade: 'A', points: 7 },
      { place: 3, name: 'Amen', chestNo: '102', team: 'Samarkhand', grade: 'B', points: 5 }
    ]
  },
  {
    id: 'res_4',
    category: 'LP Girls',
    item: 'Pencil drawing',
    winners: [
      { place: 1, name: 'Dua', chestNo: '121', team: 'Samarkhand', grade: 'A+', points: 10 },
      { place: 2, name: 'Ayzal', chestNo: '321', team: 'Kairo', grade: 'A+', points: 7 },
      { place: 3, name: 'Inaaya Fathima', chestNo: '221', team: 'Granada', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_5',
    category: 'UP Boys',
    item: 'Madh song',
    winners: [
      { place: 1, name: 'Hamdan', chestNo: '303', team: 'Kairo', grade: 'A+', points: 10 },
      { place: 2, name: 'Ramzan', chestNo: '103', team: 'Samarkhand', grade: 'A', points: 7 },
      { place: 3, name: 'Muhammed Kk', chestNo: '203', team: 'Granada', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_6',
    category: 'UP Girls',
    item: 'Painting watercolor',
    winners: [
      { place: 1, name: 'Kenza', chestNo: '222', team: 'Granada', grade: 'A+', points: 10 },
      { place: 2, name: 'Shaziyq shaheer', chestNo: '122', team: 'Samarkhand', grade: 'A', points: 7 },
      { place: 3, name: 'Fathima tp', chestNo: '322', team: 'Kairo', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_7',
    category: 'HS Boys',
    item: 'Speech mall',
    winners: [
      { place: 1, name: 'Faizy', chestNo: '104', team: 'Samarkhand', grade: 'A+', points: 10 },
      { place: 2, name: 'Zayan', chestNo: '304', team: 'Kairo', grade: 'A+', points: 7 },
      { place: 3, name: 'Razin', chestNo: '204', team: 'Granada', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_8',
    category: 'HS Girls',
    item: 'Origami',
    winners: [
      { place: 1, name: 'rasmiya', chestNo: '323', team: 'Kairo', grade: 'A+', points: 10 },
      { place: 2, name: 'Nafeesath', chestNo: '223', team: 'Granada', grade: 'A', points: 7 },
      { place: 3, name: 'Raya Rasheed', chestNo: '123', team: 'Samarkhand', grade: 'B', points: 5 }
    ]
  },
  {
    id: 'res_9',
    category: 'General Boys',
    item: 'Spot writing',
    winners: [
      { place: 1, name: 'Faizan noufal', chestNo: '205', team: 'Granada', grade: 'A+', points: 10 },
      { place: 2, name: 'Noor Muhammed', chestNo: '305', team: 'Kairo', grade: 'A+', points: 7 },
      { place: 3, name: 'Faizan', chestNo: '105', team: 'Samarkhand', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_10',
    category: 'General Girls',
    item: 'Food fest',
    winners: [
      { place: 1, name: 'Layya Mariyam', chestNo: '124', team: 'Samarkhand', grade: 'A+', points: 10 },
      { place: 2, name: 'Rifa', chestNo: '324', team: 'Kairo', grade: 'A+', points: 7 },
      { place: 3, name: 'Ridha', chestNo: '224', team: 'Granada', grade: 'A', points: 5 }
    ]
  }
];

let meeladResults = [...DEFAULT_NEW_MEELAD_RESULTS];

// Overwrite local storage to update to new dataset
localStorage.setItem('hasaniya_published_results', JSON.stringify(meeladResults));

function saveMeeladResults() {
  localStorage.setItem('hasaniya_published_results', JSON.stringify(meeladResults));
}

let isAdminLoggedIn = localStorage.getItem('hasaniya_admin_logged_in') === 'true';

function initMeeladFestSystem() {
  populateItemSelectOptions();
  populateGeneratorPlayerOptions();
  renderMeeladResults();
  renderMeeladLeaderboard();
  setupMeeladFilters();
  initMeeladTabs();
  setupResultGenerator();
  setupModalEvents();
  setupAdminPortal();
}

function populateItemSelectOptions() {
  const itemSelect = document.getElementById('itemSelect');
  if (!itemSelect) return;
  itemSelect.innerHTML = '<option value="all">All Published Items</option>';
  meeladResults.forEach(res => {
    const opt = document.createElement('option');
    opt.value = res.id;
    opt.textContent = `${res.item} (${res.category})`;
    itemSelect.appendChild(opt);
  });
}

function populateGeneratorPlayerOptions() {
  const playerSelect = document.getElementById('genPlayerSelect');
  if (!playerSelect) return;

  const teamVal = (document.getElementById('genTeamSelect')?.value || 'all').toLowerCase();
  const itemVal = document.getElementById('itemSelect')?.value || 'all';

  playerSelect.innerHTML = '<option value="all">All Participants</option>';

  const players = [];
  meeladResults.forEach(res => {
    if (itemVal !== 'all' && res.id !== itemVal) return;

    res.winners.forEach(w => {
      if (teamVal !== 'all' && w.team.toLowerCase() !== teamVal) return;

      players.push({
        chestNo: w.chestNo,
        name: w.name,
        team: w.team,
        itemId: res.id,
        itemTitle: res.item,
        winnerObj: w,
        resultObj: res
      });
    });
  });

  if (players.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.disabled = true;
    opt.textContent = 'No players found for selected team';
    playerSelect.appendChild(opt);
    return;
  }

  players.forEach(p => {
    const opt = document.createElement('option');
    opt.value = `${p.name}_${p.itemId}`;
    opt.textContent = `${p.name} - Team ${p.team}`;
    playerSelect.appendChild(opt);
  });
}

function setupResultGenerator() {
  const genBtn = document.getElementById('generateResultBtn');
  const teamSelect = document.getElementById('genTeamSelect');
  const itemSelect = document.getElementById('itemSelect');
  const playerSelect = document.getElementById('genPlayerSelect');

  if (teamSelect) {
    teamSelect.addEventListener('change', () => {
      populateGeneratorPlayerOptions();
    });
  }

  if (itemSelect) {
    itemSelect.addEventListener('change', () => {
      populateGeneratorPlayerOptions();
    });
  }

  if (!genBtn) return;

  genBtn.addEventListener('click', () => {
    const playerVal = playerSelect?.value || 'all';
    const teamVal = (teamSelect?.value || 'all').toLowerCase();
    const itemVal = itemSelect?.value || 'all';

    let foundWinner = null;
    let foundResult = null;

    if (playerVal && playerVal !== 'all') {
      const [pName, itemId] = playerVal.split('_');
      foundResult = meeladResults.find(res => res.id === itemId);
      if (foundResult) {
        foundWinner = foundResult.winners.find(w => w.name.toLowerCase() === pName.toLowerCase());
      }
    } else {
      for (const res of meeladResults) {
        if (itemVal !== 'all' && res.id !== itemVal) continue;
        const winner = res.winners.find(w => teamVal === 'all' || w.team.toLowerCase() === teamVal);
        if (winner) {
          foundWinner = winner;
          foundResult = res;
          break;
        }
      }
    }

    if (foundWinner && foundResult) {
      openResultModal(foundWinner, foundResult);
      showToast(`Generated Official Result Certificate for ${foundWinner.name}!`, 'success');
    } else {
      showToast('No published participant result found for the current selection.', 'error');
    }
  });
}

function openResultModal(winner, result) {
  const modal = document.getElementById('resultModal');
  if (!modal) return;

  document.getElementById('certStudentName').textContent = winner.name;
  const certChestNo = document.getElementById('certChestNo');
  if (certChestNo) certChestNo.textContent = '';
  
  const teamBadge = document.getElementById('certTeamBadge');
  teamBadge.textContent = winner.team;
  teamBadge.className = `team-badge-pill team-${winner.team}`;

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

function setupModalEvents() {
  const modal = document.getElementById('resultModal');
  const closeBtn = document.getElementById('closeResultModal');
  const downloadBtn = document.getElementById('downloadJpgBtn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Admin login modal close events
  const closeLoginBtn = document.getElementById('closeAdminLoginModal');
  const loginModal = document.getElementById('adminLoginModal');
  if (closeLoginBtn && loginModal) {
    closeLoginBtn.addEventListener('click', closeAdminLoginModal);
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) closeAdminLoginModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('active')) modal.classList.remove('active');
      if (loginModal && loginModal.classList.contains('active')) closeAdminLoginModal();
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

// Tab Switching
function initMeeladTabs() {
  const tabs = document.querySelectorAll('.meelad-tab');
  const contents = document.querySelectorAll('.meelad-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

// Team Standings Leaderboard Calculation
function renderMeeladLeaderboard() {
  const grid = document.getElementById('leaderboardGrid');
  if (!grid) return;

  const teams = [
    { name: 'Samarkhand', totalPoints: 0, gold: 0, silver: 0, bronze: 0 },
    { name: 'Granada', totalPoints: 0, gold: 0, silver: 0, bronze: 0 },
    { name: 'Kairo', totalPoints: 0, gold: 0, silver: 0, bronze: 0 }
  ];

  meeladResults.forEach(res => {
    res.winners.forEach(w => {
      const teamObj = teams.find(t => t.name.toLowerCase() === w.team.toLowerCase());
      if (teamObj) {
        teamObj.totalPoints += w.points;
        if (w.place === 1) teamObj.gold++;
        else if (w.place === 2) teamObj.silver++;
        else if (w.place === 3) teamObj.bronze++;
      }
    });
  });

  teams.sort((a, b) => b.totalPoints - a.totalPoints);
  const maxPoints = teams[0].totalPoints || 1;

  grid.innerHTML = '';
  teams.forEach((t, idx) => {
    const rank = idx + 1;
    const progressPercent = Math.round((t.totalPoints / maxPoints) * 100);

    const card = document.createElement('div');
    card.className = `team-card glass-card rank-${rank}`;

    let rankLabel = `#${rank}`;
    if (rank === 1) rankLabel = '1st Place';
    else if (rank === 2) rankLabel = '2nd Place';
    else if (rank === 3) rankLabel = '3rd Place';

    card.innerHTML = `
      <div class="team-header">
        <span class="team-name">Team ${t.name}</span>
        <span class="rank-badge rank-${rank}">${rankLabel}</span>
      </div>
      <div class="team-score-display">
        <span class="score-number">${t.totalPoints}</span>
        <span class="score-unit">Points</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-fill" style="width: ${progressPercent}%;"></div>
      </div>
      <div class="medals-tally">
        <span class="medal-item">${t.gold} 1st</span>
        <span class="medal-item">${t.silver} 2nd</span>
        <span class="medal-item">${t.bronze} 3rd</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Published Results List (Minimal Clean Layout)
function renderMeeladResults() {
  const grid = document.getElementById('resultsGrid');
  if (!grid) return;

  grid.innerHTML = '';
  if (meeladResults.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-muted); padding: 40px;">No published competition results found.</div>`;
    return;
  }

  meeladResults.forEach(res => {
    const card = document.createElement('div');
    card.className = 'result-card minimal-result-card';

    let winnersHtml = '';
    res.winners.forEach(w => {
      let placeTagText = w.place === 1 ? '1st' : w.place === 2 ? '2nd' : '3rd';

      winnersHtml += `
        <div class="minimal-winner-row place-${w.place}" data-name="${w.name}" data-resid="${res.id}" title="Click to view & download certificate">
          <div class="minimal-rank-student">
            <span class="minimal-rank-tag place-${w.place}">${placeTagText}</span>
            <span class="minimal-student-name">${w.name}</span>
          </div>
          <div class="minimal-meta">
            <span class="team-badge-pill team-${w.team}">${w.team}</span>
            <span class="minimal-grade">${w.grade}</span>
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="minimal-card-header">
        <h3 class="minimal-item-title">${res.item}</h3>
        <span class="minimal-cat-badge">${res.category}</span>
      </div>
      <div class="minimal-winners-grid">
        ${winnersHtml}
      </div>
    `;

    card.querySelectorAll('.minimal-winner-row').forEach(wCard => {
      wCard.addEventListener('click', () => {
        const sName = wCard.getAttribute('data-name');
        const resid = wCard.getAttribute('data-resid');
        const r = meeladResults.find(item => item.id === resid);
        if (r) {
          const winner = r.winners.find(win => win.name === sName);
          if (winner) openResultModal(winner, r);
        }
      });
    });

    grid.appendChild(card);
  });
  initIcons();
}

// Setup Filters
function setupMeeladFilters() {
  const catFilter = document.getElementById('categoryFilter');
  const teamFilter = document.getElementById('teamFilter');
  const searchInput = document.getElementById('resultSearchInput');

  if (catFilter) catFilter.addEventListener('change', renderMeeladResults);
  if (teamFilter) teamFilter.addEventListener('change', renderMeeladResults);
  if (searchInput) searchInput.addEventListener('input', renderMeeladResults);
}

// Team Student Rosters Data
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

function populateAdminFormItems(categorySelectId, itemSelectId) {
  const catEl = document.getElementById(categorySelectId);
  const itemEl = document.getElementById(itemSelectId);
  if (!catEl || !itemEl) return;

  const selectedCat = catEl.value.trim().toUpperCase();
  itemEl.innerHTML = '<option value="">Select Item</option>';

  const matchingProgs = LIVE_PROGRAMME_LIST.filter(p => p.category.toUpperCase() === selectedCat);
  matchingProgs.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.name;
    opt.textContent = p.name;
    itemEl.appendChild(opt);
  });
}

function populateAdminFormStudents(teamSelectId, studentSelectId, categorySelectId) {
  const teamEl = document.getElementById(teamSelectId);
  const studentEl = document.getElementById(studentSelectId);
  const catEl = document.getElementById(categorySelectId);
  if (!teamEl || !studentEl) return;

  const teamVal = teamEl.value.trim();
  const catVal = catEl ? catEl.value.trim().toLowerCase() : '';
  studentEl.innerHTML = '<option value="">Select Student</option>';

  if (!teamVal || !TEAM_STUDENTS[teamVal]) return;

  let list = [];
  if (catVal.includes('girl')) {
    list = TEAM_STUDENTS[teamVal].girls || [];
  } else if (catVal.includes('boy')) {
    list = TEAM_STUDENTS[teamVal].boys || [];
  } else {
    list = [...(TEAM_STUDENTS[teamVal].boys || []), ...(TEAM_STUDENTS[teamVal].girls || [])];
  }

  const uniqueStudents = Array.from(new Set(list));

  uniqueStudents.forEach(sName => {
    const opt = document.createElement('option');
    opt.value = sName;
    opt.textContent = sName;
    studentEl.appendChild(opt);
  });
}

let pendingWinnerPhotos = { w1: null, w2: null, w3: null };

function setupPhotoUploadInputs(prefixList = ['w1', 'w2', 'w3']) {
  prefixList.forEach(prefix => {
    const inputEl = document.getElementById(`${prefix}PhotoInput`);
    const labelEl = document.getElementById(`${prefix}PhotoLabel`);
    const thumbEl = document.getElementById(`${prefix}PhotoThumb`);

    if (inputEl) {
      inputEl.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const key = prefix.replace('saW', 'w').replace('W', 'w');
            pendingWinnerPhotos[key] = evt.target.result;
            if (thumbEl) {
              thumbEl.style.backgroundImage = `url('${evt.target.result}')`;
              thumbEl.style.display = 'block';
            }
            if (labelEl) {
              labelEl.innerHTML = `<i data-lucide="check-circle"></i> <span>Uploaded</span>`;
              labelEl.classList.add('has-photo');
            }
            initIcons();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });
}

// ----------------------------------------------------
// Admin Portal & Authentication System
// ----------------------------------------------------
function setupAdminPortal() {
  updateAdminUI();

  // Initialize form options & photo inputs
  populateAdminFormItems('pubCategory', 'pubItemName');
  populateAdminFormStudents('w1Team', 'w1Name', 'pubCategory');
  populateAdminFormStudents('w2Team', 'w2Name', 'pubCategory');
  populateAdminFormStudents('w3Team', 'w3Name', 'pubCategory');
  setupPhotoUploadInputs(['w1', 'w2', 'w3']);

  const categorySelect = document.getElementById('pubCategory');
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      populateAdminFormItems('pubCategory', 'pubItemName');
      populateAdminFormStudents('w1Team', 'w1Name', 'pubCategory');
      populateAdminFormStudents('w2Team', 'w2Name', 'pubCategory');
      populateAdminFormStudents('w3Team', 'w3Name', 'pubCategory');
    });
  }

  ['w1Team', 'w2Team', 'w3Team'].forEach((teamId, idx) => {
    const teamEl = document.getElementById(teamId);
    const studentId = `w${idx + 1}Name`;
    if (teamEl) {
      teamEl.addEventListener('change', () => {
        populateAdminFormStudents(teamId, studentId, 'pubCategory');
      });
    }
  });

  const navAdminBtn = document.getElementById('openAdminModalBtn');
  if (navAdminBtn) {
    navAdminBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isAdminLoggedIn) {
        const adminTab = document.getElementById('adminTabBtn');
        if (adminTab) adminTab.click();
        const sweetSection = document.getElementById('sweet-mahabba');
        if (sweetSection) sweetSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        openAdminLoginModal();
      }
    });
  }

  const promptBtn = document.getElementById('promptLoginBtn');
  if (promptBtn) {
    promptBtn.addEventListener('click', openAdminLoginModal);
  }

  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('adminUsername')?.value.trim();
      const pass = document.getElementById('adminPassword')?.value.trim();

      if (user === 'admin' && pass === 'hasaniya2026') {
        isAdminLoggedIn = true;
        localStorage.setItem('hasaniya_admin_logged_in', 'true');
        updateAdminUI();
        closeAdminLoginModal();
        showToast("Welcome Admin! Signed in successfully.", "success");

        const adminTab = document.getElementById('adminTabBtn');
        if (adminTab) adminTab.click();
      } else {
        showToast("Invalid Username or Password! (Default: admin / hasaniya2026)", "error");
      }
    });
  }

  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isAdminLoggedIn = false;
      localStorage.setItem('hasaniya_admin_logged_in', 'false');
      updateAdminUI();
      showToast("Signed out of Admin Portal.", "success");
    });
  }

  const pubForm = document.getElementById('publishResultForm');
  if (pubForm) {
    pubForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const category = document.getElementById('pubCategory').value;
      const item = document.getElementById('pubItemName').value.trim();

      const w1Name = document.getElementById('w1Name').value.trim();
      const w1Team = document.getElementById('w1Team').value;
      const w1Grade = document.getElementById('w1Grade').value;

      const w2Name = document.getElementById('w2Name').value.trim();
      const w2Team = document.getElementById('w2Team').value;
      const w2Grade = document.getElementById('w2Grade').value;

      const w3Name = document.getElementById('w3Name').value.trim();
      const w3Team = document.getElementById('w3Team').value;
      const w3Grade = document.getElementById('w3Grade').value;

      const showPhotosPublicly = document.getElementById('pubShowPhotos')?.checked || false;

      if (!item || !w1Name || !w1Team || !w2Name || !w2Team || !w3Name || !w3Team) {
        showToast("Please fill all required category, item, team, and student fields!", "error");
        return;
      }

      const newResult = {
        id: 'res_' + Date.now(),
        category: category,
        item: item,
        showPhotosPublicly: showPhotosPublicly,
        winners: [
          { place: 1, name: w1Name, team: w1Team, grade: w1Grade, points: 10, photoUrl: pendingWinnerPhotos.w1 || null },
          { place: 2, name: w2Name, team: w2Team, grade: w2Grade, points: 7, photoUrl: pendingWinnerPhotos.w2 || null },
          { place: 3, name: w3Name, team: w3Team, grade: w3Grade, points: 5, photoUrl: pendingWinnerPhotos.w3 || null }
        ]
      };

      meeladResults.unshift(newResult);
      saveMeeladResults();

      // Reset photos state
      pendingWinnerPhotos = { w1: null, w2: null, w3: null };
      ['w1', 'w2', 'w3'].forEach(prefix => {
        const thumbEl = document.getElementById(`${prefix}PhotoThumb`);
        const labelEl = document.getElementById(`${prefix}PhotoLabel`);
        if (thumbEl) thumbEl.style.display = 'none';
        if (labelEl) {
          labelEl.innerHTML = `<i data-lucide="camera"></i> <span>Photo</span>`;
          labelEl.classList.remove('has-photo');
        }
      });

      populateItemSelectOptions();
      populateGeneratorPlayerOptions();
      renderMeeladResults();
      renderMeeladLeaderboard();
      renderCategoryStandings();
      renderLiveProgrammeCards();
      renderAdminResultsList();

      pubForm.reset();
      populateAdminFormItems('pubCategory', 'pubItemName');

      showToast(`Result Published Successfully for "${item}"!`, "success");

      const resultsTab = document.querySelector('.meelad-tab[data-tab="tab-results"]');
      if (resultsTab) resultsTab.click();
    });
  }
}

function updateAdminUI() {
  const loggedOutState = document.getElementById('adminLoggedOutState');
  const loggedInState = document.getElementById('adminLoggedInState');
  const navAdminBtn = document.getElementById('openAdminModalBtn');

  if (isAdminLoggedIn) {
    if (loggedOutState) loggedOutState.style.display = 'none';
    if (loggedInState) loggedInState.style.display = 'block';
    if (navAdminBtn) {
      navAdminBtn.innerHTML = '<i data-lucide="shield-check"></i> Admin Dashboard';
      navAdminBtn.classList.add('active');
    }
    renderAdminResultsList();
  } else {
    if (loggedOutState) loggedOutState.style.display = 'block';
    if (loggedInState) loggedInState.style.display = 'none';
    if (navAdminBtn) {
      navAdminBtn.innerHTML = '<i data-lucide="lock"></i> Admin Portal';
      navAdminBtn.classList.remove('active');
    }
  }
  initIcons();
}

function openAdminLoginModal() {
  const modal = document.getElementById('adminLoginModal');
  if (modal) {
    modal.classList.add('active');
    initIcons();
  }
}

function closeAdminLoginModal() {
  const modal = document.getElementById('adminLoginModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function renderAdminResultsList() {
  const container = document.getElementById('adminResultsList');
  if (!container) return;

  container.innerHTML = '';

  if (meeladResults.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--color-muted); padding: 20px;">No published results in database.</p>`;
    return;
  }

  meeladResults.forEach(res => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'admin-result-item';

    itemDiv.innerHTML = `
      <div class="admin-result-info">
        <div class="admin-result-header-line">
          <h4>${res.item}</h4>
          <span class="admin-cat-pill">${res.category}</span>
        </div>
        <p class="admin-winners-line">Winners: ${res.winners.map(w => `${w.name} (${w.team})`).join(', ')}</p>
      </div>
      <div class="admin-item-actions">
        <button class="btn-delete" data-id="${res.id}"><i data-lucide="trash-2"></i> Delete</button>
      </div>
    `;

    itemDiv.querySelector('.btn-delete').addEventListener('click', () => {
      deleteResult(res.id);
    });

    container.appendChild(itemDiv);
  });
  initIcons();
}

function deleteResult(resId) {
  const idx = meeladResults.findIndex(r => r.id === resId);
  if (idx !== -1) {
    const itemTitle = meeladResults[idx].item;
    meeladResults.splice(idx, 1);
    saveMeeladResults();

    populateItemSelectOptions();
    populateGeneratorPlayerOptions();
    renderMeeladResults();
    renderMeeladLeaderboard();
    renderAdminResultsList();

    showToast(`Deleted published result for "${itemTitle}".`, "success");
  }
}

// ----------------------------------------------------
// Program Catalog System Logic
// ----------------------------------------------------
const PROGRAM_CATALOG = [
  { id: 'p1', name: 'Qirat Recitation', category: 'HS Boys', type: 'Stage', group: 'Single' },
  { id: 'p2', name: 'Balloon pottikal', category: 'Kids Boys', type: 'Off-Stage', group: 'Single' },
  { id: 'p3', name: 'Manjadi perukal', category: 'Kids Girls', type: 'Off-Stage', group: 'Single' },
  { id: 'p4', name: 'Story telling', category: 'LP Boys', type: 'Stage', group: 'Single' },
  { id: 'p5', name: 'Pencil drawing', category: 'LP Girls', type: 'Off-Stage', group: 'Single' },
  { id: 'p6', name: 'Speech Malayalam', category: 'UP Boys', type: 'Stage', group: 'Single' },
  { id: 'p7', name: 'Arabic Song', category: 'UP Girls', type: 'Stage', group: 'Single' },
  { id: 'p8', name: 'Calligraphy (Arabic)', category: 'HS Girls', type: 'Off-Stage', group: 'Single' },
  { id: 'p9', name: 'Duffmuttu Performance', category: 'General Boys', type: 'Stage', group: 'Group' },
  { id: 'p10', name: 'Food fest', category: 'General Girls', type: 'Off-Stage', group: 'Group' },
  { id: 'p11', name: 'Islamic Song', category: 'HS Boys', type: 'Stage', group: 'Single' },
  { id: 'p12', name: 'Pencil sketch', category: 'General Boys', type: 'Off-Stage', group: 'Single' },
  { id: 'p13', name: 'Essay Writing (English)', category: 'HS Girls', type: 'Off-Stage', group: 'Single' },
  { id: 'p14', name: 'Elocution', category: 'UP Boys', type: 'Stage', group: 'Single' },
  { id: 'p15', name: 'Group Song', category: 'General Girls', type: 'Stage', group: 'Group' }
];

let activeProgTypeTab = 'all';

function initProgramCatalogSystem() {
  const tabs = document.querySelectorAll('.prog-tab');
  const catFilter = document.getElementById('progCategoryFilter');
  const searchInput = document.getElementById('progSearchInput');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeProgTypeTab = tab.getAttribute('data-type');
      renderProgramsCatalog();
    });
  });

  if (catFilter) {
    catFilter.addEventListener('change', renderProgramsCatalog);
  }

  if (searchInput) {
    searchInput.addEventListener('input', renderProgramsCatalog);
  }

  renderProgramsCatalog();
}

function renderProgramsCatalog() {
  const container = document.getElementById('programsGrid');
  const catFilter = document.getElementById('progCategoryFilter');
  const searchInput = document.getElementById('progSearchInput');
  const countBadge = document.getElementById('progCountDisplay');
  if (!container) return;

  const selCat = catFilter ? catFilter.value : 'all';
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const filtered = PROGRAM_CATALOG.filter(p => {
    // Type tab match
    if (activeProgTypeTab !== 'all') {
      if (activeProgTypeTab === 'Stage' && p.type !== 'Stage') return false;
      if (activeProgTypeTab === 'Off-Stage' && p.type !== 'Off-Stage') return false;
      if (activeProgTypeTab === 'Single' && p.group !== 'Single') return false;
      if (activeProgTypeTab === 'Group' && p.group !== 'Group') return false;
    }

    // Category match
    if (selCat !== 'all' && p.category !== selCat) return false;

    // Search query match
    if (query) {
      const matchName = p.name.toLowerCase().includes(query);
      const matchCat = p.category.toLowerCase().includes(query);
      const matchType = p.type.toLowerCase().includes(query);
      if (!matchName && !matchCat && !matchType) return false;
    }

    return true;
  });

  // Update counter badge
  if (countBadge) {
    countBadge.innerHTML = `<i data-lucide="check-circle-2"></i> Showing <strong>${filtered.length}</strong> of ${PROGRAM_CATALOG.length} Programs`;
  }

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="no-programs-card glass-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--color-muted); margin-bottom: 12px;"></i>
        <h3>No matching programs found</h3>
        <p style="color: var(--color-muted); margin-top: 6px;">Try clearing your search query or selecting a different category filter.</p>
      </div>
    `;
    initIcons();
    return;
  }

  filtered.forEach(prog => {
    const pubMatch = meeladResults.find(r => r.item.toLowerCase() === prog.name.toLowerCase() && r.category === prog.category);
    const hasPublished = !!pubMatch;

    const card = document.createElement('div');
    card.className = 'program-card glass-card';

    card.innerHTML = `
      <div class="prog-card-top">
        <span class="prog-badge category-badge">${prog.category}</span>
        <div class="prog-type-tags">
          <span class="prog-badge type-badge ${prog.type.toLowerCase()}">
            <i data-lucide="${prog.type === 'Stage' ? 'mic' : 'edit-3'}"></i> ${prog.type}
          </span>
          <span class="prog-badge group-badge">${prog.group}</span>
        </div>
      </div>
      <div class="prog-card-body">
        <h3 class="prog-title">${prog.name}</h3>
      </div>
      <div class="prog-card-footer">
        <span class="pub-status-tag ${hasPublished ? 'status-published' : 'status-pending'}">
          <i data-lucide="${hasPublished ? 'award' : 'clock'}"></i>
          ${hasPublished ? '3 Results Published' : 'Scheduled / Pending'}
        </span>
        <button class="btn btn-sm btn-outline view-prog-btn" data-item="${prog.name}">
          ${hasPublished ? 'View Results' : 'Explore Item'}
        </button>
      </div>
    `;

    card.querySelector('.view-prog-btn').addEventListener('click', () => {
      const sweetSection = document.getElementById('sweet-mahabba');
      if (sweetSection) {
        sweetSection.scrollIntoView({ behavior: 'smooth' });
        const itemSelect = document.getElementById('itemSelect');
        if (itemSelect && hasPublished) {
          itemSelect.value = pubMatch.id;
          itemSelect.dispatchEvent(new Event('change'));
        }
        const searchInp = document.getElementById('resultSearchInput');
        if (searchInp) {
          searchInp.value = prog.name;
          searchInp.dispatchEvent(new Event('input'));
        }
      }
    });

    container.appendChild(card);
  });

  initIcons();
}





