import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Session 1', angle: 145, power: 65 },
  { name: 'Session 2', angle: 152, power: 72 },
  { name: 'Session 3', angle: 148, power: 68 },
  { name: 'Session 4', angle: 160, power: 85 },
  { name: 'Session 5', angle: 165, power: 92 },
];

export const PerformanceDeltaChart: React.FC = () => {
  return (
    <div className="w-full h-40 bg-[#081425] rounded-xl p-4 border border-[#2a3548]/40">
      <div className="w-full h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" vertical={false} opacity={0.2} />
            <XAxis 
              dataKey="name" 
              hide 
            />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#081425', border: '1px solid #2a3548', borderRadius: '8px', fontSize: '10px', fontFamily: 'var(--font-display)' }}
              itemStyle={{ color: '#c3f400' }}
            />
            <Area 
              type="monotone" 
              dataKey="angle" 
              stroke="#c3f400" 
              fillOpacity={0.1} 
              fill="#c3f400" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
