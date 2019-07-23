import { authConstants } from '../../config/constants';

const authLocalStorageItem = localStorage.getItem(authConstants.AUTH_LOCAL_STORAGE_KEY);
console.log(`retrieved local storage item with key '${authConstants.AUTH_LOCAL_STORAGE_KEY}' and value ${authLocalStorageItem}`);
const defaultState = {
    authenticatedUser: null,
    authError: null,
    authErrorMessage: null,
};
const initState = {
    ...defaultState,
    authenticatedUser: (authLocalStorageItem && JSON.parse(authLocalStorageItem)) || null,
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case authConstants.LOGIN_SUCCESS:
            console.log('login success', action.authResponseDto);
            const authenticatedUser = action.authResponseDto;
            const authenticatedUserString = JSON.stringify(authenticatedUser);
            console.log(`setting key '${authConstants.AUTH_LOCAL_STORAGE_KEY}' with value ${authenticatedUserString}`);
            localStorage.setItem(authConstants.AUTH_LOCAL_STORAGE_KEY, authenticatedUserString);
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
            localStorage.removeItem(authConstants.AUTH_LOCAL_STORAGE_KEY);
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
