import React from 'react';
import { Link } from 'react-router-dom';
import ProjectSummary from './ProjectSummary';

const ProjectList = ({projects}) => {
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

export default ProjectList;
