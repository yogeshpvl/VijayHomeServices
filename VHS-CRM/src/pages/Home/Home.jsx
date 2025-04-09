import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { config } from "../../services/config";

const Home = () => {
  const [customer, setcustomer] = useState(0);
  const [monthservice, setmonthservice] = useState(0);
  const [TodayEnquiry, setTodayEnquiry] = useState(0);
  const [ThisWeekEnquiry, setThisWeekEnquiry] = useState(0);
  const [todayCallLater, setTodayCallLater] = useState(0);
  const [thisWeekCallLater, setThisWeekCallLater] = useState(0);

  const [todayNotInterested, setTodayNotInterested] = useState(0);
  const [thisWeekNotInterested, setThisWeekNotInterested] = useState(0);

  const [todayConfirmed, setTodayConfirmed] = useState(0);
  const [thisWeekConfirmed, setThisWeekConfirmed] = useState(0);

  const [todaySurvey, setTodaySurvey] = useState(0);
  const [thisWeekSurvey, setThisWeekSurvey] = useState(0);

  useEffect(() => {
    fetchcustomer();
    fetchservicemonthly();
    fetchEnquirydata();
    fetchData();
    fetchserviceyearly();
  }, []);

  const fetchcustomer = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/customers/totalCounts`
      );
      setcustomer(response.data.totalItems);
    } catch (error) {
      console.error("Error fetching details", error);
    }
  };

  const fetchservicemonthly = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/bookings/totalCounts`
      );
      setmonthservice(response.data.totalItems);
    } catch (error) {
      console.error("Error fetching details", error);
    }
  };

  const [yearlyservice, setyearlyservice] = useState([]);
  const fetchserviceyearly = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/bookingService/yearlyCounts`
      );
      console.log("yearlyservice", response.data);

      // Mapping the fetched data to the structure needed for the chart
      const mappedData = response.data.monthlyCounts.map((item) => ({
        month: item.month,
        bookings: item.bookings,
      }));

      setyearlyservice(mappedData); // Set the data to the state
    } catch (error) {
      console.error("Error fetching details", error);
    }
  };

  const fetchEnquirydata = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/enquiries/totalCounts`
      );

      // Check if the response contains data and set totalItems
      if (response.data && response.data.todayCount) {
        setTodayEnquiry(response.data.todayCount);
        setThisWeekEnquiry(response.data.weekCount);
      }
    } catch (error) {
      console.error("Error fetching details", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/followups/totalCounts`
      );

      // Check if todayData and weekData exist
      setTodayCallLater(response.data.todayData["Call Later"] || 0);
      setThisWeekCallLater(response.data.weekData["Call Later"] || 0);

      setTodayNotInterested(response.data.todayData["Not Interested"] || 0);
      setThisWeekNotInterested(response.data.weekData["Not Interested"] || 0);

      setTodayConfirmed(response.data.todayData["Confirmed"] || 0);
      setThisWeekConfirmed(response.data.weekData["Confirmed"] || 0);

      setTodaySurvey(response.data.todayData["Survey"] || 0);
      setThisWeekSurvey(response.data.weekData["Survey"] || 0);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const stats = [
    {
      title: "Services Details",
      details: "This Month service booked:",
      value: monthservice,
    },
    {
      title: "Service Reminder Details",
      details: "This Week:",
      value: 1,
      subDetails: "This Month:",
      subValue: 12,
    },
    { title: "Customer", details: "Total Customers:", value: customer },
    {
      title: "Survey Details",
      details: "This Week:",
      value: todaySurvey,
      subDetails: "This Month:",
      subValue: todaySurvey,
    },
    {
      title: "Enquiry",
      details: "Today:",
      value: TodayEnquiry,
      subDetails: "This Week:",
      subValue: ThisWeekEnquiry,
    },

    {
      title: "Call Later",
      details: "Today:",
      value: todayCallLater,
      subDetails: "This Week:",
      subValue: thisWeekCallLater,
    },
    {
      title: "Not Interested",
      details: "Today:",
      value: todayNotInterested,
      subDetails: "This Week:",
      subValue: thisWeekNotInterested,
    },
    {
      title: "Confirmed",
      details: "Today:",
      value: todayConfirmed,
      subDetails: "This Week:",
      subValue: thisWeekConfirmed,
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
          <BarChart data={yearlyservice}>
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
