import React from 'react';
import { connect } from 'react-redux';

const ProjectDetails = (props) => {
    // const id = props.match.params.id;
    const { id, project } = props;
    const { projectOwner, projectCreatedDate, projectModifiedDate } = project;
    const { firstName, lastName } = projectOwner;
    const initials = ((firstName && firstName.length && firstName[0]) || '') +
        ((lastName && lastName.length && lastName[0]) || '');
    const createdDate = new Date(Date.parse(projectCreatedDate));
    const modifiedDate = new Date(Date.parse(projectModifiedDate));
    if (project) {
        return (
            <div className="container section project-details">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">{project.title} - {id}</span>
                        <p>{project.content}</p>
                    </div>
    
                    <div className="card-action grey lighten-4 grey-text">
                        <div>Posted by {initials}.</div>
                        <div>Created: {createdDate.toLocaleString()}</div>
                        <div>Modified: {modifiedDate.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container center">
                <p>Loading project...</p>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state);
    console.log(ownProps);
    const id = ownProps.match.params.id;
    const project = state.project.projects
        ? state.project.projects[id]
        : null;
    return {
        id,
        project
    };
}

export default connect(mapStateToProps)(ProjectDetails);
