let sidebarLessonsSubmenuContent = "";
let currentCourseFlowNodes = null;

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
                return "Lesson";
            case "worksheet":
                return "Worksheet";
            default:
                return "Assessment";
        }
    }

    if (info.category === "file") {
        const mime = info.subtype;
        const attachmentType = info.attachmentType;

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

        if (attachmentType === "NOTE") {
            return "Note";
        }

        if (attachmentType === "LINK") {
            return "Link";
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
        <img class="sidebar-content-item-chevron" src="/icons/24/solid/arrow-left.svg" alt="Back" width="24" height="20" />
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

    currentCourseFlowNodes = nodeMap;

    function generateNodeHTML(node) {
        let html = '';
        
        if (node.resourceType === 'UNIT_PLAN') {
            const hasChildren = node.children.length > 0;
            const chevron = hasChildren ? '<img class="lesson-chevron" src="/icons/24/solid/chevron-down.svg" alt="Expand" width="14" height="14" />' : '';
            
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
            const chevron = hasChildren ? '<img class="lesson-chevron" src="/icons/24/solid/chevron-down.svg" alt="Expand" width="14" height="14" />' : '';
            
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
            const label = info.attachmentType === "NOTE" ? "Note" : node.label;
            html += `<button class="lesson-item" onclick="sidebarLessonsSubmenuNavigate(this)" data-lesson-type="${lessonType}" data-node-id="${node.id}">${icon}<span class="lesson-item-title">${label}</span></button>`;
        }
        
        return html;
    }

    function getResourceIcon(node) {
        const info = classifyCourseFlowNode(node);

        if (info.category === "assessment") {
            switch (info.assessmentType) {
                case "le":
                    return '<img class="lesson-item-icon" src="/icons/24/solid/book-open.svg" alt="Lesson" width="16" height="16" />';
                case "worksheet":
                    return '<img class="lesson-item-icon" src="/icons/24/solid/document-text.svg" alt="Worksheet" width="16" height="16" />';
                default:
                    return '<img class="lesson-item-icon" src="/icons/24/solid/document-check.svg" alt="Assessment" width="16" height="16" />';
            }
        }

        if (info.category === "file") {
            const mime = info.subtype;
            const attachmentType = info.attachmentType;

            if (attachmentType === "NOTE") {
                return '<img class="lesson-item-icon" src="/icons/24/solid/list-bullet.svg" alt="Note" width="16" height="16" />';
            }

            if (attachmentType === "LINK") {
                return '<img class="lesson-item-icon" src="/icons/24/solid/link.svg" alt="Link" width="16" height="16" />';
            }

            if (mime?.startsWith("video/")) {
                return '<img class="lesson-item-icon" src="/icons/24/solid/video-camera.svg" alt="Video" width="16" height="16" />';
            }

            if (mime === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || mime === "application/vnd.ms-powerpoint") {
                return '<img class="lesson-item-icon" src="/icons/24/solid/presentation-chart-bar.svg" alt="Presentation" width="16" height="16" />';
            }

            if (mime === "application/pdf") {
                return '<img class="lesson-item-icon" src="/icons/24/solid/document.svg" alt="PDF" width="16" height="16" />';
            }

            if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || mime === "application/msword") {
                return '<img class="lesson-item-icon" src="/icons/24/solid/document.svg" alt="Document" width="16" height="16" />';
            }

            if (mime?.startsWith("audio/")) {
                return '<img class="lesson-item-icon" src="/icons/24/solid/musical-note.svg" alt="Audio" width="16" height="16" />';
            }

            if (mime?.startsWith("image/")) {
                return '<img class="lesson-item-icon" src="/icons/24/solid/photo.svg" alt="Image" width="16" height="16" />';
            }

            return '<img class="lesson-item-icon" src="/icons/24/solid/document.svg" alt="File" width="16" height="16" />';
        }

        if (info.category === "folder") {
            return '<img class="lesson-item-icon" src="/icons/24/solid/folder.svg" alt="Folder" width="16" height="16" />';
        }

        if (info.category === "unit_plan") {
            return '<img class="lesson-item-icon" src="/icons/24/solid/book.svg" alt="Unit Plan" width="16" height="16" />';
        }

        return '<img class="lesson-item-icon" src="/icons/24/solid/document.svg" alt="Unknown" width="16" height="16" />';
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
        const itemName = navItem.querySelector('.lesson-item-title')?.textContent.trim();
        const lessonType = navItem.getAttribute('data-lesson-type');
        const nodeId = navItem.getAttribute('data-node-id');

        if (nodeId && lessonType !== "Note" && lessonType !== "Link") {
            const node = currentCourseFlowNodes.get(nodeId);
            if (node && node.item) {
                const url = node.item.signedUrl || node.item.url;
                const mimeType = node.item.mimeType;

                if (url) {
                    await navigateTo("viewer", false, { url, title: itemName, mimeType });
                }
            }
        }

        document.getElementById('sidebar').classList.remove('mobile-visible');
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