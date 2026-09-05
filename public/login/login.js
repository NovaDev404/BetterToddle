document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const cookies = urlParams.get('cookies');
    if (code) {
        localStorage.setItem("authToken", "Bearer " + code);
        if (cookies) {
            const essentialCookies = ['lhst', 'rhst'];
            const cookiePairs = cookies.split('; ');
            const filteredCookies = cookiePairs.filter(pair => {
                const cookieName = pair.split('=')[0];
                return essentialCookies.includes(cookieName);
            }).join('; ');
            localStorage.setItem("authCookies", filteredCookies);
        }
        window.location.href = "/";
    }
});

const isIOS = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return true;
  }
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return true;
  }
  return false;
};

document.addEventListener('DOMContentLoaded', function() {
    const bookmarkIcon = `<img src="/icons/24/solid/bookmark.svg" alt="Bookmark" width="24" height="20" />`;
    const shortcutsIcon = `<svg width="24" height="24" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none"> <path d="M2474 5109 c-227 -21 -230 -23 -1133 -757 -854 -693 -840 -680 -893 -832 -32 -94 -32 -267 1 -360 47 -135 89 -181 357 -397 134 -108 244 -200 244 -204 0 -4 -19 -22 -42 -41 -435 -340 -507 -411 -559 -558 -33 -93 -33 -266 -1 -360 53 -152 39 -138 892 -832 466 -378 807 -648 847 -671 220 -121 524 -120 747 1 77 43 1542 1229 1624 1316 186 196 187 527 4 727 -85 93 -1549 1277 -1640 1326 -211 115 -471 121 -694 16 -113 -52 -405 -283 -435 -343 -68 -134 27 -290 177 -290 61 0 92 18 245 139 77 61 164 123 193 137 103 49 249 40 343 -21 63 -41 1493 -1205 1517 -1235 29 -36 38 -96 22 -144 -14 -44 -1482 -1245 -1580 -1294 -80 -40 -220 -40 -300 0 -32 16 -243 180 -500 389 -245 199 -583 474 -753 611 -316 256 -337 278 -337 347 0 69 17 88 288 308 254 207 264 214 285 199 12 -9 182 -146 377 -306 466 -381 529 -414 790 -414 223 0 333 46 590 249 128 101 162 134 180 171 62 128 -36 284 -179 284 -62 0 -95 -18 -236 -131 -192 -152 -246 -179 -354 -179 -134 0 -124 -7 -714 473 -272 221 -608 494 -746 606 -139 113 -259 217 -267 232 -18 36 -18 102 1 139 8 16 240 211 542 457 291 235 629 510 753 612 271 221 299 236 430 236 83 0 102 -3 150 -27 51 -25 1505 -1196 1557 -1254 50 -56 42 -141 -21 -211 -87 -97 -100 -180 -40 -266 138 -196 410 -43 480 272 40 177 -19 374 -148 499 -110 107 -1543 1262 -1608 1296 -87 46 -178 74 -259 81 -36 3 -77 7 -91 9 -14 1 -62 -1 -106 -5z"/></g></svg>`;
    const wrenchIcon = `<img src="/icons/24/solid/wrench.svg" alt="Developer Tools" width="24" height="20" />`;
    const tokenIcon = `<img src="/icons/24/solid/key.svg" alt="Auth Token" width="24" height="20" />`;
    const chevronIcon = `<img src="/icons/24/solid/chevron-right.svg" alt="Expand" width="24" height="20" />`;

    if (isIOS()) {
        document.getElementById("loginButtons").innerHTML = `<button class="login-button login-button-active" id="iosShortcutsBtn"><span class="login-button-content">${shortcutsIcon}Login with iOS Shortcuts</span>${chevronIcon}</button><button class="login-button" id="bookmarkletBtn"><span class="login-button-content">${bookmarkIcon}Login with bookmarklet</span>${chevronIcon}</button><button class="login-button" id="devToolsBtn"><span class="login-button-content">${wrenchIcon}Login with developer tools</span>${chevronIcon}</button><button class="login-button" id="authTokenBtn"><span class="login-button-content">${tokenIcon}Login with auth token</span>${chevronIcon}</button>`;
    } else {
        document.getElementById("loginButtons").innerHTML = `<button class="login-button login-button-active" id="bookmarkletBtn"><span class="login-button-content">${bookmarkIcon}Login with bookmarklet</span>${chevronIcon}</button><button class="login-button" id="devToolsBtn"><span class="login-button-content">${wrenchIcon}Login with developer tools</span>${chevronIcon}</button><button class="login-button" id="authTokenBtn"><span class="login-button-content">${tokenIcon}Login with auth token</span>${chevronIcon}</button>`;
    }

    const iosShortcutsBtn = document.getElementById('iosShortcutsBtn');
    if (iosShortcutsBtn) {
        iosShortcutsBtn.addEventListener('click', function() {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <h2 class="modal-title">iOS Shortcuts Login</h2>
                    <p class="modal-text">Follow these steps to login using iOS Shortcuts:</p>
                    <ol class="modal-steps">
                        <li><a href="https://www.icloud.com/shortcuts/e779e51678724cf4a8c3220a270bede3" target="_blank" style="color: #007AFF;">Install the iOS Shortcut</a></li>
                        <li>Make sure <code>Allow Running Scripts</code> is enabled in Settings: <code>Apps > Shortcuts > Advanced</code>
                        <li>Login to the Toddle website</li>
                        <li>Tap Share, then "View More"</li>
                        <li>Click "Login to Better Toddle"</li>
                    </ol>
                    <div class="modal-buttons">
                        <button id="closeModalBtn" class="modal-close-btn">Close</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close button functionality
            document.getElementById('closeModalBtn').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            // Close on background click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        });
    }

    const devToolsBtn = document.getElementById('devToolsBtn');
    if (devToolsBtn) {
        devToolsBtn.addEventListener('click', function() {
            const command = `let u=JSON.parse(localStorage.getItem("userInfo"));let c=document.cookie;location.href="https://bettertoddle.epicsitez.com/login/?code="+encodeURIComponent(u.jwt||u.token)+"&cookies="+encodeURIComponent(c);`;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <h2 class="modal-title">Developer Tools Login</h2>
                    <p class="modal-text">Follow these steps to login using developer tools:</p>
                    <ol class="modal-steps">
                        <li>Open the browser console (<code>Ctrl + Shift + J</code> on Windows, or <code>Cmd + Option + J</code> on Mac, or <code>F12</code>)</li>
                        <li>Copy and paste the command below into the console</li>
                        <li>Press Enter to execute</li>
                        <li>If asked, type <code>allow pasting</code>, press enter, and repeat steps 2-3</li>
                    </ol>
                    <div class="modal-code-container">
                        <code class="modal-code">${command}</code>
                        <button id="copyCommandBtn" class="modal-copy-btn"><img src="/icons/24/solid/clipboard-document.svg" alt="Copy" width="24" height="20" /></button>
                    </div>
                    <div class="modal-buttons">
                        <button id="closeModalBtn" class="modal-close-btn">Close</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Copy button functionality
            document.getElementById('copyCommandBtn').addEventListener('click', function() {
                const originalSVG = this.innerHTML;
                navigator.clipboard.writeText(command).then(() => {
                    this.innerHTML = '<img src="/icons/24/solid/check-circle.svg" alt="Copied" width="24" height="20" />';
                    setTimeout(() => {
                        this.innerHTML = originalSVG;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
            
            // Close button functionality
            document.getElementById('closeModalBtn').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            // Close on background click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        });
    }

    const bookmarkletBtn = document.getElementById('bookmarkletBtn');
    if (bookmarkletBtn) {
        bookmarkletBtn.addEventListener('click', function() {
            const bookmarkletCode = `javascript:(function(){let u=JSON.parse(localStorage.getItem("userInfo"));let c=document.cookie;location.href="https://bettertoddle.epicsitez.com/login/?code="+encodeURIComponent(u.jwt||u.token)+"&cookies="+encodeURIComponent(c);})()`;
            const bookmarkletEncoded = `javascript:(function()%7Blet%20u%3DJSON.parse(localStorage.getItem(%22userInfo%22))%3Blet%20c%3Ddocument.cookie%3Blocation.href%3D%22https%3A%2F%2Fbettertoddle.epicsitez.com%2Flogin%2F%3Fcode%3D%22%2BencodeURIComponent(u.jwt%7C%7Cu.token)%2B%22%26cookies%3D%22%2BencodeURIComponent(c)%3B%7D)()%3B`;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <h2 class="modal-title">Bookmarklet Login</h2>
                    <p class="modal-text">Follow these steps on a computer to create a bookmarklet for easy login:</p>
                    <ol class="modal-steps">
                        <li>Create a new bookmark in your browser (right-click bookmarks bar, select "Add Page" or "New bookmark")</li>
                        <li>Name the bookmark <code>Login to Better Toddle</code></li>
                        <li>Paste the code below as the URL</li>
                        <li>Once logged into Toddle, click the bookmark while on Toddle to automatically sign into Better Toddle</li>
                    </ol>
                    <div class="modal-code-container">
                        <code class="modal-code">${bookmarkletEncoded}</code>
                        <button id="copyBookmarkletBtn" class="modal-copy-btn"><img src="/icons/24/solid/clipboard-document.svg" alt="Copy" width="24" height="20" /></button>
                    </div>
                    <div class="modal-buttons">
                        <button id="closeModalBtn" class="modal-close-btn">Close</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Copy button functionality
            document.getElementById('copyBookmarkletBtn').addEventListener('click', function() {
                const originalSVG = this.innerHTML;
                navigator.clipboard.writeText(bookmarkletEncoded).then(() => {
                    this.innerHTML = '<img src="/icons/24/solid/check-circle.svg" alt="Copied" width="24" height="20" />';
                    setTimeout(() => {
                        this.innerHTML = originalSVG;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
            
            // Close button functionality
            document.getElementById('closeModalBtn').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            // Close on background click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        });
    }

    const authTokenBtn = document.getElementById('authTokenBtn');
    if (authTokenBtn) {
        authTokenBtn.addEventListener('click', function() {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <h2 class="modal-title">Auth Token Login</h2>
                    <p class="modal-text">Paste your Toddle Bearer authentication code below:</p>
                    <div style="margin: 20px 0;">
                        <input type="text" id="authTokenInput" placeholder="Paste your auth token here" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />
                    </div>
                    <div class="modal-buttons">
                        <button id="submitTokenBtn" class="modal-copy-btn" style="padding: 10px 20px;">Login</button>
                        <button id="closeModalBtn" class="modal-close-btn">Close</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Submit button functionality
            document.getElementById('submitTokenBtn').addEventListener('click', function() {
                const token = document.getElementById('authTokenInput').value.trim();
                let formattedToken = token;
                if (/^Bearer\s+\S+$/.test(formattedToken)) {
                    localStorage.setItem("authToken", formattedToken);
                    window.location.href = "/";
                } else {
                    alert('Invalid token format. Please enter a valid auth token.');
                }
            });
            
            // Close button functionality
            document.getElementById('closeModalBtn').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            // Close on background click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        });
    }
});