import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from './appbar';
import Spinner from '../img/spinner.svg'
import { findNearestParking } from '../actions';

class NearestParking extends Component {

    componentDidMount() {
        this.props.findNearestParking();
    }

    render() {
        const { nearestparking, currentlocation } = this.props
        if(this.props.authenticated) {
            if(nearestparking) {
                return (
                    <div style={{ height: '100vh' }}>
                        <AppBar />
                        {nearestparking.status === 'found' ? 
                            <div className="text-center">
                                <h6 style={{ marginTop: '150px', color: 'grey' }}>Parking Found!</h6>
                                <h6>{nearestparking.parking.name}</h6>
                                <p>{nearestparking.freeSlots === 1 ? '1 Slot Available' : `${nearestparking.freeSlots} Slots Available`}</p>
                                <a href={`https://www.google.com/maps/dir/?api=1&origin=${currentlocation.lat},${currentlocation.long}&destination=${nearestparking.parking.location.lat},${nearestparking.parking.location.long}`} className="btn btn-dark" style={{marginTop: '25px'}}>Navigate ({`${(nearestparking.distance/1000).toFixed(1)} km`})</a>
                            </div>
                        :
                            <h6 style={{ marginTop: '150px', color: 'grey' }}>No Parking Space is Available.</h6>
                        }
                    </div>
                );
            }
            else {
                return (
                    <div style={{ height: '100vh' }}>
                        <AppBar />
                        <div className="text-center">
                            <img src={`${Spinner}`} style={{marginTop: '150px', display: 'block', marginLeft: 'auto', marginRight:'auto'}} />
                            <p style={{color: 'grey'}}>Finding Nearest Parking For You</p>
                        </div>
                    </div>
                );
            }
        }

        else {
            return (
                <Redirect to="/"/>
            );
        }

    };
}

function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated,
            nearestparking: state.nearestparking.parking,
            currentlocation: state.nearestparking.currentlocation
        }
}

export default connect(mapStateToProps, { findNearestParking })(NearestParking);