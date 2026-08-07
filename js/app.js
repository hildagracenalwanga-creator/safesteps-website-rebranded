const AppState = {
  cart: JSON.parse(localStorage.getItem('safesteps_cart')) || [],

  addToCart(id, name, price) {
    this.cart.push({ id, name, price });
    this.saveCart();
    this.updateCartUI();
    this.showToast(`${name} added to cart!`);
  },

  saveCart() {
    localStorage.setItem('safesteps_cart', JSON.stringify(this.cart));
  },

  updateCartUI() {
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(el => el.textContent = this.cart.length);

    const drawerBody = document.getElementById('cartDrawerItems');
    const drawerTotal = document.getElementById('cartDrawerTotal');

    if (drawerBody && drawerTotal) {
      if (this.cart.length === 0) {
        drawerBody.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        drawerTotal.textContent = 'UGX 0';
        return;
      }

      let total = 0;
      drawerBody.innerHTML = this.cart.map((item, idx) => {
        total += item.price;
        return `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong>
              <div class="cart-item-price">UGX ${item.price.toLocaleString()}</div>
            </div>
            <button class="cart-item-remove" onclick="AppState.removeFromCart(${idx})">✕</button>
          </div>
        `;
      }).join('');

      drawerTotal.textContent = `UGX ${total.toLocaleString()}`;
    }
  },

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.updateCartUI();
  },

  showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed; bottom:30px; right:30px; background:var(--gold); color:var(--black); padding:16px 28px; border-radius:0; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.15); z-index:2000;';
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  }
};

function toggleHamburger() {
  const menu = document.getElementById('navMobile');
  const btn = document.querySelector('.menu-btn');
  if (menu && btn) {
    menu.classList.toggle('open');
    btn.classList.toggle('active');
  }
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    if (open) {
      drawer.classList.add('open');
      backdrop.style.display = 'block';
    } else {
      drawer.classList.remove('open');
      backdrop.style.display = 'none';
    }
  }
}

function addToCart(id, name, price) {
  AppState.addToCart(id, name, price);
}

/* Nav dropdowns (Our Services, Shop): keep the panel open for a short
   grace period after the cursor leaves, so moving from the nav link down
   into the panel doesn't cause it to snap shut before someone can click
   an item. Falls back to plain CSS :hover if JS is unavailable. */
(function () {
  const dropdowns = document.querySelectorAll('.nav-item-dropdown');
  const CLOSE_DELAY = 350; // ms grace period

  dropdowns.forEach((dropdown) => {
    let closeTimer = null;

    function openDropdown() {
      clearTimeout(closeTimer);
      dropdowns.forEach((d) => { if (d !== dropdown) d.classList.remove('open'); });
      dropdown.classList.add('open');
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        dropdown.classList.remove('open');
      }, CLOSE_DELAY);
    }

    dropdown.addEventListener('mouseenter', openDropdown);
    dropdown.addEventListener('mouseleave', scheduleClose);
    dropdown.addEventListener('focusin', openDropdown);
    dropdown.addEventListener('focusout', scheduleClose);
  });
})();

document.addEventListener('click', function(event) {
  const menu = document.getElementById('navMobile');
  const btn = document.querySelector('.menu-btn');
  const header = document.querySelector('header');
  if (menu && btn && header) {
    if (!header.contains(event.target)) {
      menu.classList.remove('open');
      btn.classList.remove('active');
    }
  }
});

document.addEventListener('click', function(event) {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  const cartBtn = document.querySelector('.cart-btn');
  if (drawer && backdrop && cartBtn) {
    if (drawer.classList.contains('open')) {
      if (!drawer.contains(event.target) && !cartBtn.contains(event.target)) {
        toggleCartDrawer(false);
      }
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  AppState.updateCartUI();
});

/* Hide the header once the page is scrolled past a small threshold, and
   keep it hidden. It only reappears when the visitor scrolls back up near
   the very top of the page (not on every little upward wiggle while
   scrolling), and it stays visible while the mobile menu is open. */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const REVEAL_THRESHOLD = 80; // px from top before the header hides
  let ticking = false;

  function onScroll() {
    const currentScrollY = window.scrollY;
    const navMobile = document.getElementById('navMobile');
    const menuOpen = navMobile && navMobile.classList.contains('open');

    if (menuOpen || currentScrollY <= REVEAL_THRESHOLD) {
      header.classList.remove('header-hidden');
    } else {
      header.classList.add('header-hidden');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();

/* =========================================================
   SITE SEARCH — simple client-side index of every page.
   NOTE FOR BACKEND WORK: this is a static, hard-coded index so
   the site works with no server. If a CMS/backend is added later,
   swap SITE_PAGES for a fetch() call to a real search endpoint
   (e.g. GET /api/search?q=...) and keep the same render logic.
   ========================================================= */
const SITE_PAGES = [
  { title: 'Home', url: 'index.html', desc: 'Welcome, our foundation, three core programs, news & research.', keywords: 'home welcome foundation news research' },
  { title: 'About Us', url: 'about.html', desc: 'Our story, mission, and the team behind Safe Steps.', keywords: 'about story mission founder co-founder hilda annah team' },
  { title: 'Our Services', url: 'services.html', desc: 'Child Safeguarding Advocacy & Training, The Nurture Orbit Collection, Parent Coaching & Support.', keywords: 'services programs child safeguarding advocacy training parent coaching support institutional' },
  { title: 'Child Safeguarding Advocacy and Training', url: 'child-safeguarding-training.html', desc: 'Safeguarding audits, policy development, staff training, and board governance for institutions.', keywords: 'child safeguarding advocacy training audit policy staff training governance investigations institutions schools ngos' },
  { title: 'Parent Coaching and Support', url: 'parent-coaching-support.html', desc: 'Private and group parent coaching, positive discipline, digital parenting, and family communication.', keywords: 'parent coaching support positive discipline digital parenting family communication teenage development early childhood' },
  { title: 'The Nurture Orbit Collection', url: 'nurture-orbit.html', desc: 'Annual Leadership Development Masterclass, Beyond Success Round Tables, LeadLife Program.', keywords: 'nurture orbit leadership masterclass annual beyond success round tables leadlife youth' },
  { title: 'Blog', url: 'blog.html', desc: 'Reflections on parenting, safeguarding, leadership, and community.', keywords: 'blog articles reflections mentors mentees noise silence small decisions dying rose table for one hidden geniuses unity parenting quiet strength language of safety raising roots' },
  { title: 'Gallery, Testimonials & Impact Stories', url: 'gallery.html', desc: 'Photos from our work, client testimonials, and stories from the field.', keywords: 'gallery testimonials impact stories photos reviews feedback clients' },
  { title: 'Resource Hub', url: 'library.html', desc: 'Free downloadable PDFs, guides, checklists, and puzzle packs.', keywords: 'resource hub library downloads pdf checklist guide puzzle workbook handbook policy template' },
  { title: 'Shop', url: 'shop.html', desc: 'Games, puzzles, books, and safeguarding toolkits.', keywords: 'shop store buy toolkit workbook parenting devotional bible' },
  { title: 'Games, Books & Puzzles', url: 'games-books-puzzles.html', desc: 'Educational games, puzzles, books, devotionals, and Bibles for children.', keywords: 'games books puzzles devotionals bibles learning fun children' },
  { title: 'Member Portal', url: 'portal.html', desc: 'Sign in or register for exclusive member downloads.', keywords: 'portal login sign in register member account dashboard' },
  { title: 'Contact Us', url: 'contact.html', desc: 'Get in touch for consultations, bookings, and inquiries.', keywords: 'contact email phone whatsapp address form message' },
];

function openSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('siteSearchInput');
  if (!overlay || !input) return;
  overlay.classList.add('open');
  renderSearchResults('');
  setTimeout(() => input.focus(), 50);

  // close the mobile menu if it was open when search was triggered from it
  const navMobile = document.getElementById('navMobile');
  const menuBtn = document.querySelector('.menu-btn');
  if (navMobile && navMobile.classList.contains('open')) {
    navMobile.classList.remove('open');
    menuBtn && menuBtn.classList.remove('active');
  }
}

function closeSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.classList.remove('open');
}

function renderSearchResults(query) {
  const resultsEl = document.getElementById('siteSearchResults');
  if (!resultsEl) return;

  const q = query.trim().toLowerCase();
  const matches = !q
    ? SITE_PAGES
    : SITE_PAGES.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.keywords.toLowerCase().includes(q)
      );

  if (matches.length === 0) {
    resultsEl.innerHTML = '<p class="search-empty">No pages found. Try a different word, e.g. "blog", "shop", or "coaching".</p>';
    return;
  }

  resultsEl.innerHTML = matches.map((p, i) => `
    <a href="${p.url}" class="${i === 0 ? 'active-result' : ''}">
      <span class="result-title">${p.title}</span>
      <span class="result-desc">${p.desc}</span>
    </a>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('siteSearchInput');
  const overlay = document.getElementById('searchOverlay');

  if (input) {
    input.addEventListener('input', (e) => renderSearchResults(e.target.value));
  }

  if (overlay) {
    // click outside the search box closes it
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSearch();
    });
  }

  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl+K opens search from anywhere
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
    if (e.key === 'Enter' && overlay && overlay.classList.contains('open')) {
      const firstResult = document.querySelector('#siteSearchResults a');
      if (firstResult) window.location.href = firstResult.getAttribute('href');
    }
  });
});