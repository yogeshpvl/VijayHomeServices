import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios"; // Make sure axios is installed
import { useNavigate } from "react-router-dom";
import { config } from "../../services/config";

const localizer = momentLocalizer(moment);

function DSRCalendar() {
  const users = JSON.parse(localStorage.getItem("user"));

  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentRange, setCurrentRange] = useState({
    start: moment().startOf("month").format("YYYY-MM-DD"),
    end: moment().endOf("month").format("YYYY-MM-DD"),
  });

  useEffect(() => {
    fetchEvents(currentRange.start, currentRange.end);
  }, [currentRange]);

  const fetchEvents = async (from_date, end_date) => {
    try {
      // Join cities array into a comma-separated string
      const cityList = users.city.map((user) => user.name).join(",");

      const res = await axios.get(
        `${config.API_BASE_URL}/bookingService/PaymnetsMonthlyCounts`,
        {
          params: {
            city: cityList,
            from_date,
            end_date,
          },
        }
      );

      console.log("API Response:", res.data);

      // Now the response contains a data array with days and service counts
      const dailyCounts = res.data.data; // Access the array of daily counts

      if (dailyCounts && dailyCounts.length > 0) {
        setTotalCount(
          dailyCounts.reduce((acc, day) => acc + day.serviceCount, 0)
        ); // Calculate total count of services

        // Convert the daily counts into events format for the calendar
        const calendarEvents = dailyCounts.map((day) => ({
          title: `PAYMENTS: ${day.serviceCount}`,
          start: moment(day.day).toDate(),
          end: moment(day.day).add(1, "hour").toDate(), // You can adjust the end time as per your needs
        }));

        setEvents(calendarEvents); // Set the events for the calendar
      } else {
        setEvents([]); // No services found, clear events
        setTotalCount(0); // Reset total count
      }
    } catch (error) {
      console.error("Error fetching daily service events", error);
    }
  };

  const handleSelectEvent = (event) => {
    const selectedDate = moment(event.start).format("YYYY-MM-DD");

    const url = `/payment-reports/PRList/${selectedDate}`;
    window.open(url, "_blank");
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD");

    const url = `/payment-reports/PRList/${selectedDate}`;
    window.open(url, "_blank");
  };

  const handleRangeChange = (range) => {
    const start = moment(range.start).format("YYYY-MM-DD");
    const end = moment(range.end).format("YYYY-MM-DD");
    setCurrentRange({ start, end }); // Update the range
  };

  return (
    <div>
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onRangeChange={handleRangeChange}
          style={{ height: 500 }}
        />
      </div>

      <div className="bg-red-600 text-white text-center py-4 mt-6 rounded-lg">
        <p className="text-xl font-bold">DSR - {totalCount}</p>
      </div>
    </div>
  );
}

export default DSRCalendar;
