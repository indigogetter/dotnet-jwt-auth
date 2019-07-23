import React from 'react';
import { connect } from 'react-redux';

const ProjectDetails = (props) => {
    // const id = props.match.params.id;
    const { id, project } = props;
    if (project) {
        return (
            <div className="container section project-details">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">{project.title} - {id}</span>
                        <p>{project.content}</p>
                    </div>
    
                    <div className="card-action grey lighten-4 grey-text">
                        <div>Posted by DMU.</div>
                        <div>July 16, 2019, 2pm</div>
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
