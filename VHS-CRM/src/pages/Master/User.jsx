import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { config } from "../../services/config";
import { Input } from "../../components/ui/Input";
import { FaEdit, FaTrash, FaEye, FaUserShield } from "react-icons/fa";
import { Button } from "../../components/ui/Button";
import { toast } from "react-toastify";

const User = () => {
  const [selected, setSelected] = useState(0);
  const [displayname, setDisplayName] = useState("");
  const [contactno, setContactNo] = useState("");
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [userdata, setUserdata] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    getuser();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilterData(userdata);
    } else {
      const keyword = search.toLowerCase();
      const filtered = userdata.filter(
        (user) =>
          user.displayname?.toLowerCase().includes(keyword) ||
          user.contactno?.toString().includes(keyword) ||
          user.email?.toLowerCase().includes(keyword)
      );
      setFilterData(filtered);
    }
  }, [search, userdata]);

  const getuser = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/auth/users`);
      if (res.status === 200) {
        setUserdata(res.data);
        setFilterData(res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const registerUser = async () => {
    if (!displayname || !contactno || !nameOrEmail) {
      alert("Please fill all fields");
      return;
    }

    if (!data && (!password || !cpassword)) {
      alert("Password is required for new users");
      return;
    }

    if ((password || cpassword) && password !== cpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const payload = {
        displayname,
        contactno,
        email: nameOrEmail,
      };

      // Include password only if provided
      if (password.trim() !== "") {
        payload.password = password;
      }

      if (data) {
        // EDIT MODE
        const res = await axios.put(
          `${config.API_BASE_URL}/auth/users/${data.id}`,
          payload
        );
        if (res.status === 200) {
          alert("User updated successfully");
          clearForm();
          setSelected(0);
          setData(null);
          getuser();
        }
      } else {
        // REGISTER MODE
        const res = await axios.post(
          `${config.API_BASE_URL}/auth/register`,
          payload
        );
        if (res.status === 201) {
          toast.success("✅ User registered successfully");

          clearForm();
          setSelected(0);
          getuser();
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Something went wrong. Please check console.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${config.API_BASE_URL}/auth/users/${id}`);

      toast.success("✅ User deleted successfully");
      getuser();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const clearForm = () => {
    setDisplayName("");
    setContactNo("");
    setNameOrEmail("");
    setPassword("");
    setCPassword("");
    setData(null);
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
          Add User
        </button>
        <button
          className={`px-2 py-1.5 rounded-md ${
            selected === 0
              ? "bg-red-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelected(0)}
        >
          View Users
        </button>
      </div>

      {selected === 0 ? (
        <>
          {/* Search input with smaller width */}
          <input
            type="text"
            placeholder="Search here.."
            className="w-[250px] border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="mt-4 rounded-md overflow-hidden shadow-md">
            <table className="w-full table-fixed border-collapse text-sm bg-white shadow-lg">
              {/* ✅ Correct single <thead> */}
              <thead className="bg-red-800 text-white">
                <tr>
                  <th className="p-2 text-center w-[60px]">Sl No</th>
                  <th className="p-2 text-center">Display Name</th>
                  <th className="p-2 text-center">Contact No</th>
                  <th className="p-2 text-center">Name/Email</th>
                  <th className="p-2 text-center w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterdata?.map((row, index) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2 text-center">{row.displayname}</td>
                    <td className="p-2 text-center">{row.contactno}</td>
                    <td className="p-2 text-center">{row.email}</td>
                    <td className="p-2 text-center">
                      <div className="flex justify-center space-x-4">
                        <button
                          className="text-yellow-500 hover:text-yellow-700"
                          onClick={() => {
                            setSelected(1);
                            setDisplayName(row.displayname || "");
                            setContactNo(row.contactno || "");
                            setNameOrEmail(row.email || "");
                            setPassword("");
                            setCPassword("");
                            setData(row);
                          }}
                          title="Edit"
                        >
                          <FaEdit className="text-lg" />
                        </button>

                        <Link
                          to={`/master/userdetails/${row.id}`}
                          className="text-blue-500 hover:text-blue-700"
                          title="Assign Rights"
                        >
                          <FaUserShield className="text-lg" />
                        </Link>

                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteUser(row.id)}
                          title="Delete"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filterdata.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-3 text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Display Name
              </label>
              <Input
                value={displayname}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Contact No
              </label>
              <Input
                type="number"
                value={contactno}
                onChange={(e) => setContactNo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Name/Email
              </label>
              <Input
                value={nameOrEmail}
                onChange={(e) => setNameOrEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Confirm Password
              </label>
              <Input
                type="password"
                value={cpassword}
                onChange={(e) => setCPassword(e.target.value)}
              />
            </div>
          </form>
          <Button onClick={registerUser} className="mt-4">
            {data ? "Update User" : "Register User"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default User;
