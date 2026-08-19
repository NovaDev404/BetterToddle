async function initTimetable() {
    const Calendar = tui.Calendar;
    const container = document.getElementById('timetable');
    const calendar = new Calendar(container, {
        defaultView: 'week',
        isReadOnly: true,
        useDetailPopup: true,
        timezone: {
            zones: [
                {
                    timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    displayLabel: 'Local',
                },
            ],
        },
        week: {
            taskView: false,
            eventView: ['time'],
            startDayOfWeek: 1,
            workweek: true,
        },
        template: {
            time(event) {
                const formatTime = (date) => {
                    const meridiem = date.getHours() < 12 ? 'am' : 'pm';
                    const hour12 = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
                    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                    return `${hour12}:${minutes}${meridiem}`;
                };
                return `<strong>${event.title}</strong><br>${formatTime(event.start)} - ${formatTime(event.end)}`;
            },
            popupEdit() {
                return '';
            },
            popupDelete() {
                return '';
            },
            popupStateFree() {
                return '';
            },
            popupStateBusy() {
                return '';
            },
            popupDetailLocation({ location }) {
                return location || '';
            },
            popupDetailAttendees({ attendees }) {
                return attendees && attendees.length > 0 ? attendees.join(', ') : '';
            },
            popupDetailBody() {
                return '';
            },
            popupDetailTitle({ title, raw }) {
                const courseTitle = raw?.courseTitle || '';
                return `<strong>${title}</strong> • ${courseTitle}`;
            },
            popupDetailDate({ start, end }) {
                const formatDate = (date) => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                };
                const formatTime = (date) => {
                    const meridiem = date.getHours() < 12 ? 'am' : 'pm';
                    const hour12 = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    return `${hour12}:${minutes}${meridiem}`;
                };
                return `${formatDate(start)} • ${formatTime(start)} - ${formatTime(end)}`;
            },
            timegridDisplayPrimaryTime({ time }) {
                const meridiem = time.getHours() < 12 ? 'am' : 'pm';
                const hour12 = time.getHours() % 12 === 0 ? 12 : time.getHours() % 12;
                return `${hour12}${meridiem}`;
            },
            timegridDisplayTime({ time }) {
                const meridiem = time.getHours() < 12 ? 'am' : 'pm';
                const hour12 = time.getHours() % 12 === 0 ? 12 : time.getHours() % 12;
                const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
                return `${hour12}:${minutes}${meridiem}`;
            },
            timegridNowIndicatorLabel({ time }) {
                const meridiem = time.getHours() < 12 ? 'am' : 'pm';
                const hour12 = time.getHours() % 12 === 0 ? 12 : time.getHours() % 12;
                const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
                return `${hour12}:${minutes}${meridiem}`;
            }
        }
    });
    
    calendar.on('mouseover', (event) => {
        if (event.target && event.target.closest('.toastui-calendar-event-time')) {
            const eventId = event.target.closest('.toastui-calendar-event-time').getAttribute('data-event-id');
            if (eventId) {
                calendar.showDetailPopup(eventId);
                setTimeout(() => {
                    const buttonSection = document.querySelector('.toastui-calendar-section-button');
                    if (buttonSection) {
                        buttonSection.style.display = 'none';
                    }
                    const stateContent = document.querySelector('.toastui-calendar-template-popupDetailState');
                    if (stateContent) {
                        const stateItem = stateContent.closest('.toastui-calendar-detail-item');
                        if (stateItem) {
                            stateItem.style.display = 'none';
                        }
                    }
                }, 0);
            }
        }
    });
    
    calendar.on('mouseout', (event) => {
        if (event.target && event.target.closest('.toastui-calendar-event-time')) {
            calendar.hideDetailPopup();
        }
    });
    
    const timetableData = await getStudentTimetable();
    const lessons = timetableData.enrolledPeriodsV2;
    const events = [];
    for (const lesson of lessons) {
        const subjectName = await getSubjectNameFromCourse(lesson.course.title);
        const teachers = lesson.teachers.map(teacher => teacher.firstName + ' ' + teacher.lastName);
        const event = {
            id: lesson.course.id,
            calendarId: 'timetable',
            isAllDay: false,
            title: subjectName,
            body: 'custom', // Required for popupDetailBody to work
            category: 'time',
            start: `${lesson.date}T${lesson.startTime}`,
            end: `${lesson.date}T${lesson.endTime}`,
            attendees: teachers,
            backgroundColor: '#E3F2FD',
            raw: {
                courseTitle: lesson.course.title
            }
        };
        if (lesson.location) {
            event.location = lesson.location;
        }
        events.push(event);
    }
    calendar.createEvents(events);
    loadingOverlay(false);
}