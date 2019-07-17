const initState = {
    projects: [
        {id: '1', title: 'help me find peach', content: 'some content goes here'},
        {id: '2', title: 'collect all the stars', content: 'foo bar bizz baz'},
        {id: '3', title: 'egg hunt with yoshi', content: 'blah blah blah'},
    ]
};

const projectReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CREATE_PROJECT':
            console.log('created project', action.project);
            break;
        default:
            break;
    }
    return state;
}

export default projectReducer;
