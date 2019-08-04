import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProjectSummary from './ProjectSummary';
import { readProject, readAllProjects } from '../../store/actions/projectActions';

class ProjectList extends Component {
    componentDidMount() {
        const { authenticatedUser, lastReadMilliseconds } = this.props;
        this.props.readAll(authenticatedUser, lastReadMilliseconds);
    }

    render() {
        const { projects } = this.props;
        console.log('projectList');
        console.log(projects);
        return (
            <div className="project-list section">
                { projects && Object.values(projects).map(project => {
                    return (
                        <Link to={`/project/${project.id}`} key={project.id}>
                            <ProjectSummary project={project} />
                        </Link>
                    )
                }) }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authenticatedUser: state.auth.authenticatedUser,
        lastReadMilliseconds: state.project.lastReadMilliseconds,
        projects: state.project.projects
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        // read: (projectId) => dispatch(readProject(projectId)),
        readAll: (authenticatedUser, lastReadMilliseconds) => dispatch(readAllProjects(authenticatedUser, lastReadMilliseconds)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
