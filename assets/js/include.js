// Sidebar Component Loader
// Fetches the sidebar HTML and injects it into a placeholder container
// Highlights the active navigation link based on the current page URL

document.addEventListener('DOMContentLoaded', () => {
  // Fetch the sidebar component - try relative path first, then absolute
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const sidebarPath = isLocal ? '/components/sidebar.html' : 'components/sidebar.html';

  fetch(sidebarPath)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load sidebar');
      return response.text();
    })
    .then(html => {
      // Inject sidebar into the placeholder container
      const sidebarContainer = document.getElementById('sidebar-container');
      if (sidebarContainer) {
        sidebarContainer.innerHTML = html;
      } else {
        // Fallback: prepend to body if no container exists
        const sidebar = document.createElement('aside');
        sidebar.innerHTML = html;
        document.body.insertBefore(sidebar, document.body.firstChild);
      }

      // Highlight active navigation link based on current URL
      highlightActiveLink();
    })
    .catch(err => {
      console.error('Could not load sidebar component:', err);
      // Fallback: create minimal sidebar if fetch fails
      const fallback = `
        <aside class="sidebar">
          <h3>Navigation</h3>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Me</a></li>
          </ul>
        </aside>
      `;
      document.body.insertAdjacentHTML('afterbegin', fallback);
    });
});

// Highlight the active navigation link based on current page URL
function highlightActiveLink() {
  // Get the current page filename
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';

  // Remove any existing 'active' classes first
  document.querySelectorAll('#sidebar-container ul li a').forEach(link => {
    link.classList.remove('active');
  });

  // Highlight the matching link
  document.querySelectorAll('#sidebar-container ul li a').forEach(link => {
    const linkHref = link.getAttribute('href');
    const linkPath = linkHref.split('/').pop();

    // Check if this link points to the current page
    if (linkPath === currentPage) {
      link.classList.add('active');
    }
    // Also check for hash-based navigation (e.g., #guestbook)
    else if (linkHref.startsWith('#') && currentPage.includes('index.html') && linkHref.includes('guestbook')) {
      link.classList.add('active');
    }
  });
}