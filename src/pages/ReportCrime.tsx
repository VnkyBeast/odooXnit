import { useState, useRef } from 'react';
import { Upload, MapPin } from 'lucide-react';
import { ref, push } from 'firebase/database';
import { realtimeDb } from '../firebase/config';

const ReportCrime: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    crimeType: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const crimeRef = ref(realtimeDb, 'crimes');
      const dataToSend = {
        ...formData,
        isAnonymous,
        timestamp: new Date().toISOString(),
      };
      await push(crimeRef, dataToSend);
      alert('Crime report submitted successfully!');
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        crimeType: '',
        date: '',
        time: '',
        location: '',
        description: '',
      });
      setFile(null);
    } catch (error) {
      console.error('Error reporting crime:', error);
      alert('Failed to submit report.');
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-white">Report a Crime</h1>

      {/* Anonymous Toggle */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white">Anonymous Reporting</h2>
            <p className="text-gray-400 text-sm">Toggle this option if you wish to remain anonymous</p>
          </div>
          <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`w-12 h-6 rounded-full transition-colors ${isAnonymous ? 'bg-purple-600' : 'bg-gray-600'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAnonymous ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Reporter Info */}
      {!isAnonymous && (
        <section className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">1. Reporter Information</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
            />
          </div>
        </section>
      )}

      {/* Crime Details */}
      <section className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">2. Crime Details</h2>
        <div className="space-y-4">
          <select
            name="crimeType"
            value={formData.crimeType}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
          >
            <option value="">Select crime type</option>
            <option value="theft">Theft</option>
            <option value="assault">Assault</option>
            <option value="vandalism">Vandalism</option>
            <option value="other">Other</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
            />
          </div>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location / Address / Landmark"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the incident..."
            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white resize-none h-32"
          />
        </div>
      </section>

      {/* File Upload */}
      <section className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">3. Evidence Upload (Optional)</h2>
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer" onClick={handleFileClick}>
          <Upload size={32} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300 mb-2">Click to browse or drag & drop files here</p>
          <p className="text-gray-500 text-sm">Supported: JPG, PNG, MP4, PDF (Max: 10MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            hidden
            accept=".jpg,.png,.jpeg,.mp4,.pdf"
          />
          {file && <p className="text-white mt-2">{file.name}</p>}
        </div>
      </section>

      {/* Submit */}
      <section className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">4. Submit</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input type="checkbox" className="w-4 h-4 bg-gray-700 border-gray-600 rounded-sm" />
            <label className="ml-2 text-gray-300">
              I confirm all the above information is accurate.
            </label>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Submit Report
          </button>
        </div>
      </section>
    </div>
  );
};

export default ReportCrime;
