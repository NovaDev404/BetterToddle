const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Clean and create extension directory
const extensionDir = path.join(__dirname, 'better-toddle-extension');
if (fs.existsSync(extensionDir)) {
    fs.rmSync(extensionDir, { recursive: true, force: true });
}
fs.mkdirSync(extensionDir, { recursive: true });

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules directory
            if (file !== 'node_modules') {
                arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
            }
        } else {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}

// Copy all files from public directory dynamically
const publicDir = path.join(__dirname, 'public');
const allFiles = getAllFiles(publicDir);

allFiles.forEach(srcPath => {
    const relativePath = path.relative(publicDir, srcPath);
    const destPath = path.join(extensionDir, relativePath);
    const destDir = path.dirname(destPath);
    
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${relativePath}`);
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

    // Block Toddle's redirects by overriding location methods
    const originalLocationHref = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href');
    const originalLocationAssign = window.location.assign;
    const originalLocationReplace = window.location.replace;

    // Override href setter
    Object.defineProperty(window.Location.prototype, 'href', {
        set: function(url) {
            // Only allow redirects to main page
            if (url === 'https://web.toddleapp.com/' || url === 'https://web.toddleapp.com' || url === '/' || url === '') {
                console.log("[Better Toddle] Allowing redirect to:", url);
                originalLocationHref.set.call(this, url);
            } else {
                console.log("[Better Toddle] Blocked redirect to:", url);
            }
        },
        get: function() {
            return originalLocationHref.get.call(this);
        }
    });

    // Override assign method
    window.location.assign = function(url) {
        if (url === 'https://web.toddleapp.com/' || url === 'https://web.toddleapp.com' || url === '/' || url === '') {
            console.log("[Better Toddle] Allowing assign to:", url);
            return originalLocationAssign.call(this, url);
        } else {
            console.log("[Better Toddle] Blocked assign to:", url);
        }
    };

    // Override replace method
    window.location.replace = function(url) {
        if (url === 'https://web.toddleapp.com/' || url === 'https://web.toddleapp.com' || url === '/' || url === '') {
            console.log("[Better Toddle] Allowing replace to:", url);
            return originalLocationReplace.call(this, url);
        } else {
            console.log("[Better Toddle] Blocked replace to:", url);
        }
    };

    // Override pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(state, title, url) {
        if (!url || url === '/' || url === '' || url === '/') {
            console.log("[Better Toddle] Allowing pushState to:", url);
            return originalPushState.call(this, state, title, url);
        } else {
            console.log("[Better Toddle] Blocked pushState to:", url);
        }
    };

    history.replaceState = function(state, title, url) {
        if (!url || url === '/' || url === '' || url === '/') {
            console.log("[Better Toddle] Allowing replaceState to:", url);
            return originalReplaceState.call(this, state, title, url);
        } else {
            console.log("[Better Toddle] Blocked replaceState to:", url);
        }
    };

    // Check if already on main page
    if (window.location.pathname === '/' || window.location.pathname === '') {
        console.log("[Better Toddle] Already on main page, checking auth...");
    } else {
        console.log("[Better Toddle] On subpage:", window.location.pathname);
    }

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

    // If on a subpage and logged in, redirect to main page
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
        console.log("[Better Toddle] Redirecting to main page...");
        window.location.href = 'https://web.toddleapp.com/';
        return;
    }

    console.log("[Better Toddle] User authenticated on main page, requesting takeover...");

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
