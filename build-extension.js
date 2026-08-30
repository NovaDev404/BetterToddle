const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Clean and create extension directory
const extensionDir = path.join(__dirname, 'better-toddle-extension');
if (fs.existsSync(extensionDir)) {
    fs.rmSync(extensionDir, { recursive: true, force: true });
}
fs.mkdirSync(extensionDir, { recursive: true });

// Files to copy from public
const filesToCopy = [
    'index.html',
    'styles.css',
    'script.js',
    'auth.js',
    'lessons.js',
    'lessons.css',
    'login/login.js',
    'includes/home.html',
    'includes/home.css',
    'includes/home.js',
    'includes/timetable.html',
    'includes/timetable.css',
    'includes/timetable.js',
    'includes/viewer.html',
    'includes/viewer.css',
    'includes/viewer.js',
    'images/logo_full.png',
    'images/loading.gif',
    'toastui-calendar/toastui-calendar.css',
    'toastui-calendar/toastui-calendar.min.js'
];

// Copy files
const publicDir = path.join(__dirname, 'public');
filesToCopy.forEach(file => {
    const src = path.join(publicDir, file);
    const dest = path.join(extensionDir, file);
    const destDir = path.dirname(dest);
    
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied: ${file}`);
    } else {
        console.warn(`Warning: ${file} not found`);
    }
});

// Read and modify toddle_api.js for extension
const toddleApiSrc = path.join(publicDir, 'toddle_api.js');
let toddleApiContent = fs.readFileSync(toddleApiSrc, 'utf8');

// Replace relative URLs with full Toddle API URLs
toddleApiContent = toddleApiContent.replace(
    /fetch\("\/" \+ getRegion\(\) \+ "\/graphql"/g,
    'fetch("https://" + getRegion() + ".toddleapp.com/graphql"'
);

fs.writeFileSync(
    path.join(extensionDir, 'toddle_api.js'),
    toddleApiContent
);
console.log('Modified and copied: toddle_api.js');

// Parse index.html to extract scripts and styles dynamically
const indexHtml = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');

// Extract script src attributes
const scriptMatches = indexHtml.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/g) || [];
const scripts = scriptMatches.map(match => {
    const srcMatch = match.match(/src=["']([^"']+)["']/);
    return srcMatch ? srcMatch[1] : null;
}).filter(Boolean);

// Extract stylesheet href attributes
const styleMatches = indexHtml.match(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/g) || [];
const styles = styleMatches.map(match => {
    const hrefMatch = match.match(/href=["']([^"']+)["']/);
    return hrefMatch ? hrefMatch[1] : null;
}).filter(Boolean);

console.log('Extracted scripts:', scripts);
console.log('Extracted styles:', styles);

// Create manifest.json
const manifest = {
    manifest_version: 3,
    name: "Better Toddle",
    version: "1.0.0",
    description: "A better interface for Toddle.",
    content_scripts: [
        {
            matches: ["https://web.toddleapp.com/*"],
            js: ["content-isolated.js"],
            run_at: "document_start"
        },
        {
            matches: ["https://web.toddleapp.com/*"],
            js: ["content-main.js"],
            run_at: "document_start",
            world: "MAIN"
        }
    ],
    web_accessible_resources: [
        {
            resources: ["*"],
            matches: ["https://web.toddleapp.com/*"]
        }
    ]
};

fs.writeFileSync(
    path.join(extensionDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
);
console.log('Created: manifest.json');

// Create content-isolated.js (has access to chrome API)
const contentIsolatedJs = `(() => {
    "use strict";

    console.log("[Better Toddle] Isolated world content script loaded");

    // Listen for messages from main world script
    window.addEventListener('better-toddle-takeover', (event) => {
        const { token } = event.detail;
        console.log("[Better Toddle] Received takeover request with token");

        // Store token for toddle_api.js to use
        localStorage.setItem('authToken', token);

        // Clear the entire document
        document.documentElement.innerHTML = '';

        // Load scripts dynamically (extracted from index.html)
        const scripts = ${JSON.stringify(scripts)};
        scripts.forEach(script => {
            const scriptEl = document.createElement('script');
            scriptEl.src = chrome.runtime.getURL(script);
            document.head.appendChild(scriptEl);
        });

        // Load styles dynamically (extracted from index.html)
        const styles = ${JSON.stringify(styles)};
        styles.forEach(style => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = chrome.runtime.getURL(style);
            document.head.appendChild(link);
        });

        // Load and inject index.html body content
        fetch(chrome.runtime.getURL('index.html'))
            .then(response => response.text())
            .then(html => {
                // Extract body content
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                document.body.innerHTML = doc.body.innerHTML;
                console.log("[Better Toddle] UI loaded");
            })
            .catch(err => {
                console.error("[Better Toddle] Failed to load UI:", err);
            });
    });
})();`;

fs.writeFileSync(
    path.join(extensionDir, 'content-isolated.js'),
    contentIsolatedJs
);
console.log('Created: content-isolated.js');

// Create content-main.js (runs in page context, can access localStorage)
const contentMainJs = `(() => {
    "use strict";

    console.log("[Better Toddle] Main world content script loaded");

    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    let token = null;
    
    if (userInfo) {
        try {
            const parsed = JSON.parse(userInfo);
            token = parsed.token;
        } catch (e) {
            console.error("[Better Toddle] Failed to parse userInfo:", e);
        }
    }

    if (!token) {
        console.log("[Better Toddle] User not logged in, skipping takeover");
        return;
    }

    console.log("[Better Toddle] User authenticated, requesting takeover...");

    // Send token to isolated world script
    const event = new CustomEvent('better-toddle-takeover', { detail: { token } });
    window.dispatchEvent(event);
})();`;

fs.writeFileSync(
    path.join(extensionDir, 'content-main.js'),
    contentMainJs
);
console.log('Created: content-main.js');

// Create the zip file
const output = fs.createWriteStream(path.join(__dirname, 'better-toddle-extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    console.log(`Extension built: better-toddle-extension.zip (${archive.pointer()} bytes)`);
});

archive.on('error', (err) => {
    throw err;
});

archive.pipe(output);
archive.directory(extensionDir, false);
archive.finalize();
