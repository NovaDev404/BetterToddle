function checkTokenValid(token) {
    if (!token || !token.includes('Bearer ')) {
        return false;
    }
    const cleaned = token.startsWith('Bearer ') ? token.slice(7) : token;
    const parts = cleaned.split('.');

    if (parts.length !== 3) {
        return false;
    }

    try {
        const decodeBase64 = (str) => atob(str.replace(/-/g, '+').replace(/_/g, '/'));
        const header = JSON.parse(decodeBase64(parts[0]));
        const payload = JSON.parse(decodeBase64(parts[1]));
        
        if (header.typ != "JWT" || payload.ut != "student" || payload.roles[0] != "student" || payload.isSessionVerified != true) {
            return false;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const secondsRemaining = payload.exp - currentTime;
        const daysRemaining = (secondsRemaining / (60 * 60 * 24)).toFixed(1);
        if (!(secondsRemaining > 0)) {
            return false;
        }
    } catch (err) {
        return false;
    }
    return true;
}

let isAuthenticated = localStorage.getItem("authToken") ? true : false;
let isTokenValid = checkTokenValid(localStorage.getItem("authToken"))

if (!isAuthenticated || !isTokenValid) {
    window.location.href = "/login/";
}