import React from 'react'
import Sidebar from '../../../utils/sidebar'
import Toolmodal from './popup/toolmodal'
import Addpopup from './popup/addpopup'
import { useState, useEffect,useCallback } from 'react'
import decodeToken from '../../../utils/jwtdecode'
import axios from 'axios'
import HashLoader from "react-spinners/HashLoader";
import useThemeStore from "../../store/themestore";
import ImportPopup from './popup/importpopup';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation,useNavigate  } from "react-router-dom";

const Telecallers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [opentools, setopentools] = useState(false);
  const [popup, setispopupopen] = useState(false);
  const[loading1,setloading1]=useState(false);
  const [adminid, setadminid] = useState("");
  const [telecallerdata, settelecallerdata] = useState([]);
  const [selectedtelecaller, setselectedtelecaller] = useState(null);
  const[leads,setassignedleads]=useState([]);
  const [assignedleadmodel,setassignedleadmodel]=useState(false)
  const options = ["Option 1", "Option 2", "Option 3"];
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkTheme } = useThemeStore();
  const [importPopup, setImportPopup] = useState(false);
const[databasename,setdatabasename]=useState();
useEffect(()=>{
  if(location?.state?.openModal){
    add("telecaller");
    navigate(location.pathname, { replace: true, state: {} });
  }
  else if(location?.state?.openimportModal){
    openImportPopup()
    navigate(location.pathname, { replace: true, state: {} });
  }
},[location.state])
  useEffect(() => {
    const fetchalltelecallers = async () => {
      try {
        setloading1(true);
        const token = localStorage.getItem("token");
        const tokenvalidation = decodeToken(token);
        const adminId = tokenvalidation.adminId;
        setadminid(adminId);
        const databaseName = tokenvalidation.databaseName;
        setdatabasename(databaseName)
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/getalltelecaller`,
          { headers: { database: databaseName } }
        );
  
        setloading1(false);
        
        if (response.status === 200 && response.data.alltelecallers) {
          settelecallerdata(response.data.alltelecallers);
        } else {
          settelecallerdata([]); 
        }
      } catch (error) {
        setloading1(false);
        console.error("Error fetching telecallers:", error);
        settelecallerdata([]);  
      }
    };
  
    fetchalltelecallers();
  }, []);
  const openImportPopup = () => {
    // setopentools(false);
    setImportPopup(true);
  };
  const openmodel = () => {
    setopentools(!opentools);
  };
  const openassignleads = async () => {
    // try {
    //   const response = await axios.put(
    //     `${process.env.REACT_APP_API_URL}/admin/assignallleads`,
    //     {},
    //     { headers: { "database": databasename } }
    //   );

    //   toast.success(response.data.message || "Leads assigned successfully.");
    //   await fetchLeads();
    // } catch (error) {
    //   toast.error(error.response?.data?.message || "Failed to assign leads.");
    //   console.error("Error:", error);
    // }
  };
  const [type, settype] = useState("");
  const [getuserdata, setgetuserdata] = useState();
  const closeImportPopup = () => {
    setImportPopup(false);
  };
  const fetchLeads = useCallback(async () => {
    // try {
    //   const token = localStorage.getItem("token");
    //   const tokenvalidation = decodeToken(token);
    //   const databaseName = tokenvalidation.databaseName;
      
    //   const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getallleads`, {
    //     headers: { "database": databaseName }
    //   });
    //   settelecallerdata(response.data.allleads);
    //   return response.data.allleads;
    // } catch (error) {
    //   console.error("Error fetching leads:", error);
    //   return null;
    // }
  }, []);
  const handleFileImport = async (allImportedData) => {
    try {
      console.log("😍😍😍😍😍😍😍😍",allImportedData)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/addimportedtelecaller`,
        { telecallerData: allImportedData, adminid },
        { headers: { database: databasename } }
      );
      console.log("😍😍😍😍😍😍😍😍")

      if (response.status === 201) {
        if (response.data.totalLeadsInserted === 0) {
          toast.info("No new Telecaller to insert.");
        } else {
          toast.success(`${response.data.totalLeadsInserted} Telecallers uploaded successfully!`);
        }
        closeImportPopup();
        await fetchLeads();
      } else {
        toast.error(response.data?.message || "Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error uploading leads:", err);
      
      if (err.response) {
        // Handling specific errors from the server
        if (err.response.status === 400) {
          toast.warning(err.response.data?.message || "Invalid data format.");
        } else if (err.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(err.response.data?.message || "Error uploading leads.");
        }
      } else {
        // Network or unknown error
        toast.error("Network error. Please check your connection.");
      }
    }
  };
  const add = async (data) => {
    console.log(data);
    setopentools(!opentools)
    if (data === "admin") {
      setispopupopen(true);
      settype("admin");
    } else {
      setispopupopen(true);
      settype("telecaller");
    }
  };

  const viewmore = (telecaller) => {
    setselectedtelecaller(telecaller);
  };

  const assignedleads = (telecaller) => {
    setassignedleadmodel(true);
    setassignedleads(telecaller.leads);
  };

  const closeModal = () => {
    setselectedtelecaller(null);
  };
  const swapleads = async () => {
    // try {
    //   const response = await axios.put(
    //     `${process.env.REACT_APP_API_URL}/admin/swapallleads`,
    //     {},
    //     { headers: { "database": databasename } }
    //   );

    //   toast.success(response.data.message || "Leads swapped successfully.");
    //   await fetchLeads();
    // } catch (error) {
    //   toast.error(error.response?.data?.message || "Failed to swap leads.");
    //   console.error("Error:", error);
    // }
  };
  const filteredTelecallers = telecallerdata.filter(telecaller => 
    telecaller.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (telecaller.number && telecaller.number.toString().includes(searchQuery)) ||
    (telecaller.email && telecaller.email.toLowerCase().includes(searchQuery))
  );

  if (loading1) {
    return (
      <div className={`flex h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="lg:w-[250px] w-0">
          <Sidebar />
        </div>
        <div className="flex-grow flex justify-center items-center">
          <HashLoader color="#36d7b7" size={100} />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="lg:w-[250px] w-0">
        <Sidebar />
      </div>
      <div className="flex-grow p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-3xl ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Telecallers</h1>
          <div className="flex items-center gap-4">
  <button
    className={`${isDarkTheme ? "text-white" : "text-black"} cursor-pointer`}
    onClick={openmodel}
  >
    <i className="fa fa-bars text-xl"></i>
  </button>
  <Toolmodal
    opentools={opentools}
    add={add}
    openImportPopup={openImportPopup}
    openassignleads={openassignleads}
    swapleads={swapleads}
  />
</div>
          {/* <button
            className="hidden sm:block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ml-auto"
            onClick={() => setispopupopen(true)}
          >
            Add Telecallers
          </button> */}
          {/* <div
            className={`lg:hidden ${isDarkTheme ? 'text-white' : 'text-gray-900'} ml-auto mr-3 cursor-pointer`}
            onClick={openmodel}
          >
            <i className="fa fa-bars"></i>
          </div> */}
          {/* <div className="">
            <Toolmodal opentools={opentools} add={add} />
          </div> */}
        </div>

        <div className="flex mb-6">
          <div className="p-2 relative w-full max-w-[300px] md:max-w-[500px] md:ml-0">
            <i className={`fa fa-search text-2xl ${isDarkTheme ? 'text-white' : 'text-gray-600'} absolute left-4 top-1/2 transform -translate-y-1/2`}></i>
            <input
              className={`p-2 pl-12 rounded-xl w-full ${
                isDarkTheme 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTelecallers.length > 0 ? (
            filteredTelecallers.map((telecaller, index) => (
              <div
                key={index}
                className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-4 flex flex-col`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    {telecaller.username}
                  </h2>
                  <div className="px-2 py-1 bg-green-500 text-sm text-white rounded-lg">
                    {telecaller.status === "active" ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className={`flex items-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                    <i className="fa fa-map-marker-alt text-blue-400 text-lg mr-2"></i>
                    <p className="truncate max-w-[250px]">
                      {telecaller.address ? telecaller.address : "No address available"}
                    </p>
                  </div>
                  <div className={`flex items-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                    <i className="fa fa-phone-alt text-blue-400 text-lg mr-2"></i>
                    <p>+{telecaller.number}</p>
                  </div>
                  <div className={`flex items-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                    <i className="fa fa-envelope text-blue-400 text-lg mr-2"></i>
                    <p>{telecaller.email}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    className="mt-auto py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 p-3"
                    onClick={() => viewmore(telecaller)}
                  >
                    View More
                  </button>
                  <button
                    className="mt-auto py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 p-2"
                    onClick={() => assignedleads(telecaller)}
                  >
                    Assigned Leads
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={`col-span-1 sm:col-span-2 lg:col-span-4 text-center ${isDarkTheme ? 'text-white' : 'text-gray-900'} text-xl p-6`}>
              No telecallers available.
            </div>
          )}
        </div>

        {selectedtelecaller && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl w-[60%] max-w-3xl shadow-lg`}>
              <h2 className={`text-3xl font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'} mb-4`}>
                {selectedtelecaller.username}
              </h2>
              <div className="space-y-4">
                <p className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Email:</strong> {selectedtelecaller.email}
                </p>
                <p className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Phone:</strong> +{selectedtelecaller.number}
                </p>
                <p className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Address:</strong> {selectedtelecaller.address || "No address available"}
                </p>
                <p className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Status:</strong> {selectedtelecaller.status}
                </p>
                <p className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Role:</strong> {selectedtelecaller.role}
                </p>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={closeModal}
                  className="py-2 px-6 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {assignedleadmodel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl w-[60%] max-w-3xl shadow-lg h-[60%] overflow-y-auto relative scrollbar-none`}>
              <div className="absolute top-4 right-4 cursor-pointer">
                <i
                  className={`fa fa-close text-2xl ${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                  onClick={() => setassignedleadmodel(false)}
                ></i>
              </div>

              <div className={`text-2xl text-center font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                Leads Assigned
              </div>

              <ul className="space-y-3">
                {leads.length > 0 ? (
                  leads.map((lead, index) => (
                    <li key={index} className={`p-3 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                      <p className={`text-lg ${isDarkTheme ? 'text-gray-200' : 'text-gray-900'}`}>
                        <strong>Name:</strong> {lead.name}
                      </p>
                      <p className={`text-lg ${isDarkTheme ? 'text-gray-200' : 'text-gray-900'}`}>
                        <strong>Mobile:</strong> {lead.mobilenumber}
                      </p>
                      <p className={`text-lg ${isDarkTheme ? 'text-gray-200' : 'text-gray-900'}`}>
                        <strong>Status:</strong> {lead.status}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className={`p-3 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                    <p className={`text-lg text-center ${isDarkTheme ? 'text-gray-200' : 'text-gray-900'}`}>
                      No leads Assigned
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
 <ImportPopup
          isOpen={importPopup}
          closePopup={closeImportPopup}
          handleFileImport={handleFileImport}
        />
        <Addpopup
          popup={popup}
          setispopupopen={setispopupopen}
          type={"Telecaller"}
          adminid={adminid}
        />
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Telecallers;