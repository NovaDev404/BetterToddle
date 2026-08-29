let sidebarContent = `
<button class="sidebar-content-item" onclick="sidebarNavigate(this)">
    <div class="sidebar-content-item-left">
        <img class="sidebar-content-item-icon" src="/icons/24/solid/home.svg" alt="Home" width="24" height="20" />
        Home
    </div>
</button>
<button class="sidebar-content-item" onclick="sidebarNavigate(this)">
    <div class="sidebar-content-item-left">
        <img class="sidebar-content-item-icon" src="/icons/24/solid/academic-cap.svg" alt="Courses" width="24" height="20" />
        Courses
    </div>
    <div class="sidebar-content-item-right"><img class="sidebar-content-item-chevron" src="/icons/24/solid/chevron-right.svg" alt="Expand" width="24" height="20" /></div>
</button>
<button class="sidebar-content-item" onclick="sidebarNavigate(this)">
    <div class="sidebar-content-item-left">
        <img class="sidebar-content-item-icon" src="/icons/24/solid/calendar-days.svg" alt="Timetable" width="24" height="20" />
        Timetable
    </div>
</button>`

let sidebarCoursesSubmenuContent = `
<button class="sidebar-submenu-nav" onclick="sidebarCoursesSubmenuNavigate(this)">
    <span class="sidebar-submenu-nav-left">
        <img class="sidebar-content-item-chevron" src="/icons/24/solid/arrow-left.svg" alt="Back" width="24" height="20" />
        Courses
    </span>
</button>`;

let mainHomeContent = fetch('includes/home.html').then(res => res.text());
let mainTimetableContent = fetch('includes/timetable.html').then(res => res.text());
let cachedStudentCourses = null;

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
    if (!cachedStudentCourses) {
        cachedStudentCourses = await getStudentCourses();
    }
    const courses = cachedStudentCourses;
    courses.forEach(course => {
        const subjectName = course.subjects[0].name;
        const courseName = course.title;
        sidebarCoursesSubmenuContent += `<button class="sidebar-content-item" onclick="sidebarCoursesSubmenuNavigate(this)"><div class="sidebar-content-item-left">${subjectName}<br><span class="sidebar-content-item-left-subtitle">${courseName}</span></div><div class="sidebar-content-item-right"><img class="sidebar-content-item-chevron" src="/icons/24/solid/chevron-right.svg" alt="Expand" width="24" height="20" /></div></button>`;
    });
}

async function sidebarNavigate(navItem) {
    const itemName = navItem.children[0].textContent.trim();
    switch (itemName) {
        case "Home":
            navigateTo("home");
            document.getElementById('sidebar').classList.remove('mobile-visible');
            break;
        case "Courses":
            document.getElementById('sidebar-content').innerHTML = sidebarCoursesSubmenuContent;
            break;
        case "Timetable":
            navigateTo("timetable");
            document.getElementById('sidebar').classList.remove('mobile-visible');
            break;
        default:
            // Do nothing
            break;
    }
}

async function sidebarCoursesSubmenuNavigate(navItem) {
    const subtitleElement = navItem.children[0]?.querySelector('.sidebar-content-item-left-subtitle');
    const itemName = subtitleElement ? subtitleElement.textContent.trim() : navItem.children[0]?.textContent.trim();
    if (itemName == "Courses") {
        populateSidebar();
    } else {
        loadingOverlay(true);
        const courses = cachedStudentCourses;
        let courseId = "";
        let learningCourseId = "";
        let subjectName = "";
        courses.forEach(course => {
            if (course.title === itemName) {
                courseId = course.id;
                learningCourseId = course.learningCourse[0].id;
                subjectName = course.subjects[0].name;
            }
        });
        await addLessonsToLessonsSubmenu(courseId, learningCourseId, subjectName);
        document.getElementById('sidebar').classList.add('sidebar-extended');
        document.getElementById('sidebar-content').innerHTML = sidebarLessonsSubmenuContent;
        loadingOverlay(false);
    }
}

async function navigateTo(page, force = false) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page') || 'home';
    if (currentPage === page && !force) {
        return;
    }
    loadingOverlay(true);
    if (page === "home") {
        populateMainContent(await mainHomeContent);
        updateUrl("home");
        await updateStudentNameHome();
        loadingOverlay(false);
    } else if (page === "timetable") {
        populateMainContent(await mainTimetableContent);
        initTimetable();
        updateUrl("timetable");
    }
}

function loadingOverlay(yes) {
    if (yes) {
        document.getElementById("loadingOverlay").style.display = "flex";
    } else {
        document.getElementById("loadingOverlay").style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    await loadStudentDetails();
    await addCoursesToCoursesSubmenu();
    populateSidebar();
    if (page) {
        navigateTo(page, true);
    } else {
        navigateTo("home", true);
    }

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('mobile-visible');
        });
    }
});