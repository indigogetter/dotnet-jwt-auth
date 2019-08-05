import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Notifications from './Notifications';
import ProjectList from '../projects/ProjectList';

class Dashboard extends Component {
    render() {
        // console.log(this.props);
        const { authenticatedUser, projects } = this.props;
        if (!authenticatedUser || !authenticatedUser.token) {
            return <Redirect to='/signin' />
        }
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m6">
                        <ProjectList projects={projects} />
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <Notifications />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authenticatedUser: state.auth.authenticatedUser,
        projects: state.project.projects,
    }
}

export default connect(mapStateToProps)(Dashboard);
