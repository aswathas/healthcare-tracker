'use client';

import { useState } from 'react';
import { Upload, X, Loader2, FileText, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { showToast } from '@/lib/toast';

interface UploadAnalyzeProps {
  onAnalysisComplete: (analysis: any) => void;
}

export default function UploadAnalyze({ onAnalysisComplete }: UploadAnalyzeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const supabase = createClientComponentClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeFiles = async () => {
    try {
      setAnalyzing(true);
      
      // Upload files to temporary storage
      const uploadPromises = files.map(async (file) => {
        const fileName = `temp/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('reports')
          .upload(fileName, file, {
            onUploadProgress: (progress) => {
              setUploadProgress((progress.loaded / progress.total) * 100);
            }
          });

        if (error) throw error;
        return data.path;
      });

      const uploadedPaths = await Promise.all(uploadPromises);

      // Call Google AI API for analysis
      const response = await fetch('/api/analyze-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: uploadedPaths }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysis = await response.json();
      
      // Clean up temporary files
      const deletePromises = uploadedPaths.map(path => 
        supabase.storage.from('reports').remove([path])
      );
      await Promise.all(deletePromises);

      onAnalysisComplete(analysis);
      setIsOpen(false);
      setFiles([]);
      showToast('success', 'Analysis completed successfully');
    } catch (error) {
      console.error('Analysis error:', error);
      showToast('error', 'Failed to analyze reports');
    } finally {
      setAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
      >
        <Upload className="h-5 w-5" />
        Upload & Analyze
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  AI Report Analysis
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-8
                    ${files.length > 0 ? 'border-purple-200' : 'border-gray-200'}
                    hover:border-purple-400 transition-colors
                  `}
                >
                  <div className="flex flex-col items-center text-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Drop your medical reports here or{' '}
                      <label className="text-purple-600 hover:text-purple-700 cursor-pointer">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports PDF, JPG, JPEG, PNG
                    </p>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {analyzing && (
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Analyzing your reports...
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={analyzeFiles}
                    disabled={files.length === 0 || analyzing}
                    className={`
                      px-4 py-2 rounded-lg flex items-center gap-2
                      ${files.length === 0 || analyzing
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                      }
                    `}
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5" />
                        Analyze with AI
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
