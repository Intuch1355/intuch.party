// Hash-based SPA router
const pages = {
    home: `
        <h2>Welcome to my website!</h2>
        <p>
            Hey! Welcome to INTUCH.PARTY.
            This is my little place on the internet.
        </p>
    `,
    about: `
        <h2>About Me</h2>
        <p>
            Hey, I'm <strong>Intuch</strong> — a software engineer student who loves purple, space, video game, and linux.
            This site is my playground for learning HTML, CSS, and JavaScript. 
        </p>
        <h3>What I'm into</h3>
        <ul>
            <li>🎵 Music: Lil Uzi Vert, Trippie Redd</li>
            <li>💻 Tech: Homelab, Linux</li>
            <li>🎨 Aesthetic: 90s webcore</li>
            <li>🚀 Learning: HTML, CSS, JavaScript</li>
        </ul>
        <h3>This Website</h3>
        <p>
            Built with pure HTML, CSS, and JavaScript — no frameworks, no build tools.
            Hosted on my homelab (Pls do not DDos or Attack my webserver).
        </p>
    `,
    projects: `
        <h2>My Projects</h2>

        <div style="margin-bottom: 20px;">
            <h3>🏠 Homelab Infrastructure</h3>
            <p>3-node Alpine Linux cluster managed with Ansible:</p>
            <a>Not on GitHub yet</a>
        </div>

        <div style="margin-bottom: 20px;">
            <h3>🌐 INTUCH.PARTY (This Site)</h3>
            <p>Personal homepage with Lil Uzi / 90s webcore aesthetic.</p>
            <a href="https://github.com/Intuch1355/intuch.party" target="_blank">View on GitHub →</a>
        </div>

        <div>
            <h3>🛠️ Other Experiments</h3>
            <ul>
                <li>More coming soon...</li>
            </ul>
        </div>
    `,
    links: `
        <h2>My Links</h2>

        <h3>🔗 Social</h3>
        <ul>
            <li><a href="https://github.com/Intuch1355" target="_blank">GitHub</a></li>
            <li><a href="https://www.instagram.com/nathan1355_" target="_blank">Instagram</a></li>
            <li><a href="#" target="_blank">Discord</a></li>
        </ul>

        <h3>🛠️ Dev</h3>
        <ul>
            <li><a href="https://github.com/Intuch1355/intuch.party" target="_blank">This Site Repo</a></li>
        </ul>
    `,
    music: `
        <h2>My Music</h2>
        <p>Coming soon</p>
    `
};

function renderPage() {
    const hash = location.hash.slice(1) || 'home';
    const app = document.getElementById('app');

    if (pages[hash]) {
        app.innerHTML = pages[hash];
    } else {
        app.innerHTML = pages.home;
    }

    // Update active nav link
    document.querySelectorAll('#sidebar a[data-page]').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + hash);
    });
}

// Initial render
renderPage();

// Listen for hash changes
window.addEventListener('hashchange', renderPage);
