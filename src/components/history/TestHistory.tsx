import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Activity, TrendingUp } from 'lucide-react';
import { getAnalysisHistory, AnalysisResult } from '@/utils/model';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TestHistoryProps {
  onBack: () => void;
}

const TestHistory: React.FC<TestHistoryProps> = ({ onBack }) => {
  // ... (no changes to state or helper functions) ...
  const [showAll, setShowAll] = useState(false);
  const history = getAnalysisHistory();

  const getSeverityStyling = (severity: string) => {
    switch (severity) {
      case 'normal':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'high-risk':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'danger':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBorderColor = (severity: string): string => {
    switch (severity) {
      case 'normal':
        return 'border-l-4 border-l-green-500';
      case 'high-risk':
        return 'border-l-4 border-l-orange-400';
      case 'danger':
        return 'border-l-4 border-l-red-500';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  const severityToNumber = (severity: AnalysisResult['severity']): number => {
    switch (severity) {
      case 'normal': return 1;
      case 'high-risk': return 2;
      case 'danger': return 3;
      default: return 0;
    }
  };

  const chartData = history
    .slice(0, 10)
    .reverse()
    .map((result, index) => ({
      name: `Test #${history.length - history.slice(0, 10).length + index + 1}`,
      severityValue: severityToNumber(result.severity),
    }));
    
  const yAxisTickFormatter = (value: number): string => {
    if (value === 1) return 'Normal';
    if (value === 2) return 'High-Risk';
    if (value === 3) return 'Danger';
    return '';
  };

  const displayedHistory = showAll ? history : history.slice(0, 10);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ... (no changes to header) ... */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Test History</h1>
      </div>

      {history.length > 1 && (
         <Card className="mb-6">
           <CardHeader>
             <CardTitle className="flex items-center">
               <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
               Severity Trend (Last {Math.min(10, history.length)} Tests)
             </CardTitle>
           </CardHeader>
           <CardContent>
             <ResponsiveContainer width="100%" height={250}>
               <LineChart
                 data={chartData}
                 // ✅ FIX 1: Increased left margin for Y-axis label spacing
                 margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
               >
                 <CartesianGrid strokeDasharray="3 3" />
                 {/* ✅ FIX 2: Added interval={0} to show all labels */}
                 <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={60} />
                 <YAxis 
                   domain={[0, 4]} 
                   ticks={[1, 2, 3]} 
                   tickFormatter={yAxisTickFormatter}
                 />
                 <Tooltip />
                 <Line
                   type="monotone"
                   dataKey="severityValue"
                   stroke="#3b82f6"
                   strokeWidth={2}
                   dot={{ r: 4 }}
                   activeDot={{ r: 8 }}
                   name="Severity"
                 />
               </LineChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>
      )}

      {/* ... (no changes to the rest of the file) ... */}
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
          {displayedHistory.map((result, index) => (
            <Card key={result.timestamp} className={getSeverityBorderColor(result.severity)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Test #{history.length - (showAll ? index : history.indexOf(result))}
                  </CardTitle>
                  <div className={`px-3 py-1 rounded-full border text-xs ${getSeverityStyling(result.severity)}`}>
                    <span className="font-semibold capitalize">{result.severity.replace('-', ' ')}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Diagnosis:</p>
                    <p className="font-medium text-gray-800">{result.diagnosis}</p>
                  </div>
                   <div>
                    <p className="text-sm text-gray-500">Confidence: <span className="font-medium text-gray-800">{Math.round(result.confidence * 100)}%</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date:</p>
                    <p className="text-gray-800">{new Date(result.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {history.length > 10 && !showAll && (
            <div className="text-center mt-6">
              <Button onClick={() => setShowAll(true)} variant="outline">
                Show All ({history.length}) Tests
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestHistory;
