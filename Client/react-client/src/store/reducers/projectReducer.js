import { projectConstants } from '../../config/constants';

const initState = {
    projects: {
        '1': {id: '1', title: 'help me find peach', content: 'some content goes here'},
        '2': {id: '2', title: 'collect all the stars', content: 'foo bar bizz baz'},
        '3': {id: '3', title: 'egg hunt with yoshi', content: 'blah blah blah'},
    }
};

const projectReducer = (state = initState, action) => {
    switch (action.type) {
        case projectConstants.CREATE_PROJECT:
            console.log('attempting to create project', action.project);
            return state;
        case projectConstants.CREATE_PROJECT_SUCCESS:
            console.log('created project', action.project);
            return state;
        case projectConstants.CREATE_PROJECT_ERROR:
            console.log(`create project error`, action.err);
            return state;
        default:
            return state;
    }
}

export default projectReducer;
