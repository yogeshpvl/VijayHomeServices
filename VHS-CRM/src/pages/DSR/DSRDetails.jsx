import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
// import { CalendarIcon, WhatsappIcon } from "lucide-react";

const DSRDetails = () => {
  const [appointmentDate, setAppointmentDate] = useState("2025-02-27");
  const [appointmentTime, setAppointmentTime] = useState("9PM-10PM");
  const [priorityLevel, setPriorityLevel] = useState("");
  const [city, setCity] = useState("Chennai");

  const priorityOptions = [
    { value: "", label: "--select--" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const cityOptions = [
    { value: "Bangalore", label: "Bangalore" },
    { value: "Chennai", label: "Chennai" },
    { value: "Hyderabad", label: "Hyderabad" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Job Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Input
              label="Booking Date & Time"
              value="2025-02-25 10:46 AM"
              disabled
            />
            <Dropdown
              label="Priority Level"
              options={priorityOptions}
              value={priorityLevel}
              onChange={setPriorityLevel}
            />
            <Input
              label="Appointment Date"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
            <Input
              label="Appointment Time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
            <Dropdown
              label="City"
              options={cityOptions}
              value={city}
              onChange={setCity}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Button variant="default">Reschedule Date</Button>
            <Button variant="outline">Update Time</Button>
            <Button variant="outline">Update City</Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Customer Name" value="Gopalakrishnan S" disabled />
            <Input
              label="Contact 1"
              value="9500919034"
              // icon={<WhatsappIcon />}
              disabled
            />
            <Input label="Contact 2" placeholder="Contact 2" />
            <Input label="Email Id" placeholder="Email Id" />
            <Input
              label="Address"
              value="C 43 Golden Garden, Chennai"
              disabled
            />
            <Input label="City" placeholder="City" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Treatment Details</h2>
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Sr</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Cont. Type</th>
                <th className="p-2 text-left">Treatment</th>
                <th className="p-2 text-left">Service Freq.</th>
                <th className="p-2 text-left">Contract Period</th>
                <th className="p-2 text-left">Service Date</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Charges</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">1</td>
                <td className="p-2">Cleaning</td>
                <td className="p-2">One Time</td>
                <td className="p-2">Bathroom Machine Cleaning</td>
                <td className="p-2">1</td>
                <td className="p-2">2025-02-27/00-00-0000</td>
                <td className="p-2">2025-02-27</td>
                <td className="p-2">2 bathrooms deep cleaning</td>
                <td className="p-2">1000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DSRDetails;
