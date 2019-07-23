import axios from 'axios';
import { apiConstants, projectConstants } from '../../config/constants';

export const createProject = (project) => {
    return (dispatch, getState) => {
        const authenticatedUser = getState().auth.authenticatedUser;
        // make async call to database
        const url = `${apiConstants.projectsController}/create`;
        const data = {
            'title': project.title,
            'content': project.content,
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authenticatedUser && authenticatedUser.token}`,
        };
        axios.post(
            url,
            data,
            headers
        ).then((projectDto) => {
            dispatch({ type: projectConstants.CREATE_PROJECT_SUCCESS, project: projectDto });
        }).catch((err) => {
            dispatch({ type: projectConstants.CREATE_PROJECT_ERROR, err });
        });
    }
};
