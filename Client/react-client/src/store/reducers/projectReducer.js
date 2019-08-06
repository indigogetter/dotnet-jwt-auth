import { persistenceConstants, projectConstants } from '../../config/constants';
import clientStorage from '../persistence/clientStorage';

// const initState = {
//     projects: {
//         '1': {id: '1', title: 'help me find peach', content: 'some content goes here'},
//         '2': {id: '2', title: 'collect all the stars', content: 'foo bar bizz baz'},
//         '3': {id: '3', title: 'egg hunt with yoshi', content: 'blah blah blah'},
//     }
// };

/**
 * Notes (8/3/2019):
 * Need to structure storage such that the caching mechanism expires projects individually
 * rather than in a single 'projects' chunk.
 * Also, need to add a limit in projectActions for the number
 * of items retrieved... or not.
 */

// consider modifying this item to be an array of keys
// though, the expiration mechanism will need to be reviewed
// since tiered data is expired by overall lastAccessTime
const recentProjectsLocalStorageItem = clientStorage.get(projectConstants.RECENT_PROJECTS_LOCAL_STORAGE_KEY);
console.log(`retrieved local storage item with key '${projectConstants.RECENT_PROJECTS_LOCAL_STORAGE_KEY}' and value ${JSON.stringify(recentProjectsLocalStorageItem)}`);
const defaultState = {
    projects: {},
    lastReadMilliseconds: 0,
};
const initState = {
    ...defaultState,
    projects: recentProjectsLocalStorageItem || {},
};

const projectReducer = (state = initState, action) => {
    switch (action.type) {
        case projectConstants.CREATE_PROJECT:
            console.log('attempting to create project', action);
            return state;
        case projectConstants.CREATE_PROJECT_SUCCESS:
            console.log('created project', action);
            const { project } = action;
            const integratedProjects = {
                ...state.projects,
            };
            integratedProjects[project.projectId] = project;
            clientStorage.set(
                projectConstants.RECENT_PROJECTS_LOCAL_STORAGE_KEY,
                integratedProjects,
                persistenceConstants.TIER_C
            );
            return {
                ...state,
                projects: integratedProjects,
            };
        case projectConstants.CREATE_PROJECT_ERROR:
            console.log(`create project error`, action);
            return state;
        case projectConstants.READ_PROJECT:
            console.log(`read project`, action);
            return state;
        case projectConstants.READ_PROJECT_SUCCESS:
            console.log(`read project success`, action);
            return state;
        case projectConstants.READ_PROJECT_ERROR:
            console.log(`read project error`, action);
            return state;
        case projectConstants.READ_PROJECTS_MODIFIED_AFTER_DATE:
            console.log(`get recent projects`, action);
            return state;
        case projectConstants.READ_PROJECTS_MODIFIED_AFTER_DATE_SUCCESS:
            const { readAllProjectsDto } = action;
            console.log(`get recent projects success`, action);
            console.log(readAllProjectsDto);
            const { startingDate, projects } = readAllProjectsDto;
            const mergedProjects = {
                ...state.projects,
            };
            for (let i = 0; i < projects.length; i++) {
                mergedProjects[projects[i].projectId] = projects[i];
            }
            clientStorage.set(
                projectConstants.RECENT_PROJECTS_LAST_POLL_DATE_STORAGE_KEY,
                startingDate,
                persistenceConstants.TIER_C);
            clientStorage.set(
                projectConstants.RECENT_PROJECTS_LOCAL_STORAGE_KEY,
                mergedProjects,
                persistenceConstants.TIER_C);
            return {
                ...state,
                projects: mergedProjects,
                lastReadMilliseconds: startingDate.valueOf(),
            };
        case projectConstants.READ_PROJECTS_MODIFIED_AFTER_DATE_ERROR:
            console.log(`get recent projects error`, action);
            return state;
        default:
            return state;
    }
}

export default projectReducer;
