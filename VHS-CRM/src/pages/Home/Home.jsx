import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Home = () => {
  const stats = [
    {
      title: "Services Details",
      details: "This Month service booked:",
      value: 2022,
    },
    {
      title: "Service Reminder Details",
      details: "This Week:",
      value: 1,
      subDetails: "This Month:",
      subValue: 12,
    },
    { title: "Customer", details: "Total Customers:", value: 89911 },
    {
      title: "Expiry Details",
      details: "This Week:",
      value: 3,
      subDetails: "This Month:",
      subValue: 25,
    },
    {
      title: "Enquiry",
      details: "Today:",
      value: 145,
      subDetails: "This Week:",
      subValue: 1231,
    },
    // {
    //   title: "Positive",
    //   details: "Today:",
    //   value: 5,
    //   subDetails: "This Week:",
    //   subValue: 5,
    // },
    {
      title: "Call Later",
      details: "Today:",
      value: 7292,
      subDetails: "This Week:",
      subValue: 5,
    },
    {
      title: "Not Interested",
      details: "Today:",
      value: 0,
      subDetails: "This Week:",
      subValue: 5,
    },
    {
      title: "Enquiry Followup",
      details: "Today:",
      value: 0,
      subDetails: "This Week:",
      subValue: 18,
    },
  ];

  // Dummy analytics data for service bookings
  const bookingData = [
    { month: "Jan", bookings: 1800 },
    { month: "Feb", bookings: 2100 },
    { month: "Mar", bookings: 1700 },
    { month: "Apr", bookings: 2200 },
    { month: "May", bookings: 2500 },
    { month: "Jun", bookings: 2000 },
    { month: "Jul", bookings: 2700 },
    { month: "Aug", bookings: 2900 },
    { month: "Sep", bookings: 2300 },
    { month: "Oct", bookings: 2800 },
    { month: "Nov", bookings: 3200 },
    { month: "Dec", bookings: 3500 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-5 border-l-4 border-red-800 transition transform hover:scale-105 hover:shadow-xl"
          >
            <h4 className="text-lg font-semibold text-gray-700">
              {stat.title}
            </h4>
            <p className="text-gray-600">
              {stat.details}{" "}
              <span className="font-bold text-gray-800">{stat.value}</span>
            </p>
            {stat.subDetails && (
              <p className="text-gray-600">
                {stat.subDetails}{" "}
                <span className="font-bold text-gray-800">{stat.subValue}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Booking Analytics */}
      <div className="mt-10 bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Service Bookings Analytics
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="darkred" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Home;
