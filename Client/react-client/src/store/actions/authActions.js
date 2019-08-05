import axios from 'axios';
import { apiConstants, authConstants } from '../../config/constants';

export const signIn = (credentials) => {
    return (dispatch) => {
        const url = `${apiConstants.usersController}/authenticate`;
        const data = {
            'username': credentials.username,
            'password': credentials.password,
        };
        const headers = {
            'Content-Type': 'application/json',
        };
        dispatch({ type: authConstants.LOGIN, credentials });
        axios.post(
            url,
            data,
            headers
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
