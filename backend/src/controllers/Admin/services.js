import { User } from "../../models/user.model.js";
import { Trip } from "../../models/trip.model.js";
import { Booking } from "../../models/booking.model.js";

const CHART_DAYS = 30;

// Bookings + revenue per day for the last N days (fills missing days with 0).
async function getBookingSeries() {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (CHART_DAYS - 1));

  const daily = await Booking.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        bookings: { $sum: 1 },
        revenue: { $sum: "$totalPrice" },
      },
    },
  ]);

  const byDay = new Map(daily.map((d) => [d._id, d]));
  const labels = [];
  const bookingValues = [];
  const revenueValues = [];

  for (let i = 0; i < CHART_DAYS; i += 1) {
    const day = new Date(since);
    day.setDate(since.getDate() + i);
    const key = day.toISOString().slice(0, 10);
    labels.push(key.slice(5)); // "MM-DD"
    bookingValues.push(byDay.get(key)?.bookings || 0);
    revenueValues.push(Math.round((byDay.get(key)?.revenue || 0) * 100) / 100);
  }

  return { labels, bookingValues, revenueValues };
}

export const getDashboardData = async () => {
  const [
    totalUsers,
    totalTours,
    totalBookings,
    paidBookings,
    topTours,
    approved,
    rejected,
    pending,
    series,
  ] = await Promise.all([
    User.countDocuments(),
    Trip.countDocuments(),
    Booking.countDocuments(),
    Booking.aggregate([
      { $match: { status: "confirmed", paymentStatus: "paid" } },
      { $group: { _id: null, totalPrice: { $sum: "$totalPrice" } } },
    ]),
    Trip.find({})
      .sort({ rating: -1 })
      .limit(10)
      .select("title location rating image createdAt")
      .lean(),
    Trip.countDocuments({ status: "active" }),
    Trip.countDocuments({ status: "rejected" }),
    Trip.countDocuments({ status: "pending" }),
    getBookingSeries(),
  ]);

  return {
    cards: [
      { title: "Total Users", counter: totalUsers },
      { title: "Total Tours", counter: totalTours },
      { title: "Total Bookings", counter: totalBookings },
      { title: "Revenue (USD)", counter: Math.round((paidBookings[0]?.totalPrice || 0) * 100) / 100 },
    ],
    charts: [
      {
        type: "LineChart",
        title: "Bookings Overview",
        data: {
          datasets: [
            { label: "Bookings", values: series.bookingValues },
            { label: "Revenue", values: series.revenueValues },
          ],
          labels: series.labels,
        },
      },
      {
        type: "DoughnutChart",
        title: "Tours by Status",
        data: {
          labels: ["Active", "Pending", "Rejected"],
          values: [approved, pending, rejected],
        },
      },
    ],
    topTours: {
      data: topTours,
      meta: {
        totalRecords: topTours.length,
        headers: ["IMAGE", "NAME", "LOCATION", "RATING", "CREATED AT"],
      },
    },
    pendingApprovals: [],
  };
};
