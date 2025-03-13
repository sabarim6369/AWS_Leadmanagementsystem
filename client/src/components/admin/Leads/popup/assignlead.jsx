import React from "react";
import { X } from "lucide-react";

const Assignlead = ({ setleadassignpopup, availableTelecallers, assignLeadWithTelecaller }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-2xl shadow-xl h-[60%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={() => setleadassignpopup(false)} className="text-gray-600 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Available Telecallers</h2>

        {/* Table Header */}
        <div className="flex justify-between font-bold p-3 border-b bg-gray-100 rounded-lg shadow-sm">
          <div className="w-1/3 text-center">Email</div>
          <div className="w-1/4 text-center">Pending Leads</div>
          <div className="w-1/4 text-center">Assigned Leads</div>
          <div className="w-1/4 text-center">Action</div>
        </div>

        {/* Table Content */}
        {availableTelecallers.length > 0 ? (
          availableTelecallers.map((telecaller) => (
            <div key={telecaller._id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50">
              <div className="w-1/3 text-center text-gray-700">{telecaller.email}</div>
              <div className="w-1 text-center text-gray-700">{telecaller.pending || 0}</div>
              <div className="w-1/4 text-center text-gray-700">{telecaller.leads.length || 0}</div>
              <button
                className="bg-blue-500 px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-blue-600 transition"
                onClick={() => assignLeadWithTelecaller(telecaller._id)}
              >
                Assign
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No available telecallers</p>
        )}
      </div>
    </div>
  );
};

export default Assignlead;
