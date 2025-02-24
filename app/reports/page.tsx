'use client';

import { useState } from 'react';
import { LineChart, Calendar, FileText, Download } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  doctor: string;
  category: string;
  status: 'completed' | 'pending' | 'in-progress';
}

const sampleReports: Report[] = [
  {
    id: '1',
    title: 'Blood Test Report',
    type: 'Laboratory',
    date: '2025-02-20',
    doctor: 'Dr. Sarah Johnson',
    category: 'Hematology',
    status: 'completed'
  },
  {
    id: '2',
    title: 'ECG Report',
    type: 'Cardiology',
    date: '2025-02-18',
    doctor: 'Dr. Michael Chen',
    category: 'Cardiac',
    status: 'completed'
  },
  {
    id: '3',
    title: 'X-Ray Chest',
    type: 'Radiology',
    date: '2025-02-15',
    doctor: 'Dr. Emily Wilson',
    category: 'Imaging',
    status: 'completed'
  },
  {
    id: '4',
    title: 'Lipid Profile',
    type: 'Laboratory',
    date: '2025-02-24',
    doctor: 'Dr. Sarah Johnson',
    category: 'Biochemistry',
    status: 'pending'
  }
];

export default function ReportsPage() {
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredReports = filter === 'all' 
    ? sampleReports 
    : sampleReports.filter(report => report.category.toLowerCase() === filter);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
          <p className="text-gray-500">View and manage your medical reports</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Download className="h-5 w-5" />
          Export All
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {['all', 'hematology', 'cardiac', 'imaging', 'biochemistry'].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg ${
              filter === category
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-500">{report.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(report.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-2" />
                {report.doctor}
              </div>
            </div>
            
            <button className="mt-4 w-full bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <LineChart className="h-4 w-4" />
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
