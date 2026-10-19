'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useApp } from '@/lib/context/AppContext';

interface TrendChartProps {
  trendData: Array<{
    date: string;
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
  }>;
  askingPrice?: number;
  unit: string;
  marketName: string;
}

export default function TrendChart({
  trendData,
  askingPrice,
  unit,
  marketName,
}: TrendChartProps) {
  const { language } = useApp();

  if (!trendData || trendData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-stone-50 dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 text-stone-500 text-sm">
        {language === 'kn' ? 'ದತ್ತಾಂಶ ಲಭ್ಯವಿಲ್ಲ' : 'Trend data currently unavailable for this commodity'}
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-stone-800 p-3 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 text-xs">
          <p className="font-semibold text-stone-800 dark:text-stone-200 mb-1">
            {label} ({marketName} Mandi)
          </p>
          <p className="text-emerald-700 dark:text-emerald-400 font-medium">
            {language === 'kn' ? 'ಮಂಡಿ ಸಾಮಾನ್ಯ ದರ:' : 'Modal Mandi Price:'} ₹{data.modalPrice} / {unit}
          </p>
          <p className="text-stone-500">
            {language === 'kn' ? 'ಶ್ರೇಣಿ:' : 'Range:'} ₹{data.minPrice} - ₹{data.maxPrice} / {unit}
          </p>
          {askingPrice && (
            <p className="text-amber-700 dark:text-amber-400 font-medium mt-1 pt-1 border-t border-stone-100 dark:border-stone-700">
              {language === 'kn' ? 'ರೈತರ ದರ:' : 'Farmer Asking:'} ₹{askingPrice} / {unit}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-600 rounded"></span>
            {language === 'kn' ? 'ಮಂಡಿ ದಿನನಿತ್ಯ ದರ' : `${marketName} Mandi Modal`}
          </span>
          {askingPrice && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-600"></span>
              {language === 'kn' ? 'ರೈತರ ಕೇಳಿದ ದರ' : 'Farmer Asking Price'}
            </span>
          )}
        </div>
        <span>{language === 'kn' ? 'ಕಳೆದ 30 ದಿನಗಳು' : 'Last 30 Days (Agmarknet)'}</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.6} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#d1d5db' }}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              domain={['auto', 'auto']}
              unit=""
            />
            <Tooltip content={<CustomTooltip />} />

            {askingPrice && (
              <ReferenceLine
                y={askingPrice}
                stroke="#d97706"
                strokeDasharray="4 4"
                label={{
                  value: `₹${askingPrice}`,
                  fill: '#d97706',
                  fontSize: 11,
                  position: 'right',
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="modalPrice"
              stroke="#2E7D32"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#2E7D32' }}
              activeDot={{ r: 6, fill: '#1b5e20', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
