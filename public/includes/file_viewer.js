function loadViewerContent(url, title, mimeType) {
    if (title) {
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) {
            headerTitle.textContent = title;
        }
    }

    if (url) {
        const content = document.getElementById("viewer-content");
        const loading = document.getElementById("viewer-loading");
        if (content && loading) {
            // Clear existing content except loading overlay
            content.innerHTML = '';
            content.appendChild(loading);
            loading.style.display = 'flex';

            const iframe = document.createElement("iframe");
            if (mimeType?.includes("wordprocessingml") || mimeType === "application/msword" || mimeType?.includes("presentationml") || mimeType === "application/vnd.ms-powerpoint") {
                iframe.src = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
            } else {
                iframe.src = url;
            }
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.frameBorder = "0";
            iframe.onload = () => {
                if (loading) loading.style.display = "none";
            };
            content.appendChild(iframe);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get('url');
    const title = urlParams.get('title');
    const mimeType = urlParams.get('type');

    if (url || title) {
        loadViewerContent(url, title, mimeType);
    }
});
