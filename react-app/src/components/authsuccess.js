import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'qs'
import AppBar from './appbar';
import { signinUser } from '../actions';

class AuthSuccess extends Component {

    componentWillMount() {
        const qs = queryString.parse(this.props.location.search);
        this.props.signinUser({token: qs.token, userId: qs.uid, name: qs.name, email: qs.email}, () => this.props.history.push('/'))
    }

    render() {

        return (
            <div style={{ height: '100vh', backgroundColor: '#3F51B5'}}>
                <AppBar />
                <h1>Auth Successful!</h1>
            </div>
        );

    };
}

export default connect(null, { signinUser })(AuthSuccess);
