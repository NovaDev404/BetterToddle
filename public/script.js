let sidebarContent = `<button class="sidebar-content-item" onclick="sidebarNavigate(this)">
                <span class="sidebar-content-item-left">
                    <svg class="sidebar-content-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"> <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" /> <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" /> </svg>
                    Home
                </span>
            </button>
            <button class="sidebar-content-item" onclick="sidebarNavigate(this)">
                <span class="sidebar-content-item-left">
                    <svg class="sidebar-content-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"> <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" /> <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" /> <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" /> </svg>
                    Courses
                </span>
                <span class="sidebar-content-item-right"><svg class="sidebar-content-item-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg></span>
            </button>`

let sidebarCoursesSubmenuContent = `<button class="sidebar-submenu-nav" onclick="sidebarSubmenuNavigate(this)">
                <span class="sidebar-submenu-nav-left">
                    <svg class="sidebar-content-item-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" /></svg>
                    Courses
                </span>
            </button>`

function populateSidebar() {
    document.getElementById('sidebar-content').innerHTML = sidebarContent;
}
async function addCoursesToCoursesSubmenu() {
    const courses = await getStudentCourses();
    courses.forEach(course => {
        const courseName = course.subjects[0].name
        sidebarCoursesSubmenuContent += `<button class="sidebar-content-item" onclick="sidebarSubmenuNavigate(this)"><span class="sidebar-content-item-left">${courseName}</span></button>`;
    });
    document.getElementById('sidebar-content').innerHTML = sidebarCoursesSubmenuContent;
}

function sidebarNavigate(navItem) {
    const itemName = navItem.children[0].textContent.trim();
    switch (itemName) {
        case "Home":
            // Handle home
            break;
        case "Courses":
            document.getElementById('sidebar-content').innerHTML = sidebarCoursesSubmenuContent;
            break;
        default:
            // Default
            break;
    }
}

function sidebarSubmenuNavigate(navItem) {
    const itemName = navItem.children[0].textContent.trim();
    if (itemName == "Courses") {
        populateSidebar();
    } else {
        // Navigate to course
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await addCoursesToCoursesSubmenu();
    populateSidebar();
});