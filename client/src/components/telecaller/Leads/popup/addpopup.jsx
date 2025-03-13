import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import decodeToken from './../../../../utils/jwtdecode';

const Addpopup = ({ popup, setispopupopen, type,telecallerid }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    City: "",
    adminId: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authentication token missing!");
            return;
        }

        const tokenvalidation = decodeToken(token);
        const adminId = tokenvalidation.adminId;
        const databaseName = tokenvalidation.databaseName;

        if (!adminId) {
            toast.error("Admin ID is missing!");
            return;
        }

        console.log("Admin ID:", adminId, "Database Name:", databaseName);

        const updatedFormData = { ...formData, adminId };

        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/telecaller/addLeadsFromTelecaller`,
            { leadsData: [updatedFormData], adminid: adminId, telecallerId: telecallerid },
            {
                headers: {
                    "database": databaseName
                }
            }
        );

        if (response.status === 201) {
            toast.success(`${response.data.totalLeadsInserted} lead(s) added successfully.`);
            window.location.reload();
            setFormData({
                Name: "",
                Email: "",
                Phone: "",
                City: "",
                adminId: ""
            });

            setTimeout(() => {
                setispopupopen(false);
            }, 2000);
        } else {
            toast.warning(response.data?.message || "Unexpected response.");
        }

    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                toast.warning(error.response.data.message || "Please fill in all required fields.");
            } else if (error.response.status === 409) {
                toast.warning("Lead with this email or phone number already exists.");
            } else {
                toast.error("Error adding lead: " + error.response.data.message);
            }
        } else {
            toast.error("Network error. Please check your connection.");
        }
    }
};
;

  return (
    popup && (
      <div className="fixed inset-0 flex items-center justify-center z-1001">
        <div className="absolute inset-0 bg-black opacity-50 z-1000"></div>

        <div className="absolute md:w-[30%] bg-[#efeff3] z-1001 rounded-lg overflow-hidden">
          <div className="flex justify-end p-4">
            <i
              className="fa fa-times text-2xl cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => setispopupopen(false)}
            ></i>
          </div>
          <form className="add-users-model p-6 space-y-6" onSubmit={handleSubmit}>
            <h1 className="text-center mb-4 text-2xl font-semibold text-black">
              Add Leads
            </h1>

            <div className="flex flex-col items-center space-y-4">
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="p-3 w-[90%] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Name"
              />
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                className="p-3 w-[90%] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Email"
              />
              <input
                type="text"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
                className="p-3 w-[90%] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Phone Number"
              />
              <input
                type="text"
                name="City"
                value={formData.City}
                onChange={handleChange}
                className="p-3 w-[90%] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Address"
              />

              <button
                type="submit"
                className="w-[90%] rounded-lg border border-gray-300 p-3 border-2 border-green-300 hover:border-black hover:border-2 hover:bg-red-400"
              >
                Add
              </button>
            </div>
          </form>
        </div>
        <ToastContainer position="top-center" />
      </div>
    )
  );
};

export default Addpopup;
