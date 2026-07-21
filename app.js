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
    id: 'spandanam_2026',
    title: 'Spandanam - Student Handwritten Magazine',
    description: 'Special student handwritten publication from Madarasathul Hasaniya (Adikkumpara)',
    writers: ['Unais Sa-adi Al Malhari (Coordinator)', 'Riza Abdul Shukoor (Chief Editor)', 'Afeefa (Sub-editor)', 'Fathima K.P. (Sub-editor)', 'Rimsha K. (Writer)', 'Diya Sherin (Writer)', 'Nashwa (Cover & Art)', 'Lutfia P.A. (Cover & Art)'],
    pages: [
      'assets/default_magazine/spandanam_1.jpg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.40 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.40 AM (2).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.40 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.41 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.42 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.42 AM (2).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.42 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.45 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.45 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.52 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.52 AM (2).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.52 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.53 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.53 AM (2).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.53 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.54 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.54 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.09.55 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.03 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.08 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.12 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.13 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.13 AM (2).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.13 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.14 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.15 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.16 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.17 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.17 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.18 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.18 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.19 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.20 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.20 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.21 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.22 AM (1).jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.22 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.23 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.24 AM.jpeg',
      'assets/default_magazine/WhatsApp Image 2026-07-21 at 11.10.25 AM.jpeg',
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

  initIcons();
  initHeader();
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
  
  // Set preview cover on hero section if it's the static one or has pages
  if (magazine.pages.length > 0) {
    document.getElementById('heroPreviewImg').src = magazine.pages[0];
  }

  renderBook();
  updateViewerUI();
  updateMagazineDetailsCard();
}

// Build Book structure dynamically
function renderBook() {
  const book = document.getElementById('magazineBook');
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
  const pages = currentMagazine.pages;
  const pageIndicator = document.getElementById('pageIndicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

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
  // Click Featured Issue to scroll to reader
  const heroCard = document.querySelector('.hero-preview-card');
  if (heroCard) {
    heroCard.style.cursor = 'pointer';
    heroCard.addEventListener('click', () => {
      document.getElementById('viewer').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Dropdown selector
  const select = document.getElementById('magazineSelect');
  select.addEventListener('change', (e) => {
    selectMagazine(e.target.value);
  });

  // Navigation buttons
  document.getElementById('nextBtn').addEventListener('click', flipNext);
  document.getElementById('prevBtn').addEventListener('click', flipPrev);

  // Keypress support
  document.addEventListener('keydown', (e) => {
    // Only flip when reader is in viewport
    const viewerSection = document.getElementById('viewer');
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

  bookViewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  bookViewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      flipNext(); // Swiped left, go forward
    } else if (touchEndX - touchStartX > swipeThreshold) {
      flipPrev(); // Swiped right, go backward
    }
  }

  // Click side-zones of book viewport to flip
  document.getElementById('leftNavZone').addEventListener('click', flipPrev);
  document.getElementById('rightNavZone').addEventListener('click', flipNext);

  // Zoom / Fullscreen action
  const zoomBtn = document.getElementById('zoomBtn');
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

  // Reset book state button
  document.getElementById('resetBtn').addEventListener('click', () => {
    currentSheetIndex = 0;
    currentMobilePageIndex = 0;
    updateBookLayout();
    updateViewerUI();
    showToast("Book reset to Cover Page.", "success");
  });

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
