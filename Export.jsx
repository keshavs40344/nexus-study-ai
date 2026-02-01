// src/components/Schedule/Export.jsx
import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar as CalendarIcon, Printer, Share2 } from 'lucide-react';

const ScheduleExport = ({ onExport }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportOptions = [
    { id: 'pdf', label: 'PDF Document', icon: <FileText className="w-4 h-4" />, format: 'pdf' },
    { id: 'excel', label: 'Excel Spreadsheet', icon: <FileSpreadsheet className="w-4 h-4" />, format: 'xlsx' },
    { id: 'csv', label: 'CSV File', icon: <FileSpreadsheet className="w-4 h-4" />, format: 'csv' },
    { id: 'ical', label: 'iCal Calendar', icon: <CalendarIcon className="w-4 h-4" />, format: 'ical' },
    { id: 'json', label: 'JSON Data', icon: <FileText className="w-4 h-4" />, format: 'json' }
  ];

  const handleExport = (format) => {
    onExport(format);
    setShowExportMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
      >
        <Download className="w-5 h-5 text-gray-400" />
        <span className="hidden md:inline text-gray-400">Export</span>
      </button>

      {showExportMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowExportMenu(false)}
          />
          
          <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-gray-400 border-b border-gray-800">
                Export Schedule As
              </div>
              
              {exportOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleExport(option.format)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="text-gray-400">
                    {option.icon}
                  </div>
                  <span>{option.label}</span>
                </button>
              ))}
              
              <div className="border-t border-gray-800 mt-2 pt-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                  <Printer className="w-4 h-4" />
                  <span>Print Schedule</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScheduleExport;
