import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/authActions';

const SignedInLinks = (props) => {
    const { authenticatedUser } = props;
    const initials = ((authenticatedUser && authenticatedUser.firstName && authenticatedUser.firstName[0]) || '') + 
        ((authenticatedUser && authenticatedUser.lastName && authenticatedUser.lastName[0]) || '');
    // check the status of the token each time the dashboard props are updated
    if (!authenticatedUser || (Date.parse(authenticatedUser.tokenExpirationDate).valueOf() < Date.now())) {
        // if the token expired:
        //      1. attempt to obtain a new one via refresh token
        //      2. until that's implemented, log the user out
        props.signOut();
    }
    return (
        <ul className="right">
            <li><NavLink to="/create">New Project</NavLink></li>
            <li><NavLink to="/" onClick={props.signOut}>Log Out</NavLink></li>
            <li><NavLink to="/" className="btn btn-floating pink lighten-1">{initials}</NavLink></li>
        </ul>
    )
}

const mapStateToProps = (state) => {
    return {
        authenticatedUser: state.auth.authenticatedUser,
        projects: state.project.projects,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);
