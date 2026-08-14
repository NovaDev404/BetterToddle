let sidebarLessonsSubmenuContent = "";

async function addLessonsToLessonsSubmenu(courseID, learningCourseID, subjectName) {
    const lessons = await getCourseFlow(courseID, learningCourseID);
    sidebarLessonsSubmenuContent = `
<button class="sidebar-submenu-nav" onclick="sidebarLessonsSubmenuNavigate(this)">
    <span class="sidebar-submenu-nav-left">
        <svg class="sidebar-content-item-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" /></svg>
        ${subjectName}
    </span>
</button>`;

    const edges = lessons.classFlowFeedWrapper.learningCourseFlowFeed.edges;

    if (!edges || edges.length === 0) {
        sidebarLessonsSubmenuContent += `<div class="sidebar-no-lessons">No lessons set</div>`;
        return;
    }

    const nodeMap = new Map();
    const rootNodes = [];

    edges.forEach(edge => {
        const node = edge.node;
        const cleanLabel = node.label.replace(/<[^>]*>/g, '').trim();
        
        nodeMap.set(node.id, {
            id: node.id,
            label: cleanLabel,
            depth: node.depth,
            resourceType: node.resourceType,
            parentId: node.parent?.id || null,
            children: []
        });
    });

    nodeMap.forEach(node => {
        if (node.parentId && nodeMap.has(node.parentId)) {
            nodeMap.get(node.parentId).children.push(node);
        } else {
            rootNodes.push(node);
        }
    });

    function generateNodeHTML(node) {
        let html = '';
        
        if (node.resourceType === 'UNIT_PLAN') {
            const hasChildren = node.children.length > 0;
            const chevron = hasChildren ? '<svg class="lesson-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02l2.97 2.97 2.97-2.97a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" /></svg>' : '';
            
            html += `<div class="lesson-topic" onclick="toggleLesson(this)">${chevron}<span class="lesson-topic-title">${node.label}</span></div>`;
            if (hasChildren) {
                html += '<div class="lesson-children">';
                node.children.forEach(child => {
                    html += generateNodeHTML(child);
                });
                html += '</div>';
            }
        } else if (node.resourceType === 'FOLDER') {
            const hasChildren = node.children.length > 0;
            const chevron = hasChildren ? '<svg class="lesson-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02l2.97 2.97 2.97-2.97a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" /></svg>' : '';
            
            html += `<div class="lesson-folder" onclick="toggleLesson(this)">${chevron}<span class="lesson-folder-title">${node.label}</span></div>`;
            if (hasChildren) {
                html += '<div class="lesson-children">';
                node.children.forEach(child => {
                    html += generateNodeHTML(child);
                });
                html += '</div>';
            }
        } else {
            const icon = getResourceIcon(node.resourceType);
            html += `<button class="lesson-item" onclick="sidebarLessonsSubmenuNavigate(this)">${icon}<span class="lesson-item-title">${node.label}</span></button>`;
        }
        
        return html;
    }

    function getResourceIcon(resourceType) {
        const icons = {
            'ASSESSMENT': '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" /></svg>',
            'FILE': '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z" clip-rule="evenodd" /></svg>',
            'WORKSHEET': '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" /></svg>',
            'LEARNING_ENGAGEMENT': '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" /></svg>'
        };
        return icons[resourceType] || '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" /></svg>';
    }
    
    rootNodes.forEach(node => {
        sidebarLessonsSubmenuContent += generateNodeHTML(node);
    });
}

async function sidebarLessonsSubmenuNavigate(navItem) {
    if (navItem.classList.contains('sidebar-submenu-nav')) {
        document.getElementById('sidebar-content').innerHTML = sidebarCoursesSubmenuContent;
    } else {
        // Clicking on lesson items does nothing for now
        const itemName = navItem.querySelector('.lesson-item-title')?.textContent.trim();
        console.log("Lesson clicked:", itemName);
    }
}

function toggleLesson(headerElement) {
    const container = headerElement.nextElementSibling;
    const chevron = headerElement.querySelector('.lesson-chevron');
    
    if (container && container.classList.contains('lesson-children')) {
        container.classList.toggle('collapsed');
        if (chevron) {
            chevron.classList.toggle('rotated');
        }
    }
}