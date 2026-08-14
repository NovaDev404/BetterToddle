document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        localStorage.setItem("authToken", "Bearer " + code);
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
    const bookmarkIcon = `<svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" clip-rule="evenodd" /></svg>`;
    const shortcutsIcon = `<svg width="24" height="24" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none"> <path d="M2474 5109 c-227 -21 -230 -23 -1133 -757 -854 -693 -840 -680 -893 -832 -32 -94 -32 -267 1 -360 47 -135 89 -181 357 -397 134 -108 244 -200 244 -204 0 -4 -19 -22 -42 -41 -435 -340 -507 -411 -559 -558 -33 -93 -33 -266 -1 -360 53 -152 39 -138 892 -832 466 -378 807 -648 847 -671 220 -121 524 -120 747 1 77 43 1542 1229 1624 1316 186 196 187 527 4 727 -85 93 -1549 1277 -1640 1326 -211 115 -471 121 -694 16 -113 -52 -405 -283 -435 -343 -68 -134 27 -290 177 -290 61 0 92 18 245 139 77 61 164 123 193 137 103 49 249 40 343 -21 63 -41 1493 -1205 1517 -1235 29 -36 38 -96 22 -144 -14 -44 -1482 -1245 -1580 -1294 -80 -40 -220 -40 -300 0 -32 16 -243 180 -500 389 -245 199 -583 474 -753 611 -316 256 -337 278 -337 347 0 69 17 88 288 308 254 207 264 214 285 199 12 -9 182 -146 377 -306 466 -381 529 -414 790 -414 223 0 333 46 590 249 128 101 162 134 180 171 62 128 -36 284 -179 284 -62 0 -95 -18 -236 -131 -192 -152 -246 -179 -354 -179 -134 0 -124 -7 -714 473 -272 221 -608 494 -746 606 -139 113 -259 217 -267 232 -18 36 -18 102 1 139 8 16 240 211 542 457 291 235 629 510 753 612 271 221 299 236 430 236 83 0 102 -3 150 -27 51 -25 1505 -1196 1557 -1254 50 -56 42 -141 -21 -211 -87 -97 -100 -180 -40 -266 138 -196 410 -43 480 272 40 177 -19 374 -148 499 -110 107 -1543 1262 -1608 1296 -87 46 -178 74 -259 81 -36 3 -77 7 -91 9 -14 1 -62 -1 -106 -5z"/></g></svg>`;
    const wrenchIcon = `<svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25Zm.943 8.752a.75.75 0 0 1 .055-1.06L6.128 9l-1.88-1.693a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 0 1-1.06-.055ZM9.75 10.25a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z" clip-rule="evenodd" /></svg>`;
    const tokenIcon = `<svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M10 2.5c-1.31 0-2.526.386-3.546 1.051a.75.75 0 0 1-.82-1.256A8 8 0 0 1 18 9a22.47 22.47 0 0 1-1.228 7.351.75.75 0 1 1-1.417-.49A20.97 20.97 0 0 0 16.5 9 6.5 6.5 0 0 0 10 2.5ZM4.333 4.416a.75.75 0 0 1 .218 1.038A6.466 6.466 0 0 0 3.5 9a7.966 7.966 0 0 1-1.293 4.362.75.75 0 0 1-1.257-.819A6.466 6.466 0 0 0 2 9c0-1.61.476-3.11 1.295-4.365a.75.75 0 0 1 1.038-.219ZM10 6.12a3 3 0 0 0-3.001 3.041 11.455 11.455 0 0 1-2.697 7.24.75.75 0 0 1-1.148-.965A9.957 9.957 0 0 0 5.5 9c0-.028.002-.055.004-.082a4.5 4.5 0 0 1 8.996.084V9.15l-.005.297a.75.75 0 1 1-1.5-.034c.003-.11.004-.219.005-.328a3 3 0 0 0-3-2.965Zm0 2.13a.75.75 0 0 1 .75.75c0 3.51-1.187 6.745-3.181 9.323a.75.75 0 1 1-1.186-.918A13.687 13.687 0 0 0 9.25 9a.75.75 0 0 1 .75-.75Zm3.529 3.698a.75.75 0 0 1 .584.885 18.883 18.883 0 0 1-2.257 5.84.75.75 0 1 1-1.29-.764 17.386 17.386 0 0 0 2.078-5.377.75.75 0 0 1 .885-.584Z" clip-rule="evenodd" /></svg>`;
    const chevronIcon = `<svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>`;

    if (!isIOS()) {
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
                        <li><a href="https://www.icloud.com/shortcuts/4dfbaef9d055422dbb8464768b25b12e" target="_blank" style="color: #007AFF;">Install the iOS Shortcut</a></li>
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
            const command = `let u=JSON.parse(localStorage.getItem("userInfo"));location.href="https://bettertoddle.epicsitez.com/login/?code="+encodeURIComponent(u.jwt||u.token);`;
            
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
                        <button id="copyCommandBtn" class="modal-copy-btn"><svg height="25px" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z" clip-rule="evenodd" /><path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" /><path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" /></svg></button>
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
                    this.innerHTML = '<svg height="25px" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>';
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
            const bookmarkletCode = `javascript:(function(){let u=JSON.parse(localStorage.getItem("userInfo"));location.href="https://bettertoddle.epicsitez.com/login/?code="+encodeURIComponent(u.jwt||u.token);})()`;
            const bookmarkletEncoded = `javascript:(function()%7Blet%20u%3DJSON.parse(localStorage.getItem(%22userInfo%22))%3Blocation.href%3D%22https%3A%2F%2Fbettertoddle.epicsitez.com%2Flogin%2F%3Fcode%3D%22%2BencodeURIComponent(u.jwt%7C%7Cu.token)%3B%7D)()%3B`;
            
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
                        <button id="copyBookmarkletBtn" class="modal-copy-btn"><svg height="25px" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z" clip-rule="evenodd" /><path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" /><path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" /></svg></button>
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
                    this.innerHTML = '<svg height="25px" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>';
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