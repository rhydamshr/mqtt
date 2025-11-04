import { useMemo } from 'react';

interface SensorData {
  id: string;
  temperature: number;
  humidity: number;
  aqi: number;
  location: string;
  timestamp: string;
}

interface DataChartProps {
  data: SensorData[];
}

export default function DataChart({ data }: DataChartProps) {
  const chartData = useMemo(() => {
    return data.slice(0, 20).reverse();
  }, [data]);

  const getMaxValue = (key: 'temperature' | 'humidity' | 'aqi') => {
    const values = chartData.map(d => d[key]);
    return Math.max(...values, 1);
  };

  const getMinValue = (key: 'temperature' | 'humidity' | 'aqi') => {
    const values = chartData.map(d => d[key]);
    return Math.min(...values, 0);
  };

  const normalize = (value: number, key: 'temperature' | 'humidity' | 'aqi') => {
    const max = getMaxValue(key);
    const min = getMinValue(key);
    return ((value - min) / (max - min)) * 100;
  };

  if (chartData.length === 0) return null;

  return (
    <div className="animate-fade-in-slow">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Historical Data
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Temperature"
          data={chartData}
          valueKey="temperature"
          unit="°C"
          color="from-orange-400 to-red-500"
          normalize={normalize}
        />

        <ChartCard
          title="Humidity"
          data={chartData}
          valueKey="humidity"
          unit="%"
          color="from-blue-400 to-cyan-500"
          normalize={normalize}
        />

        <ChartCard
          title="Air Quality"
          data={chartData}
          valueKey="aqi"
          unit=""
          color="from-green-400 to-emerald-500"
          normalize={normalize}
        />
      </div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  data: SensorData[];
  valueKey: 'temperature' | 'humidity' | 'aqi';
  unit: string;
  color: string;
  normalize: (value: number, key: 'temperature' | 'humidity' | 'aqi') => number;
}

function ChartCard({ title, data, valueKey, unit, color, normalize }: ChartCardProps) {
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const change = previous ? ((latest[valueKey] - previous[valueKey]) / previous[valueKey]) * 100 : 0;

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

      <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold">
              {latest[valueKey].toFixed(1)}{unit}
            </p>
          </div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full ${
            change > 0
              ? 'bg-red-500/20 text-red-400'
              : change < 0
              ? 'bg-green-500/20 text-green-400'
              : 'bg-slate-500/20 text-slate-400'
          }`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </div>
        </div>

        <div className="relative h-32 flex items-end gap-1">
          {data.map((item, index) => {
            const height = normalize(item[valueKey], valueKey);
            return (
              <div
                key={item.id}
                className="flex-1 relative group/bar"
                style={{
                  animation: `grow-bar 0.5s ease-out ${index * 50}ms both`
                }}
              >
                <div
                  className={`w-full bg-gradient-to-t ${color} rounded-t transition-all duration-300 hover:opacity-80`}
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      {item[valueKey].toFixed(1)}{unit}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between text-xs text-slate-500">
          <span>{new Date(data[0].timestamp).toLocaleTimeString()}</span>
          <span>{new Date(data[data.length - 1].timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
