import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from './appbar';
import GoogleSignInButton from '../img/google_signin_normal.png';
import { findNearestParking } from '../actions';

class Home extends Component {

    render() {

        if(this.props.authenticated) {
            return (
                <div style={{ height: '100vh'}}>
                    <AppBar />
                    <h3 style={{fontWeight: '300', marginTop: '100px'}} className="text-center">{`Welcome, ${localStorage.getItem('name')}`}</h3>
                    <div className="text-center" style={{marginTop: '50px'}}>
                        <Link className="btn btn-dark" to="/nearestparking">Find Nearest Parking</Link>
                    </div>
                </div>
            );
        }

        else {
            return (
                <div style={{ height: '100vh', backgroundColor: '#3F51B5'}}>
                    <AppBar />
                    <h3 style={{ fontWeight: '300', marginTop: '100px', color: 'white' }} className="text-center">Parking your car has never been this easy!</h3>
                    <a href="https://parking-suggest-api.priyanshrastogi.com/auth/google">
                        <img src={`${GoogleSignInButton}`} style={{marginTop: '150px', display: 'block', marginLeft: 'auto', marginRight:'auto', height: '46px', width: '191px'}} />
                    </a>
                </div>
            );
        }

    };
}

function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated }
}

export default connect(mapStateToProps, { findNearestParking })(Home);
