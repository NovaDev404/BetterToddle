const token = localStorage.getItem("authToken");
const cleaned = token.startsWith('Bearer ') ? token.slice(7) : token;
const parts = cleaned.split('.');
const decodeBase64 = (str) => atob(str.replace(/-/g, '+').replace(/_/g, '/'));
const payload = JSON.parse(decodeBase64(parts[1]));

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
async function getClassFeedFiltersPreference() {
  const json = await getStudentPreferences();
  const configurations = json.data.platform.preferences[0].configurations;
  const ClassFeedFiltersPreference = JSON.parse(
    configurations.find(x => x.configuration === "ClassFeedFiltersPreference")?.value
  );

  return ClassFeedFiltersPreference;
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
  const requestPayload = {
    operationName: "getUserCourses",
    variables: {
      isCurriculumProgramFree: false,
      id: getStudentID(),
      type: "STUDENT",
      filters: {
        archivalState: "ALL",
        includeRemovedCoursesForStudent: true
      },
      courseGradeFilters: {
        academicYearId: Object.keys(await getClassFeedFiltersPreference())[0]
      }
    },
    query: `query getUserCourses($id: ID!, $type: ENTITY_TYPE_ENUM!, $filters: CourseFilter, $isCurriculumProgramFree: Boolean! = false, $courseGradeFilters: CourseGradeFilters, $enabledModulesFilters: EnabledModulesFiltersInput) {
    node(id: $id, type: $type) {
      id
      ... on Staff {
        ...staffItem
        __typename
      }
      ... on Student {
        ...studentCourseItem
        __typename
      }
      __typename
    }
  }

  fragment studentCourseItem on Student {
    id
    courses(orderBy: TITLE, orderByDirection: ASC, filters: $filters) {
      ...courseFeedItem
      __typename
    }
    __typename
  }

  fragment courseFeedItem on Course {
    id
    title
    primaryGrade(filters: $courseGradeFilters) {
      id
      name
      __typename
    }
    profileImageData {
      url
      icon
      color
      __typename
    }
    grades(filters: $courseGradeFilters) {
      id
      name
      globalGrade {
        id
        uid
        name
        constants
        __typename
      }
      displaySequence
      __typename
    }
    calendar {
      id
      __typename
    }
    curriculumProgram {
      ...curriculumProgramBasicDetailsItem
      __typename
    }
    academicYears {
      ...academicYearItem
      __typename
    }
    subjects {
      id
      name
      type
      __typename
    }
    subjectGroups {
      id
      name
      __typename
    }
    projectGroups {
      ...basicProjectGroupDetails
      __typename
    }
    isDemo
    isRemovedCourseForLoggedInUser
    isArchived
    genericTags {
      id
      label
      type
      __typename
    }
    enabledModules(filters: $enabledModulesFilters)
    learningCourse {
      id
      title
      academicCourse {
        id
        label
        __typename
      }
      gradingPeriods {
        edges {
          node {
            id
            __typename
          }
          __typename
        }
        __typename
      }
      displayMetadata
      __typename
    }
    __typename
  }

  fragment academicYearItem on AcademicYear {
    id
    startDate
    endDate
    isCurrentAcademicYear
    isUpcomingAcademicYear
    transitionReviewStatus
    label
    __typename
  }

  fragment curriculumProgramBasicDetailsItem on CurriculumProgram {
    id
    type
    nodeInterfaceType
    label
    acronym
    academicSetupType
    programType
    ... on IbDpCurriculumProgram {
      examSessionMonth
      __typename
    }
    __typename
  }

  fragment basicProjectGroupDetails on ProjectGroup {
    id
    name
    type
    subType
    curriculumProgram {
      id
      type
      __typename
    }
    __typename
  }

  fragment staffItem on Staff {
    id
    courses(orderBy: TITLE, orderByDirection: ASC, filters: $filters) {
      ...courseItem
      __typename
    }
    __typename
  }

  fragment courseItem on Course {
    id
    title
    isArchived
    enabledModules(filters: $enabledModulesFilters)
    grades(filters: $courseGradeFilters) {
      ...gradeItem
      __typename
    }
    curriculumProgram {
      ...curriculumProgramBasicDetailsItem
      __typename
    }
    calendar {
      id
      __typename
    }
    isDemo
    academicYears {
      ...academicYearItem
      __typename
    }
    subjectGroups {
      id
      name
      __typename
    }
    projectGroups {
      ...basicProjectGroupDetails
      __typename
    }
    profileImage
    isRemovedCourseForLoggedInUser
    tags {
      id
      key
      value
      __typename
    }
    subjects {
      id
      name
      __typename
    }
    __typename
  }

  fragment gradeItem on Grade {
    id
    name
    unitPlanCount(innerUserIdFilter: $id) @include(if: $isCurriculumProgramFree)
    globalGrade {
      id
      constants
      displaySequence
      __typename
    }
    displaySequence
    __typename
  }`
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