'use client';

interface TestResultsProps {
  tests: Array<{ test_date: string; hemoglobin: number }>;
}

export default function TestResults({ tests }: TestResultsProps) {
  return (
    <div className="space-y-2">
      {tests?.map((test, index) => (
        <div key={index} className="py-2 border-b">
          <p className="font-medium">{new Date(test.test_date).toLocaleDateString()}</p>
          <p>Hb: {test.hemoglobin} g/dL</p>
        </div>
      )) || <p className="text-gray-500">No recent tests found</p>}
    </div>
  );
}
