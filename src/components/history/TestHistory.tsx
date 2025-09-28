import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Activity } from 'lucide-react';
import { getAnalysisHistory } from '@/utils/model';

interface TestHistoryProps {
  onBack: () => void;
}

const TestHistory: React.FC<TestHistoryProps> = ({ onBack }) => {
  const history = getAnalysisHistory();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'mild': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Test History</h1>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Tests Yet</h3>
            <p className="text-gray-500">Take your first kidney test to see results here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Test #{history.length - index}
                  </CardTitle>
                  <div className={`px-3 py-1 rounded-full border ${getSeverityColor(result.severity)}`}>
                    <span className="text-sm font-medium capitalize">{result.severity}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Diagnosis:</p>
                    <p className="font-medium">{result.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Confidence: {Math.round(result.confidence * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date:</p>
                    <p>{new Date(result.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestHistory;