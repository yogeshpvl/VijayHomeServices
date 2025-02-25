import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

const sampleCategories = [
  { name: "Business" },
  { name: "Personal" },
  { name: "Meetings" },
  { name: "Events" },
];

const sampleEvents = [
  {
    title: "DSR",
    start: new Date(2025, 1, 20, 10, 0),
    end: new Date(2025, 1, 20, 12, 0),
  },
  {
    title: "DSR",
    start: new Date(2025, 1, 22, 14, 0),
    end: new Date(2025, 1, 22, 15, 0),
  },
];

function DSRCalendar() {
  const [category, setCategory] = useState("");
  const [totalCount, setTotalCount] = useState(sampleEvents.length);
  const navigate = useNavigate();

  const handleViewChange = () => {};

  const handleRangeChange = () => {};

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

  return (
    <div className="">
      <div className="">
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">DSR Calendar</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="">-select-</option>
                {sampleCategories.map((cat, index) => (
                  <option key={index} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <Calendar
            localizer={localizer}
            events={sampleEvents}
            onView={handleViewChange}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectEvent={handleSelectEvent}
            onRangeChange={handleRangeChange}
            onSelectSlot={handleSelectSlot}
            style={{ height: 500 }}
          />
        </div>

        <div className="bg-red-600 text-white text-center py-4 mt-6 rounded-lg">
          <p className="text-xl font-bold">DSR - {totalCount}</p>
        </div>
      </div>
    </div>
  );
}

export default DSRCalendar;
