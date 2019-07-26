const baseUrl = 'http://localhost:5000';

export const apiConstants = {
    'baseUrl': baseUrl,
    'projectsController': `${baseUrl}/projects`,
    'usersController': `${baseUrl}/users`,
};

export const authConstants = {
    'AUTH_LOCAL_STORAGE_KEY': 'AUTH_LOCAL_STORAGE',

    'LOGIN': 'LOGIN',
    'LOGIN_SUCCESS': 'LOGIN_SUCCESS',
    'LOGIN_ERROR': 'LOGIN_ERROR',

    'LOGOUT': 'LOGOUT',
};

export const projectConstants = {
    'CREATE_PROJECT': 'CREATE_PROJECT',
    'CREATE_PROJECT_SUCCESS': 'CREATE_PROJECT_SUCCESS',
    'CREATE_PROJECT_ERROR': 'CREATE_PROJECT_ERROR',
};

export const persistenceConstants = {
    'LOCAL_STORAGE_STRATEGY': 'LOCAL_STORAGE_STRATEGY',
    'COOKIE_CRUMB_STRATEGY': 'COOKIE_CRUM_STRATEGY',

    'TIER_A': 1,
    'TIER_B': 2,
    'TIER_C': 3,
    'TIER_D': 4,
    'TIER_E': 5,

    'INDEX_KEY': 'INDEX_KEY',
    'LAST_ACCESSED_KEY': 'LAST_ACCESSED_KEY',

    // Expire 'Tier A' after 30 days
    'EXPIRATION_MILLISECONDS_TIER_A': 30 * 24 * 60 * 60 * 1000,
    // Expire 'Tier B' after 14 days
    'EXPIRATION_MILLISECONDS_TIER_B': 14 * 24 * 60 * 60 * 1000,
    // Expire 'Tier C' after 7 days
    'EXPIRATION_MILLISECONDS_TIER_C': 7 * 24 * 60 * 60 * 1000,
    // Expire 'Tier D' after 1 day
    'EXPIRATION_MILLISECONDS_TIER_D': 1 * 24 * 60 * 60 * 1000,
    // Expire 'Tier E' after 1 hour
    'EXPIRATION_MILLISECONDS_TIER_E': 1 * 60 * 60 * 1000,
};
