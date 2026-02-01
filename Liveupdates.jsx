// src/components/Dashboard/LiveUpdates.jsx
import React from 'react';
import { Bell, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const LiveUpdates = ({ updates }) => {
  const getUpdateIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'update':
        return <Zap className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white">Live Updates</h3>
        <div className="flex items-center gap-2 text-sm text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live
        </div>
      </div>
      
      <div className="space-y-4">
        {updates.length > 0 ? (
          updates.map((update) => (
            <div key={update.id} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
              <div className="p-1.5 bg-gray-800 rounded">
                {getUpdateIcon(update.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{update.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(update.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">📡</div>
            <p className="text-gray-400">No updates yet</p>
          </div>
        )}
      </div>
      
      {updates.length > 0 && (
        <button className="w-full mt-4 py-2 text-center text-sm text-blue-400 hover:text-blue-300">
          View All Updates
        </button>
      )}
    </div>
  );
};

export default LiveUpdates;
