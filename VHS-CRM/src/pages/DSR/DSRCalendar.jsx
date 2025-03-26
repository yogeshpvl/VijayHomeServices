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
  const [category, setCategory] = useState("");
  const [events, setEvents] = useState([]); // Store events here
  const [totalCount, setTotalCount] = useState(0); // Store total count of follow-ups
  const [currentRange, setCurrentRange] = useState({
    start: moment().startOf("month").format("YYYY-MM-DD"),
    end: moment().endOf("month").format("YYYY-MM-DD"),
  }); // Store current month range
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      fetchEvents(category, currentRange.start, currentRange.end); // Fetch events when category or range changes
    }
  }, [category, currentRange]);

  const fetchEvents = async (selectedCategory, from_date, end_date) => {
    try {
      // Join cities array into a comma-separated string
      const cityList = users.city.map((user) => user.name).join(",");

      const res = await axios.get(
        `${config.API_BASE_URL}/bookingService/MonthlyCounts`,
        {
          params: {
            category: selectedCategory,
            city: cityList, // Pass cities as a comma-separated string
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
          title: `DSR: ${day.serviceCount}`,
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

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
  };

  const handleSelectEvent = (event) => {
    const selectedDate = moment(event.start).format("YYYY-MM-DD");

    if (!category) {
      alert("Please select a category before proceeding.");
      return;
    }

    const url = `/DSR/DSRList/${selectedDate}/${category}`;
    window.open(url, "_blank");
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD");

    if (!category) {
      alert("Please select a category before proceeding.");
      return;
    }

    const url = `/DSR/DSRList/${selectedDate}/${category}`;
    window.open(url, "_blank");
  };

  const handleRangeChange = (range) => {
    const start = moment(range.start).format("YYYY-MM-DD");
    const end = moment(range.end).format("YYYY-MM-DD");
    setCurrentRange({ start, end }); // Update the range

    if (category) {
      fetchEvents(category, start, end); // Fetch events when the range changes
    }
  };

  return (
    <div>
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-4">
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              className="w-100 border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
              onChange={handleCategoryChange}
              value={category}
            >
              <option value="">-select-</option>
              {users?.category?.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onRangeChange={handleRangeChange} // Call handleRangeChange when the month changes
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
