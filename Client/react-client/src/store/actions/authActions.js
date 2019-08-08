import axios from 'axios';
import { apiConstants, authConstants } from '../../config/constants';

export const isAuthTokenExpired = (authenticatedUser) => {
    return Date.parse(authenticatedUser.tokenExpirationDate) < Date.now();
};

export const refreshToken = (authenticatedUser) => {
    /**
     * In order to take advantage of this feature, this method will need
     * to be bound to a connected component's properties.  For example:
     * 
     *      componentDidMount() {
     *          if (this.props.isAuthTokenExpired(this.props.authenticatedUser)) {
     *              this.props.refreshToken(this.props.authenticatedUser)
     *          }
     *      }
     * 
     * This practice should forestall any component actions receiving a 401
     * as a result of an expired auth token.  Upon refresh failure, the reducer
     * logs the user out of the SPA.
     */
    return (dispatch) => {
        const url = `${apiConstants.usersController}/refresh`;
        const data = {
            'refreshToken': authenticatedUser.refreshToken,
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        dispatch({ type: authConstants.REFRESH_TOKEN });
        axios.post(
            url,
            data,
            config
        ).then((response) => {
            const refreshResponseDto = response.data;
            dispatch({ type: authConstants.REFRESH_TOKEN_SUCCESS, refreshResponseDto });
        }).catch((err) => {
            dispatch({ type: authConstants.REFRESH_TOKEN_ERROR, err });
        });
    }
};

export const signIn = (credentials) => {
    return (dispatch) => {
        const url = `${apiConstants.usersController}/authenticate`;
        const data = {
            'username': credentials.username,
            'password': credentials.password,
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        dispatch({ type: authConstants.LOGIN, credentials });
        axios.post(
            url,
            data,
            config
        ).then((response) => {
            const authResponseDto = response.data;
            dispatch({ type: authConstants.LOGIN_SUCCESS, authResponseDto });
        }).catch((err) => {
            dispatch({ type: authConstants.LOGIN_ERROR, err });
        });
    }
};

export const signOut = () => {
    return (dispatch) => {
        // modify this to allow axios to post to 'users/invalidate' the refresh token
        dispatch({ type: authConstants.LOGOUT });
    }
};

export const signUp = (newUser) => {
    return (dispatch) => {
        const url = `${apiConstants.usersController}/create`;
        const data = {
            'username': newUser.username,
            'email': newUser.email,
            'password': newUser.password,
            'firstName': newUser.firstName,
            'lastName': newUser.lastName,
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        dispatch({ type: authConstants.CREATE_NEW_USER, newUser });
        axios.post(
            url,
            data,
            config
        ).then((response) => {
            const createResponseDto = response.data;
            dispatch({ type: authConstants.CREATE_NEW_USER_SUCCESS, createResponseDto });
            // on success, automatically trigger a sign-in action
            signIn({ 'username': newUser.username, 'password': newUser.password })(dispatch);
        }).catch((err) => {
            dispatch({ type: authConstants.CREATE_NEW_USER_ERROR, err });
        });
    }
};
