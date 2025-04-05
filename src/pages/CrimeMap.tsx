import { Plus, Minus, MapPin } from 'lucide-react';

const CrimeMap: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Crime Map Overview</h1>
        <div className="flex space-x-2">
          <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-gray-700">
            <Plus size={20} />
          </button>
          <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-gray-700">
            <Minus size={20} />
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 h-[600px] relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MapPin size={48} className="mx-auto mb-4 text-purple-400" />
            <p>Interactive crime map would render here</p>
            <p className="text-sm">Showing crime data across your neighborhood</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-purple-400 font-medium mb-2">Recent Incidents</h3>
          <p className="text-gray-400 text-sm">Last 7 days</p>
          <p className="text-4xl font-bold text-white mt-2">24</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-purple-400 font-medium mb-2">Safety Rating</h3>
          <p className="text-gray-400 text-sm">Downtown Area</p>
          <p className="text-4xl font-bold text-white mt-2">B+</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-purple-400 font-medium mb-2">Patrol Units</h3>
          <p className="text-gray-400 text-sm">Currently active</p>
          <p className="text-4xl font-bold text-white mt-2">8</p>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;