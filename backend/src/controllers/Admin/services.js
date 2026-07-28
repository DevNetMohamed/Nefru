import mongoose from "mongoose";

import { User } from '../../models/user.model.js'
import { Trip } from '../../models/trip.model.js'
import { Booking } from '../../models/booking.model.js'

export const getDashboardData = async () => {
    try {
        const [
            totalUsers,
            totalTours,
            totalBookings,
            paidBookings,
            approved,
            rejected,
            pending,
        ] = await Promise.all([
            User.countDocuments(),
            Trip.countDocuments(),
            Booking.countDocuments(),
            Booking.countDocuments({
                status: "confirmed",
                paymentStatus: "paid",
            }),
            Trip.countDocuments({ status: "approved" }),
            Trip.countDocuments({ status: "rejected" }),
            Trip.countDocuments({ status: "pending" }),
        ]);

        return {
            totalUsers,
            totalTours,
            totalBookings,
            paidBookings,
            toursStatus: {
                approved,
                rejected,
                pending,
            },
        };
    } catch (error) {
        console.error(error);

        return {
            totalUsers: 0,
            totalTours: 0,
            totalBookings: 0,
            paidBookings: 0,
            toursStatus: {
                approved: 0,
                rejected: 0,
                pending: 0,
            },
        };
    }
};