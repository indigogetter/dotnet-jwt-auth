import axios from 'axios';
import { apiConstants, projectConstants } from '../../config/constants';

export const createProject = (authenticatedUser, project) => {
    return (dispatch) => {
        // const authenticatedUser = getState().auth.authenticatedUser;
        // make async call to database
        const url = `${apiConstants.projectsController}/create`;
        const data = {
            'title': project.title,
            'content': project.content,
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authenticatedUser && authenticatedUser.token}`,
            }
        };
        console.log(`url: ${url}`);
        console.log(`data: ${JSON.stringify(data)}`);
        console.log(`headers: ${JSON.stringify(config)}`);
        dispatch({ type: projectConstants.CREATE_PROJECT, project });
        axios.post(
            url,
            data,
            config
        ).then((response) => {
            const projectDto = response.data;
            dispatch({ type: projectConstants.CREATE_PROJECT_SUCCESS, project: projectDto });
        }).catch((err) => {
            dispatch({ type: projectConstants.CREATE_PROJECT_ERROR, err });
        });
    }
};

export const readProject = (authenticatedUser, projectId) => {
    return (dispatch) => {
        // const authenticatedUser = getState().auth.authenticatedUser;
        // make async call to database
        const url = `${apiConstants.projectsController}/read?projectId=${projectId}`;
        const config = {
            headers: {
                'Authorization': `Bearer ${authenticatedUser && authenticatedUser.token}`,
            }
        };
        dispatch({ type: projectConstants.READ_PROJECT, projectId });
        axios.get(
            url,
            config
        ).then((projectDto) => {
            dispatch({ type: projectConstants.READ_PROJECT_SUCCESS, project: projectDto });
        }).catch((err) => {
            dispatch({ type: projectConstants.READ_PROJECT_ERROR, err });
        });
    }
};

export const readAllProjects = (authenticatedUser, lastReadMilliseconds) => {
    return (dispatch) => {
        // const authenticatedUser = getState().auth.authenticatedUser;
        // const lastPollTimeMilliseconds = getSate().project.lastReadMilliseconds;
        const lastPollDate = new Date(lastReadMilliseconds);
        // make async call to database
        const url = `${apiConstants.projectsController}/readall?startingDate=${lastPollDate.toISOString()}`;
        const config = {
            headers: {
                'Authorization': `Bearer ${authenticatedUser && authenticatedUser.token}`,
            }
        };
        dispatch({ type: projectConstants.READ_PROJECTS_MODIFIED_AFTER_DATE, lastPollDate });
        axios.get(
            url,
            config
        ).then((response) => {
            dispatch({ type: projectConstants.READ_PROJECTS_MODIFIED_AFTER_DATE_SUCCESS, readAllProjectsDto: response.data });
        }).catch((err) => {
            dispatch({ type: projectConstants.READ_PROJECTS_MODIFIED_AFTER_DATE_ERROR, err });
        });
    }
};
