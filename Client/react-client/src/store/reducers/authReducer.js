import { authConstants, persistenceConstants } from '../../config/constants';
import clientStorage from '../persistence/clientStorage';

const authLocalStorageItem = clientStorage.get(authConstants.AUTH_LOCAL_STORAGE_KEY);
console.log(`retrieved local storage item with key '${authConstants.AUTH_LOCAL_STORAGE_KEY}' and value ${JSON.stringify(authLocalStorageItem)}`);
const defaultState = {
    authenticatedUser: null,
    authError: null,
    authErrorMessage: null,
};
const initState = {
    ...defaultState,
    authenticatedUser: authLocalStorageItem || null,
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case authConstants.LOGIN_SUCCESS:
            console.log('login success', action.authResponseDto);
            const authenticatedUser = action.authResponseDto;
            console.log(`setting key '${authConstants.AUTH_LOCAL_STORAGE_KEY}' with value ${JSON.stringify(authenticatedUser)}`);
            clientStorage.set(authConstants.AUTH_LOCAL_STORAGE_KEY, authenticatedUser, persistenceConstants.TIER_A);
            return {
                ...state,
                authenticatedUser,
                authError: null,
                authErrorMessage: null,
            };
        case authConstants.LOGIN_ERROR:
            console.error('login error', action.err);
            return {
                ...state,
                authErrorMessage: 'Login failed',
                authError: action.err,
            };
        case authConstants.LOGOUT:
            // clientStorage.remove(authConstants.AUTH_LOCAL_STORAGE_KEY);
            // clear all local storage when the client logs out
            // or the action is triggered by token expiration
            clientStorage.reset(persistenceConstants.TIER_A);
            console.log('logout success');
            return {
                ...state,
                ...defaultState,
            };
        case authConstants.REFRESH_TOKEN:
            console.log('attempting to refresh auth token');
            return state;
        case authConstants.REFRESH_TOKEN_SUCCESS:
            console.log('refresh token success', action.refreshResponseDto);
            const refreshedUser = action.refreshResponseDto;
            console.log(`setting key '${authConstants.AUTH_LOCAL_STORAGE_KEY}' with value ${JSON.stringify(refreshedUser)}`);
            clientStorage.set(authConstants.AUTH_LOCAL_STORAGE_KEY, refreshedUser, persistenceConstants.TIER_A);
            return {
                ...state,
                authenticatedUser: refreshedUser,
                authError: null,
                authErrorMessage: null,
            };
        case authConstants.REFRESH_TOKEN_ERROR:
            // clear all local storage when the refresh token fails
            clientStorage.reset(persistenceConstants.TIER_A);
            console.error('refresh token error');
            return {
                ...state,
                ...defaultState,
                authError: action.err,
                authErrorMessage: 'Refresh token failed to reauthenticate user.'
            };
        case authConstants.CREATE_NEW_USER:
            console.log('create new user');
            return state;
        case authConstants.CREATE_NEW_USER_SUCCESS:
            console.log('create new user success');
            const createdUser = action.createResponseDto;
            console.log(`setting key '${authConstants.AUTH_LOCAL_STORAGE_KEY}' with value ${JSON.stringify(createdUser)}`);
            clientStorage.set(authConstants.AUTH_LOCAL_STORAGE_KEY, createdUser, persistenceConstants.TIER_A);
            return {
                ...state,
                authenticatedUser: createdUser,
                authError: null,
                authErrorMessage: null,
            };
        case authConstants.CREATE_NEW_USER_ERROR:
            console.error('create new user error');
            return {
                ...state,
                ...defaultState,
                authError: action.err,
                authErrorMessage: 'Refresh token failed to reauthenticate user.'
            };
        default:
            return state;
    }
}

export default authReducer;
