import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from './appbar';
import { findNearestParking } from '../actions';

class NearestParking extends Component {

    componentDidMount() {

    }

    render() {

        if(this.props.authenticated) {
            return (
                <div style={{ height: '100vh'}}>
                    <AppBar />
                    <h6>We have found a parking for you</h6>
                </div>
            );
        }

        else {
            return (
                <Redirect to="/"/>
            );
        }

    };
}

function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated, nearestparking: state.nearestparking }
}

export default connect(mapStateToProps, { findNearestParking })(Home);