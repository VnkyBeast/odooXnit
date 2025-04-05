import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const ReportCrime: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-white">Report a Crime</h1>

      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white">Anonymous Reporting</h2>
            <p className="text-gray-400 text-sm">Toggle this option if you wish to remain anonymous</p>
          </div>
          <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`w-12 h-6 rounded-full transition-colors ${
              isAnonymous ? 'bg-purple-600' : 'bg-gray-600'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                isAnonymous ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-gray-400 text-sm">Your contact information will be visible to authorities</p>
      </div>

      <div className="space-y-6">
        <section className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">1. Reporter Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="For follow-up if needed"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="For confirmation and updates"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">2. Crime Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Type of Crime</label>
              <select className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white">
                <option value="">Select crime type</option>
                <option value="theft">Theft</option>
                <option value="assault">Assault</option>
                <option value="vandalism">Vandalism</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Date of Incident</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Time of Incident</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Location of Crime</label>
              <input
                type="text"
                placeholder="Address / GPS Coordinates / Landmark"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
              />
              <button className="mt-2 text-purple-400 text-sm flex items-center">
                <MapPin size={16} className="mr-1" />
                Use my current location
              </button>
            </div>
          </div>
        </section>

        <section className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">3. Evidence Upload (If Available)</h2>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8">
            <div className="text-center">
              <Upload size={32} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-300 mb-2">Drag & drop files or click to browse</p>
              <p className="text-gray-500 text-sm">Supports: JPG, PNG, MP4, PDF (max 10MB)</p>
              <button className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                Browse Files
              </button>
            </div>
          </div>
        </section>

        <section className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">4. Action Required</h2>
          <div>
            <label className="block text-gray-300 mb-2">Urgency Level</label>
            <div className="grid grid-cols-3 gap-4">
              <button className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20">
                Immediate
              </button>
              <button className="px-4 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20">
                Moderate
              </button>
              <button className="px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg hover:bg-blue-500/20">
                Low
              </button>
            </div>
          </div>
        </section>

        <section className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">5. Submit & Confirmation</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 bg-gray-700 border-gray-600 rounded-sm" />
              <label className="ml-2 text-gray-300">
                I confirm that the information provided is accurate to the best of my knowledge.
              </label>
            </div>
            <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Submit Report
            </button>
            <p className="text-gray-500 text-sm text-center">
              Filing a false report is a criminal offense. All reports are logged and IP addresses are recorded.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportCrime;