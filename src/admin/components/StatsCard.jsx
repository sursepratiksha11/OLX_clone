import React from 'react';
import { motion } from 'framer-motion';

const colorMap = {
  blue:   { bgColor: '#002f34', iconColor: '#23e5db', up: 'text-green-700 bg-green-50', down: 'text-red-700 bg-red-50' },
  green:  { bgColor: '#00a49f', iconColor: '#002f34', up: 'text-green-700 bg-green-50', down: 'text-red-700 bg-red-50' },
  orange: { bgColor: '#ffce32', iconColor: '#002f34', up: 'text-green-700 bg-green-50', down: 'text-red-700 bg-red-50' },
  red:    { bgColor: '#ef4444', iconColor: '#ffffff', up: 'text-green-600 bg-green-50', down: 'text-red-600 bg-red-50' },
  purple: { bgColor: '#8b5cf6', iconColor: '#ffffff', up: 'text-green-600 bg-green-50', down: 'text-red-600 bg-red-50' },
  cyan:   { bgColor: '#06b6d4', iconColor: '#ffffff', up: 'text-green-600 bg-green-50', down: 'text-red-600 bg-red-50' },
};

const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue, index = 0 }) => {
  const c = colorMap[color] || colorMap.blue;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
          style={{ backgroundColor: c.bgColor }}
        >
          <Icon className="text-xl" style={{ color: c.iconColor }} />
        </div>
        {trend && trendValue && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${trend === 'up' ? c.up : c.down}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-slate-800 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </motion.div>
  );
};

export default StatsCard;
