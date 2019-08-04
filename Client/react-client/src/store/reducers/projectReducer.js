import { projectConstants } from '../../config/constants';
import clientStorage from '../persistence/clientStorage';

// const initState = {
//     projects: {
//         '1': {id: '1', title: 'help me find peach', content: 'some content goes here'},
//         '2': {id: '2', title: 'collect all the stars', content: 'foo bar bizz baz'},
//         '3': {id: '3', title: 'egg hunt with yoshi', content: 'blah blah blah'},
//     }
// };
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
            return state;
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
            return state;
        case projectConstants.READ_PROJECTS_MODIFIED_AFTER_DATE_ERROR:
            console.log(`get recent projects error`, action);
            return state;
        default:
            return state;
    }
}

export default projectReducer;
