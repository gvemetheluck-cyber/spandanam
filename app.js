/* app.js */

// Global State
let currentMagazine = null;
let currentSheetIndex = 0; // For desktop (3D flip)
let currentMobilePageIndex = 0; // For mobile (single page slide)
let loadedMagazines = [];
let db = null;
let prevMobilePageIndex = 0; // Track previous page for mobile transitions

// Static default magazine registration
const STATIC_MAGAZINES = [
  {
    id: 'sweet_of_mahabba',
    title: 'Sweet Of Mahabba - Special Edition',
    description: 'Special Edition Student Calligraphy & Literary Collection from Madarasathul Hasaniya',
    writers: ['Fathima Riza (Editor)', 'Aisha Raihana (Calligraphy)', 'Muhammed Sa-ad (Articles)', 'Nafih Hasani (Art)', 'Zubair Al-Hasani (Cover)'],
    pages: [
      'assets/default_magazine/spandanam_1.jpg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.40 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.41 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.42 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.45 AM.jpeg',
      'assets/default_magazine/spandanam_2.jpg'
    ]
  },
  {
    id: 'al_hasaniya_v1',
    title: 'Al-Hasaniya Voice - Vol 1 (Sample)',
    description: 'Annual Student Special Edition 2026',
    writers: ['Abdullah K', 'Mariyam Bilal', 'Zainaba Farha', 'Hassan Patel'],
    pages: [
      'assets/default_magazine/page1.jpg',
      'assets/default_magazine/page2.jpg',
      'assets/default_magazine/page3.jpg',
      'assets/default_magazine/page4.jpg'
    ]
  }
];

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
  initMeeladFestSystem();
  initIndexedDB()
    .then(() => loadAllMagazines())
    .then(() => {
      populateMagazineDropdown();
      selectMagazine(STATIC_MAGAZINES[0].id);
    })
    .catch(err => {
      console.error("Failed to initialize IndexedDB:", err);
      // Fallback: just load static magazine
      loadedMagazines = [...STATIC_MAGAZINES];
      populateMagazineDropdown();
      selectMagazine(STATIC_MAGAZINES[0].id);
      showToast("Storage error. Uploads will not persist.", "error");
    });

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
// IndexedDB Database Access
// ----------------------------------------------------
function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('HasaniyaMagazineDB', 1);

    request.onerror = (event) => reject(event.target.error);
    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('magazines')) {
        db.createObjectStore('magazines', { keyPath: 'id' });
      }
    };
  });
}

// Load all magazines from IndexedDB and merge with static list
function loadAllMagazines() {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve([...STATIC_MAGAZINES]);
      return;
    }

    const transaction = db.transaction(['magazines'], 'readonly');
    const store = transaction.objectStore('magazines');
    const request = store.getAll();

    request.onerror = (event) => reject(event.target.error);
    request.onsuccess = (event) => {
      const userMagazines = event.target.result || [];
      loadedMagazines = [...STATIC_MAGAZINES, ...userMagazines];
      resolve(loadedMagazines);
    };
  });
}

// Save magazine to IndexedDB
function saveMagazineToDB(magazine) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    const transaction = db.transaction(['magazines'], 'readwrite');
    const store = transaction.objectStore('magazines');
    const request = store.put(magazine);

    request.onerror = (event) => reject(event.target.error);
    request.onsuccess = () => resolve();
  });
}

// ----------------------------------------------------
// Magazine UI & Viewer Logic
// ----------------------------------------------------
function populateMagazineDropdown() {
  const select = document.getElementById('magazineSelect');
  if (!select) return;
  select.innerHTML = '';
  
  loadedMagazines.forEach(mag => {
    const opt = document.createElement('option');
    opt.value = mag.id;
    opt.textContent = mag.title;
    select.appendChild(opt);
  });
}

function selectMagazine(id) {
  const magazine = loadedMagazines.find(m => m.id === id);
  if (!magazine) return;

  currentMagazine = magazine;
  currentSheetIndex = 0;
  currentMobilePageIndex = 0;

  renderBook();
  updateViewerUI();
  updateMagazineDetailsCard();
}

// Build Book structure dynamically
function renderBook() {
  const book = document.getElementById('magazineBook');
  if (!book) return;
  book.innerHTML = '';

  const isMobile = window.innerWidth < 768;
  const pages = currentMagazine.pages;

  if (isMobile) {
    // Mobile rendering: flat pages list
    pages.forEach((pageSrc, index) => {
      const sheetDiv = document.createElement('div');
      sheetDiv.className = 'sheet';
      sheetDiv.id = `sheet-${index}`;
      
      const frontPage = document.createElement('div');
      frontPage.className = 'page front';
      
      const content = document.createElement('div');
      content.className = 'page-content';
      
      const img = document.createElement('img');
      img.src = pageSrc;
      img.alt = `Page ${index + 1}`;
      img.className = 'page-img';
      img.loading = 'lazy';

      content.appendChild(img);
      frontPage.appendChild(content);
      sheetDiv.appendChild(frontPage);
      book.appendChild(sheetDiv);
    });
  } else {
    // Desktop rendering: 3D Sheets
    // Page 0 is Cover (Sheet 0 Front). Page 1 is Sheet 0 Back. Page 2 is Sheet 1 Front, etc.
    const numSheets = Math.ceil(pages.length / 2);
    
    for (let i = 0; i < numSheets; i++) {
      const sheetDiv = document.createElement('div');
      sheetDiv.className = 'sheet';
      sheetDiv.id = `sheet-${i}`;

      // Front Page
      const frontPage = document.createElement('div');
      frontPage.className = 'page front';
      const frontContent = document.createElement('div');
      frontContent.className = 'page-content';
      
      const frontImg = document.createElement('img');
      frontImg.src = pages[2 * i];
      frontImg.alt = `Page ${2 * i + 1}`;
      frontImg.className = 'page-img';
      frontImg.loading = 'lazy';
      
      frontContent.appendChild(frontImg);
      frontPage.appendChild(frontContent);
      sheetDiv.appendChild(frontPage);

      // Back Page (if it exists)
      const backPage = document.createElement('div');
      backPage.className = 'page back';
      const backContent = document.createElement('div');
      backContent.className = 'page-content';

      if (2 * i + 1 < pages.length) {
        const backImg = document.createElement('img');
        backImg.src = pages[2 * i + 1];
        backImg.alt = `Page ${2 * i + 2}`;
        backImg.className = 'page-img';
        backImg.loading = 'lazy';
        backContent.appendChild(backImg);
      } else {
        // Blank page at the end if odd page count
        const blankNotice = document.createElement('div');
        blankNotice.style.margin = 'auto';
        blankNotice.style.color = '#a0aec0';
        blankNotice.style.fontSize = '0.9rem';
        blankNotice.textContent = 'End of Magazine';
        backContent.appendChild(blankNotice);
        backContent.style.justifyContent = 'center';
        backContent.style.alignItems = 'center';
      }
      
      // Page turn curl overlay effect
      const overlay = document.createElement('div');
      overlay.className = 'sheet-turn-overlay';
      
      backPage.appendChild(backContent);
      sheetDiv.appendChild(backPage);
      sheetDiv.appendChild(overlay);
      book.appendChild(sheetDiv);
    }
  }

  // Set initial sheet transforms and z-indexes
  updateBookLayout();
}

// Apply visual transforms to sheets based on state
function updateBookLayout() {
  const isMobile = window.innerWidth < 768;
  const sheets = document.querySelectorAll('#magazineBook .sheet');
  const numSheets = sheets.length;

  if (isMobile) {
    // Mobile slide display with page-turning animations
    sheets.forEach((sheet, idx) => {
      sheet.classList.remove('active-sheet', 'turn-enter-next', 'turn-exit-next', 'turn-enter-prev', 'turn-exit-prev');
      
      if (idx === currentMobilePageIndex) {
        sheet.classList.add('active-sheet');
        if (currentMobilePageIndex > prevMobilePageIndex) {
          sheet.classList.add('turn-enter-next');
        } else if (currentMobilePageIndex < prevMobilePageIndex) {
          sheet.classList.add('turn-enter-prev');
        }
      } else if (idx === prevMobilePageIndex) {
        if (currentMobilePageIndex > prevMobilePageIndex) {
          sheet.classList.add('turn-exit-next');
        } else if (currentMobilePageIndex < prevMobilePageIndex) {
          sheet.classList.add('turn-exit-prev');
        }
      }
    });
    
    prevMobilePageIndex = currentMobilePageIndex;
  } else {
    // Desktop 3D Page flip layout
    sheets.forEach((sheet, idx) => {
      // Add turning class to trigger curl shadow transitions
      sheet.classList.add('turning');
      setTimeout(() => {
        sheet.classList.remove('turning');
      }, 800); // match CSS page turning transition length

      if (idx < currentSheetIndex) {
        // Flipped to the left
        sheet.classList.add('flipped');
        sheet.style.zIndex = idx; // Sheets stacked on left: Sheet 0 is bottom, sheet 1 above it, etc.
      } else {
        // Unflipped on the right
        sheet.classList.remove('flipped');
        sheet.style.zIndex = numSheets - idx; // Sheets stacked on right: Sheet 0 is top, sheet 1 below it, etc.
      }
    });
  }
}

// Update indicator labels and navigation button states
function updateViewerUI() {
  const isMobile = window.innerWidth < 768;
  const pages = currentMagazine ? currentMagazine.pages : [];
  const pageIndicator = document.getElementById('pageIndicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!pageIndicator || !prevBtn || !nextBtn) return;

  if (isMobile) {
    // Mobile index limits
    pageIndicator.textContent = `Page ${currentMobilePageIndex + 1} / ${pages.length}`;
    prevBtn.disabled = currentMobilePageIndex === 0;
    nextBtn.disabled = currentMobilePageIndex === pages.length - 1;
  } else {
    // Desktop double page indicator logic
    const totalSheets = Math.ceil(pages.length / 2);
    
    if (currentSheetIndex === 0) {
      pageIndicator.textContent = `Cover (Page 1)`;
      prevBtn.disabled = true;
      nextBtn.disabled = totalSheets === 0;
    } else if (currentSheetIndex === totalSheets) {
      pageIndicator.textContent = `End (Page ${pages.length})`;
      prevBtn.disabled = false;
      nextBtn.disabled = true;
    } else {
      const leftPage = currentSheetIndex * 2;
      const rightPage = leftPage + 1;
      
      if (rightPage <= pages.length) {
        pageIndicator.textContent = `Pages ${leftPage}-${rightPage}`;
      } else {
        pageIndicator.textContent = `Page ${leftPage}`;
      }
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    }
  }
}

// Flip Forward
function flipNext() {
  const isMobile = window.innerWidth < 768;
  const pages = currentMagazine.pages;

  if (isMobile) {
    if (currentMobilePageIndex < pages.length - 1) {
      currentMobilePageIndex++;
      updateBookLayout();
      updateViewerUI();
    }
  } else {
    const totalSheets = Math.ceil(pages.length / 2);
    if (currentSheetIndex < totalSheets) {
      currentSheetIndex++;
      updateBookLayout();
      updateViewerUI();
    }
  }
}

// Flip Backward
function flipPrev() {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    if (currentMobilePageIndex > 0) {
      currentMobilePageIndex--;
      updateBookLayout();
      updateViewerUI();
    }
  } else {
    if (currentSheetIndex > 0) {
      currentSheetIndex--;
      updateBookLayout();
      updateViewerUI();
    }
  }
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

  // Dropdown selector
  const select = document.getElementById('magazineSelect');
  if (select) {
    select.addEventListener('change', (e) => {
      selectMagazine(e.target.value);
    });
  }

  // Navigation buttons
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) nextBtn.addEventListener('click', flipNext);

  const prevBtn = document.getElementById('prevBtn');
  if (prevBtn) prevBtn.addEventListener('click', flipPrev);

  // Keypress support
  document.addEventListener('keydown', (e) => {
    const viewerSection = document.getElementById('viewer');
    if (!viewerSection) return;
    const rect = viewerSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      if (e.key === 'ArrowRight') {
        flipNext();
      } else if (e.key === 'ArrowLeft') {
        flipPrev();
      }
    }
  });

  // Touch support (Swiping on mobile/tablets)
  let touchStartX = 0;
  let touchEndX = 0;
  const bookViewport = document.getElementById('bookViewport');

  if (bookViewport) {
    bookViewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    bookViewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      flipNext(); // Swiped left, go forward
    } else if (touchEndX - touchStartX > swipeThreshold) {
      flipPrev(); // Swiped right, go backward
    }
  }

  // Click side-zones of book viewport to flip
  const leftZone = document.getElementById('leftNavZone');
  if (leftZone) leftZone.addEventListener('click', flipPrev);

  const rightZone = document.getElementById('rightNavZone');
  if (rightZone) rightZone.addEventListener('click', flipNext);

  // Zoom / Fullscreen action
  const zoomBtn = document.getElementById('zoomBtn');
  if (zoomBtn && bookViewport) {
    zoomBtn.addEventListener('click', () => {
      bookViewport.classList.toggle('zoomed');
      const isZoomed = bookViewport.classList.contains('zoomed');
      const icon = zoomBtn.querySelector('i');

      if (isZoomed) {
        icon.setAttribute('data-lucide', 'minimize-2');
        showToast("View Expanded. Press Esc or click again to close.", "success");
      } else {
        icon.setAttribute('data-lucide', 'maximize-2');
      }
      initIcons();
    });

    // Escape key closes zoom
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && bookViewport.classList.contains('zoomed')) {
        bookViewport.classList.remove('zoomed');
        zoomBtn.querySelector('i').setAttribute('data-lucide', 'maximize-2');
        initIcons();
      }
    });
  }

  // Reset book state button
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentSheetIndex = 0;
      currentMobilePageIndex = 0;
      updateBookLayout();
      updateViewerUI();
      showToast("Book reset to Cover Page.", "success");
    });
  }

  // Resize event - switch between 3D sheet layout and mobile layout
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderBook();
      updateViewerUI();
    }, 250);
  });


}

// Update Magazine Details and Writers List in UI
function updateMagazineDetailsCard() {
  const infoTitle = document.getElementById('infoTitle');
  const infoDesc = document.getElementById('infoDesc');
  const writersList = document.getElementById('writersList');
  const infoCard = document.getElementById('magazineInfoCard');

  if (!currentMagazine) {
    infoCard.style.display = 'none';
    return;
  }

  infoCard.style.display = 'grid';
  infoTitle.textContent = currentMagazine.title;
  infoDesc.textContent = currentMagazine.description;

  writersList.innerHTML = '';
  const writers = currentMagazine.writers || [];

  if (writers.length > 0) {
    writers.forEach(writer => {
      const tag = document.createElement('span');
      tag.className = 'writer-tag';
      tag.innerHTML = `<i data-lucide="user"></i> ${writer}`;
      writersList.appendChild(tag);
    });
  } else {
    const noWriters = document.createElement('span');
    noWriters.style.color = 'var(--color-muted)';
    noWriters.style.fontSize = '0.9rem';
    noWriters.textContent = 'No writers listed.';
    writersList.appendChild(noWriters);
  }

  initIcons();
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
    item: 'Spot magazine',
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
  const printBtn = document.getElementById('printCertBtn');

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

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
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
        <span class="medal-item">${t.gold} Gold</span>
        <span class="medal-item">${t.silver} Silver</span>
        <span class="medal-item">${t.bronze} Bronze</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Published Results List
function renderMeeladResults() {
  const grid = document.getElementById('resultsGrid');
  if (!grid) return;

  const categoryVal = document.getElementById('categoryFilter')?.value || 'all';
  const teamVal = document.getElementById('teamFilter')?.value || 'all';
  const searchVal = (document.getElementById('resultSearchInput')?.value || '').toLowerCase();

  const filtered = meeladResults.filter(res => {
    if (categoryVal !== 'all' && res.category !== categoryVal) return false;

    if (teamVal !== 'all') {
      const hasTeam = res.winners.some(w => w.team.toLowerCase() === teamVal.toLowerCase());
      if (!hasTeam) return false;
    }

    if (searchVal) {
      const matchItem = res.item.toLowerCase().includes(searchVal);
      const matchCategory = res.category.toLowerCase().includes(searchVal);
      const matchStudent = res.winners.some(w => 
        w.name.toLowerCase().includes(searchVal) || w.team.toLowerCase().includes(searchVal)
      );
      if (!matchItem && !matchCategory && !matchStudent) return false;
    }

    return true;
  });

  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-muted); padding: 40px;">No published competition results found matching your search.</div>`;
    return;
  }

  filtered.forEach(res => {
    const card = document.createElement('div');
    card.className = 'result-card glass-card';

    let winnersHtml = '';
    res.winners.forEach(w => {
      let placeText = w.place === 1 ? '1st' : w.place === 2 ? '2nd' : '3rd';

      winnersHtml += `
        <div class="winner-item-card place-${w.place}" data-name="${w.name}" data-resid="${res.id}" title="Click to view official certificate">
          <div class="winner-student-info">
            <span class="rank-badge-minimal place-${w.place}">${placeText}</span>
            <div>
              <div class="student-name-text">${w.name}</div>
            </div>
          </div>
          <div class="winner-meta-badges">
            <span class="team-badge-pill team-${w.team}">${w.team}</span>
            <span class="grade-badge-pill">${w.grade}</span>
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="result-card-header">
        <div class="item-title-box">
          <h3>${res.item}</h3>
        </div>
        <span class="category-badge">${res.category}</span>
      </div>
      <div class="winners-list-display">
        ${winnersHtml}
      </div>
    `;

    card.querySelectorAll('.winner-item-card').forEach(wCard => {
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

// ----------------------------------------------------
// Admin Portal & Authentication System
// ----------------------------------------------------
function setupAdminPortal() {
  updateAdminUI();

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
      saveMeeladResults();

      populateItemSelectOptions();
      populateGeneratorPlayerOptions();
      renderMeeladResults();
      renderMeeladLeaderboard();
      renderAdminResultsList();

      pubForm.reset();

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



