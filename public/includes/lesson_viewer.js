function getFileTypeLabel(mimeType) {
    if (!mimeType) return 'File';
    
    switch (true) {
        case mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || mimeType === "application/vnd.ms-powerpoint":
            return "Presentation";
        case mimeType === "application/pdf":
            return "PDF";
        case mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || mimeType === "application/msword":
            return "Document";
        case mimeType?.startsWith("audio/"):
            return "Audio";
        case mimeType?.startsWith("video/"):
            return "Video";
        case mimeType?.startsWith("image/"):
            return "Image";
        default:
            return "File";
    }
}

function openResourceViewer(url, label, mimeType) {
    const viewerParams = new URLSearchParams();
    viewerParams.set('url', url);
    viewerParams.set('title', label);
    viewerParams.set('type', mimeType);
    navigateTo("viewer", false, { url, title: label, mimeType });
}

async function loadLessonContent(classroomId, title) {
    let headerTitle = document.getElementById('header-title');
    if (title && headerTitle) {
        headerTitle.textContent = title;
    }

    if (classroomId) {
        const content = document.getElementById("lesson-viewer-content");
        const loading = document.getElementById("lesson-viewer-loading");
        if (content && loading) {
            // Clear existing content except loading overlay
            content.innerHTML = '';
            content.appendChild(loading);
            loading.style.display = 'flex';

            let courseDetails = await getCourseDetails(classroomId);
            console.log(courseDetails);
            
            if (courseDetails && courseDetails.content && courseDetails.content.title) {
                headerTitle.textContent = courseDetails.content.title.value;
            }
         
            const allFields = courseDetails.content.allFields;
            const uidField = allFields.find(field => field.uid === 'uid');

            const lessonPlan = allFields.find(field => field.uid === 'description').value || null;
            const goals = allFields.find(field => field.uid === 'goals').value || null;
            const resources = courseDetails.content.organizationResources.edges || null;

            if (goals) {
                const goalsDiv = document.createElement('div');
                goalsDiv.className = 'goals';
                let goalsHTML = '<h2>Learning Intentions</h2><ul>';
                goals.forEach(goal => {
                    goalsHTML += `<li>${goal.value}</li>`;
                });
                goalsHTML += '</ul>';
                goalsDiv.innerHTML = goalsHTML;
                content.appendChild(goalsDiv);
            }

            if (resources && resources.length > 0) {
                const resourcesDiv = document.createElement('div');
                resourcesDiv.className = 'resources';
                let resourcesHTML = '<h2>Resources</h2>';
                resources.forEach(edge => {
                    const resource = edge.node;
                    const url = resource.attachment.signedUrl || resource.attachment.url;
                    const label = resource.label;
                    const mimeType = resource.attachment.mimeType;
                    const fileType = getFileTypeLabel(mimeType);
                    resourcesHTML += `<div class="resource"><a href="#" onclick="openResourceViewer('${url}', '${label.replace(/'/g, "\\'")}', '${mimeType}'); return false;"><div class="resource-header"><strong>${label}</strong><img class="resource-dl-icon" src="/icons/24/solid/arrow-down-tray.svg" width="16" height="16"></div><span class="resource-type">${fileType}</span></a></div>`;
                });
                resourcesDiv.innerHTML = resourcesHTML;
                content.appendChild(resourcesDiv);
            }

            if (lessonPlan) {
                const lessonPlanDiv = document.createElement('div');
                lessonPlanDiv.className = 'lesson-plan';
                lessonPlanDiv.innerHTML = '<h2>Lesson Plan</h2>';
                lessonPlanDiv.innerHTML += lessonPlan;
                content.appendChild(lessonPlanDiv);
            }

            // WHEN DONE LOADING:
            if (loading) loading.style.display = "none";
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const classroomId = urlParams.get('classroomId');
    const title = urlParams.get('title');

    if (classroomId) {
        loadLessonContent(classroomId, title);
    }
});
