import React, { Component } from 'react';
import { connect } from 'react-redux';
import { subscribeProjectHub, subscribeUserHub, unsubscribeProjectHub, unsubscribeUserHub } from '../../store/actions/notificationActions';

class Notifications extends Component {
    componentDidMount() {
        this.props.subscribeProjectHub(() => this.props.authenticatedUser.token);
        this.props.subscribeUserHub(() => this.props.authenticatedUser.token);
    }

    componentWillUnmount() {
        this.props.unsubscribeProjectHub(this.props.projectHubConnection);
        this.props.unsubscribeUserHub(this.props.userHubConnection);
    }

    render() {
        const { notifications } = this.props;
        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">Notifications</span>
                        <ul className="Notifications">
                            { !!notifications && notifications.map(notification => {
                                let displayName = '';
                                let modifiedDate = new Date();
                                if (notification.project) {
                                    const project = notification.project;
                                    const projectOwner = project.projectOwner;
                                    displayName = ((projectOwner.firstName && `${projectOwner.firstName} `) || '') + (projectOwner.lastName || '');
                                    modifiedDate = new Date(Date.parse(project.projectModifiedDate));
                                } else if (notification.user) {
                                    const user = notification.user;
                                    displayName = ((user.firstName && `${user.firstName} `) || '') + (user.lastName || '');
                                    modifiedDate = new Date(Date.parse(user.userModifiedDate));
                                }
                                return (
                                    <li key={notification.notificationId}>
                                        <span className="pink-text">{displayName}</span>&nbsp;
                                        <span>{notification.content}</span>
                                        <div className="grey-text note-date">{modifiedDate.toLocaleString()}</div>
                                    </li>
                                )
                            }) }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authenticatedUser: state.auth.authenticatedUser,
        notifications: state.notification.notifications,
        notificationsLength: state.notification.notifications.length,
        pendingNotificationProjectId: state.notification.pendingNotificationProjectId,
        pendingNotificationUserId: state.notification.pendingNotificationUserId,
        projectHubConnection: state.notification.projectHubConnection,
        userHubConnection: state.notification.userHubConnection,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        subscribeProjectHub: (tokenFactory) => dispatch(subscribeProjectHub(tokenFactory)),
        subscribeUserHub: (tokenFactory) => dispatch(subscribeUserHub(tokenFactory)),
        unsubscribeProjectHub: (projectHubConnection) => dispatch(unsubscribeProjectHub(projectHubConnection)),
        unsubscribeUserHub: (userHubConnection) => dispatch(unsubscribeUserHub(userHubConnection)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
