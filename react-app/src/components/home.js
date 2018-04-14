import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from './appbar';
import GoogleSignInButton from '../img/google_signin_normal.png';
import { findNearestParking } from '../actions';

class Home extends Component {

    handleFindButton() {
        this.props.findNearestParking();
    }

    render() {

        if(this.props.authenticated) {
            return (
                <div style={{ height: '100vh'}}>
                    <AppBar />
                    <h3 style={{fontWeight: '300', marginTop: '100px'}} className="text-center">{`Welcome, ${localStorage.getItem('name')}`}</h3>
                    <div className="text-center" style={{marginTop: '50px'}}>
                        <button type="button" className="btn btn-dark" onClick={this.handleFindButton.bind(this)}>Find Nearest Parking</button>
                    </div>
                </div>
            );
        }

        else {
            return (
                <div style={{ height: '100vh', backgroundColor: '#3F51B5'}}>
                    <AppBar />
                    <h3 style={{ fontWeight: '300', marginTop: '100px', color: 'white' }} className="text-center">Parking your car has never been this easy!</h3>
                    <a href="http://ec2-13-127-87-11.ap-south-1.compute.amazonaws.com/auth/google">
                        <img src={`${GoogleSignInButton}`} style={{marginTop: '150px', display: 'block', marginLeft: 'auto', marginRight:'auto', height: '46px', width: '191px'}} />
                    </a>
                    <div className="text-center" style={{ marginTop: '50px' }}>
                        <button type="button" className="btn btn-dark" onClick={this.handleFindButton.bind(this)}>Find Nearest Parking</button>
                    </div>
                </div>
            );
        }

    };
}

function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated }
}

export default connect(mapStateToProps, { findNearestParking })(Home);
