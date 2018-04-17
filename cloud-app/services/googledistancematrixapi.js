const axios = require('axios').default;
const Parking = require('../models/parking');
const config = require('../config');
const _ = require('lodash');
const GOOGLE_DISTANCE_MATRIX_API = 'https://maps.googleapis.com/maps/api/distancematrix/json?'

exports.getDistanceToParkings = (origin) => {
    return new Promise((resolve, reject) => {
        let distances = [];
        Parking.find({})
        .then((parkings) => {
            let destinations = '';
            parkings.forEach(parking => {
                destinations = `${destinations}${parking.location.lat},${parking.location.long}|`
                distances.push({'parkingId': parking._id, 'distance': null})
            });
            axios.get(`${GOOGLE_DISTANCE_MATRIX_API}origins=${origin}&destinations=${destinations}&key=${config.googleDistanceMatrixApiKey}`)
        .then((response) => {
            for(let i=0; i<distances.length; i++) {
                distances[i].distance = response.data.rows[0].elements[i].distance.value;
            }
            distances = _.orderBy(distances, ['distance'], ['asc']);
            resolve(distances);
        })
        .catch((err) => { reject(err) });
        })
        .catch((err) => { reject(err) });
        });
}