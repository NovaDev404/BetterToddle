let sidebarContent = `
<button class="sidebar-content-item" onclick="sidebarNavigate(this)">
    <div class="sidebar-content-item-left">
        <svg class="sidebar-content-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"> <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" /> <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" /> </svg>
        Home
    </div>
</button>
<button class="sidebar-content-item" onclick="sidebarNavigate(this)">
    <div class="sidebar-content-item-left">
        <svg class="sidebar-content-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"> <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" /> <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" /> <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" /> </svg>
        Courses
    </div>
    <div class="sidebar-content-item-right"><svg class="sidebar-content-item-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg></div>
</button>
<button class="sidebar-content-item" onclick="sidebarNavigate(this)">
    <div class="sidebar-content-item-left">
        <svg class="sidebar-content-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" /><path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" /></svg>
        Timetable
    </div>
</button>`

let sidebarCoursesSubmenuContent = `
<button class="sidebar-submenu-nav" onclick="sidebarCoursesSubmenuNavigate(this)">
    <span class="sidebar-submenu-nav-left">
        <svg class="sidebar-content-item-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" /></svg>
        Courses
    </span>
</button>`

let mainHomeContent = fetch('includes/home.html').then(res => res.text());
let mainTimetableContent = fetch('includes/timetable.html').then(res => res.text());

function updateUrl(page) {
    if (page == "home") {
        window.history.replaceState({}, "", "/");
    } else {
        window.history.replaceState({}, "", "?page=" + page);
    }
}
function populateSidebar() {
    document.getElementById('sidebar-content').innerHTML = sidebarContent;
}
function populateMainContent(content) {
    document.getElementById('main').innerHTML = content;
}
async function addCoursesToCoursesSubmenu() {
    const courses = await getStudentCourses();
    courses.forEach(course => {
        const subjectName = course.subjects[0].name;
        const courseName = course.title;
        sidebarCoursesSubmenuContent += `<button class="sidebar-content-item" onclick="sidebarCoursesSubmenuNavigate(this)"><div class="sidebar-content-item-left">${subjectName}<br><span class="sidebar-content-item-left-subtitle">${courseName}</span></div></button>`;
    });
}

async function sidebarNavigate(navItem) {
    const itemName = navItem.children[0].textContent.trim();
    switch (itemName) {
        case "Home":
            navigateTo("home");
            break;
        case "Courses":
            document.getElementById('sidebar-content').innerHTML = sidebarCoursesSubmenuContent;
            break;
        case "Timetable":
            navigateTo("timetable");
            break;
        default:
            // Do nothing
            break;
    }
}

async function sidebarCoursesSubmenuNavigate(navItem) {
    const itemName = navItem.children[0]?.children[1]?.textContent.trim() ?? navItem.children[0]?.textContent.trim();
    if (itemName == "Courses") {
        populateSidebar();
    } else {
        const courses = await getStudentCourses();
        let courseId = "";
        let learningCourseId = "";
        courses.forEach(course => {
            if (course.title === itemName) {
                courseId = course.id;
                learningCourseId = course.learningCourse[0].id;
            }
        });
        const courseFlow = await getCourseFlow(courseId, learningCourseId);
    }
}

async function navigateTo(page) {
    if (page === "home") {
        populateMainContent(await mainHomeContent);
        updateUrl("home");
    } else if (page === "timetable") {
        populateMainContent(await mainTimetableContent);
        initTimetable();
        updateUrl("timetable");
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    await addCoursesToCoursesSubmenu();
    populateSidebar();
    navigateTo(page);
});