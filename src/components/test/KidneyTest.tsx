import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, Scan, ArrowLeft } from 'lucide-react';
import { analyzeImageWithModel, saveAnalysisResult, AnalysisResult } from '@/utils/model';
import { toast } from '@/components/ui/use-toast';

interface KidneyTestProps {
  onBack: () => void;
}

const KidneyTest: React.FC<KidneyTestProps> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      toast({
        title: "Image uploaded",
        description: "Image ready for analysis",
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a JPG or PNG image",
        variant: "destructive",
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      toast({
        title: "Camera error",
        description: "Unable to access camera",
        variant: "destructive",
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          setImagePreview(canvas.toDataURL());
          setShowCamera(false);
          setResult(null);
          // Stop camera stream
          const stream = video.srcObject as MediaStream;
          stream?.getTracks().forEach(track => track.stop());
          toast({
            title: "Image captured",
            description: "Image ready for analysis",
          });
        }
      }, 'image/jpeg');
    }
  };

  const startScan = async () => {
    if (!selectedImage) return;
    
    setIsScanning(true);
    try {
      const analysisResult = await analyzeImageWithModel(selectedImage);
      setResult(analysisResult);
      saveAnalysisResult(analysisResult);
      toast({
        title: "Scan complete",
        description: "Analysis results are ready",
      });
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'high-risk': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'danger': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getColorIndicator = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-400';
      case 'orange': return 'bg-orange-400';
      case 'green': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Kidney Health Test</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload or Capture Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showCamera && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png"
                  className="hidden"
                />
                <div className="flex gap-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                    variant="outline"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button
                    onClick={startCamera}
                    className="flex-1"
                    variant="outline"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Use Camera
                  </Button>
                </div>
              </>
            )}

            {showCamera && (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-4">
                  <Button onClick={captureImage} className="flex-1">
                    Capture Image
                  </Button>
                  <Button
                    onClick={() => setShowCamera(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {imagePreview && !showCamera && (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-lg border"
                />
                <Button
                  onClick={startScan}
                  disabled={isScanning}
                  className="w-full"
                >
                  {isScanning ? (
                    <>
                      <Scan className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Start Scan
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!result && !isScanning && (
              <div className="text-center py-8 text-gray-500">
                Upload an image and start scanning to see results
              </div>
            )}
            
            {isScanning && (
              <div className="text-center py-8">
                <Scan className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Analyzing your image...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${getSeverityColor(result.severity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold capitalize text-lg">{result.severity.replace('-', ' ')}</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${getColorIndicator(result.colorDetected)}`}></div>
                      <span className="text-sm font-medium">{result.colorDetected.toUpperCase()}</span>
                    </div>
                  </div>
                  <p className="text-sm opacity-75">{Math.round(result.confidence * 100)}% Confidence</p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-1 text-blue-800">Albumin-Creatinine Ratio:</h3>
                  <p className="text-blue-700 font-medium">{result.albuminCreatinineRatio}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Diagnosis:</h3>
                  <p className="text-gray-700">{result.diagnosis}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Recommendations:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-sm text-gray-500 pt-2 border-t">
                  Analysis completed: {new Date(result.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KidneyTest;