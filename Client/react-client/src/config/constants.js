const baseUrl = 'http://localhost:5000';

export const apiConstants = {
    'baseUrl': baseUrl,
    'projectsController': `${baseUrl}/projects`,
    'usersController': `${baseUrl}/users`,
};

export const authConstants = {
    'LOGIN': 'LOGIN',
    'LOGIN_ERROR': 'LOGIN_ERROR',

    'LOGOUT': 'LOGOUT',
};

export const projectConstants = {
    'CREATE_PROJECT': 'CREATE_PROJECT',
    'CREATE_PROJECT_ERROR': 'CREATE_PROJECT_ERROR',
};
