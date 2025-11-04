import { useEffect, useState } from 'react';
import { Thermometer, Droplets, Wind, Gauge, MapPin, Calendar } from 'lucide-react';
import { supabase } from './lib/supabase';
import SensorCard from './components/SensorCard';
import DataChart from './components/DataChart';

interface SensorData {
  id: string;
  temperature: number;
  humidity: number;
  aqi: number;
  location: string;
  timestamp: string;
}

function App() {
  const [latestData, setLatestData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        setLatestData(data[0] as SensorData);
        setHistoricalData(data as SensorData[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: 'from-green-400 to-emerald-500' };
    if (aqi <= 100) return { label: 'Moderate', color: 'from-yellow-400 to-amber-500' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'from-orange-400 to-orange-600' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'from-red-400 to-red-600' };
    return { label: 'Hazardous', color: 'from-purple-400 to-purple-700' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-slate-300 text-lg">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  if (!latestData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-slate-300">
          <Wind className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No sensor data available</p>
        </div>
      </div>
    );
  }

  const aqiStatus = getAQIStatus(latestData.aqi);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Environmental Monitor
          </h1>
          <div className="flex items-center gap-4 text-slate-400 mt-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{latestData.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(latestData.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <SensorCard
            icon={<Thermometer />}
            title="Temperature"
            value={`${latestData.temperature.toFixed(1)}°C`}
            subtitle={`${(latestData.temperature * 9/5 + 32).toFixed(1)}°F`}
            gradient="from-orange-400 to-red-500"
            delay={0}
          />

          <SensorCard
            icon={<Droplets />}
            title="Humidity"
            value={`${latestData.humidity.toFixed(1)}%`}
            subtitle={latestData.humidity > 60 ? 'High' : latestData.humidity < 30 ? 'Low' : 'Comfortable'}
            gradient="from-blue-400 to-cyan-500"
            delay={100}
          />

          <SensorCard
            icon={<Wind />}
            title="Air Quality Index"
            value={latestData.aqi.toString()}
            subtitle={aqiStatus.label}
            gradient={aqiStatus.color}
            delay={200}
          />

          <SensorCard
            icon={<Gauge />}
            title="Overall Status"
            value={aqiStatus.label}
            subtitle="System Active"
            gradient="from-teal-400 to-emerald-500"
            delay={300}
          />
        </div>

        <DataChart data={historicalData} />
      </div>
    </div>
  );
}

export default App;
