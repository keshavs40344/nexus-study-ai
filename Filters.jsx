// src/components/Schedule/Filters.jsx
import React, { useState, useMemo } from 'react';
import { Filter, Search, X, ChevronDown, Check } from 'lucide-react';

const ScheduleFilters = ({ filters, onFilterChange, schedule }) => {
  const [showFilters, setShowFilters] = useState(false);

  // Extract filter options from schedule
  const filterOptions = useMemo(() => {
    if (!schedule || schedule.length === 0) {
      return {
        subjects: [],
        types: [],
        priorities: []
      };
    }

    const allTasks = schedule.flatMap(day => day.tasks || []);
    
    const subjects = [...new Set(allTasks.map(task => task.subject).filter(Boolean))];
    const types = [...new Set(allTasks.map(task => task.type).filter(Boolean))];
    const priorities = [...new Set(allTasks.map(task => task.priority).filter(Boolean))];
    
    return {
      subjects,
      types,
      priorities
    };
  }, [schedule]);

  const handleFilterToggle = (filterType, value) => {
    const currentFilters = filters[filterType];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    
    onFilterChange({
      ...filters,
      [filterType]: newFilters
    });
  };

  const clearFilters = () => {
    onFilterChange({
      subjects: [],
      types: [],
      priorities: [],
      status: ['pending', 'completed'],
      searchQuery: ''
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.subjects.length > 0 ||
      filters.types.length > 0 ||
      filters.priorities.length > 0 ||
      filters.searchQuery ||
      filters.status.length !== 2
    );
  };

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white">Filters</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search tasks..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Status Filters */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-3">Status</div>
        <div className="flex gap-2">
          {[
            { id: 'pending', label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' },
            { id: 'completed', label: 'Completed', color: 'bg-green-500/20 text-green-400' }
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => {
                const newStatus = filters.status.includes(status.id)
                  ? filters.status.filter(s => s !== status.id)
                  : [...filters.status, status.id];
                onFilterChange({ ...filters, status: newStatus });
              }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filters.status.includes(status.id)
                  ? status.color
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="space-y-6">
          {/* Subjects Filter */}
          {filterOptions.subjects.length > 0 && (
            <div>
              <div className="text-sm text-gray-400 mb-3">Subjects</div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => handleFilterToggle('subjects', subject)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filters.subjects.includes(subject)
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    {subject}
                    {filters.subjects.includes(subject) && (
                      <Check className="w-3 h-3 inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Task Types Filter */}
          {filterOptions.types.length > 0 && (
            <div>
              <div className="text-sm text-gray-400 mb-3">Task Types</div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.types.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterToggle('types', type)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filters.types.includes(type)
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    {type}
                    {filters.types.includes(type) && (
                      <Check className="w-3 h-3 inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Priorities Filter */}
          {filterOptions.priorities.length > 0 && (
            <div>
              <div className="text-sm text-gray-400 mb-3">Priorities</div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.priorities.map((priority) => {
                  const colorClass = {
                    high: 'bg-red-500/20 text-red-400 border-red-500/30',
                    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }[priority] || 'bg-gray-800 text-gray-400 border-gray-700';

                  return (
                    <button
                      key={priority}
                      onClick={() => handleFilterToggle('priorities', priority)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filters.priorities.includes(priority)
                          ? colorClass
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                      }`}
                    >
                      {priority}
                      {filters.priorities.includes(priority) && (
                        <Check className="w-3 h-3 inline ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">Active Filters</div>
            <button
              onClick={clearFilters}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.subjects.map(subject => (
              <span key={subject} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                Subject: {subject}
              </span>
            ))}
            {filters.types.map(type => (
              <span key={type} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                Type: {type}
              </span>
            ))}
            {filters.priorities.map(priority => (
              <span key={priority} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                Priority: {priority}
              </span>
            ))}
            {filters.status.length !== 2 && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                Status: {filters.status.join(', ')}
              </span>
            )}
            {filters.searchQuery && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                Search: "{filters.searchQuery}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleFilters;
