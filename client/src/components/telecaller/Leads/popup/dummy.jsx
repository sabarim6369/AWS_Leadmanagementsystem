import React, { useState } from "react";
import { FiFolder, FiX, FiUpload, FiTrash, FiDownload } from "react-icons/fi";
import axios from "axios";

const Viewmore = ({ selectedtelecaller, closeModal, databasename }) => {
  const [showFiles, setShowFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  const handleDeleteFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDeleteAvailableFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/telecaller/deletefile`, {
        data: { fileId },
        headers: { database: databasename },
      });

      alert("File deleted successfully!");
      selectedtelecaller.files = selectedtelecaller.files.filter(
        (file) => file._id !== fileId
      );
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete the file.");
    }
  };

  const handleDownloadFile = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleSave = async () => {
    if (files.length === 0) {
      alert("Please upload at least one file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("leadId", selectedtelecaller._id);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/telecaller/addfiles`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            database: databasename,
          },
        }
      );

      if (response.data.success) {
        alert("Files uploaded successfully!");
        setFiles([]);
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl w-[60%] max-w-3xl shadow-lg relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          {selectedtelecaller.username}
        </h2>
        <div className="absolute top-4 right-16 cursor-pointer" onClick={() => setShowFiles(!showFiles)}>
          <FiFolder className="text-3xl text-blue-500 hover:text-blue-700 transition duration-300" />
        </div>
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-700 hover:text-red-600 transition duration-300">
          <FiX className="text-3xl" />
        </button>

        {showFiles && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl w-[40%] max-w-2xl h-[80%] shadow-lg relative flex flex-col">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-between">
                Uploaded Files
                <FiX className="cursor-pointer text-2xl" onClick={() => setShowFiles(false)} />
              </h3>
              <div className="space-y-2 flex-grow overflow-auto">
                {selectedtelecaller.files.length > 0 ? (
                  selectedtelecaller.files.map((file) => (
                    <div key={file._id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow">
                      <span className="text-sm truncate w-64">{file.name}</span>
                      <div className="flex gap-3">
                        <FiDownload className="text-green-600 cursor-pointer hover:text-green-800" onClick={() => handleDownloadFile(file.url)} />
                        <FiTrash className="text-red-600 cursor-pointer hover:text-red-800" onClick={() => handleDeleteAvailableFile(file._id)} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-lg text-gray-600">No available files</p>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Upload New Files</h3>
              <div className="space-y-2 overflow-auto">
                {files.length > 0 &&
                  files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow">
                      <span className="text-sm truncate w-64">{file.name}</span>
                      <FiTrash className="text-red-600 cursor-pointer hover:text-red-800" onClick={() => handleDeleteFile(index)} />
                    </div>
                  ))}
              </div>
              <div className="mt-6 flex justify-between">
                <input type="file" multiple className="hidden" id="fileUpload" onChange={handleFileUpload} />
                <label htmlFor="fileUpload" className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300">
                  <FiUpload /> Upload Files
                </label>
                <button onClick={handleSave} disabled={loading} className={`px-6 py-3 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} text-white rounded-full transition duration-300`}>
                  {loading ? "Uploading..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewmore;
