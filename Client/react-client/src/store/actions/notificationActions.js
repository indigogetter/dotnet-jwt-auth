import { apiConstants, projectConstants, notificationConstants } from '../../config/constants';
const signalR = require("@aspnet/signalr");

export const subscribeProjectHub = (tokenFactory) => {
    return (dispatch) => {
        dispatch({ type: notificationConstants.SUBSCRIBE_PROJECT_HUB });
        const projectHubConnection = new signalR.HubConnectionBuilder()
            .withUrl(apiConstants.projectsHub, { accessTokenFactory: () => tokenFactory() })
            .build();
        
        projectHubConnection.on(notificationConstants.PROJECT_NOTIFICATION_HANDLER_NAME, (inboundPayload) => {
            dispatch({ type: notificationConstants.RECEIVE_PROJECT_CREATED, createdProjectDto: inboundPayload.createdProjectDto });
            dispatch({ type: projectConstants.READ_PROJECT_SUCCESS, projectDto: inboundPayload.createdProjectDto });
        });

        projectHubConnection.start()
            .then(() => {
                console.log(`projectHubConnection.start() indicated success`);
                console.log(projectHubConnection);
                dispatch({ type: notificationConstants.SUBSCRIBE_PROJECT_HUB_SUCCESS, projectHubConnection });
                console.log(`projectHubConnection.invoke('${notificationConstants.PROJECT_SUBSCRIBERS_ADD_TO_GROUP_RPC}', '${notificationConstants.PROJECT_SUBSCRIBERS_GROUP_NAME}')`);
                projectHubConnection.invoke(notificationConstants.PROJECT_SUBSCRIBERS_ADD_TO_GROUP_RPC, notificationConstants.PROJECT_SUBSCRIBERS_GROUP_NAME)
                    .then(() => console.log(`SUCCESS: projectHubConnection.invoke('${notificationConstants.PROJECT_SUBSCRIBERS_ADD_TO_GROUP_RPC}', '${notificationConstants.PROJECT_SUBSCRIBERS_GROUP_NAME}')`))
                    .catch(() => console.error(`FAILURE: projectHubConnection.invoke('${notificationConstants.PROJECT_SUBSCRIBERS_ADD_TO_GROUP_RPC}', '${notificationConstants.PROJECT_SUBSCRIBERS_GROUP_NAME}')`));
                    // .then(() => dispatch({ type: notificationConstants.JOINED_PROJECT_SUBSCRIBERS_GROUP_SUCCESS }))
                    // .catch(() => dispatch({ type: notificationConstants.JOINED_PROJECT_SUBSCRIBERS_GROUP_ERROR }));
            })
            .catch((err) => dispatch({ type: notificationConstants.SUBSCRIBE_PROJECT_HUB_ERROR, err }));
    }
};

export const unsubscribeProjectHub = (projectHubConnection) => {
    return (dispatch) => {
        dispatch({ type: notificationConstants.UNSUBSCRIBE_PROJECT_HUB });
        projectHubConnection.stop()
            .then(() => dispatch({ type: notificationConstants.UNSUBSCRIBE_PROJECT_HUB_SUCCESS }))
            .catch((err) => dispatch({ type: notificationConstants.SUBSCRIBE_PROJECT_HUB_ERROR, err }));
    }
};

export const subscribeUserHub = (tokenFactory) => {
    return (dispatch) => {
        dispatch({ type: notificationConstants.SUBSCRIBE_USER_HUB });
        const userHubConnection = new signalR.HubConnectionBuilder()
            .withUrl(apiConstants.usersHub, { accessTokenFactory: () => tokenFactory() })
            .build();
        userHubConnection.on(notificationConstants.USER_NOTIFICATION_HANDLER_NAME, (inboundPayload) => {
            dispatch({ type: notificationConstants.RECEIVE_USER_CREATED, createdUserDto: inboundPayload.createdUserDto });
        });

        userHubConnection.start()
            .then(() => {
                console.log(`userHubConnection.start() indicated success`);
                console.log(userHubConnection);
                dispatch({ type: notificationConstants.SUBSCRIBE_USER_HUB_SUCCESS, userHubConnection });
                userHubConnection.invoke(notificationConstants.USER_SUBSCRIBERS_ADD_TO_GROUP_RPC, notificationConstants.USER_SUBSCRIBERS_GROUP_NAME)
                    .then(() => console.log(`SUCCESS: userHubConnection.invoke('${notificationConstants.USER_SUBSCRIBERS_ADD_TO_GROUP_RPC}', '${notificationConstants.USER_SUBSCRIBERS_GROUP_NAME}')`))
                    .catch(() => console.error(`FAILURE: userHubConnection.invoke('${notificationConstants.USER_SUBSCRIBERS_ADD_TO_GROUP_RPC}', '${notificationConstants.USER_SUBSCRIBERS_GROUP_NAME}')`));
                    // .then(() => dispatch({ type: notificationConstants.JOINED_USER_SUBSCRIBERS_GROUP_SUCCESS }))
                    // .catch(() => dispatch({ type: notificationConstants.JOINED_USER_SUBSCRIBERS_GROUP_ERROR }));
            })
            .catch((err) => dispatch({ type: notificationConstants.SUBSCRIBE_USER_HUB_ERROR, err }));
    }
};

export const unsubscribeUserHub = (userHubConnection) => {
    return (dispatch) => {
        dispatch({ type: notificationConstants.UNSUBSCRIBE_USER_HUB });
        userHubConnection.stop()
            .then(() => dispatch({ type: notificationConstants.UNSUBSCRIBE_USER_HUB_SUCCESS }))
            .catch((err) => dispatch({ type: notificationConstants.SUBSCRIBE_USER_HUB_ERROR, err }));
    }
};
