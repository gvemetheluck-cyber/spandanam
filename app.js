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

// ----------------------------------------------------
// Sweet Of Mahabba - Meelad Fest Result Generator & Published Portal
// ----------------------------------------------------

let meeladResults = [
  {
    id: 'res_1',
    category: 'Senior',
    item: 'Qirat Recitation (Tajweed)',
    winners: [
      { place: 1, name: 'Muhammed Sinan', chestNo: '104', team: 'Badr', grade: 'A+', points: 10 },
      { place: 2, name: 'Abdul Basith', chestNo: '211', team: 'Uhud', grade: 'A', points: 7 },
      { place: 3, name: 'Ahammed Safwan', chestNo: '305', team: 'Thabuk', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_2',
    category: 'Junior',
    item: 'Arabic Calligraphy & Sketch',
    winners: [
      { place: 1, name: 'Lutfia P.A.', chestNo: '202', team: 'Uhud', grade: 'A+', points: 10 },
      { place: 2, name: 'Fathima K.P.', chestNo: '115', team: 'Badr', grade: 'A+', points: 7 },
      { place: 3, name: 'Diya Sherin', chestNo: '408', team: 'Hudaibiyya', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_3',
    category: 'Sub-Junior',
    item: 'Islamic Song (Mappila Pattu)',
    winners: [
      { place: 1, name: 'Nafih Hasani', chestNo: '312', team: 'Thabuk', grade: 'A+', points: 10 },
      { place: 2, name: 'Riza Abdul Shukoor', chestNo: '109', team: 'Badr', grade: 'A', points: 7 },
      { place: 3, name: 'Muhammed Rayan', chestNo: '414', team: 'Hudaibiyya', grade: 'B', points: 5 }
    ]
  },
  {
    id: 'res_4',
    category: 'General',
    item: 'Duff Muttu Performance',
    winners: [
      { place: 1, name: 'Team Badr Group', chestNo: '100', team: 'Badr', grade: 'A+', points: 10 },
      { place: 2, name: 'Team Uhud Group', chestNo: '200', team: 'Uhud', grade: 'A+', points: 7 },
      { place: 3, name: 'Team Thabuk Group', chestNo: '300', team: 'Thabuk', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_5',
    category: 'Senior',
    item: 'Arabic Elocution & Speech',
    winners: [
      { place: 1, name: 'Zubair Al-Hasani', chestNo: '105', team: 'Badr', grade: 'A+', points: 10 },
      { place: 2, name: 'Bilal Ahammed', chestNo: '208', team: 'Uhud', grade: 'A', points: 7 },
      { place: 3, name: 'Rashid K.T.', chestNo: '410', team: 'Hudaibiyya', grade: 'A', points: 5 }
    ]
  },
  {
    id: 'res_6',
    category: 'Junior',
    item: 'Quran Memorization (Hifz)',
    winners: [
      { place: 1, name: 'Aisha Raihana', chestNo: '310', team: 'Thabuk', grade: 'A+', points: 10 },
      { place: 2, name: 'Fathima Riza', chestNo: '112', team: 'Badr', grade: 'A+', points: 7 },
      { place: 3, name: 'Mariyam Bilal', chestNo: '215', team: 'Uhud', grade: 'A', points: 5 }
    ]
  }
];

function initMeeladFestSystem() {
  populateItemSelectOptions();
  renderMeeladResults();
  renderMeeladLeaderboard();
  setupMeeladFilters();
  initMeeladTabs();
  setupResultGenerator();
  setupModalEvents();
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

function setupResultGenerator() {
  const genBtn = document.getElementById('generateResultBtn');
  if (!genBtn) return;

  genBtn.addEventListener('click', () => {
    const chestInput = (document.getElementById('chestNoInput')?.value || '').trim();
    const itemVal = document.getElementById('itemSelect')?.value || 'all';

    let foundWinner = null;
    let foundResult = null;

    if (chestInput) {
      for (const res of meeladResults) {
        const w = res.winners.find(win => win.chestNo.toLowerCase() === chestInput.toLowerCase());
        if (w) {
          foundWinner = w;
          foundResult = res;
          break;
        }
      }
    } else if (itemVal !== 'all') {
      foundResult = meeladResults.find(res => res.id === itemVal);
      if (foundResult && foundResult.winners.length > 0) {
        foundWinner = foundResult.winners[0];
      }
    } else {
      foundResult = meeladResults[0];
      foundWinner = foundResult.winners[0];
    }

    if (foundWinner && foundResult) {
      openResultModal(foundWinner, foundResult);
      showToast(`Generated Official Result Certificate for #${foundWinner.chestNo} (${foundWinner.name})!`, 'success');
    } else {
      showToast(`No published result found for Chest No #${chestInput}. Please check the chest number.`, 'error');
    }
  });
}

function openResultModal(winner, result) {
  const modal = document.getElementById('resultModal');
  if (!modal) return;

  document.getElementById('certStudentName').textContent = winner.name;
  document.getElementById('certChestNo').textContent = `#${winner.chestNo}`;
  
  const teamBadge = document.getElementById('certTeamBadge');
  teamBadge.textContent = winner.team;
  teamBadge.className = `team-badge-pill team-${winner.team}`;

  document.getElementById('certItemName').textContent = result.item;
  document.getElementById('certCategory').textContent = result.category;
  document.getElementById('certGrade').textContent = winner.grade;
  document.getElementById('certPoints').textContent = `${winner.points} Points`;

  let rankIcon = '🥇';
  let rankTitle = 'FIRST PLACE';
  if (winner.place === 2) { rankIcon = '🥈'; rankTitle = 'SECOND PLACE'; }
  if (winner.place === 3) { rankIcon = '🥉'; rankTitle = 'THIRD PLACE'; }

  document.getElementById('certRankIcon').textContent = rankIcon;
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }

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
    { name: 'Badr', totalPoints: 0, gold: 0, silver: 0, bronze: 0 },
    { name: 'Uhud', totalPoints: 0, gold: 0, silver: 0, bronze: 0 },
    { name: 'Thabuk', totalPoints: 0, gold: 0, silver: 0, bronze: 0 },
    { name: 'Hudaibiyya', totalPoints: 0, gold: 0, silver: 0, bronze: 0 }
  ];

  // Calculate points from results
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

  // Sort descending by totalPoints
  teams.sort((a, b) => b.totalPoints - a.totalPoints);
  const maxPoints = teams[0].totalPoints || 1;

  grid.innerHTML = '';
  teams.forEach((t, idx) => {
    const rank = idx + 1;
    const progressPercent = Math.round((t.totalPoints / maxPoints) * 100);

    const card = document.createElement('div');
    card.className = `team-card glass-card rank-${rank}`;

    let rankLabel = `#${rank}`;
    if (rank === 1) rankLabel = '🥇 1st Place';
    else if (rank === 2) rankLabel = '🥈 2nd Place';
    else if (rank === 3) rankLabel = '🥉 3rd Place';

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
        <span class="medal-item">🥇 ${t.gold} Gold</span>
        <span class="medal-item">🥈 ${t.silver} Silver</span>
        <span class="medal-item">🥉 ${t.bronze} Bronze</span>
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
        w.name.toLowerCase().includes(searchVal) || w.chestNo.toLowerCase().includes(searchVal)
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
      let placeIcon = '🥇';
      if (w.place === 2) placeIcon = '🥈';
      if (w.place === 3) placeIcon = '🥉';

      winnersHtml += `
        <div class="winner-item-card place-${w.place}" data-chest="${w.chestNo}" data-resid="${res.id}" title="Click to view official certificate">
          <div class="winner-student-info">
            <span class="place-icon">${placeIcon}</span>
            <div>
              <div class="student-name-text">${w.name}</div>
              <div class="chest-text">Chest No: #${w.chestNo}</div>
            </div>
          </div>
          <div class="winner-meta-badges">
            <span class="team-badge-pill team-${w.team}">${w.team}</span>
            <span class="grade-badge-pill">${w.grade}</span>
            <button class="cert-quick-btn" title="View Certificate"><i data-lucide="award"></i></button>
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
        const chest = wCard.getAttribute('data-chest');
        const resid = wCard.getAttribute('data-resid');
        const r = meeladResults.find(item => item.id === resid);
        if (r) {
          const winner = r.winners.find(win => win.chestNo === chest);
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


