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
    'RECENT_PROJECTS_LOCAL_STORAGE_KEY': 'RECENT_PROJECTS_LOCAL_STORAGE_KEY',
    'RECENT_PROJECTS_LAST_POLL_DATE_STORAGE_KEY': 'RECENT_PROJECTS_LAST_POLL_DATE_STORAGE_KEY',

    'CREATE_PROJECT': 'CREATE_PROJECT',
    'CREATE_PROJECT_SUCCESS': 'CREATE_PROJECT_SUCCESS',
    'CREATE_PROJECT_ERROR': 'CREATE_PROJECT_ERROR',

    'READ_PROJECT': 'READ_PROJECT',
    'READ_PROJECT_SUCCESS': 'READ_PROJECT_SUCCESS',
    'READ_PROJECT_ERROR': 'READ_PROJECT_ERROR',

    'READ_PROJECTS_MODIFIED_AFTER_DATE': 'READ_PROJECTS_MODIFIED_AFTER_DATE',
    'READ_PROJECTS_MODIFIED_AFTER_DATE_SUCCESS': 'READ_PROJECTS_MODIFIED_AFTER_DATE_SUCCESS',
    'READ_PROJECTS_MODIFIED_AFTER_DATE_ERROR': 'READ_PROJECTS_MODIFIED_AFTER_DATE_ERROR',
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
    'MAX_COOKIE_WRITE_ATTEMPTS': 8,

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
