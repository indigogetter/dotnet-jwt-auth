import axios from 'axios';
import { apiConstants, projectConstants } from '../../config/constants';

const testAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiNy8yNi8yMDE5IDE6MDg6NTAgUE0iLCJuYmYiOjE1NjM1NTk3MzAsImV4cCI6MTU2NDE2NDUzMCwiaWF0IjoxNTYzNTU5NzMwLCJpc3MiOiJodHRwczovL2Rldi5qd3QuaW5kaWdvZ2V0dGVyIiwiYXVkIjoiZGV2Lmp3dC5pbmRpZ29nZXR0ZXIifQ.R9lL5nnhr-Rz1hSJ8aRHOnTGuwEzTzRPV0qtzhqZk0s';

export const createProject = (project) => {
    return (dispatch, getState) => {
        // make async call to database
        dispatch({ type: projectConstants.CREATE_PROJECT, project });
    }
};
