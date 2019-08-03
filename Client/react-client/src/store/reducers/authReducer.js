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
            clientStorage.remove(authConstants.AUTH_LOCAL_STORAGE_KEY);
            console.log('logout success');
            return {
                ...state,
                ...defaultState,
            };
        default:
            return state;
    }
}

export default authReducer;
