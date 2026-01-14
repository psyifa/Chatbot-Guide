// DENAI Documentation Custom JavaScript

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DENAI Documentation loaded');
  
  // Initialize features
  initMermaidDiagrams();
  initCodeCopyButton();
  initExternalLinks();
  initSmoothScroll();
  initAPIMethodBadges();
  
  // Analytics (if configured)
  if (typeof gtag !== 'undefined') {
    trackPageView();
  }
});

/**
 * Initialize Mermaid diagrams with custom theme
 */
function initMermaidDiagrams() {
  if (typeof mermaid !== 'undefined') {
    // Configure Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: document.body.getAttribute('data-md-color-scheme') === 'slate' ? 'dark' : 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35
      }
    });
    
    // Update theme on color scheme change
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'data-md-color-scheme') {
          const isDark = document.body.getAttribute('data-md-color-scheme') === 'slate';
          mermaid.initialize({ theme: isDark ? 'dark' : 'default' });
          
          // Re-render diagrams
          const diagrams = document.querySelectorAll('.mermaid');
          diagrams.forEach(diagram => {
            const code = diagram.textContent;
            diagram.removeAttribute('data-processed');
            diagram.innerHTML = code;
          });
          mermaid.init(undefined, '.mermaid');
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-md-color-scheme']
    });
    
    console.log('✅ Mermaid diagrams initialized');
  }
}

/**
 * Add copy button to code blocks
 */
function initCodeCopyButton() {
  const codeBlocks = document.querySelectorAll('pre > code');
  
  codeBlocks.forEach(function(codeBlock) {
    const pre = codeBlock.parentElement;
    const button = document.createElement('button');
    button.className = 'md-clipboard md-icon';
    button.title = 'Copy to clipboard';
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z"></path></svg>';
    
    button.addEventListener('click', function() {
      const code = codeBlock.textContent;
      navigator.clipboard.writeText(code).then(function() {
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z"></path></svg>';
        button.style.color = '#4caf50';
        
        setTimeout(function() {
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z"></path></svg>';
          button.style.color = '';
        }, 2000);
      });
    });
    
    // Add button to pre element
    if (!pre.querySelector('.md-clipboard')) {
      pre.style.position = 'relative';
      pre.appendChild(button);
    }
  });
  
  console.log(`✅ Copy buttons added to ${codeBlocks.length} code blocks`);
}

/**
 * Add external link indicators
 */
function initExternalLinks() {
  const links = document.querySelectorAll('.md-content a[href^="http"]');
  
  links.forEach(function(link) {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Add external icon
      const icon = document.createElement('span');
      icon.innerHTML = ' ↗';
      icon.style.fontSize = '0.8em';
      icon.style.opacity = '0.6';
      link.appendChild(icon);
    }
  });
  
  console.log(`✅ ${links.length} external links marked`);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without scrolling
        history.pushState(null, null, href);
      }
    });
  });
  
  console.log('✅ Smooth scroll initialized');
}

/**
 * Add styled badges for API methods
 */
function initAPIMethodBadges() {
  const content = document.querySelector('.md-content');
  if (!content) return;
  
  // Find API method patterns in text
  const methodPattern = /(GET|POST|PUT|DELETE|PATCH)\s+(\/[\w\/-]+)/g;
  
  // Process text nodes
  const walker = document.createTreeWalker(
    content,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const nodesToReplace = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (methodPattern.test(node.textContent)) {
      nodesToReplace.push(node);
    }
  }
  
  nodesToReplace.forEach(node => {
    const text = node.textContent;
    const matches = text.matchAll(methodPattern);
    let newHTML = text;
    
    for (const match of matches) {
      const method = match[1];
      const path = match[2];
      const badge = `<span class="api-method ${method.toLowerCase()}">${method}</span><code>${path}</code>`;
      newHTML = newHTML.replace(match[0], badge);
    }
    
    if (newHTML !== text) {
      const span = document.createElement('span');
      span.innerHTML = newHTML;
      node.parentNode.replaceChild(span, node);
    }
  });
  
  console.log('✅ API method badges initialized');
}

/**
 * Track page views (Google Analytics)
 */
function trackPageView() {
  const page = window.location.pathname;
  gtag('event', 'page_view', {
    page_path: page,
    page_title: document.title
  });
  console.log('📊 Page view tracked:', page);
}

/**
 * Track search queries
 */
function trackSearch(query) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'search', {
      search_term: query
    });
    console.log('🔍 Search tracked:', query);
  }
}

/**
 * Track outbound links
 */
document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
  if (!link) return;
  
  const href = link.getAttribute('href');
  if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        event_category: 'outbound',
        event_label: href,
        transport_type: 'beacon'
      });
      console.log('🔗 Outbound link tracked:', href);
    }
  }
});

/**
 * Add loading indicator for slow-loading diagrams
 */
function addDiagramLoadingIndicator() {
  const diagrams = document.querySelectorAll('.mermaid');
  
  diagrams.forEach(diagram => {
    if (!diagram.hasAttribute('data-processed')) {
      diagram.style.minHeight = '200px';
      diagram.style.position = 'relative';
      
      const loader = document.createElement('div');
      loader.className = 'diagram-loader';
      loader.innerHTML = '<div class="spinner"></div>';
      loader.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);';
      
      diagram.appendChild(loader);
    }
  });
}

/**
 * Remove loading indicators after diagrams load
 */
if (typeof mermaid !== 'undefined') {
  mermaid.parseError = function(err, hash) {
    console.error('Mermaid parse error:', err);
  };
}

/**
 * Keyboard shortcuts
 */
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.md-search__input');
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  // Ctrl/Cmd + / for keyboard shortcuts help
  if ((e.ctrlKey || e.metaKey) && e.key === '/') {
    e.preventDefault();
    showKeyboardShortcuts();
  }
});

/**
 * Show keyboard shortcuts modal
 */
function showKeyboardShortcuts() {
  const shortcuts = [
    { key: 'Ctrl/Cmd + K', description: 'Open search' },
    { key: 'Ctrl/Cmd + /', description: 'Show keyboard shortcuts' },
    { key: 'Esc', description: 'Close modals' }
  ];
  
  console.log('⌨️ Keyboard shortcuts:');
  shortcuts.forEach(s => console.log(`  ${s.key}: ${s.description}`));
}

/**
 * Add table of contents highlighting
 */
function initTOCHighlight() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.isIntersecting) {
        document.querySelectorAll('.md-nav__link').forEach(link => {
          link.classList.remove('md-nav__link--active');
        });
        
        const activeLink = document.querySelector(`.md-nav__link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('md-nav__link--active');
        }
      }
    });
  }, { rootMargin: '0px 0px -80% 0px' });
  
  // Observe all headings
  document.querySelectorAll('h2[id], h3[id]').forEach(heading => {
    observer.observe(heading);
  });
}

// Initialize TOC highlighting
if (document.querySelector('.md-sidebar--secondary')) {
  initTOCHighlight();
}

console.log('✨ DENAI Documentation enhancements loaded successfully');