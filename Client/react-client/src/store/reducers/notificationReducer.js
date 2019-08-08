import { notificationConstants } from '../../config/constants';

const defaultState = {
    notifications: [],
    pendingNotificationProjectId: 0,
    pendingNotificationUserId: 0,
    projectHubConnection: null,
    userHubConnection: null,
};
const initState = {
    ...defaultState,
};

const notificationReducer = (state = initState, action) => {
    switch (action.type) {
        case notificationConstants.NOTIFY_PROJECT_CREATED:
            console.log('notifying logged in users of project creation', action);
            const newProject = action.project;
            return {
                ...state,
                pendingNotificationProjectId: newProject.projectId
            };
        case notificationConstants.NOTIFY_PROJECT_CREATED_SUCCESS:
            console.log('project notification success', action);
            return {
                ...state,
                pendingNotificationProjectId: 0,
            };
        case notificationConstants.NOTIFY_PROJECT_CREATED_ERROR:
            console.error(`project notification error`, action);
            return {
                ...state,
                pendingNotificationProjectId: 0,
            };
        case notificationConstants.NOTIFY_USER_CREATED:
            console.log(`notifying logged in users of new user registration`, action);
            const newUser = action.user;
            return {
                ...state,
                pendingNotificationUserId: newUser.userId
            };
        case notificationConstants.NOTIFY_USER_CREATED_SUCCESS:
            console.log(`user notification success`, action);
            return {
                ...state,
                pendingNotificationUserId: 0,
            };
        case notificationConstants.NOTIFY_USER_CREATED_ERROR:
            console.error(`user notification error`, action);
            return {
                ...state,
                pendingNotificationUserId: 0,
            };
        case notificationConstants.RECEIVE_PROJECT_CREATED:
            console.log(`received project created notification`, action);
            const { createdProjectDto } = action;
            const projectUpdatedNotifications = state.notifications.slice();
            const projectNotification = {
                notificationId: `project_${createdProjectDto.projectId}`,
                content: `Added a new project`,
                project: createdProjectDto,
            };
            projectUpdatedNotifications.push(projectNotification);
            if (projectUpdatedNotifications.length > notificationConstants.VISIBLE_LIMIT) {
                projectUpdatedNotifications.shift();
            }
            return {
                ...state,
                notifications: projectUpdatedNotifications,
            };
        case notificationConstants.RECEIVE_USER_CREATED:
            console.log(`received user registration notification`, action);
            const { createdUserDto } = action;
            const userUpdatedNotifications = state.notifications.slice();
            const userNotification = {
                notificationId: `user_${createdUserDto.userId}`,
                content: `Registered a new user`,
                user: createdUserDto,
            };
            userUpdatedNotifications.push(userNotification);
            if (userUpdatedNotifications.length > notificationConstants.VISIBLE_LIMIT) {
                userUpdatedNotifications.shift();
            }
            return {
                ...state,
                notifications: userUpdatedNotifications,
            };
        case notificationConstants.SUBSCRIBE_PROJECT_HUB:
            console.log('subscribing to project hub');
            return state;
        case notificationConstants.SUBSCRIBE_PROJECT_HUB_SUCCESS:
            console.log('subscribed to project hub');
            return {
                ...state,
                projectHubConnection: action.projectHubConnection,
            };
        case notificationConstants.SUBSCRIBE_PROJECT_HUB_ERROR:
            console.error('error subscribing to project hub', action.err);
            return state;
        case notificationConstants.UNSUBSCRIBE_PROJECT_HUB:
            console.log('unsubscribing from project hub');
            return state;
        case notificationConstants.UNSUBSCRIBE_PROJECT_HUB_SUCCESS:
            console.log('unsubscribed from project hub');
            return {
                ...state,
                projectHubConnection: null,
            };
        case notificationConstants.UNSUBSCRIBE_PROJECT_HUB_ERROR:
            console.error('error unsubscribing from project hub', action.err);
            return state;
        case notificationConstants.SUBSCRIBE_USER_HUB:
            console.log('subscribing to user hub');
            return state;
        case notificationConstants.SUBSCRIBE_USER_HUB_SUCCESS:
            console.log('subscribed to user hub');
            return {
                ...state,
                userHubConnection: action.userHubConnection,
            };
        case notificationConstants.SUBSCRIBE_USER_HUB_ERROR:
            console.error('error subscribing to user hub', action.err);
            return state;
        case notificationConstants.UNSUBSCRIBE_USER_HUB:
            console.log('unsubscribing from user hub');
            return state;
        case notificationConstants.UNSUBSCRIBE_USER_HUB_SUCCESS:
            console.log('unsubscribed from user hub');
            return {
                ...state,
                userHubConnection: null,
            };
        case notificationConstants.UNSUBSCRIBE_USER_HUB_ERROR:
            console.error('error unsubscribing from user hub', action.err);
            return state;
        default:
            return state;
    }
}

export default notificationReducer;
