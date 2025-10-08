import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, Scan, ArrowLeft, SwitchCamera } from 'lucide-react';
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
  
  // ✅ ADDED: State to track which camera is being used
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // ✅ REVISED LOGIC: Store the stream in state to manage its lifecycle correctly.
  const [stream, setStream] = useState<MediaStream | null>(null);

  // This effect attaches the stream to the video element once both are ready.
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  // ✅ REVISED LOGIC: Clean up the stream when the component unmounts.
  useEffect(() => {
    // The return function from useEffect serves as a cleanup function.
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    stopCamera(); // Ensure camera is off if a file is uploaded
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

    if (event.target) {
      event.target.value = '';
    }
  };

  // ✅ REVISED LOGIC: stopCamera now uses the stream from state.
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setStream(null);
  };

  // ✅ REVISED LOGIC: startCamera now accepts optional camera mode parameter
  const startCamera = async (cameraMode?: 'user' | 'environment') => {
    // Stop any existing stream before starting a new one
    stopCamera(); 
    
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    
    // Use the provided camera mode or the current state
    const mode = cameraMode || facingMode;
    if (cameraMode) {
      setFacingMode(cameraMode);
    }
    
    // 1. Show the video element on the page
    setShowCamera(true);

    // 2. Request camera access with the specified facing mode
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode } 
      });
      setStream(cameraStream); // This will trigger the useEffect to attach and play
    } catch (error) {
      console.error("Camera access denied:", error);
      toast({
        title: "Camera error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
      // Hide the video element if permission fails
      setShowCamera(false); 
    }
  };

  // ✅ ADDED: Function to flip between front and back camera
  const flipCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          setImagePreview(canvas.toDataURL());
          setResult(null);
          
          stopCamera(); // This will now correctly stop the stream from state
          
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
    setResult(null);
    
    try {
      const analysisResult = await analyzeImageWithModel(selectedImage);
      setResult(analysisResult);
      saveAnalysisResult(analysisResult); 
      toast({
        title: "Scan complete",
        description: "Analysis results are ready",
      });
    } catch (error) {
      console.error("Scan Failed in Component:", error);
      toast({
        title: "Scan failed",
        description: "Please try again",
        variant: "destructive",
      });
      setResult(null); 
    } finally {
      setIsScanning(false);
    }
  };

  // ... (No changes to getSeverityColor, getColorIndicator, or the JSX return) ...
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
                    onClick={() => startCamera()}
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
                  muted // Muting is good practice for user experience
                  className="w-full rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-4">
                  <Button onClick={captureImage} className="flex-1">
                    Capture Image
                  </Button>
                  <Button
                    onClick={flipCamera}
                    variant="outline"
                    className="flex-1"
                  >
                    <SwitchCamera className="w-4 h-4 mr-2" />
                    Flip Camera
                  </Button>
                  <Button
                    onClick={stopCamera}
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

        {/* ... Analysis Results Card (no changes) ... */}
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
