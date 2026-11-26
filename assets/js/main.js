// INTUCH.PARTY - Main JavaScript
// Handles visitor counter and guestbook via Flask API

// API base URL - works for both local testing and production
const API_BASE = '/api';

// Initialize guestbook only on pages that have the guestbook section
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize guestbook if we're on index.html or guestbook.html
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop();
  if (currentPage === 'index.html' || currentPage === 'guestbook.html') {
    initGuestbook();
  }
});

// === GUESTBOOK ===
async function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const list = document.getElementById('guestbook-list');
  if (!form || !list) return;

  // Load existing entries
  await loadGuestbookEntries();

  // Handle form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input[name="message"], textarea[name="message"]');
    const message = input.value.trim();
    if (!message) return;

    try {
      const res = await fetch(`${API_BASE}/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        input.value = '';
        await loadGuestbookEntries();
      }
    } catch (err) {
      console.error('Failed to post guestbook entry:', err);
    }
  });
}

async function loadGuestbookEntries() {
  const list = document.getElementById('guestbook-list');
  if (!list) return;

  try {
    const res = await fetch(`${API_BASE}/guestbook`);
    if (res.ok) {
      const data = await res.json();
      renderGuestbookEntries(data.entries || []);
    }
  } catch (err) {
    console.warn('Guestbook API unavailable:', err);
    list.innerHTML = '<li style="color: #FF8BDF;">Could not load entries</li>';
  }
}

function renderGuestbookEntries(entries) {
  const list = document.getElementById('guestbook-list');
  if (!list) return;

  if (entries.length === 0) {
    list.innerHTML = '<li style="color: #B99AE8; font-style: italic;">No messages yet. Be the first!</li>';
    return;
  }

  list.innerHTML = entries.map(entry => {
    const date = new Date(entry.created_at).toLocaleDateString();
    return `
      <li style="margin-bottom: 12px; padding: 8px; background: #160B2B; border: 1px solid #7040A8;">
        <div style="color: #FF8BDF; font-size: 12px; margin-bottom: 4px;">
          <span style="font-family: 'Geist Pixel', monospace;">${entry.message}</span>
        </div>
        <div style="color: #B99AE8; font-size: 11px; font-family: 'Geist Pixel', monospace;">
          ${date}
        </div>
      </li>
    `;
  }).join('');
}