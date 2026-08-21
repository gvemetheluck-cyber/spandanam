// ----------------------------------------------------
// Madarasathul Hasaniya - Students Portal Script
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

let currentStep = 1;
let selectedTeam = null;
let selectedStudent = null;
let activeGenderFilter = 'all';
let studentSearchQuery = '';

let meeladResults = [];

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  loadResultsFromStorage();
  setupNavigation();
  setupStep1Events();
  setupStep2Events();
  setupStep3Events();
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

// ----------------------------------------------------
// Stepper Navigation Logic
// ----------------------------------------------------
function goToStep(stepNum) {
  currentStep = stepNum;

  // Update step views with smooth animation
  const views = [
    document.getElementById('step1View'),
    document.getElementById('step2View'),
    document.getElementById('step3View')
  ];

  views.forEach((v, idx) => {
    if (!v) return;
    if (idx + 1 === stepNum) {
      v.classList.add('active');
      v.style.animation = 'none';
      // Trigger reflow for animation restart
      void v.offsetHeight;
      v.style.animation = 'slideUpFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    } else {
      v.classList.remove('active');
    }
  });

  // Update stepper indicator icons
  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById(`stepIndicator${i}`);
    const line = document.getElementById(`stepLine${i}`);
    if (indicator) {
      if (i < stepNum) {
        indicator.className = 'stepper-step completed';
        indicator.querySelector('.step-num').innerHTML = '<i data-lucide="check" style="width:14px;height:14px;"></i>';
      } else if (i === stepNum) {
        indicator.className = 'stepper-step active';
        indicator.querySelector('.step-num').textContent = `${i}`;
      } else {
        indicator.className = 'stepper-step';
        indicator.querySelector('.step-num').textContent = `${i}`;
      }
    }
    if (line) {
      if (i < stepNum) {
        line.classList.add('active');
      } else {
        line.classList.remove('active');
      }
    }
  }

  window.scrollTo({ top: 120, behavior: 'smooth' });
  initIcons();
}

// ----------------------------------------------------
// Step 1: Team Selection
// ----------------------------------------------------
function setupStep1Events() {
  const teamCards = document.querySelectorAll('.team-select-card');
  teamCards.forEach(card => {
    card.addEventListener('click', () => {
      const team = card.getAttribute('data-team');
      if (team) {
        selectedTeam = team;
        document.getElementById('selectedTeamPill').textContent = `Team: ${team === 'Kairo' ? 'Cairo (Kairo)' : team}`;
        document.getElementById('selectedTeamPill').className = `active-team-pill team-${team}`;
        renderStudentsList();
        goToStep(2);
      }
    });
  });
}

// ----------------------------------------------------
// Step 2: Student Selection
// ----------------------------------------------------
function setupStep2Events() {
  const backToStep1Btn = document.getElementById('backToStep1Btn');
  const searchInput = document.getElementById('studentSearchInput');
  const genderTabs = document.querySelectorAll('.gender-tab-btn');

  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
      selectedStudent = null;
      goToStep(1);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      studentSearchQuery = e.target.value.toLowerCase().trim();
      renderStudentsList();
    });
  }

  genderTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      genderTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeGenderFilter = tab.getAttribute('data-gender');
      renderStudentsList();
    });
  });
}

function renderStudentsList() {
  const grid = document.getElementById('studentsListGrid');
  if (!grid || !selectedTeam || !TEAM_STUDENTS[selectedTeam]) return;

  grid.innerHTML = '';

  const boys = TEAM_STUDENTS[selectedTeam].boys || [];
  const girls = TEAM_STUDENTS[selectedTeam].girls || [];

  let pool = [];
  if (activeGenderFilter === 'boys') {
    pool = boys.map(name => ({ name, gender: 'boy' }));
  } else if (activeGenderFilter === 'girls') {
    pool = girls.map(name => ({ name, gender: 'girl' }));
  } else {
    pool = [
      ...boys.map(name => ({ name, gender: 'boy' })),
      ...girls.map(name => ({ name, gender: 'girl' }))
    ];
  }

  if (studentSearchQuery) {
    pool = pool.filter(s => s.name.toLowerCase().includes(studentSearchQuery));
  }

  if (pool.length === 0) {
    grid.innerHTML = `
      <div class="no-students-found" style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <i data-lucide="user-x" style="width: 48px; height: 48px; color: var(--color-muted); margin-bottom: 12px;"></i>
        <h3>No matching students found</h3>
        <p style="color: var(--color-muted); font-size: 0.9rem;">Try searching for a different student name or resetting the gender filter.</p>
      </div>
    `;
    initIcons();
    return;
  }

  pool.forEach(student => {
    const card = document.createElement('div');
    card.className = 'student-item-card glass-card';

    const isSelected = selectedStudent === student.name;
    if (isSelected) card.classList.add('selected');

    const firstLetter = student.name.charAt(0).toUpperCase();

    card.innerHTML = `
      <div class="student-item-left">
        <div class="student-avatar-initial ${student.gender}">${firstLetter}</div>
        <div class="student-name-box">
          <h4>${student.name}</h4>
          <span class="student-meta-tag">${selectedTeam} • ${student.gender === 'boy' ? 'Boy' : 'Girl'}</span>
        </div>
      </div>
      <button class="btn btn-sm ${isSelected ? 'btn-success' : 'btn-outline'} btn-select-student">
        ${isSelected ? '<i data-lucide="check"></i> Selected' : 'View Results'}
      </button>
    `;

    card.addEventListener('click', () => {
      selectedStudent = student.name;
      loadStudentResultsDashboard(student.name);
      goToStep(3);
    });

    grid.appendChild(card);
  });

  initIcons();
}

// ----------------------------------------------------
// Step 3: Results Dashboard View
// ----------------------------------------------------
function setupStep3Events() {
  const backToStep2Btn = document.getElementById('backToStep2Btn');
  const restartFlowBtn = document.getElementById('restartFlowBtn');

  if (backToStep2Btn) {
    backToStep2Btn.addEventListener('click', () => {
      goToStep(2);
    });
  }

  if (restartFlowBtn) {
    restartFlowBtn.addEventListener('click', () => {
      selectedStudent = null;
      selectedTeam = null;
      goToStep(1);
    });
  }
}

function loadStudentResultsDashboard(studentName) {
  loadResultsFromStorage();

  const avatarInitials = document.getElementById('studentAvatarInitials');
  const profileName = document.getElementById('profileStudentName');
  const profileBadge = document.getElementById('profileTeamBadge');
  const profileCountPill = document.getElementById('profileResultsCount');

  const statTotalPoints = document.getElementById('statTotalPoints');
  const statFirstPlaces = document.getElementById('statFirstPlaces');
  const statTotalPlacements = document.getElementById('statTotalPlacements');
  const resultsGrid = document.getElementById('studentResultsCardsGrid');

  if (avatarInitials) avatarInitials.textContent = studentName.charAt(0).toUpperCase();
  if (profileName) profileName.textContent = studentName;
  if (profileBadge) {
    profileBadge.textContent = selectedTeam === 'Kairo' ? 'Cairo (Kairo)' : selectedTeam;
    profileBadge.className = `team-badge-pill team-${selectedTeam}`;
  }

  // Find all results where this student placed 1st, 2nd, or 3rd
  const studentPlacements = [];
  meeladResults.forEach(res => {
    const winnerObj = res.winners.find(w => w.name.toLowerCase() === studentName.toLowerCase());
    if (winnerObj) {
      studentPlacements.push({
        resultObj: res,
        winnerObj: winnerObj
      });
    }
  });

  let totalPoints = 0;
  let firstPlacesCount = 0;
  studentPlacements.forEach(p => {
    totalPoints += p.winnerObj.points;
    if (p.winnerObj.place === 1) firstPlacesCount++;
  });

  if (statTotalPoints) statTotalPoints.textContent = totalPoints;
  if (statFirstPlaces) statFirstPlaces.textContent = firstPlacesCount;
  if (statTotalPlacements) statTotalPlacements.textContent = studentPlacements.length;
  if (profileCountPill) {
    profileCountPill.innerHTML = `<i data-lucide="award"></i> ${studentPlacements.length} Published Award${studentPlacements.length === 1 ? '' : 's'}`;
  }

  if (!resultsGrid) return;
  resultsGrid.innerHTML = '';

  if (studentPlacements.length === 0) {
    // Elegant 'No competition result yet' Card
    resultsGrid.innerHTML = `
      <div class="no-results-card glass-card">
        <div class="no-results-icon-circle">
          <i data-lucide="award" style="width: 48px; height: 48px; color: #94a3b8;"></i>
        </div>
        <h3>No competition result yet</h3>
        <p>Results for <strong>${studentName}</strong> have not been published by the management panel yet. Please check back soon for live updates!</p>
        <button class="btn btn-outline" onclick="goToStep(2)" style="margin-top: 16px;">
          <i data-lucide="arrow-left"></i> Check Another Student
        </button>
      </div>
    `;
    initIcons();
    return;
  }

  // Render published results cards for this student
  studentPlacements.forEach(p => {
    const res = p.resultObj;
    const win = p.winnerObj;

    const card = document.createElement('div');
    card.className = `student-award-card glass-card place-${win.place}`;

    let placeLabel = '1st Place';
    if (win.place === 2) placeLabel = '2nd Place';
    if (win.place === 3) placeLabel = '3rd Place';

    card.innerHTML = `
      <div class="award-card-header">
        <span class="award-place-tag place-${win.place}">${placeLabel}</span>
        <span class="award-grade-tag">${win.grade}</span>
      </div>
      <div class="award-card-body">
        <h4 class="award-item-title">${res.item}</h4>
        <span class="award-cat-name">${res.category}</span>
      </div>
      <div class="award-card-footer">
        <span class="award-points-text"><i data-lucide="star"></i> ${win.points} Points</span>
        <button class="btn btn-sm btn-sweet view-cert-btn">
          <i data-lucide="award"></i> Certificate
        </button>
      </div>
    `;

    card.querySelector('.view-cert-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openResultModal(win, res);
    });

    resultsGrid.appendChild(card);
  });

  initIcons();
}

// ----------------------------------------------------
// Certificate Modal & JPG Download Handler
// ----------------------------------------------------
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
