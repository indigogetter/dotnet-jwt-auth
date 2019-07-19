import axios from 'axios';
import { apiConstants, authConstants } from '../../config/constants';

export const createProject = (project) => {
    return (dispatch, getState) => {
        // make async call to database
        dispatch({ type: authConstants.LOGIN, project });
    }
};
