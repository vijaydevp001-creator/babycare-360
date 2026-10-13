import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Scale, Ruler } from 'lucide-react';

const GrowthChart = ({ data, type = 'weight' }) => {
  // Sort data by date just in case
  const sortedData = [...data].sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));

  const chartData = sortedData.map(record => ({
    date: new Date(record.date || record.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    age: record.ageInMonths,
    [type]: record[type]
  }));

  const isWeight = type === 'weight';
  const label = isWeight ? 'Weight' : 'Height';
  const unit = isWeight ? 'kg' : 'cm';
  const color = isWeight ? '#2563EB' : '#10B981';
  const Icon = isWeight ? Scale : Ruler;

  const CustomTooltip = ({ active, payload, label: tooltipLabel }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#11181C] border border-gray-800 rounded-2xl shadow-2xl px-5 py-4 animate-in fade-in zoom-in duration-200">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{tooltipLabel}</p>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
              <Icon size={14} style={{ color: color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {payload[0].value} <span className="text-xs font-medium text-gray-400">{unit}</span>
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-2 border-[#E5E7EB] rounded-[40px] p-10 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group relative overflow-hidden">
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-[#F9FAFB] border-2 border-[#F3F4F6] group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
            <Icon size={24} strokeWidth={2.5} className="text-[#11181C]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#11181C] tracking-tight">{label} Clinical Progression</h3>
            <p className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.2em] mt-1">
              Biological Trajectory Analysis
            </p>
          </div>
        </div>
        <div className="px-4 py-2 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest leading-none">
            {chartData.length} Data Points
        </div>
      </div>
      
      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 text-center relative z-10">
          <div className="w-20 h-20 bg-[#F9FAFB] border-2 border-[#F3F4F6] rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <TrendingUp size={32} className="text-[#E5E7EB]" />
          </div>
          <p className="text-sm font-black text-[#9CA3AF] tracking-widest uppercase">No clinical data points detected</p>
        </div>
      ) : (
        <div className="h-80 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 900, textAnchor: 'middle' }}
                axisLine={false}
                tickLine={false}
                dy={20}
              />
              <YAxis
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 900 }}
                axisLine={false}
                tickLine={false}
                dx={-15}
              />
              <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }} content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={type}
                stroke={color}
                strokeWidth={4}
                fillOpacity={1}
                fill={`url(#color${type})`}
                animationDuration={2000}
                dot={{ r: 5, fill: color, strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 8, fill: color, strokeWidth: 4, stroke: '#fff', shadow: '0 0 15px rgba(0,0,0,0.1)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default GrowthChart;
