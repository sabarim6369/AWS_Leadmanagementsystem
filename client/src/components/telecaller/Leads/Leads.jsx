import React, { useState, useEffect, useCallback } from 'react';
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
import Notes from './popup/Notes';
import Leadscard from './leadcards/leads';
import Searchbar from './headersection/searchbar';
import { jwtDecode } from "jwt-decode";
import useThemeStore from "../../store/themestore";

const TelecallersLeads = () => {
  const [opentools, setopentools] = useState(false);
  const [popup, setispopupopen] = useState(false);
  const [loading1, setloading1] = useState(false);
  const [adminid, setadminid] = useState("");
  const [telecallerdata, settelecallerdata] = useState([]);
  const [selectedtelecaller, setselectedtelecaller] = useState(null);
  const [type, settype] = useState("");
  const [leadassignpopup, setleadassignpopup] = useState(false);

  const [importPopup, setImportPopup] = useState(false);
  const [databasename, setdatabasename] = useState("");
  const [selectedleadforassignment, setselectedtleadforassignment] = useState("");
  const [telecallerid, settelecallerid] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [Status, setStatus] = useState("");
  const { isDarkTheme } = useThemeStore();

  const fetchLeads = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const tokenvalidation = jwtDecode(token);
      const databaseName = tokenvalidation.databaseName;
      const userid = tokenvalidation.telecallerId;
      settelecallerid(userid);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/telecaller/leads/${userid}`, {
        headers: { "database": databaseName }
      });
      settelecallerdata(response.data.leads);
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
      if (error.response) {
        toast.error(error.response.data.message || "Error assigning lead");
      } else {
        toast.error("Network error! Please try again.");
      }
    }
  };

  const [leadfornotes, setleadfornotes] = useState();
  const [opennotespopup, setopennotespopup] = useState(false);

  const opennotes = (lead) => {
    setleadfornotes(lead);
    setopennotespopup(true);
  };

  const closeModal = () => {
    setselectedtelecaller(null);
  };

  const openImportPopup = () => {
    setopentools(false);
    setImportPopup(true);
  };

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

  const closeImportPopup = () => {
    setImportPopup(false);
  };

  const handleFileImport = async (allImportedData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/addleads`,
        { leadsData: allImportedData, adminid },
        { headers: { "database": databasename } }
      );

      if (response.status === 201) {
        toast.success("Leads uploaded successfully!");
        closeImportPopup();
        await fetchLeads();
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error uploading leads:", err);
      if (err.response) {
        toast.error(`Error: ${err.response.data.message || "Please try again."}`);
      } else if (err.request) {
        toast.error("Network error: No response received from the server.");
      } else {
        toast.error("Error uploading leads. Please try again.");
      }
    }
  };

  const filteredLeads = telecallerdata.filter(lead =>
    (lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.mobilenumber && lead.mobilenumber.toString().includes(searchQuery)) ||
      lead.email.includes(searchQuery)) && (Status === "" || lead.status === Status)
  );

  if (loading1) {
    return (
      <div className={`flex min-h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="hidden lg:block lg:w-[250px]">
          <Sidebar />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <HashLoader color="#36d7b7" size={100} />
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className={`text-2xl md:text-3xl mb-4 sm:mb-0 ${isDarkTheme ? "text-white" : "text-black"}`}>
        Leads</h1>
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
          <Leadscard
            telecallerdata={filteredLeads}
            viewmore={viewmore}
            opennotes={opennotes}
            databasename={databasename}
            isDarkTheme={isDarkTheme} 

          />
        </div>

        {selectedtelecaller && (
          <Viewmore
            selectedtelecaller={selectedtelecaller}
            closeModal={closeModal}
            databasename={databasename}
            toast={toast}
          />
        )}
        
        {opennotespopup && (
          <Notes
            setopennotespopup={setopennotespopup}
            leadfornotes={leadfornotes}
            databasename={databasename}
            telecallerid={telecallerid}
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
          type={"Telecaller"}
          adminid={adminid}
          telecallerid={telecallerid}
        />

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default TelecallersLeads;