// src/components/ReportCrime.tsx
import { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { ref, push } from 'firebase/database';
import { realtimeDb } from '../firebase/config';

const CLOUD_NAME = 'dvfxo6a2s';
const UPLOAD_PRESET = 'crime_reports';

const ReportCrime: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

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
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.fullName.trim()) newErrors.push('Full Name is required.');
    if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.push('Phone Number must be 10 digits.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.push('Invalid Email format.');
    if (!formData.crimeType) newErrors.push('Crime Type is required.');
    if (!formData.date) newErrors.push('Date is required.');
    if (!formData.time) newErrors.push('Time is required.');
    if (!formData.location.trim()) newErrors.push('Location is required.');
    if (!formData.description.trim()) newErrors.push('Description is required.');
    if (!agreedToTerms) newErrors.push('You must confirm the accuracy of the report.');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: 'POST',
      body: form,
    });

    if (!res.ok) throw new Error('Failed to upload image');

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setUploading(true);

    try {
      const imageUrls: string[] = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        imageUrls.push(url);
      }

      const reportData = {
        ...formData,
        timestamp: new Date().toISOString(),
        imageUrls,
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
      setFiles([]);
      setCoords({ lat: '', lon: '' });
      setErrors([]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit report.');
    } finally {
      setUploading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
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
        setFormData((prev) => ({ ...prev, location: address }));
        setCoords({ lat: latitude.toString(), lon: longitude.toString() });
      } catch (err) {
        console.error(err);
      }
    }, (err) => {
      console.error(err);
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

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [formData.location]);

  const handleSuggestionSelect = (place: any) => {
    setFormData((prev) => ({ ...prev, location: place.display_name }));
    setCoords({ lat: place.lat, lon: place.lon });
    setSuggestions([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Report a Crime</h1>

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md">
          <ul className="list-disc pl-5 text-sm">
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </div>
      )}

      <section className="bg-gray-800 p-6 rounded-xl space-y-4">
        <h2 className="text-xl text-white font-semibold">1. Reporter Information</h2>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange}
          className="input" />
        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange}
          className="input" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
          className="input" />
      </section>

      <section className="bg-gray-800 p-6 rounded-xl space-y-4">
        <h2 className="text-xl text-white font-semibold">2. Crime Details</h2>
        <select name="crimeType" value={formData.crimeType} onChange={handleChange} className="input">
          <option value="">Select Crime Type</option>
          <option value="theft">Theft</option>
          <option value="assault">Assault</option>
          <option value="vandalism">Vandalism</option>
          <option value="other">Other</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="input" />
          <input type="time" name="time" value={formData.time} onChange={handleChange} className="input" />
        </div>
        <div className="relative">
          <input type="text" name="location" placeholder="Location / Address / Landmark" value={formData.location}
            onChange={handleChange} className="input pr-36" />
          <button onClick={handleUseCurrentLocation}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-purple-600 text-white text-sm rounded-md">
            Use Current Location
          </button>
          {suggestions.length > 0 && (
            <ul className="absolute bg-white text-black mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto w-full border">
              {suggestions.map((place, i) => (
                <li key={i} onClick={() => handleSuggestionSelect(place)} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <textarea name="description" placeholder="Describe the incident..." value={formData.description}
          onChange={handleChange} className="input h-32 resize-none" />
      </section>

      <section className="bg-gray-800 p-6 rounded-xl space-y-4">
        <h2 className="text-xl text-white font-semibold">3. Upload Evidence (Optional)</h2>
        <div onClick={handleFileClick} className="border-2 border-dashed border-gray-600 p-8 text-center rounded-lg cursor-pointer">
          {!files.length ? (
            <>
              <Upload size={32} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-300">Click to upload or drag files</p>
              <p className="text-gray-500 text-sm">Supported: JPG, PNG, MP4, PDF</p>
            </>
          ) : (
            <ul className="text-sm text-white">
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}
          <input ref={fileInputRef} type="file" hidden multiple onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.mp4,.pdf" />
        </div>
      </section>

      <section className="bg-gray-800 p-6 rounded-xl space-y-4">
        <h2 className="text-xl text-white font-semibold">4. Submit</h2>
        <div className="flex items-start">
          <input type="checkbox" checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)}
            className="mt-1 w-4 h-4" />
          <label className="ml-2 text-sm text-gray-300">
            I confirm that the information is truthful and accurate.
          </label>
        </div>
        <button onClick={handleSubmit} disabled={uploading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          {uploading ? 'Submitting...' : 'Submit Report'}
        </button>
      </section>
    </div>
  );
};

export default ReportCrime;
