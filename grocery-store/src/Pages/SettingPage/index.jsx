import React from 'react'
import { useState } from "react"
import { ArrowLeft, User, ShoppingBag, Heart, Settings, CreditCard, Bell, Shield, Globe, LogOut } from "lucide-react"
import { Link } from 'react-router-dom'
import LeftSideBarMenu from '../../components/LeftSideBarMenu'


const SettingPage = () => {

const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showActivity: false,
    dataSharing: false,
  })

  const handleLogout = () => {
    console.log("Logging out...")
    window.location.href = "/"
  }

  return (
     <section className='py-2'>
        <div className="container">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-8">
        <div className="flex flex-col lg:flex-row gap-3 ">
          {/* Left Sidebar Menu */}
          <div className="max-h-[360px]">
             <LeftSideBarMenu/>
          </div>
                   


          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Notification Settings */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {key === "sms" ? "SMS" : key} Notifications
                      </p>
                      <p className="text-sm text-gray-500">Receive {key} notifications about your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications((prev) => ({ ...prev, [key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                {Object.entries(privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {key === "profileVisible"
                          ? "Profile Visibility"
                          : key === "showActivity"
                            ? "Show Activity"
                            : "Data Sharing"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {key === "profileVisible"
                          ? "Make your profile visible to other users"
                          : key === "showActivity"
                            ? "Show your activity to other users"
                            : "Share data with third-party services"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPrivacy((prev) => ({ ...prev, [key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Language & Region */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Language & Region</h3>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        </div>
            </section>
  )
}

export default SettingPage
