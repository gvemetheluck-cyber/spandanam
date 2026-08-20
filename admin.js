/* admin.js - Standalone Admin Portal Script */

// Default Credentials
let adminUser = localStorage.getItem('hasaniya_admin_user') || 'admin';
let adminPass = localStorage.getItem('hasaniya_admin_pass') || 'hasaniya2026';
let isAdminLoggedIn = localStorage.getItem('hasaniya_admin_logged_in') === 'true';

// Published Results Data
let meeladResults = [
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
  }
];

let savedResults = localStorage.getItem('hasaniya_published_results');
if (savedResults) {
  try {
    meeladResults = JSON.parse(savedResults);
  } catch (e) {
    console.error("Failed to parse saved results:", e);
  }
}

function saveResults() {
  localStorage.setItem('hasaniya_published_results', JSON.stringify(meeladResults));
}

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  updateUI();
  setupEventHandlers();
});

function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function updateUI() {
  const loginSection = document.getElementById('adminLoginSection');
  const dashSection = document.getElementById('adminDashboardSection');
  const dispUser = document.getElementById('dispUser');
  const dispPass = document.getElementById('dispPass');

  if (dispUser) dispUser.textContent = adminUser;
  if (dispPass) dispPass.textContent = adminPass;

  if (isAdminLoggedIn) {
    if (loginSection) loginSection.style.display = 'none';
    if (dashSection) dashSection.style.display = 'block';
    renderResultsList();
  } else {
    if (loginSection) loginSection.style.display = 'block';
    if (dashSection) dashSection.style.display = 'none';
  }
  initIcons();
}

function setupEventHandlers() {
  // Login Form
  const loginForm = document.getElementById('standaloneLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('saUsername').value.trim();
      const pass = document.getElementById('saPassword').value.trim();

      if (user === adminUser && pass === adminPass) {
        isAdminLoggedIn = true;
        localStorage.setItem('hasaniya_admin_logged_in', 'true');
        updateUI();
        showToast("Signed in successfully to Admin Portal!", "success");
      } else {
        showToast(`Invalid credentials! Use ${adminUser} / ${adminPass}`, "error");
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById('saLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isAdminLoggedIn = false;
      localStorage.setItem('hasaniya_admin_logged_in', 'false');
      updateUI();
      showToast("Signed out of Admin Portal.", "success");
    });
  }

  // Publish Result Form
  const pubForm = document.getElementById('saPublishForm');
  if (pubForm) {
    pubForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const category = document.getElementById('saCategory').value;
      const item = document.getElementById('saItemName').value.trim();

      const w1Name = document.getElementById('saW1Name').value.trim();
      const w1Team = document.getElementById('saW1Team').value;
      const w1Grade = document.getElementById('saW1Grade').value;

      const w2Name = document.getElementById('saW2Name').value.trim();
      const w2Team = document.getElementById('saW2Team').value;
      const w2Grade = document.getElementById('saW2Grade').value;

      const w3Name = document.getElementById('saW3Name').value.trim();
      const w3Team = document.getElementById('saW3Team').value;
      const w3Grade = document.getElementById('saW3Grade').value;

      const newResult = {
        id: 'res_' + Date.now(),
        category: category,
        item: item,
        winners: [
          { place: 1, name: w1Name, team: w1Team, grade: w1Grade, points: 10 },
          { place: 2, name: w2Name, team: w2Team, grade: w2Grade, points: 7 },
          { place: 3, name: w3Name, team: w3Team, grade: w3Grade, points: 5 }
        ]
      };

      meeladResults.unshift(newResult);
      saveResults();

      renderResultsList();
      pubForm.reset();

      showToast(`Published competition result for "${item}" successfully!`, "success");
    });
  }

  // Change Credentials Modal
  const credsBtn = document.getElementById('changeCredsBtn');
  const credsModal = document.getElementById('credsModal');
  const closeCredsModal = document.getElementById('closeCredsModal');

  if (credsBtn && credsModal) {
    credsBtn.addEventListener('click', () => {
      document.getElementById('newUsername').value = adminUser;
      document.getElementById('newPassword').value = adminPass;
      credsModal.classList.add('active');
      initIcons();
    });
  }

  if (closeCredsModal && credsModal) {
    closeCredsModal.addEventListener('click', () => {
      credsModal.classList.remove('active');
    });
  }

  const updateCredsForm = document.getElementById('updateCredsForm');
  if (updateCredsForm) {
    updateCredsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newUser = document.getElementById('newUsername').value.trim();
      const newPass = document.getElementById('newPassword').value.trim();

      if (newUser && newPass) {
        adminUser = newUser;
        adminPass = newPass;
        localStorage.setItem('hasaniya_admin_user', adminUser);
        localStorage.setItem('hasaniya_admin_pass', adminPass);

        if (credsModal) credsModal.classList.remove('active');
        updateUI();
        showToast(`Credentials updated! Username: ${adminUser}`, "success");
      }
    });
  }
}

function renderResultsList() {
  const container = document.getElementById('saResultsList');
  if (!container) return;

  container.innerHTML = '';

  if (meeladResults.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--color-muted); padding: 20px;">No published results found.</p>`;
    return;
  }

  meeladResults.forEach(res => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'admin-result-item';

    itemDiv.innerHTML = `
      <div class="admin-result-info">
        <h4>${res.item}</h4>
        <p>Category: <strong>${res.category}</strong> | Winners: ${res.winners.map(w => w.name).join(', ')}</p>
      </div>
      <button class="btn-delete" data-id="${res.id}">Delete</button>
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
    const title = meeladResults[idx].item;
    meeladResults.splice(idx, 1);
    saveResults();
    renderResultsList();
    showToast(`Deleted published result for "${title}".`, "success");
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let iconName = type === 'error' ? 'alert-triangle' : 'check-circle';
  
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
