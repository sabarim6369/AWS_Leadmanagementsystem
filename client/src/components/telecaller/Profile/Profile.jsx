import React, { useState, useEffect } from "react";
import Sidebar from "../../../utils/sidebar";
import { FiPhone, FiMail, FiCalendar, FiEdit2, FiLock, FiSettings } from 'react-icons/fi';
import { BiSolidPhoneCall, BiSolidPhone, BiSolidPhoneOff, BiSolidCheckCircle } from 'react-icons/bi';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import useThemeStore from "../../store/themestore";

const telecaller = {
  name: "John Doe",
  username: "johndoe123",
  email: "johndoe@example.com",
  phone: "+1 234 567 890",
  avatar: "https://i.pravatar.cc/150?img=12",
  totalCalls: 157,
  answeredCalls: 80,
  notAnsweredCalls: 50,
  confirmed: 27,
  createdAt: "2023-05-10",
  role: "Senior Telecaller",
  status: "Online",
  performance: 85
};

const TelecallerProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [telecallerid, setTelecallerId] = useState("");
  const [databaseName, setDatabaseName] = useState("");
  const [telecallerdata, settelecallerdata] = useState(null);
  const { isDarkTheme } = useThemeStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenvalidation = jwtDecode(token);
      console.log("Decoded Token:", tokenvalidation);
      setDatabaseName(tokenvalidation.databaseName);
      setTelecallerId(tokenvalidation.telecallerId);
    }
  }, []);

  useEffect(() => {
    if (telecallerid && databaseName) {
      const getdata = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/telecaller/history/${telecallerid}`,
            {
              headers: { database: databaseName },
            }
          );
          console.log("API Response:", response.data.telecallerdetails);
          settelecallerdata(response.data.telecallerdetails);
        } catch (error) {
          console.error("API Error:", error);
        }
      };
      getdata();
    }
  }, [telecallerid, databaseName]);

  if (!telecallerdata) {
    return (
      <div className={`flex h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="lg:w-[250px] w-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <HashLoader color="#36d7b7" size={100} />
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                icon={<BiSolidPhoneCall className="text-2xl" />}
                title="Total Calls"
                value={telecallerdata.totalcalls}
                color="yellow"
              />
              <StatCard 
                icon={<BiSolidPhone className="text-2xl" />}
                title="Answered"
                value={telecallerdata.answeredcalls}
                color="green"
              />
              <StatCard 
                icon={<BiSolidPhoneOff className="text-2xl" />}
                title="Not Answered"
                value={telecallerdata.notansweredcalls}
                color="red"
              />
              <StatCard 
                icon={<BiSolidCheckCircle className="text-2xl" />}
                title="Confirmed"
                value={telecallerdata.confirmed}
                color="blue"
              />
            </div>
            
            <ContactInfo 
              email={telecallerdata.email}
              phone={telecallerdata.number}
              createdAt={telecaller.createdAt}
            />
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-6">
            <div className={`${isDarkTheme ? 'bg-gray-700/50' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <ProgressBar label="Call Success Rate" value={85} />
                <ProgressBar label="Customer Satisfaction" value={92} />
                <ProgressBar label="Response Time" value={78} />
                <ProgressBar label="Follow-up Rate" value={88} />
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4">
            <SettingsOption 
              icon={<FiEdit2 />}
              title="Edit Profile"
              description="Update your personal information"
            />
            <SettingsOption 
              icon={<FiLock />}
              title="Security Settings"
              description="Change your password and security preferences"
            />
            <SettingsOption 
              icon={<FiSettings />}
              title="Preferences"
              description="Customize your application settings"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="lg:w-[250px] w-0">
        <Sidebar />
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className={`min-h-screen ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className={`${isDarkTheme ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl border backdrop-blur-md overflow-hidden`}>
              {/* Header Section */}
              <div className="relative h-48 bg-blue-700">
                <div className="absolute -bottom-20 left-8 flex items-end space-x-6">
                  <div className="relative">
                    <img
                      src={telecaller.avatar}
                      alt="Profile"
                      className={`w-32 h-32 rounded-full border-4 ${isDarkTheme ? 'border-gray-800' : 'border-white'} shadow-xl`}
                    />
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
                  </div>
                  <div className="mb-6">
                  <h1 className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
  {telecallerdata.username}
</h1>
<p className={`${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>
  {telecallerdata.email}
</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold text-white">
                    {telecaller.role}
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="mt-24 px-8">
                <nav className={`flex space-x-6 border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                  <TabButton 
                    active={activeTab === 'overview'} 
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </TabButton>
                  <TabButton 
                    active={activeTab === 'settings'} 
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </TabButton>
                </nav>
              </div>

              {/* Content Section */}
              <div className="p-8">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const { isDarkTheme } = useThemeStore();
  return (
    <div className={`${isDarkTheme ? 'bg-gray-700/50' : 'bg-white'} p-6 rounded-xl shadow-lg hover:transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 bg-${color}-400/20 rounded-lg text-${color}-400`}>
          {icon}
        </div>
        <div>
          <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{title}</p>
          <p className={`text-${color}-400 text-2xl font-bold`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ email, phone, createdAt }) => {
  const { isDarkTheme } = useThemeStore();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InfoCard icon={<FiMail />} label="Email" value={email} />
      <InfoCard icon={<FiPhone />} label="Phone" value={phone} />
      <InfoCard 
        icon={<FiCalendar />} 
        label="Joined" 
        value={new Date(createdAt).toLocaleDateString()} 
      />
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => {
  const { isDarkTheme } = useThemeStore();
  return (
    <div className={`${isDarkTheme ? 'bg-gray-700/50' : 'bg-white'} p-4 rounded-xl shadow-lg`}>
      <div className="flex items-center space-x-3">
        <div className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>{icon}</div>
        <div>
          <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{label}</p>
          <p className={isDarkTheme ? 'text-gray-200' : 'text-gray-900'}>{value}</p>
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value }) => {
  const { isDarkTheme } = useThemeStore();
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{label}</span>
        <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{value}%</span>
      </div>
      <div className={`w-full ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2`}>
        <div
          className="bg-blue-500 rounded-full h-2 transition-all duration-300"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

const SettingsOption = ({ icon, title, description }) => {
  const { isDarkTheme } = useThemeStore();
  return (
    <button className={`w-full ${isDarkTheme ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-white hover:bg-gray-50'} p-4 rounded-xl transition-colors flex items-center space-x-4 shadow-lg`}>
      <div className={`p-2 rounded-lg ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <div className="text-left">
        <h4 className="font-medium">{title}</h4>
        <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      </div>
    </button>
  );
};

const TabButton = ({ children, active, onClick }) => {
  const { isDarkTheme } = useThemeStore();
  return (
    <button
      onClick={onClick}
      className={`py-4 px-2 -mb-px ${
        active
          ? 'border-b-2 border-blue-500 text-blue-500'
          : `${isDarkTheme ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
      }`}
    >
      {children}
    </button>
  );
};

export default TelecallerProfile;