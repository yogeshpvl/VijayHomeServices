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
    let res = await axios.get("http://localhost:5000/api/auth/users");
    if (res.status === 200) {
      setUserdata(res.data);
      setFilterData(res.data);
    }
  };

  const registerUser = async () => {
    if (password !== cpassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        displayname,
        contactno,
        email: nameOrEmail,
        password,
      });
      if (res.status === 201) {
        alert("User registered successfully");
        getuser();
        setSelected(0);
      }
    } catch (error) {
      console.error("Registration failed", error);
      alert("Error registering user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
      alert("User deleted successfully");
      getuser();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-end space-x-4 mb-4 gap-3">
        <button
          className={`px-2 py-1.5 rounded-md ${
            selected === 1
              ? "bg-red-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelected(1)}
        >
          User Add
        </button>
        <button
          className={`px-2 py-1.5 rounded-md ${
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
            className="w-1/4 border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mt-4  rounded-md overflow-hidden shadow-md">
            <table className="w-full border-collapse text-sm bg-white shadow-lg">
              <thead className="bg-red-200 text-gray-700">
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
                  <tr key={row._id} className="hover:bg-gray-00">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2 text-center">{row.displayname}</td>
                    <td className="p-2 text-center">{row.contactno}</td>
                    <td className="p-2 text-center">{row.email}</td>
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
                        onClick={() => deleteUser(row._id)}
                      >
                        🗑
                      </button>
                      <button className="text-green-500">👁️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Display Name
              </label>
              <input
                type="text"
                className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md"
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Contact No
              </label>
              <input
                type="text"
                className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md"
                onChange={(e) => setContactNo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Name/Email
              </label>
              <input
                type="text"
                className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md"
                onChange={(e) => setNameOrEmail(e.target.value)}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default User;
