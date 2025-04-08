import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

const sampleEvents = [
  {
    title: "Followups",
    start: new Date(2025, 1, 20, 10, 0),
    end: new Date(2025, 1, 20, 12, 0),
  },
  {
    title: "Followups",
    start: new Date(2025, 1, 22, 14, 0),
    end: new Date(2025, 1, 22, 15, 0),
  },
];

function QuoteCalendar() {
  const users = JSON.parse(localStorage.getItem("user"));
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
        <div className="bg-white shadow-lg rounded-2xl p-4 mb-4">
          {/* <h2 className="text-2xl font-semibold mb-4">DSR Calendar</h2> */}
          <form>
            <div className="mb-4 w-200">
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                className="w-100 border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
                onChange={(e) => setCategory(e.target.value)}
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
          <p className="text-xl font-bold">Quote - {totalCount}</p>
        </div>
      </div>
    </div>
  );
}

export default QuoteCalendar;
