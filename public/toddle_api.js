const token = localStorage.getItem("authToken");
const cleaned = token.startsWith('Bearer ') ? token.slice(7) : token;
const parts = cleaned.split('.');
const decodeBase64 = (str) => atob(str.replace(/-/g, '+').replace(/_/g, '/'));
const payload = JSON.parse(decodeBase64(parts[1]));
let classFeedFiltersPreferences = null;
let studentCourses = null;

function getRegion() {
  const region = payload.region;
  return region;
}
function getOrganisationID() {
  const organisationID = payload.oid;
  return organisationID;
}
function getStudentID() {
  const studentID = payload.id;
  return studentID;
}
async function getClassFeedFiltersPreferences() {
  const json = await getStudentPreferences();
  const configurations = json.data.platform.preferences[0].configurations;
  const ClassFeedFiltersPreference = JSON.parse(
    configurations.find(x => x.configuration === "ClassFeedFiltersPreference")?.value
  );

  return ClassFeedFiltersPreference;
}
async function getSubjectNameFromCourse(courseName) {
  if (!studentCourses) {
    studentCourses = await getStudentCourses();
  }
  const courses = await studentCourses;
  const course = courses.find(x => x.title === courseName);
  return course.subjects[0].name;
}
async function getAcademicYearId() {
  return Object.keys(await classFeedFiltersPreferences)[0];
}
async function getCurriculumProgramId() {
  return Object.keys((await classFeedFiltersPreferences)[await getAcademicYearId()])[0];
}

async function getStudentDetails() {
  const requestPayload = {
    "operationName": "getPlatformUserDetails",
    "variables": {
        "id": getStudentID(),
        "type": "STUDENT"
    },
    "query": "query getPlatformUserDetails($id: ID!, $type: ENTITY_TYPE_ENUM!) {\n  node(id: $id, type: $type) {\n    id\n    ... on Staff {\n      id\n      firstName\n      middleName\n      lastName\n      preferredName\n      pronouns\n      suffix\n      prefix\n      displayRole\n      profileImage\n      email\n      type\n      showPitchScreen\n      role\n      showClassSelectionScreen\n      showBifurcationScreen\n      isDevUser\n      isArchived\n      entityTags {\n        id\n        key\n        value\n        __typename\n      }\n      coachMarkStatus {\n        id\n        coachMark\n        isViewed\n        count\n        __typename\n      }\n      firstLoggedInAt\n      type\n      userDetailsHash {\n        appId\n        sprinklrChatHash\n        userServiceId\n        organizationId\n        __typename\n      }\n      phoneNumber\n      designation {\n        id\n        title\n        __typename\n      }\n      academicYears(filters: {archivalState: ACTIVE}) {\n        id\n        startDate\n        endDate\n        isCurrentAcademicYear\n        isUpcomingAcademicYear\n        transitionReviewStatus\n        __typename\n      }\n      jwt\n      intercomJwt\n      vitallyNpsToken\n      isSessionVerified\n      isImpersonated\n      linkedIdentityUsersV2 {\n        totalCount\n        __typename\n      }\n      linkedIdentityV2 {\n        id\n        __typename\n      }\n      organization {\n        id\n        name\n        tier {\n          plan\n          isFree\n          __typename\n        }\n        region\n        academicYears {\n          id\n          isCurrentAcademicYear\n          __typename\n        }\n        curriculumPrograms {\n          ...curriculumProgramBasicDetailsItem\n          ...curriculumProgramBasicDetailsWithSubscriptionPlanItem\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on Student {\n      id\n      firstName\n      middleName\n      lastName\n      pronouns\n      preferredName\n      prefix\n      suffix\n      profileImage\n      email\n      type\n      isDevUser\n      isArchived\n      sourceId\n      type\n      coachMarkStatus {\n        id\n        coachMark\n        isViewed\n        count\n        __typename\n      }\n      type\n      userDetailsHash {\n        appId\n        sprinklrChatHash\n        userServiceId\n        organizationId\n        __typename\n      }\n      phoneNumber\n      allCourses {\n        id\n        academicYears {\n          id\n          __typename\n        }\n        curriculumProgram {\n          ...curriculumProgramBasicDetailsItem\n          __typename\n        }\n        __typename\n      }\n      academicYears(filters: {archivalState: ACTIVE}) {\n        id\n        startDate\n        endDate\n        isCurrentAcademicYear\n        isUpcomingAcademicYear\n        transitionReviewStatus\n        __typename\n      }\n      jwt\n      isSessionVerified\n      isImpersonated\n      linkedIdentityUsersV2 {\n        totalCount\n        __typename\n      }\n      organization {\n        id\n        name\n        tier {\n          plan\n          isFree\n          __typename\n        }\n        region\n        academicYears {\n          id\n          isCurrentAcademicYear\n          __typename\n        }\n        curriculumPrograms {\n          ...curriculumProgramBasicDetailsItem\n          ...curriculumProgramBasicDetailsWithSubscriptionPlanItem\n          __typename\n        }\n        __typename\n      }\n      yearGroup {\n        id\n        grade {\n          id\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on FamilyMember {\n      id\n      isSessionVerified\n      firstName\n      middleName\n      lastName\n      preferredName\n      prefix\n      suffix\n      pronouns\n      profileImage\n      type\n      Email: email\n      isDevUser\n      status\n      userDetailsHash {\n        appId\n        sprinklrChatHash\n        userServiceId\n        organizationId\n        __typename\n      }\n      phoneNumber\n      communicationState {\n        id\n        messageType\n        isSeen\n        appType\n        __typename\n      }\n      children {\n        id\n        email\n        type\n        jwt\n        profileImage\n        inviteExpireTime\n        firstName\n        middleName\n        lastName\n        preferredName\n        pronouns\n        prefix\n        suffix\n        isDevUser\n        parentStatus(parentId: $id)\n        isRequestAccepted\n        sourceId\n        familyInviteCode\n        signInCode\n        isBlocked\n        blockMessage\n        curriculumPrograms {\n          id\n          type\n          __typename\n        }\n        organization {\n          id\n          name\n          tier {\n            plan\n            isFree\n            __typename\n          }\n          region\n          academicYears {\n            id\n            isCurrentAcademicYear\n            __typename\n          }\n          curriculumPrograms {\n            ...curriculumProgramBasicDetailsItem\n            ...curriculumProgramBasicDetailsWithSubscriptionPlanItem\n            __typename\n          }\n          __typename\n        }\n        allCourses {\n          id\n          academicYears {\n            id\n            __typename\n          }\n          curriculumProgram {\n            ...curriculumProgramBasicDetailsItem\n            __typename\n          }\n          __typename\n        }\n        curriculumProgram {\n          ...curriculumProgramBasicDetailsItem\n          __typename\n        }\n        academicYears(filters: {archivalState: ACTIVE}) {\n          id\n          startDate\n          endDate\n          isCurrentAcademicYear\n          isUpcomingAcademicYear\n          transitionReviewStatus\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment curriculumProgramBasicDetailsWithSubscriptionPlanItem on CurriculumProgram {\n  id\n  type\n  nodeInterfaceType\n  label\n  acronym\n  academicSetupType\n  subscriptionPlan {\n    id\n    type\n    isFree\n    label\n    __typename\n  }\n  buddy {\n    id\n    email\n    firstName\n    lastName\n    __typename\n  }\n  curriculumProgramData {\n    subscriptionPlan\n    __typename\n  }\n  programType\n  logo\n  isPrimary\n  __typename\n}\n\nfragment curriculumProgramBasicDetailsItem on CurriculumProgram {\n  id\n  type\n  nodeInterfaceType\n  label\n  acronym\n  academicSetupType\n  __typename\n}\n"
  };
  try {
    const res = await fetch("/" + getRegion() + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(requestPayload)
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getStudentPreferences() {
  const requestPayload = {
    "operationName": "getPreferences",
    "variables": {
      "configurationEntityGroupFilters": [
        {
          "configurationEntityGroups": [
            {
              "entityId": getOrganisationID(),
              "entityType": "ORGANIZATION"
            },
            {
              "entityId": getStudentID(),
              "entityType": "USER"
            }
          ],
          "excludeInterRepoConfigurations": true,
          "configurations": []
        }
      ],
      "isAdminPage": false,
      "isSettingsPage": false,
      "isCourseModuleSetting": false,
      "isAdminNotificationManager": false
    },
    "query": "query getPreferences($configurationEntityGroupFilters: [ConfigurationEntityGroupFilter!], $isAdminPage: Boolean!, $isSettingsPage: Boolean!, $isCourseModuleSetting: Boolean, $isAdminNotificationManager: Boolean) {\n  platform {\n    preferences(filters: {configurationEntityGroupFilters: $configurationEntityGroupFilters}) {\n      ...configurationResponseItem\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment configurationResponseItem on ConfigurationResponse {\n  configurations @include(if: $isSettingsPage) {\n    ...configurationV2SettingItem\n    __typename\n  }\n  configurations @skip(if: $isSettingsPage) {\n    ...configurationV2Item\n    __typename\n  }\n  entityGroups @include(if: $isAdminPage) {\n    entityId\n    entityType\n    __typename\n  }\n  __typename\n}\n\nfragment configurationV2SettingItem on ConfigurationV2 {\n  id\n  uidV2\n  configuration\n  aclControlParameterType\n  valueType\n  value\n  isLocked\n  state\n  channelTypeCategorizedValues(filters: {isAdminNotificationManager: $isAdminNotificationManager}) {\n    push\n    email\n    inApp\n    __typename\n  }\n  disabledEntityGroups(filters: {entityTypeGroups: [COURSE]}) {\n    entities {\n      entityId\n      entityType\n      resolvedEntity {\n        ... on Course {\n          id\n          title\n          curriculumProgram {\n            id\n            type\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  validPlatforms\n  platformCategorizedValues(isCourseModuleSetting: $isCourseModuleSetting) {\n    default\n    staff\n    parent\n    student\n    __typename\n  }\n  configurationGroup\n  parentConfigurations {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment configurationV2Item on ConfigurationV2 {\n  id\n  uidV2\n  configuration\n  aclControlParameterType\n  valueType\n  value\n  isLocked\n  __typename\n}\n"
  };
  try {
    const res = await fetch("/" + getRegion() + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(requestPayload)
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getStudentCourses() {
  if (!classFeedFiltersPreferences) {
    classFeedFiltersPreferences = await getClassFeedFiltersPreferences();
  }
  
  const requestPayload = {
    "operationName": "getUserCourses",
    "variables": {
        "isCurriculumProgramFree": false,
        "id": getStudentID(),
        "type": "STUDENT",
        "filters": {
            "curriculumProgramIds": [
                await getCurriculumProgramId()
            ],
            "archivalState": "ALL",
            "includeRemovedCoursesForStudent": true
        },
        "courseGradeFilters": {
            "academicYearId": await getAcademicYearId()
        }
    },
    "query": "query getUserCourses($id: ID!, $type: ENTITY_TYPE_ENUM!, $filters: CourseFilter, $isCurriculumProgramFree: Boolean! = false, $courseGradeFilters: CourseGradeFilters, $enabledModulesFilters: EnabledModulesFiltersInput) {\n  node(id: $id, type: $type) {\n    id\n    ... on Staff {\n      ...staffItem\n      __typename\n    }\n    ... on Student {\n      ...studentCourseItem\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment studentCourseItem on Student {\n  id\n  courses(orderBy: TITLE, orderByDirection: ASC, filters: $filters) {\n    ...courseFeedItem\n    __typename\n  }\n  __typename\n}\n\nfragment courseFeedItem on Course {\n  id\n  title\n  primaryGrade(filters: $courseGradeFilters) {\n    id\n    name\n    __typename\n  }\n  profileImageData {\n    url\n    icon\n    color\n    __typename\n  }\n  grades(filters: $courseGradeFilters) {\n    id\n    name\n    globalGrade {\n      id\n      uid\n      name\n      constants\n      __typename\n    }\n    displaySequence\n    __typename\n  }\n  calendar {\n    id\n    __typename\n  }\n  curriculumProgram {\n    ...curriculumProgramBasicDetailsItem\n    __typename\n  }\n  academicYears {\n    ...academicYearItem\n    __typename\n  }\n  subjects {\n    id\n    name\n    type\n    __typename\n  }\n  subjectGroups {\n    id\n    name\n    __typename\n  }\n  projectGroups {\n    ...basicProjectGroupDetails\n    __typename\n  }\n  isDemo\n  isRemovedCourseForLoggedInUser\n  isArchived\n  genericTags {\n    id\n    label\n    type\n    __typename\n  }\n  enabledModules(filters: $enabledModulesFilters)\n  learningCourse {\n    id\n    title\n    academicCourse {\n      id\n      label\n      __typename\n    }\n    gradingPeriods {\n      edges {\n        node {\n          id\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    displayMetadata\n    __typename\n  }\n  __typename\n}\n\nfragment academicYearItem on AcademicYear {\n  id\n  startDate\n  endDate\n  isCurrentAcademicYear\n  isUpcomingAcademicYear\n  transitionReviewStatus\n  label\n  __typename\n}\n\nfragment curriculumProgramBasicDetailsItem on CurriculumProgram {\n  id\n  type\n  nodeInterfaceType\n  label\n  acronym\n  academicSetupType\n  programType\n  ... on IbDpCurriculumProgram {\n    examSessionMonth\n    __typename\n  }\n  __typename\n}\n\nfragment basicProjectGroupDetails on ProjectGroup {\n  id\n  name\n  type\n  subType\n  curriculumProgram {\n    id\n    type\n    __typename\n  }\n  __typename\n}\n\nfragment staffItem on Staff {\n  id\n  courses(orderBy: TITLE, orderByDirection: ASC, filters: $filters) {\n    ...courseItem\n    __typename\n  }\n  __typename\n}\n\nfragment courseItem on Course {\n  id\n  title\n  isArchived\n  enabledModules(filters: $enabledModulesFilters)\n  grades(filters: $courseGradeFilters) {\n    ...gradeItem\n    __typename\n  }\n  curriculumProgram {\n    ...curriculumProgramBasicDetailsItem\n    __typename\n  }\n  calendar {\n    id\n    __typename\n  }\n  isDemo\n  academicYears {\n    ...academicYearItem\n    __typename\n  }\n  subjectGroups {\n    id\n    name\n    __typename\n  }\n  projectGroups {\n    ...basicProjectGroupDetails\n    __typename\n  }\n  profileImage\n  isRemovedCourseForLoggedInUser\n  tags {\n    id\n    key\n    value\n    __typename\n  }\n  subjects {\n    id\n    name\n    __typename\n  }\n  __typename\n}\n\nfragment gradeItem on Grade {\n  id\n  name\n  unitPlanCount(innerUserIdFilter: $id) @include(if: $isCurriculumProgramFree)\n  globalGrade {\n    id\n    constants\n    displaySequence\n    __typename\n  }\n  displaySequence\n  __typename\n}\n"
  };
  try {
    const res = await fetch("/" + getRegion() + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(requestPayload)
    });

    const data = await res.json();
    const final = data.data.node.courses;
    return final;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getStudentTimetable() {
  if (!classFeedFiltersPreferences) {
    classFeedFiltersPreferences = await getClassFeedFiltersPreferences();
  }
  
  const requestPayload = {
    "operationName": "getTeacherTimetablePeriods",
    "variables": {
        "id": getStudentID(),
        "type": "STUDENT",
        "periodsFilters": {
            "startDate": new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() || 7) + 1)).toLocaleDateString("en-CA"),
            "endDate": new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() || 7) + 5)).toLocaleDateString("en-CA"),
            "academicYearId": await getAcademicYearId(),
            "isAllDayPeriods": false,
            "onlySelectedSlots": true,
            "filterByViewerClassAccess": false
        },
        "permissionFilters": {
            "academicYearId": await getAcademicYearId()
        },
        "termFilters": {
            "types": [
                "REPORTING",
                "EXAM"
            ]
        },
        "attendanceFilters": {
            "academicYearId": await getAcademicYearId()
        },
        "isToddleV2TimetableEnabled": false
    },
    "query": "query getTeacherTimetablePeriods($id: ID!, $type: ENTITY_TYPE_ENUM!, $periodsFilters: PeriodFilterOptions, $permissionFilters: TimetableSlotPermissionFilters, $termFilters: TermFilters, $attendanceFilters: TimetableSlotAttendanceFilters!, $itemFilter: TimetableSlotItemsFilters, $isToddleV2TimetableEnabled: Boolean!) {\n  node(id: $id, type: $type) {\n    ... on Student {\n      id\n      ...studentPeriodListItemV2 @skip(if: $isToddleV2TimetableEnabled)\n      ...studentNameFields @include(if: $isToddleV2TimetableEnabled)\n      enrolledPeriodsV3(filters: $periodsFilters) @include(if: $isToddleV2TimetableEnabled) {\n        ...selectedPeriodItemV3\n        __typename\n      }\n      __typename\n    }\n    ... on Staff {\n      id\n      ...staffPeriodListItemV2 @skip(if: $isToddleV2TimetableEnabled)\n      firstName @include(if: $isToddleV2TimetableEnabled)\n      lastName @include(if: $isToddleV2TimetableEnabled)\n      middleName @include(if: $isToddleV2TimetableEnabled)\n      enrolledPeriodsV3(filters: $periodsFilters) @include(if: $isToddleV2TimetableEnabled) {\n        ...selectedPeriodItemV3\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment studentPeriodListItemV2 on Student {\n  id\n  ...studentNameFields\n  enrolledPeriodsV2(filters: $periodsFilters) {\n    ...selectedPeriodItemV2\n    __typename\n  }\n  __typename\n}\n\nfragment selectedPeriodItemV2 on TimetableSlot {\n  date\n  isSelected\n  day\n  timetableSlotId\n  rotationDay {\n    id\n    label\n    __typename\n  }\n  location\n  locationV2 {\n    id\n    label\n    __typename\n  }\n  course {\n    ...courseItem\n    __typename\n  }\n  period {\n    ...periodItem\n    abbreviation\n    __typename\n  }\n  teachers {\n    ...staffItem\n    __typename\n  }\n  teachersV2 {\n    staff {\n      ...staffItem\n      __typename\n    }\n    type\n    __typename\n  }\n  items(filters: $itemFilter) {\n    ...slotItem\n    __typename\n  }\n  permissions {\n    canMarkAttendance(filters: $permissionFilters)\n    canEditCoursePlanner(filters: $permissionFilters)\n    canShareCoursePlannerWithStudents(filters: $permissionFilters)\n    __typename\n  }\n  subject\n  startTime\n  endTime\n  groupKey\n  attendance(filters: $attendanceFilters) {\n    attendanceMarkedStatus\n    unmarkedStudents {\n      id\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment courseItem on Course {\n  id\n  title\n  isArchived\n  curriculumProgram {\n    id\n    type\n    label\n    __typename\n  }\n  primaryGrade {\n    id\n    curriculumProgram {\n      id\n      type\n      __typename\n    }\n    __typename\n  }\n  learningCourse {\n    id\n    title\n    gradingPeriods(filters: $termFilters) {\n      totalCount\n      edges {\n        node {\n          id\n          label\n          lockingStatus\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    primaryGrade {\n      id\n      __typename\n    }\n    __typename\n  }\n  students {\n    totalCount\n    __typename\n  }\n  grades {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment periodItem on Period {\n  id\n  label\n  type\n  isDefault\n  startTime\n  endTime\n  sequence\n  isDefault\n  abbreviation\n  __typename\n}\n\nfragment staffItem on Staff {\n  id\n  ...staffNameFields\n  profileImage\n  email\n  role\n  isArchived\n  __typename\n}\n\nfragment staffNameFields on Staff {\n  firstName\n  middleName\n  lastName\n  preferredName\n  prefix\n  suffix\n  pronouns\n  type\n  __typename\n}\n\nfragment slotItem on TimetableSlotItem {\n  id\n  itemType\n  item {\n    ... on LearningCourseFlow {\n      id\n      label\n      learningCourse {\n        id\n        __typename\n      }\n      itemType\n      state\n      sharedDetails {\n        class {\n          id\n          __typename\n        }\n        students {\n          id\n          __typename\n        }\n        __typename\n      }\n      lockingInfo {\n        isLocked\n        __typename\n      }\n      item {\n        ... on Attachment {\n          ...attachmentItem\n          __typename\n        }\n        ... on Assessment {\n          ...assessmentItem\n          __typename\n        }\n        ... on UnitPlan {\n          id\n          unitPlanTitle: title {\n            id\n            value\n            __typename\n          }\n          colorCode\n          unitTemplateId: templateId\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on Assignment {\n      id\n      contentType\n      content {\n        ... on Assessment {\n          assignments {\n            edges {\n              id\n              state {\n                state\n                __typename\n              }\n              course {\n                id\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          ...assessmentItem\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment assessmentItem on Assessment {\n  id\n  templateId\n  assessmentTitle: title {\n    id\n    value\n    __typename\n  }\n  assessmentType {\n    id\n    value\n    __typename\n  }\n  image {\n    id\n    value\n    __typename\n  }\n  academicTerm {\n    id\n    label\n    lockingStatus\n    __typename\n  }\n  lockingInfo {\n    isLocked\n    __typename\n  }\n  learningCourse {\n    id\n    __typename\n  }\n  assignments {\n    edges {\n      id\n      course {\n        id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ...timetableAssessmentLEDetailFields\n  __typename\n}\n\nfragment timetableAssessmentLEDetailFields on Assessment {\n  globalCategories {\n    id\n    name\n    __typename\n  }\n  taskType {\n    id\n    type\n    label\n    __typename\n  }\n  linkedAssessments {\n    id\n    assessmentType {\n      id\n      value\n      __typename\n    }\n    taskType {\n      id\n      type\n      label\n      __typename\n    }\n    image {\n      id\n      value\n      __typename\n    }\n    title {\n      id\n      value\n      __typename\n    }\n    __typename\n  }\n  allFields {\n    id\n    uid\n    value\n    resolvedMinimalTree {\n      ... on ResolvedFieldStudentTemplate {\n        id\n        attachmentGroups {\n          id\n          attachments {\n            id\n            name\n            url\n            type\n            mimeType\n            thumbUrl\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      ... on ResolvedFieldLtiTemplate {\n        id\n        attachmentGroups {\n          id\n          attachments {\n            id\n            name\n            url\n            type\n            mimeType\n            thumbUrl\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      ... on ResolvedFieldPlannerElementSet {\n        id\n        type\n        nodes {\n          id\n          label\n          parent\n          isLeaf\n          __typename\n        }\n        __typename\n      }\n      ... on ResolvedFieldConceptSet {\n        id\n        concepts {\n          id\n          label\n          __typename\n        }\n        __typename\n      }\n      ... on ResolvedFieldBenchmarkSet {\n        id\n        benchmarks {\n          id\n          label\n          __typename\n        }\n        __typename\n      }\n      ... on ResolvedFieldATLSet {\n        id\n        atls {\n          id\n          label\n          __typename\n        }\n        __typename\n      }\n      ... on ResolvedFieldLPSet {\n        id\n        learnerProfiles {\n          id\n          label\n          __typename\n        }\n        __typename\n      }\n      ... on ResolvedFieldThemeSet {\n        id\n        themes {\n          id\n          label\n          __typename\n        }\n        __typename\n      }\n      ... on ResolvedFieldActionSet {\n        id\n        actions {\n          id\n          label\n          __typename\n        }\n        __typename\n      }\n      ... on ResolvedFieldRelatedConceptSet {\n        id\n        relatedConcepts {\n          id\n          label\n          __typename\n        }\n        __typename\n      }\n      ... on ResolvedFieldVoiceInstruction {\n        id\n        attachment {\n          ...attachmentItem\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  organizationResources: organizationResourcesV2(orderBy: CREATED_AT, orderByDirection: ASC, first: 100) {\n    edges {\n      node {\n        id\n        label\n        attachment {\n          ...attachmentItem\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  assessmentTools {\n    edges {\n      node {\n        id\n        assessmentToolType\n        assessmentToolItem {\n          id\n          ... on MypObjectiveRubric {\n            id\n            label\n            __typename\n          }\n          ... on ScoreAssessmentTool {\n            id\n            __typename\n          }\n          ... on Analysis {\n            id\n            label\n            criterias {\n              id\n              label\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment attachmentItem on Attachment {\n  id\n  name\n  type\n  mimeType\n  url\n  signedUrl\n  thumbUrl\n  title\n  metadata\n  streamUrl\n  parentType\n  isRead\n  similarityReport {\n    ...similarityItem\n    __typename\n  }\n  createdBy {\n    id\n    type\n    __typename\n  }\n  lockingState {\n    state\n    scheduledAt\n    __typename\n  }\n  questionAttachment {\n    ... on QuestionSubmission {\n      id\n      questionScore\n      score {\n        id\n        value\n        __typename\n      }\n      __typename\n    }\n    ... on Question {\n      id\n      questionScore\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment similarityItem on SimilarityReport {\n  status\n  submissionId\n  errorCode\n  overallMatchPercentage\n  __typename\n}\n\nfragment studentNameFields on Student {\n  firstName\n  middleName\n  lastName\n  preferredName\n  prefix\n  suffix\n  pronouns\n  type\n  __typename\n}\n\nfragment staffPeriodListItemV2 on Staff {\n  id\n  firstName\n  lastName\n  middleName\n  enrolledPeriodsV2(filters: $periodsFilters) {\n    ...selectedPeriodItemV2\n    __typename\n  }\n  __typename\n}\n\nfragment selectedPeriodItemV3 on TimetableSlotV2 {\n  date\n  isSelected\n  day\n  timetableSlotId\n  rotationDay: rotationEntity {\n    id\n    label\n    __typename\n  }\n  location\n  locationV2 {\n    id\n    label\n    __typename\n  }\n  course {\n    ...courseItem\n    __typename\n  }\n  period {\n    ...periodItem\n    abbreviation\n    __typename\n  }\n  teachersV2: teachers {\n    staff {\n      ...staffItem\n      __typename\n    }\n    type\n    __typename\n  }\n  items(filters: $itemFilter) {\n    ...slotItem\n    __typename\n  }\n  permissions {\n    canMarkAttendance(filters: $permissionFilters)\n    canEditCoursePlanner(filters: $permissionFilters)\n    canShareCoursePlannerWithStudents(filters: $permissionFilters)\n    __typename\n  }\n  subject\n  startTime\n  endTime\n  groupKey\n  attendance(filters: $attendanceFilters) {\n    attendanceMarkedStatus\n    unmarkedStudents {\n      id\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n"
};
  try {
    const res = await fetch("/" + getRegion() + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(requestPayload)
    });

    const data = await res.json();
    const final = data.data.node;
    return final;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getCourseFlow(courseID, learningCourseID) {
  const requestPayload = {
        "operationName": "getEntireCourseFlowFeed",
        "variables": {
            "includeCourseSyncStatus": true,
            "id": courseID,
            "filters": {
                "searchText": "",
                "unitTypes": [],
                "sharedWith": [],
                "itemTypes": [
                    "FOLDER",
                    "ASSESSMENT",
                    "UNIT_PLAN",
                    "FILE"
                ],
                "classIds": [
                    courseID
                ],
                "subjects": [],
                "assessmentFilters": {
                    "assessmentType": [],
                    "groupTypes": [],
                    "studentAssignmentStatus": []
                },
                "attachmentTypes": []
            },
            "syncedBluePrintItemFilters": {
                "learningCourseId": courseID
            },
            "type": "COURSE",
            "stateFilters": {
                "classIds": []
            },
            "assessmentFieldUids": [
                "subjects",
                "learningStandardUBD",
                "pace"
            ]
        },
        "query": "query getEntireCourseFlowFeed($id: ID!, $filters: LearningCourseFlowFilter, $type: ENTITY_TYPE_ENUM!, $stateFilters: LearningCourseFlowStateFilter, $syncedBluePrintItemFilters: SyncedBluePrintItemFilter, $assessmentFieldUids: [String!], $includeCourseSyncStatus: Boolean = false) {\n  node(id: $id, type: $type) {\n    id\n    ... on Course {\n      classFlowFeedWrapper {\n        learningCourseFlowFeed(first: 10000, filters: $filters) {\n          edges {\n            node {\n              ...courseFlowResource\n              isSyncedWithAllTeacherCourseV2(filters: $syncedBluePrintItemFilters) {\n                courseSyncStatus @include(if: $includeCourseSyncStatus) {\n                  course {\n                    id\n                    title\n                    __typename\n                  }\n                  status\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          pageInfo {\n            hasNextPage\n            hasPreviousPage\n            startCursor\n            endCursor\n            __typename\n          }\n          resourceBasedCount {\n            totalCount\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on LearningCourse {\n      id\n      learningCourseFlowFeedWrapper {\n        learningCourseFlowFeed(first: 10000, filters: $filters) {\n          edges {\n            node {\n              ...courseFlowResource\n              isSyncedWithAllTeacherCourseV2(filters: $syncedBluePrintItemFilters) {\n                courseSyncStatus @include(if: $includeCourseSyncStatus) {\n                  course {\n                    id\n                    title\n                    __typename\n                  }\n                  status\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          pageInfo {\n            hasNextPage\n            hasPreviousPage\n            startCursor\n            endCursor\n            __typename\n          }\n          resourceBasedCount {\n            totalCount\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment courseFlowResource on LearningCourseFlow {\n  id\n  label\n  depth\n  resourceType: itemType\n  isRepeated\n  repeatedResources\n  state(filters: $stateFilters)\n  parent {\n    id\n    __typename\n  }\n  item {\n    id\n    ... on Assessment {\n      type\n      academicTerm {\n        id\n        label\n        lockingStatus\n        __typename\n      }\n      assessmentType {\n        id\n        value\n        __typename\n      }\n      taskType {\n        id\n        type\n        label\n        __typename\n      }\n      lockingInfo {\n        isLocked\n        __typename\n      }\n      fields(uids: $assessmentFieldUids) {\n        id\n        uid\n        value\n        resolvedMinimalTree {\n          id\n          ... on ResolvedFieldPlannerElementSet {\n            id\n            nodes {\n              id\n              dataSetNodeWrapper {\n                plannerElementNodeSet {\n                  id\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on UnitPlan {\n      lockingInfo {\n        isLocked\n        __typename\n      }\n      unitType {\n        id\n        value\n        __typename\n      }\n      subjects {\n        id\n        value\n        lockingInfo {\n          isLocked\n          __typename\n        }\n        __typename\n      }\n      standardLockingInfo {\n        uid\n        value\n        lockingInfo {\n          isLocked\n          __typename\n        }\n        __typename\n      }\n      fields(uids: [\"pace\"]) {\n        id\n        uid\n        value\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  lockingInfo {\n    isLocked\n    __typename\n  }\n  isSyncedFromBluePrintCourse(filters: $syncedBluePrintItemFilters)\n  isSyncedWithAllTeacherCourseV2(filters: $syncedBluePrintItemFilters) {\n    isConflictExists\n    status\n    __typename\n  }\n  childrenV2: children(filters: $filters) {\n    id\n    __typename\n  }\n  childrenHierarchyInfo(filters: $filters) {\n    maxDepth\n    totalCount\n    totalCountWithFolder\n    __typename\n  }\n  __typename\n}\n"
    };
  try {
    const res = await fetch("/" + getRegion() + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(requestPayload)
    });

    const data = await res.json();
    const final = data.data.node;
    return final;
  } catch (err) {
    console.error("Error:", err);
  }
}