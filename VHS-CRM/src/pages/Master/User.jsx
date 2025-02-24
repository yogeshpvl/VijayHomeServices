import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const User = () => {
  const [selected, setSelected] = useState(0);
  const [displayname, setDisplayName] = useState("");
  const [contactno, setContactNo] = useState("");
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [userdata, setUserdata] = useState([]);
  const [search, setSearch] = useState("");
  const [filterdata, setFilterData] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    getuser();
  }, []);

  const getuser = async () => {
    let res = await axios.get("/master/getuser");
    if (res.status === 200) {
      setUserdata(res.data?.masteruser);
      setFilterData(res.data?.masteruser);
    }
  };

  return (
    <div className=" bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-end space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            selected === 1
              ? "bg-red-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelected(1)}
        >
          User Add
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            selected === 0
              ? "bg-red-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelected(0)}
        >
          User View
        </button>
      </div>
      {selected === 0 ? (
        <div>
          <input
            type="text"
            placeholder="Search here.."
            className="w-1/4 border bg-white border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mt-4 border rounded-md overflow-hidden shadow-md">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2">Sl No</th>
                  <th className="p-2">Display Name</th>
                  <th className="p-2">Contact No</th>
                  <th className="p-2">Name/Email</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filterdata?.map((row, index) => (
                  <tr key={row._id} className="border-b hover:bg-gray-100">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2">{row.displayname}</td>
                    <td className="p-2">{row.contactno}</td>
                    <td className="p-2">{row.loginnameOrEmail}</td>
                    <td className="p-2 flex space-x-2 justify-center">
                      <button
                        className="text-yellow-500"
                        onClick={() => setData(row)}
                      >
                        ✏️
                      </button>
                      <Link
                        to="/userrights"
                        state={{ data: row }}
                        className="text-blue-500"
                      >
                        ✔
                      </Link>
                      <button
                        className="text-red-500"
                        onClick={() => deleteuser(row._id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-4 bg-gray-100 p-6 rounded-lg shadow-md">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Display Name
              </label>
              <input
                type="text"
                className="w-full border bg-white border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Contact No
              </label>
              <input
                type="text"
                className="w-full border bg-white border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
                onChange={(e) => setContactNo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Name/Email
              </label>
              <input
                type="text"
                className="w-full border bg-white border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
                onChange={(e) => setNameOrEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                className="w-full border bg-white border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border bg-white border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
                onChange={(e) => setCPassword(e.target.value)}
              />
            </div>
            <div className="col-span-2 flex justify-center mt-4">
              <button className="px-4 py-2 bg-red-700 text-white rounded-md shadow-md">
                Save
              </button>
              <button className="ml-4 px-4 py-2 bg-gray-400 text-white rounded-md shadow-md">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default User;
