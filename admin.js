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

let meeladGalleryItems = [
  { id: 'g1', type: 'photo', title: 'Qirat Recitation Stage Performance', category: 'Stage Competition', src: 'assets/gallery_1.jpg', desc: 'Senior student delivering Qirat recitation on the main illuminated Meelad Fest stage.' },
  { id: 'g2', type: 'photo', title: 'Arabic Calligraphy Exhibition', category: 'Off-Stage Art', src: 'assets/gallery_2.jpg', desc: 'Detailed close-up of handwritten student Arabic calligraphy created live during competition.' },
  { id: 'g3', type: 'photo', title: 'Grand Duffmuttu Performance', category: 'Group Event', src: 'assets/gallery_3.jpg', desc: 'Team Granada performing traditional Duffmuttu with white traditional attire and drums.' },
  { id: 'g4', type: 'video', title: 'Meelad Fest Opening Highlights', category: 'Video Highlight', src: 'assets/gallery_1.jpg', duration: '03:45', desc: 'Watch video highlights of the inauguration ceremony and opening speeches.' },
  { id: 'g5', type: 'video', title: 'Calligraphy & Student Art Showcase', category: 'Exhibition Video', src: 'assets/gallery_2.jpg', duration: '02:30', desc: 'Video tour of handwritten magazine preservation and student calligraphy gallery.' },
  { id: 'g6', type: 'video', title: 'Duffmuttu & Song Final Performances', category: 'Stage Performance', src: 'assets/gallery_3.jpg', duration: '04:15', desc: 'Full stage video highlights of Duffmuttu and group song finals.' }
];

const savedGallery = localStorage.getItem('hasaniya_gallery_items');
if (savedGallery) {
  try { meeladGalleryItems = JSON.parse(savedGallery); } catch(e){}
}

function saveSaGallery() {
  try {
    const storableItems = meeladGalleryItems.map(item => {
      if (item.src && item.src.startsWith('blob:')) {
        return { ...item, src: 'assets/gallery_1.jpg' };
      }
      return item;
    });
    localStorage.setItem('hasaniya_gallery_items', JSON.stringify(storableItems));
  } catch (e) {
    console.warn("Storage quota warning in standalone admin:", e);
  }
}

let saPendingMediaFile = null;

function setupSaMediaManagement() {
  const fileInput = document.getElementById('saMediaFileInput');
  const fileBtn = document.getElementById('saMediaFileBtn');
  const addForm = document.getElementById('saAddMediaForm');
  const publishBtn = document.getElementById('saPublishMediaBtn');

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        saPendingMediaFile = file;

        const typeSelect = document.getElementById('saMediaType');
        if (typeSelect && file.type.startsWith('video/')) {
          typeSelect.value = 'video';
        } else if (typeSelect && file.type.startsWith('image/')) {
          typeSelect.value = 'photo';
        }

        if (fileBtn) {
          fileBtn.innerHTML = `<i data-lucide="check-circle"></i> ${file.name}`;
          fileBtn.classList.add('btn-success');
        }
        initIcons();
      }
    });
  }

  let isSubmitting = false;

  function handleSaPublish(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSubmitting) return;

    const typeSelect = document.getElementById('saMediaType');
    let type = typeSelect?.value || 'photo';
    const urlInput = document.getElementById('saMediaUrlInput')?.value.trim();

    if (!saPendingMediaFile && !urlInput) {
      showToast("Please select a photo/video file or enter a URL first!", "error");
      return;
    }

    isSubmitting = true;

    function processAndSave(srcUrl, fileName) {
      if (saPendingMediaFile && saPendingMediaFile.type.startsWith('video/')) {
        type = 'video';
      }

      const isVideo = type === 'video';
      const itemTitle = fileName
        ? (isVideo ? `Video: ${fileName}` : `Photo: ${fileName}`)
        : (isVideo ? 'Meelad Fest Video Highlight' : 'Meelad Fest Program Photo');

      const newItem = {
        id: 'g_' + Date.now(),
        type: type,
        title: itemTitle,
        category: isVideo ? 'Video Highlight' : 'Gallery Photo',
        src: srcUrl,
        duration: isVideo ? 'Video Stream' : undefined,
        desc: isVideo ? 'Uploaded video highlight of Meelad Fest program performance.' : 'Uploaded photograph from Meelad Fest events.'
      };

      meeladGalleryItems.unshift(newItem);
      saveSaGallery();

      saPendingMediaFile = null;
      if (fileInput) fileInput.value = '';
      if (fileBtn) {
        fileBtn.innerHTML = `<i data-lucide="upload-cloud"></i> Choose File`;
        fileBtn.classList.remove('btn-success');
      }

      if (addForm) addForm.reset();
      renderSaMediaList();

      showToast(`Published new ${type} to gallery successfully!`, "success");
      setTimeout(() => { isSubmitting = false; }, 400);
    }

    if (saPendingMediaFile) {
      if (saPendingMediaFile.type.startsWith('video/')) {
        const objectUrl = URL.createObjectURL(saPendingMediaFile);
        processAndSave(objectUrl, saPendingMediaFile.name);
      } else {
        const reader = new FileReader();
        reader.onload = (evt) => {
          processAndSave(evt.target.result, saPendingMediaFile.name);
        };
        reader.onerror = () => {
          showToast("Error reading selected file.", "error");
          isSubmitting = false;
        };
        reader.readAsDataURL(saPendingMediaFile);
      }
    } else {
      processAndSave(urlInput, null);
    }
  }

  if (addForm) {
    addForm.addEventListener('submit', handleSaPublish);
  }
  if (publishBtn) {
    publishBtn.addEventListener('click', (e) => {
      handleSaPublish(e);
    });
  }

  renderSaMediaList();
}

function renderSaMediaList() {
  const container = document.getElementById('saMediaList');
  if (!container) return;

  container.innerHTML = '';

  if (meeladGalleryItems.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--color-muted); grid-column: 1/-1; padding: 20px;">No gallery media published.</p>`;
    return;
  }

  meeladGalleryItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'admin-media-card';

    card.innerHTML = `
      <div class="admin-media-thumb">
        <img src="${item.src}" alt="${item.title}" onerror="this.src='assets/logo.jpg'">
        <span class="media-type-badge ${item.type}">${item.type.toUpperCase()}</span>
      </div>
      <div class="admin-media-info">
        <h5>${item.title}</h5>
        <span class="media-cat-text">${item.category}</span>
      </div>
      <button class="btn-delete-media" data-id="${item.id}" title="Remove Media from Public Gallery">
        <i data-lucide="trash-2"></i> Remove
      </button>
    `;

    card.querySelector('.btn-delete-media').addEventListener('click', () => {
      deleteSaGalleryMedia(item.id);
    });

    container.appendChild(card);
  });

  initIcons();
}

function deleteSaGalleryMedia(id) {
  const idx = meeladGalleryItems.findIndex(m => m.id === id);
  if (idx !== -1) {
    const title = meeladGalleryItems[idx].title;
    meeladGalleryItems.splice(idx, 1);
    saveSaGallery();
    renderSaMediaList();
    showToast(`Removed "${title}" from program gallery.`, "success");
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
    setupSaMediaManagement();
  } else {
    if (loginSection) loginSection.style.display = 'block';
    if (dashSection) dashSection.style.display = 'none';
  }
  initIcons();
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

let saPendingPhotos = { w1: null, w2: null, w3: null };

function setupSaPhotoInputs() {
  ['saW1', 'saW2', 'saW3'].forEach(prefix => {
    const inputEl = document.getElementById(`${prefix}PhotoInput`);
    const labelEl = document.getElementById(`${prefix}PhotoLabel`);
    const thumbEl = document.getElementById(`${prefix}PhotoThumb`);

    if (inputEl) {
      inputEl.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const key = prefix.replace('saW', 'w');
            saPendingPhotos[key] = evt.target.result;
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

function setupEventHandlers() {
  // Initialize form populating & photo inputs
  populateAdminFormItems('saCategory', 'saItemName');
  populateAdminFormStudents('saW1Team', 'saW1Name', 'saCategory');
  populateAdminFormStudents('saW2Team', 'saW2Name', 'saCategory');
  populateAdminFormStudents('saW3Team', 'saW3Name', 'saCategory');
  setupSaPhotoInputs();

  const saCategoryEl = document.getElementById('saCategory');
  if (saCategoryEl) {
    saCategoryEl.addEventListener('change', () => {
      populateAdminFormItems('saCategory', 'saItemName');
      populateAdminFormStudents('saW1Team', 'saW1Name', 'saCategory');
      populateAdminFormStudents('saW2Team', 'saW2Name', 'saCategory');
      populateAdminFormStudents('saW3Team', 'saW3Name', 'saCategory');
    });
  }

  ['saW1Team', 'saW2Team', 'saW3Team'].forEach((teamId, idx) => {
    const teamEl = document.getElementById(teamId);
    const studentId = `saW${idx + 1}Name`;
    if (teamEl) {
      teamEl.addEventListener('change', () => {
        populateAdminFormStudents(teamId, studentId, 'saCategory');
      });
    }
  });

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

      const showPhotosPublicly = document.getElementById('saShowPhotos')?.checked || false;

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
          { place: 1, name: w1Name, team: w1Team, grade: w1Grade, points: 10, photoUrl: saPendingPhotos.w1 || null },
          { place: 2, name: w2Name, team: w2Team, grade: w2Grade, points: 7, photoUrl: saPendingPhotos.w2 || null },
          { place: 3, name: w3Name, team: w3Team, grade: w3Grade, points: 5, photoUrl: saPendingPhotos.w3 || null }
        ]
      };

      meeladResults.unshift(newResult);
      saveResults();

      // Reset pending photos
      saPendingPhotos = { w1: null, w2: null, w3: null };
      ['saW1', 'saW2', 'saW3'].forEach(prefix => {
        const thumbEl = document.getElementById(`${prefix}PhotoThumb`);
        const labelEl = document.getElementById(`${prefix}PhotoLabel`);
        if (thumbEl) thumbEl.style.display = 'none';
        if (labelEl) {
          labelEl.innerHTML = `<i data-lucide="camera"></i> <span>Photo</span>`;
          labelEl.classList.remove('has-photo');
        }
      });

      renderResultsList();
      pubForm.reset();
      populateAdminFormItems('saCategory', 'saItemName');

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

    const isPublicPhotos = !!res.showPhotosPublicly;
    const hasPhotos = res.winners.some(w => !!w.photoUrl);

    itemDiv.innerHTML = `
      <div class="admin-result-info">
        <div class="admin-result-header-line">
          <h4>${res.item}</h4>
          <span class="admin-cat-pill">${res.category}</span>
        </div>
        <p class="admin-winners-line">Winners: ${res.winners.map(w => `${w.name} (${w.team})`).join(', ')}</p>
        <div class="admin-photo-toggle-bar">
          <label class="toggle-switch-container compact">
            <input type="checkbox" class="admin-photo-toggle" data-id="${res.id}" ${isPublicPhotos ? 'checked' : ''}>
            <span class="toggle-slider"></span>
            <span class="toggle-label-text">
              ${isPublicPhotos ? '<i data-lucide="eye"></i> Winner Photos Publicly Visible' : '<i data-lucide="eye-off"></i> Winner Photos Hidden (Admin Only)'}
            </span>
          </label>
          ${hasPhotos ? '<span class="photos-count-badge"><i data-lucide="image"></i> Photos Saved</span>' : '<span class="photos-count-badge no-photos">No Photos Uploaded</span>'}
        </div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-delete" data-id="${res.id}"><i data-lucide="trash-2"></i> Delete</button>
      </div>
    `;

    const toggleInput = itemDiv.querySelector('.admin-photo-toggle');
    if (toggleInput) {
      toggleInput.addEventListener('change', (e) => {
        const targetRes = meeladResults.find(r => r.id === res.id);
        if (targetRes) {
          targetRes.showPhotosPublicly = e.target.checked;
          saveResults();
          renderResultsList();
          showToast(
            targetRes.showPhotosPublicly ? `Winner photos for "${res.item}" are now PUBLIC!` : `Winner photos for "${res.item}" are now HIDDEN from public.`,
            "success"
          );
        }
      });
    }

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
