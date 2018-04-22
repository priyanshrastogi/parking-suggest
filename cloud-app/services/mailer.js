var nodemailer = require('nodemailer');
var config = require('../config');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: config.mailUser,
        pass: config.mailPass
    }
});

exports.sendWelcomeMail = function(to, name) {
    const mailOptions = {
        from: '"Parking Suggest" <parking.suggest@gmail.com>', // sender address
        to: to, // list of receivers
        subject: 'Welcome to Parking Suggest', // Subject line
        text: 'Hey '+ name.split(' ')[0]+',\n\nWelcome to Parking Suggest.\n\n',
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};


exports.sendParkingInMail = function(to, name, parking, inTime) {
    const mailOptions = {
        from: '"Parking Suggest" <parking.suggest@gmail.com>', // sender address
        to: to, // list of receivers
        subject: `Parking In Alert: ${parking}`, // Subject line
        text: `Hey ${name.split(' ')[0]},\n\nYou have parked your car in ${parking} at ${inTime}`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};


exports.sendParkingOutMail = function(to, name, parking, inTime, outTime, bill) {
    const mailOptions = {
        from: '"Parking Suggest" <parking.suggest@gmail.com>', // sender address
        to: to, // list of receivers
        subject: `Invoice: Your Parking at ${parking}`, // Subject line
        text: `Hey ${name.split(' ')[0]},\n\nThank You for using Parking Suggest. Here is your Parking Invoice:\n\nParking: ${parking}\nIn Time: ${inTime}\nOut Time:${outTime}\nBilled Amount: INR ${bill}`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};
