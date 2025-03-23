import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const localizer = momentLocalizer(moment);

function FollowupCalendar() {
  const users = JSON.parse(localStorage.getItem("user"));
  const [category, setCategory] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [dateRange, setDateRange] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    end_date: moment().endOf("month").format("YYYY-MM-DD"),
  });

  const navigate = useNavigate();

  const fetchEvents = async (cat, from, to) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/followups/monthlyCounts",
        {
          params: {
            category: cat,
            from_date: from,
            end_date: to,
            response: "Call Later",
          },
        }
      );

      const followups = res.data.followups;
      setTotalCount(
        followups.reduce((sum, item) => sum + parseInt(item.count), 0)
      );

      const calendarEvents = followups.map((followup) => ({
        title: `Survey: ${followup.count}`,
        start: moment(followup.next_followup_date).toDate(),
        end: moment(followup.next_followup_date).add(1, "hour").toDate(),
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching survey events", error);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    if (selectedCategory) {
      fetchEvents(selectedCategory, dateRange.from_date, dateRange.end_date);
    }
  };

  const handleNavigate = (newDate) => {
    const start = moment(newDate).startOf("month").format("YYYY-MM-DD");
    const end = moment(newDate).endOf("month").format("YYYY-MM-DD");
    setDateRange({ from_date: start, end_date: end });

    if (category) {
      fetchEvents(category, start, end);
    }
  };

  const handleSelectEvent = (event) => {
    const selectedDate = moment(event.start).format("YYYY-MM-DD");
    if (!category) return alert("Please select a category before proceeding.");
    window.open(
      `/EnquiryFollowup/FollowupDateTable/${selectedDate}/${category}`,
      "_blank"
    );
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD");
    if (!category) return alert("Please select a category before proceeding.");
    window.open(
      `/EnquiryFollowup/FollowupDateTable/${selectedDate}/${category}`,
      "_blank"
    );
  };

  return (
    <div>
      <div className="bg-white shadow-lg rounded-2xl p-4 mb-4">
        <div className="mb-4 w-200">
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
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <Calendar
          localizer={localizer}
          events={events}
          onView={() => {}}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onNavigate={handleNavigate}
          defaultView={Views.MONTH}
          style={{ height: 500 }}
        />
      </div>

      <div className="bg-red-600 text-white text-center py-4 mt-6 rounded-lg">
        <p className="text-xl font-bold">Followups - {totalCount}</p>
      </div>
    </div>
  );
}

export default FollowupCalendar;
