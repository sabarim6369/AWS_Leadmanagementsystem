import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../../utils/sidebar';
import Toolmodal from './popup/toolmodal';
import Addpopup from './popup/addpopup';
import decodeToken from '../../../utils/jwtdecode';
import axios from 'axios';
import HashLoader from "react-spinners/HashLoader";
import * as XLSX from "xlsx";
import ImportPopup from './popup/importpopup';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Viewmore from './popup/viewmore';
import Assignlead from './popup/assignlead';
import Searchbar from './headersection/searchbar';
import useThemeStore from '../../store/themestore';

const Leads = () => {
  const [opentools, setopentools] = useState(false);
  const [popup, setispopupopen] = useState(false);
  const [loading1, setloading1] = useState(false);
  const [adminid, setadminid] = useState("");
  const [telecallerdata, settelecallerdata] = useState([]);
  const [selectedtelecaller, setselectedtelecaller] = useState(null);
  const options = ["Option 1", "Option 2", "Option 3"];
  const [type, settype] = useState("");
  const [importPopup, setImportPopup] = useState(false);
  const [databasename, setdatabasename] = useState("");
  const [selectedleadforassignment, setselectedtleadforassignment] = useState("");
  const [availabletelecallers, setavailabletelecallers] = useState([]);
  const [leadassignpopup, setleadassignpopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkTheme } = useThemeStore();

  const fetchLeads = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const tokenvalidation = decodeToken(token);
      const databaseName = tokenvalidation.databaseName;
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getallleads`, {
        headers: { "database": databaseName }
      });
      settelecallerdata(response.data.allleads);
      return response.data.allleads;
    } catch (error) {
      console.error("Error fetching leads:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setloading1(true);
      const token = localStorage.getItem("token");
      const tokenvalidation = decodeToken(token);
      const adminId = tokenvalidation.adminId;
      const databaseName = tokenvalidation.databaseName;
      
      setadminid(adminId);
      setdatabasename(databaseName);
      
      await fetchLeads();
      setloading1(false);
    };

    initialize();
  }, [fetchLeads]);

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      const newLeads = await fetchLeads();
      if (newLeads) {
        const currentIds = new Set(telecallerdata.map(lead => lead._id));
        const hasChanges = newLeads.some(lead => !currentIds.has(lead._id)) ||
                          telecallerdata.length !== newLeads.length;
        
        if (hasChanges) {
          settelecallerdata(newLeads);
        }
      }
    }, 60000);

    return () => clearInterval(pollInterval);
  }, [fetchLeads, telecallerdata]);

  const openmodel = () => {
    setopentools(!opentools);
  };

  const add = async (data) => {
    setopentools(!opentools);
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

  const assignleadwithtelecaller = async (telecallerid) => {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/admin/assign-leads`,
            { telecallerId: telecallerid, leadId: selectedleadforassignment },
            { headers: { "database": databasename } }
        );

        toast.success("Lead assigned successfully!");
        await fetchLeads();
        setleadassignpopup(false);
    } catch (error) {
        console.error(error);

        const errorMessage = error.response?.data?.message || "Error assigning lead";

        if (errorMessage.includes("Lead is already assigned")) {
            const confirmReassign = window.confirm(
                `${errorMessage}\nDo you want to reassign this lead to the selected telecaller?`
            );

            if (confirmReassign) {
                try {
                    // Call API again to forcefully reassign the lead
                    await axios.put(
                        `${process.env.REACT_APP_API_URL}/admin/forceassign-leads`,
                        { telecallerId: telecallerid, leadId: selectedleadforassignment },
                        { headers: { "database": databasename } }
                    );

                    toast.success("Lead reassigned successfully!");
                    await fetchLeads();
                    setleadassignpopup(false);
                } catch (reassignError) {
                    console.error(reassignError);
                    toast.error("Error reassigning lead.");
                }
            }
        } else {
            toast.error(errorMessage);
        }
    }
};


  const Assignleads = async (telecallerid) => {
    setleadassignpopup(true);
    setselectedtleadforassignment(telecallerid);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/getalltelecaller`,
        { headers: { "database": databasename } }
      );
      setavailabletelecallers(response.data.alltelecallers);
    } catch (error) {
      toast.error("Failed to fetch telecallers");
      console.error(error);
    }
  };

  const closeModal = () => {
    setselectedtelecaller(null);
  };

  const openImportPopup = () => {
    setopentools(false);
    setImportPopup(true);
  };
const[Status,setStatus]=useState("");

  const filteredLeads = telecallerdata.filter(lead => 
    (lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lead.mobilenumber && lead.mobilenumber.toString().includes(searchQuery)) ||
    lead.email.includes(searchQuery))&&(Status===""|| lead.status === Status)
  );

  const openassignleads = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/assignallleads`,
        {},
        { headers: { "database": databasename } }
      );

      toast.success(response.data.message || "Leads assigned successfully.");
      await fetchLeads();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign leads.");
      console.error("Error:", error);
    }
  };

  const swapleads = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/swapallleads`,
        {},
        { headers: { "database": databasename } }
      );

      toast.success(response.data.message || "Leads swapped successfully.");
      await fetchLeads();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to swap leads.");
      console.error("Error:", error);
    }
  };

  const closeImportPopup = () => {
    setImportPopup(false);
  };

  const handleFileImport = async (allImportedData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/addleads`,
        { leadsData: allImportedData, adminid },
        { headers: { database: databasename } }
      );
  
      if (response.status === 201) {
        if (response.data.totalLeadsInserted === 0) {
          toast.info("No new leads to insert.");
        } else {
          toast.success(`${response.data.totalLeadsInserted} leads uploaded successfully!`);
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
  

  
if (loading1) {
  return (
    <div className={`flex min-h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="hidden lg:block lg:w-[250px]">
        <Sidebar />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <HashLoader color={isDarkTheme ? "#36d7b7" : "#1E293B"} size={100} />
      </div>
    </div>
  );
}

  return (
    <div className={`flex min-h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100' }`}>
      <div className="hidden lg:block lg:w-[250px]">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className={`text-2xl md:text-3xl mb-4 sm:mb-0 ${isDarkTheme ? "text-white" : "text-black"}`}>
  Leads
</h1>
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

        </div>

        <div className="mb-6">
          <Searchbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            Status={Status}
            setStatus={setStatus}   
            isDarkTheme={isDarkTheme} 
            
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {filteredLeads.map((telecaller, index) => (
    <div
      key={telecaller._id || index}
      className={`rounded-2xl shadow-lg p-4 flex flex-col ${
        isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg md:text-xl font-semibold truncate ${isDarkTheme ? "text-white" : "text-black"}`}>
          {telecaller.name}
        </h2>
        <div className="px-2 py-1 bg-green-500 text-xs md:text-sm text-white rounded-lg">
          {telecaller.status}
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-grow">
        <div className={`flex items-center ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
          <i className="fa fa-map-marker-alt text-blue-400 text-lg mr-2"></i>
          <p className="truncate text-sm">{telecaller.address || "No address available"}</p>
        </div>
        <div className={`flex items-center ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
          <i className="fa fa-phone-alt text-blue-400 text-lg mr-2"></i>
          <p className="text-sm">+91 {telecaller.mobilenumber}</p>
        </div>
        <div className={`flex items-center ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
          <i className="fa fa-envelope text-blue-400 text-lg mr-2"></i>
          <p className="text-sm truncate">
            Assigned To: {telecaller.assignedTo?.[0]?.email || "Not Assigned"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
        <button
          className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={() => viewmore(telecaller)}
        >
          View More
        </button>
        <button
          className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={() => Assignleads(telecaller._id)}
        >
          Assign
        </button>
      </div>
    </div>
  ))}
</div>


        {selectedtelecaller && (
          <Viewmore
            selectedtelecaller={selectedtelecaller}
            closeModal={closeModal}
          />
        )}
        {leadassignpopup && (
          <Assignlead
            setleadassignpopup={setleadassignpopup}
            availableTelecallers={availabletelecallers}
            assignLeadWithTelecaller={assignleadwithtelecaller}
          />
        )}

        <ImportPopup
          isOpen={importPopup}
          closePopup={closeImportPopup}
          handleFileImport={handleFileImport}
        />

        <Addpopup
          popup={popup}
          setispopupopen={setispopupopen}
          type={type}
          adminid={adminid}
        />
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Leads;