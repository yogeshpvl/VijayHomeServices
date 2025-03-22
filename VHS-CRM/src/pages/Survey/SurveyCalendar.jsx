import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const localizer = momentLocalizer(moment);

function SurveyCalendar() {
  const users = JSON.parse(localStorage.getItem("user"));
  const [category, setCategory] = useState("");
  const [totalCount, setTotalCount] = useState(0); // Total follow-up count
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Handle category change and fetch follow-up data
  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    if (selectedCategory) {
      // Get the first and last day of the current month
      const from_date = moment().startOf("month").format("YYYY-MM-DD");
      const end_date = moment().endOf("month").format("YYYY-MM-DD");

      // Call API with category and date range
      try {
        const res = await axios.get(
          "http://localhost:5000/api/followups/monthlyCounts",
          {
            params: {
              category: selectedCategory,
              from_date,
              end_date,
              response: "Survey",
            },
          }
        );

        console.log("API Response:", res.data);

        // Extract follow-ups from API response
        const followups = res.data.followups;

        // If there are follow-ups, set the events and total count
        if (followups && followups.length > 0) {
          setTotalCount(followups[0].count); // Set the count of follow-ups

          // Convert the follow-ups into events format for the calendar
          const calendarEvents = followups.map((followup) => ({
            title: `Survey: ${followup.count}`, // Title can include the count
            start: moment(followup.next_followup_date).toDate(),
            end: moment(followup.next_followup_date).add(1, "hour").toDate(), // You can adjust the end time as per your needs
          }));

          setEvents(calendarEvents); // Set the events for the calendar
        } else {
          setEvents([]); // No follow-ups found, clear events
          setTotalCount(0); // Reset total count
        }
      } catch (error) {
        console.error("Error fetching survey events", error);
      }
    }
  };

  const handleSelectEvent = (event) => {
    const selectedDate = moment(event.start).format("YYYY-MM-DD");

    if (!category) {
      alert("Please select a category before proceeding.");
      return;
    }

    const url = `/Survey/SurveyList/${selectedDate}/${category}`;
    window.open(url, "_blank");
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD");

    if (!category) {
      alert("Please select a category before proceeding.");
      return;
    }

    const url = `/Survey/SurveyList/${selectedDate}/${category}`;
    window.open(url, "_blank");
  };

  return (
    <div>
      <div>
        <div className="bg-white shadow-lg rounded-2xl p-4 mb-2">
          <form>
            <div>
              <label className="block text-gray-700 mb-2 text-base">
                Category
              </label>
              <select
                className="w-100 text-sm border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
                onChange={handleCategoryChange}
                value={category}
              >
                <option value="">Select Category</option>
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
            events={events} // Set events based on the API response
            onView={() => {}}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            style={{ height: 500 }}
          />
        </div>

        <div className="bg-red-600 text-white text-center py-4 mt-6 rounded-lg">
          <p className="text-xl font-bold">Survey - {totalCount}</p>{" "}
          {/* Show the total count */}
        </div>
      </div>
    </div>
  );
}

export default SurveyCalendar;
