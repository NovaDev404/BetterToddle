let sidebarLessonsSubmenuContent = "";

function classifyCourseFlowNode(node) {
    const resourceType = node.resourceType;

    if (resourceType === "ASSESSMENT") {
        return {
            category: "assessment",
            subtype: node.item?.type ?? null,
            assessmentType: node.item?.assessmentType?.value ?? null
        };
    }

    if (resourceType === "FILE") {
        return {
            category: "file",
            subtype: node.item?.mimeType ?? null,
            attachmentType: node.item?.attachmentType ?? null
        };
    }

    if (resourceType === "UNIT_PLAN") {
        return {
            category: "unit_plan",
            subtype: node.item?.unitType?.value ?? null
        };
    }

    if (resourceType === "FOLDER") {
        return {
            category: "folder",
            subtype: null
        };
    }

    return {
        category: resourceType?.toLowerCase() ?? "unknown",
        subtype: null
    };
}

function getLessonTypeLabel(info) {
    if (info.category === "assessment") {
        switch (info.assessmentType) {
            case "le":
                return "Learning Experience";
            case "worksheet":
                return "Worksheet";
            default:
                return "Assessment";
        }
    }

    if (info.category === "file") {
        const mime = info.subtype;

        if (mime === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || mime === "application/vnd.ms-powerpoint") {
            return "Presentation";
        }

        if (mime === "application/pdf") {
            return "PDF";
        }

        if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || mime === "application/msword") {
            return "Document";
        }

        if (mime?.startsWith("audio/")) {
            return "Audio";
        }

        if (mime?.startsWith("video/")) {
            return "Video";
        }

        if (mime?.startsWith("image/")) {
            return "Image";
        }

        return "File";
    }

    if (info.category === "folder") {
        return "Folder";
    }

    if (info.category === "unit_plan") {
        return "Unit Plan";
    }

    return "Unknown";
}

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
            item: node.item,
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
            const icon = getResourceIcon(node);
            const info = classifyCourseFlowNode(node);
            const lessonType = getLessonTypeLabel(info);
            html += `<button class="lesson-item" onclick="sidebarLessonsSubmenuNavigate(this)" data-lesson-type="${lessonType}">${icon}<span class="lesson-item-title">${node.label}</span></button>`;
        }
        
        return html;
    }

    function getResourceIcon(node) {
        const info = classifyCourseFlowNode(node);

        if (info.category === "assessment") {
            switch (info.assessmentType) {
                case "le":
                    return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" /></svg>';
                case "worksheet":
                    return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" /></svg>';
                default:
                    return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" /><path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" /></svg>';
            }
        }

        if (info.category === "file") {
            const mime = info.subtype;

            if (mime === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || mime === "application/vnd.ms-powerpoint") {
                return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.375 4.125C3.375 3.504 3.879 3 4.5 3h15c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125V4.125ZM13.5 8.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM13.5 11.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM13.5 14.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM5.625 8.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75ZM5.625 11.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75ZM5.625 14.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" /></svg>';
            }

            if (mime === "application/pdf") {
                return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" /></svg>';
            }

            if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || mime === "application/msword") {
                return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" /></svg>';
            }

            if (mime?.startsWith("audio/")) {
                return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 3.03v7.5a.75.75 0 0 1-1.5 0v-7.5c0-.414.336-.75.75-.75s.75.336.75.75ZM9.75 9.75a.75.75 0 0 0-1.5 0v1.5a3.75 3.75 0 1 0 7.5 0v-1.5a.75.75 0 0 0-1.5 0v1.5a2.25 2.25 0 1 1-4.5 0v-1.5Z" /><path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 1.5h9a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0V3h-7.5v7.5a.75.75 0 0 1-1.5 0v-7.5Z" clip-rule="evenodd" /></svg>';
            }

            if (mime?.startsWith("video/")) {
                return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" /></svg>';
            }

            if (mime?.startsWith("image/")) {
                return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm7.47-3.97a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM18.75 7.5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clip-rule="evenodd" /></svg>';
            }

            return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z" clip-rule="evenodd" /></svg>';
        }

        if (info.category === "folder") {
            return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM12.75 4.5a.75.75 0 0 0-.75.75v6a.75.75 0 0 0 1.5 0v-6a.75.75 0 0 0-.75-.75Z" /><path d="M3.75 4.5a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h6a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-.75-.75h-6Z" /></svg>';
        }

        if (info.category === "unit_plan") {
            return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" /></svg>';
        }

        return '<svg class="lesson-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" /></svg>';
    }
    
    rootNodes.forEach(node => {
        sidebarLessonsSubmenuContent += generateNodeHTML(node);
    });
}

async function sidebarLessonsSubmenuNavigate(navItem) {
    if (navItem.classList.contains('sidebar-submenu-nav')) {
        document.getElementById('sidebar-content').innerHTML = sidebarCoursesSubmenuContent;
        document.getElementById('sidebar').classList.remove('sidebar-extended');
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