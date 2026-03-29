import mongoose from 'mongoose'

const Booking = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        address: {type: String, required: true},
        phone: {type: Number, required: true, unique: true},
        service: {type: String, required: true},
        description: {type: String, required: true},
        dateOfService: {type: Date, required: true}
    },
    { collection: 'Bookings'}, {timestamps: true}
)

const BookingModel = mongoose.model('Bookings', Booking)

export default BookingModel