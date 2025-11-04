import { ReactNode } from 'react';

interface SensorCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle: string;
  gradient: string;
  delay: number;
}

export default function SensorCard({ icon, title, value, subtitle, gradient, delay }: SensorCardProps) {
  return (
    <div
      className="relative group animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>

      <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105">
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4`}>
          <div className="w-6 h-6 text-white">
            {icon}
          </div>
        </div>

        <h3 className="text-slate-400 text-sm font-medium mb-2">{title}</h3>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-slate-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
