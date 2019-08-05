import React from 'react';

const ProjectSummary = ({project}) => {
    const { projectOwner, projectCreatedDate, projectModifiedDate } = project;
    const { firstName, lastName } = projectOwner;
    const initials = ((firstName && firstName.length && firstName[0]) || '') +
        ((lastName && lastName.length && lastName[0]) || '');
    const createdDate = new Date(Date.parse(projectCreatedDate));
    const modifiedDate = new Date(Date.parse(projectModifiedDate));
    return (
        <div className="card z-depth-0 project-summary">
            <div className="card-content grey-text text-darken-3">
                <span className="card-title">{project.title}</span>
                <p>Posted by {initials}.</p>
                <p className="grey-text">Created: {createdDate.toLocaleString()}</p>
                <p className="grey-text">Modified: {modifiedDate.toLocaleString()}</p>
            </div>
        </div>
    )
}

export default ProjectSummary;
