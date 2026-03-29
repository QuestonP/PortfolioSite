import ServiceNotification from '../client/src/emails/ServiceNotification.jsx';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import BookingModel from './models/booking.js';
import bodyParser from 'body-parser';
import {Resend} from 'resend';
import dotenv from 'dotenv';
import registerBabel from '@babel/register';
registerBabel({
  presets: ['@babel/preset-react'],
});
dotenv.config();



const app = express()

const API_URL="http://localhost:8080/"

const DB_URI = process.env.DB_URI

const EMAIL_API_KEY = process.env.RESEND_API_KEY

const port = process.env.PORT ||  8080

app.use(bodyParser.json());

// Replace 'your_database_url' with your actual MongoDB connection string
mongoose.connect("mongodb+srv://quest:lynnhunt@cluster0.8aif6n0.mongodb.net/BookingsDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

 
app.use(cors()) // bypass cors in development


app.use(express.json()) // tells express were using json
const resend = new Resend("re_JB6ZSzRm_8cQJK7ggMKBq8haCzRR9KUbJ");


app.post('/create-booking', async (req, res) => {
    try {
        const newBooking = new BookingModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            phone: req.body.phone,
            service: req.body.service,
            description: req.body.desc,
            dateOfService: req.body.dateOfService
        });

        const [savedBooking, confirmationEmail ] = Promise.all([
            await newBooking.save(),
            await resend.sendEmail({
                from: "Nicholasconstruction.co@gmail.com",
                to: "questonparker@gmail.com",
                subject: "New Scheduled Booking",
                react: ServiceNotification(
                    props.firstName = req.body.firstName,
                    props.lastName = req.body.lastName,
                    props.phone = req.body.phone,
                    props.address = req.body.address, 
                    props.service = req.body.service,
                    props.desc = req.body.desc,
                    props.dateOfService = req.body.dateOfService
                )
            })

        ])

        res.json({
            savedBooking: savedBooking,
            confirmationEmail: confirmationEmail.data
        });
        console.log('Booking Successful');

        // await resend.sendEmail({
        //     from: "Nicholasconstruction.co@gmail.com",
        //     to: "questonparker@gmail.com",
        //     subject: "New Scheduled Booking",
        //     react: ServiceNotification(
        //         props.firstName = req.body.firstName,
        //         props.lastName = req.body.lastName,
        //         props.phone = req.body.phone,
        //         props.address = req.body.address, 
        //         props.service = req.body.service,
        //         props.desc = req.body.desc,
        //         props.dateOfService = req.body.dateOfService
        //     )
        // });

    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});





// start server 
app.listen(port, () => {
    console.log('Running on port 8080')
})