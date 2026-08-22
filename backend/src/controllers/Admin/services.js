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
            topTours,
            approved,
            rejected,
            pending,
        ] = await Promise.all([
            User.countDocuments(),
            Trip.countDocuments(),
            Booking.countDocuments(),
            Booking.aggregate([
                {
                    $match: {
                        status: "confirmed",
                        paymentStatus: "paid",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalBookings: { $sum: 1 },
                        totalPrice: { $sum: "$totalPrice" },
                    },
                },
            ]),
            Trip.find({})
                .sort({ rating: -1 })
                .limit(10),
            Trip.countDocuments({ status: "approved" }),
            Trip.countDocuments({ status: "rejected" }),
            Trip.countDocuments({ status: "pending" }),
            Booking.find({ status: "completed" })
        ]);
        const { totalPrice } = paidBookings[0]
        console.log(paidBookings)
        return {
            cards:
                [
                    { title: "Total Users", counter: totalUsers, rate: "0%", rateStatus: "NORMAL", duration: "vs Apr 1 - Apr 31" },
                    { title: "Total Tours", counter: totalTours, rate: "0%", rateStatus: "NORMAL", duration: "vs Apr 1 - Apr 31" },
                    { title: "Total Bookings", counter: totalBookings, rate: "0%", rateStatus: "NORMAL", duration: "vs Apr 1 - Apr 31" },
                    { title: "Revenue (USD)", counter: totalPrice, rate: "0%", rateStatus: "NORMAL", duration: "vs Apr 1 - Apr 31" },
                ],
            charts: [
                { type: "LineChart", title: "Bookings Overview", data: {} }, { type: "DoughnutChart", title: "Tours by Status", data: { labels: ["Approved", "Pending", "Rejected"], values: [approved, rejected, pending] } }],
            topTours: {
                data: topTours,
                meta: {
                    totalRecords: topTours.length,
                    headers: ["NAME", "LOCATION", "RATING", "CREATED AT"]
                }
            },
            pendingApprovals: []
        }
    } catch (error) {
        return { cards: [], charts: [], topTours: [] };
    }
};

export const getAccountsStatusData = async () => {
    try {
        const [
            totalTourists,
            totalSuspendedTourists,
            totalGuides,
            totalPendingGuides
        ] = await Promise.all([
            User.countDocuments({ role: "tourist" }),
            User.countDocuments({ role: "tourist", status: "suspended" }),
            User.countDocuments({ role: "guide" }),
            User.countDocuments({ role: "guide", status: "suspended" }),
        ]);
        return {
            cards: [
                { title: "Total Tourists", counter: totalTourists, rate: "0%", rateStatus: "NORMAL", duration: "vs Apr 1 - Apr 31" },
                { title: "Suspended Tourists", counter: totalSuspendedTourists, rate: "0%", rateStatus: "DOWN", duration: "vs Apr 1 - Apr 31" },
                { title: "Total Guides", counter: totalGuides, rate: "0%", rateStatus: "NORMAL", duration: "vs Apr 1 - Apr 31" },
                { title: "Suspended Guides", counter: totalPendingGuides, rate: "0%", rateStatus: "DOWN", duration: "vs Apr 1 - Apr 31" },
            ],
            tabs:[
                {label:"Tourists", value:"tourist"},
                {label:"Guides", value:"guide"},
                {label:"Admins", value:"admin"},
            ],
        }
    } catch (error) {
        console.log(error)
        return { cards: [] }
    }
}