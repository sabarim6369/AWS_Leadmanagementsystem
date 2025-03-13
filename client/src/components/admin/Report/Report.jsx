import Sidebar from "../../../utils/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import decodeToken from "../../../utils/jwtdecode";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";
import useThemeStore from "../../store/themestore";
const Report = () => {
  const [databaseName, setDatabaseName] = useState();
  const [rows, setRows] = useState([]);
  const [leads, setLeads] = useState([]);
  const [openViewModel, setOpenViewModel] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState({});
  const [notes, setNotes] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkTheme, toggleTheme } = useThemeStore();


  useEffect(() => {
    const getLeadData = async () => {
      const token = localStorage.getItem("token");
      const tokenValidation = decodeToken(token);
      const databaseName = tokenValidation.databaseName;
      setDatabaseName(databaseName);

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getallleads`, {
        headers: { "database": databaseName }
      });
      console.log(response.data.allleads);
      setLeads(response.data.allleads);
    };

    getLeadData();
    const array = Array(20).fill(null);
    setRows(array);
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Leads Report", 14, 20);
  
    const tableColumn = ["#", "Name", "Email", "Phone", "Status"];
    const tableRows = leads.map((lead, index) => [
      index + 1,
      lead.name,
      lead.email,
      lead.mobilenumber,
      lead.status,
    ]);
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
  
    doc.save("Leads_Report.pdf");
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Report");
    XLSX.writeFile(workbook, "Leads_Report.xlsx");
  };
  
  const setViewModelOpen = async (leadId) => {
    const leadData = leads.find((lead) => lead._id === leadId);
    console.log(leadData);
    setSelectedLeadData(leadData);
    setOpenViewModel(true);
  };

  const closeViewModel = () => {
    setOpenViewModel(false);
    setSelectedLeadData({});
    setNotes([]);
  };

  return (
    <>
      <div className="flex h-screen">
        <div className="lg:w-[250px] w-0">
          <Sidebar />
        </div>

        <div className={`flex-grow p-6 overflow-auto ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div className="flex justify-end">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-3"
              onClick={generatePDF}
            >
              Generate PDF
            </button>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={generateExcel}
            >
              Generate Excel
            </button>
          </div>

          <div className="p-2 relative w-full max-w-md mb-8">
            <i className={`fa fa-search text-2xl absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkTheme ? 'text-white' : 'text-gray-600'}`}></i>
            <input
              className={`p-3 pl-12 rounded-xl w-full ${
                isDarkTheme 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
            />
          </div>

          <div className={`text-2xl ml-3 mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Caller's List
          </div>

          <div className="overflow-auto max-h-[570px] scrollbar-none">
            <table className={`table-auto w-full text-left mt-5 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <thead className={`sticky top-0 ${isDarkTheme ? 'bg-custom-gray' : 'bg-gray-200'}`}>
                <tr className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-300'}`}>
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Insights</th>
                  <th className="py-2 px-4">Calls</th>
                  <th className="py-2 px-4">Caller Type</th>
                  <th className="py-2 px-4">View Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <tr key={index} className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-300'}`}>
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{lead.name}</td>
                    <td className="py-2 px-4">
                      <div className={`w-2/3 ${isDarkTheme ? 'bg-gray-500' : 'bg-gray-300'} h-2`}>
                        <div className="bg-blue-600 h-full w-[46%]"></div>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className={`pt-1 pb-1 pl-3 pr-3 border-2 border-amber-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-amber-500 shadow-md w-max rounded text-center`}>
                        46%
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className={`pt-1 pb-1 pl-4 pr-4 border-2 border-red-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-red-500 shadow-md w-max rounded text-center`}>
                        {lead.status}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className={`pt-1 pb-1 pl-4 pr-4 border-2 border-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-blue-500 shadow-md w-max rounded text-center cursor-pointer hover:bg-red-700`}
                        onClick={() => {
                          setViewModelOpen(lead._id);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {openViewModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg w-[600px] shadow-xl relative`}>
              <button
                className={`absolute top-4 right-4 ${isDarkTheme ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-500'} text-xl`}
                onClick={closeViewModel}
              >
                ✖
              </button>
              <h2 className={`text-2xl font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Lead Details</h2>
              <div className="mb-6">
                <p className={`text-lg p-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                  <strong>ID:</strong> {selectedLeadData._id}
                </p>
                <p className={`text-lg p-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                  <strong>Name:</strong> {selectedLeadData.name}
                </p>
                <p className={`text-lg p-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                  <strong>Email:</strong> {selectedLeadData.email}
                </p>
                <p className={`text-lg p-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                  <strong>Phone:</strong> {selectedLeadData.mobilenumber}
                </p>
                <h1 className={`text-lg p-1 font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  Notes:
                  <div className="overflow-y-auto max-h-[300px]">
                    {selectedLeadData.notes &&
                      selectedLeadData.notes.map((note, index) => (
                        <div
                          key={index}
                          className={`${isDarkTheme ? 'bg-gray-700' : 'bg-white'} p-4 rounded-lg mb-4 shadow-md border-l-4 border-blue-500`}
                        >
                          <p className={`text-sm font-medium ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>
                            {note.note}
                          </p>
                        </div>
                      ))}
                  </div>
                </h1>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Report;