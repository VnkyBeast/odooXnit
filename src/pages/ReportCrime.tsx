import { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { ref, push } from 'firebase/database';
import { realtimeDb } from '../firebase/config';

const CLOUD_NAME = 'dvfxo6a2s';
const UPLOAD_PRESET = 'crime_reports';

const ReportCrime: React.FC = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [coords, setCoords] = useState({ lat: '', lon: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.email) {
      alert('Please fill in all reporter information.');
      return false;
    }

    if (!formData.crimeType || !formData.date || !formData.time || !formData.location || !formData.description) {
      alert('Please fill in all required crime details.');
      return false;
    }

    if (!agreedToTerms) {
      alert('Please confirm that the information is accurate.');
      return false;
    }

    return true;
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setUploading(true);

    try {
      let imageUrl = '';
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      const reportData = {
        ...formData,
        timestamp: new Date().toISOString(),
        imageUrl: imageUrl || null,
        coordinates: coords.lat && coords.lon ? coords : null,
      };

      await push(ref(realtimeDb, 'crimes'), reportData);

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
      setAgreedToTerms(false);
      setFile(null);
      setCoords({ lat: '', lon: '' });
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the crime report.');
    } finally {
      setUploading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        const address = data.display_name || `${latitude}, ${longitude}`;
        setFormData((prevData) => ({
          ...prevData,
          location: address,
        }));
        setCoords({ lat: latitude.toString(), lon: longitude.toString() });
      } catch (err) {
        console.error('Error fetching location:', err);
        alert('Failed to retrieve location address.');
      }
    }, (err) => {
      console.error(err);
      alert('Unable to retrieve your location');
    });
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (formData.location.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${formData.location}&format=json`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [formData.location]);

  const handleSuggestionSelect = (place: any) => {
    setFormData((prevData) => ({
      ...prevData,
      location: place.display_name,
    }));
    setCoords({ lat: place.lat, lon: place.lon });
    setSuggestions([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Report a Crime</h1>

      {/* Reporter Info */}
      <section className="bg-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl text-white font-semibold">1. Reporter Information</h2>
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
      </section>

      {/* Crime Details */}
      <section className="bg-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl text-white font-semibold">2. Crime Details</h2>
        <select
          name="crimeType"
          value={formData.crimeType}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
        >
          <option value="">Select Crime Type</option>
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
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location / Address / Landmark"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 pr-36"
          />
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition"
          >
            Use Current Location
          </button>

          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white text-black mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto w-full border border-gray-300">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionSelect(place)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the incident..."
          className="w-full h-32 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 resize-none"
        />
      </section>

      {/* File Upload */}
      <section className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl text-white font-semibold mb-4">3. Upload Evidence (Optional)</h2>
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer relative"
          onClick={handleFileClick}
        >
          {!file ? (
            <>
              <Upload size={32} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-300 mb-2">Click to browse or drag & drop files here</p>
              <p className="text-gray-500 text-sm">Supported: JPG, PNG, MP4, PDF (Max: 10MB)</p>
            </>
          ) : (
            <div className="text-white">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Selected evidence"
                  className="mx-auto max-h-48 rounded-md"
                />
              ) : (
                <p className="text-lg font-semibold">{file.name}</p>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            hidden
            accept=".jpg,.jpeg,.png,.mp4,.pdf"
          />
        </div>
      </section>

      {/* Submit */}
      <section className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl text-white font-semibold mb-4">4. Submit</h2>
        <div className="flex items-start mb-4">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 bg-gray-700 border-gray-600 rounded-sm"
            checked={agreedToTerms}
            onChange={() => setAgreedToTerms(!agreedToTerms)}
          />
          <label className="ml-2 text-gray-300 text-sm">
            I confirm that the above information is accurate and truthful to the best of my knowledge.
          </label>
        </div>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {uploading ? 'Submitting...' : 'Submit Report'}
        </button>
      </section>
    </div>
  );
};

export default ReportCrime;
