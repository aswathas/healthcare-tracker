'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/useToast';

interface ScanReport {
  id: string;
  name: string;
  type: string;
  date: string;
  url: string;
}

interface ScanReportUploadProps {
  profileId: string;
  onUploadComplete: (report: ScanReport) => void;
}

export default function ScanReportUpload({ profileId, onUploadComplete }: ScanReportUploadProps) {
  const supabase = createClientComponentClient();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('scan-reports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('scan-reports')
        .getPublicUrl(fileName);

      // Save report metadata to database
      const { data: reportData, error: dbError } = await supabase
        .from('scan_reports')
        .insert({
          profile_id: profileId,
          name: file.name,
          type: reportType,
          date: reportDate,
          file_path: fileName,
          url: publicUrl
        })
        .select()
        .single();

      if (dbError) throw dbError;

      showToast('Report uploaded successfully', 'success');
      onUploadComplete(reportData);

      // Reset form
      setReportType('');
      event.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload report', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="scan_type">Report Type</label>
        <select
          id="scan_type"
          name="scan_type"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          aria-label="Type of scan"
          required
        >
          <option value="">Select type</option>
          <option value="X-Ray">X-Ray</option>
          <option value="MRI">MRI</option>
          <option value="CT Scan">CT Scan</option>
          <option value="Ultrasound">Ultrasound</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="scan_date">Report Date</label>
        <input
          id="scan_date"
          type="date"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          aria-label="Date of scan"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Report</label>
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png"
          disabled={uploading || !reportType}
          aria-label="Upload scan report"
          title="Choose a file to upload"
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
      </div>
    </div>
  );
}
