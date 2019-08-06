import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createProject } from '../../store/actions/projectActions';

class CreateProject extends Component {
    state = {
        title: '',
        content: ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(this.state);
        const successCallback = () => this.props.history.push('/');
        this.props.createProject(this.props.authenticatedUser, this.state, successCallback);
    }

    render() {
        const { authenticatedUser } = this.props;
        if (!authenticatedUser || !authenticatedUser.token) {
            return <Redirect to='/signin' />
        }
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Create New Project</h5>
                    <div className="input-field">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="content">Project Content</label>
                        <textarea className="materialize-textarea" id="content" onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <button className="btn pink lighten-1 z-depth-0">Create</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authenticatedUser: state.auth.authenticatedUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createProject: (authenticatedUser, project, successCallback) => dispatch(createProject(authenticatedUser, project, successCallback)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject);
