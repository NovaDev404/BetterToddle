function submitAuthForm(e) {
    e.preventDefault();
    const token = document.getElementById("tokenInput").value.trim();
    if (/^Bearer\s+\S+$/.test(token)) {
        localStorage.setItem("authToken", token);
        window.location.href = "/";
    } else {
        window.location.reload()
    }
}