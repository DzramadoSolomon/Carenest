import * as tf from '@tensorflow/tfjs';

// --- Interfaces ---

export interface AnalysisResult {
    confidence: number;
    diagnosis: string;
    recommendations: string[];
    severity: 'normal' | 'high-risk' | 'danger';
    timestamp: string;
    colorDetected: 'yellow' | 'orange' | 'green';
    albuminCreatinineRatio: string;
}

// --- Global State ---

// Global model variable to ensure the model is only loaded once.
let model: tf.LayersModel | null = null;

// --- Model Loading ---

/**
 * Load the TensorFlow.js model from the public folder.
 */
export const loadModel = async (): Promise<tf.LayersModel> => {
    if (model) return model;
    
    try {
        // Assuming model.json is directly in the public folder root
        model = await tf.loadLayersModel('/model.json');
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw new Error('Failed to load kidney analysis model. Please ensure model.json is correctly placed in the public folder.');
    }
};

// --- Image Preprocessing ---

/**
 * Preprocess image for model prediction.
 * Resizes, normalizes, and converts the image file into a TensorFlow tensor.
 * Includes crucial cleanup for the temporary Object URL.
 */
const preprocessImage = async (imageFile: File): Promise<tf.Tensor> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // Create temporary URL for the image file
        const objectURL = URL.createObjectURL(imageFile); 

        img.onload = () => {
            // CRITICAL FIX: Revoke the temporary URL immediately after the image is loaded.
            // Prevents browser resource leaks and potential memory issues.
            URL.revokeObjectURL(objectURL);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }
            
            // Resize image to model input size (224x224)
            canvas.width = 224;
            canvas.height = 224;
            ctx.drawImage(img, 0, 0, 224, 224);
            
            // Get image data
            const data = ctx.getImageData(0, 0, 224, 224).data;
            
            // Convert to tensor and normalize
            const tensor = tf.tidy(() => {
                const rgbData = new Float32Array(224 * 224 * 3);
                for (let i = 0; i < data.length; i += 4) {
                    const idx = (i / 4) * 3;
                    rgbData[idx] = data[i] / 255.0;     // R
                    rgbData[idx + 1] = data[i + 1] / 255.0; // G
                    rgbData[idx + 2] = data[i + 2] / 255.0; // B
                }
                
                // Create tensor and normalize: (pixel_value / 127.5) - 1
                const imageTensor = tf.tensor3d(rgbData, [224, 224, 3]);
                const normalized = imageTensor.div(127.5).sub(1);
                
                // Add batch dimension
                return normalized.expandDims(0);
            });
            
            resolve(tensor);
        };
        
        img.onerror = (e) => {
            // Revoke on error too
            URL.revokeObjectURL(objectURL);
            reject(new Error(`Failed to load image from URL: ${e}`));
        };
        
        img.src = objectURL;
    });
};

// --- Prediction Interpretation ---

/**
 * Interpret model prediction results (e.g., probability array) into AnalysisResult object.
 * Maps prediction index to the corresponding severity/recommendations.
 */
const interpretPrediction = (predictions: Float32Array): AnalysisResult => {
    // Find the class with highest confidence
    let maxIndex = 0;
    let maxConfidence = predictions[0];
    
    for (let i = 1; i < predictions.length; i++) {
        if (predictions[i] > maxConfidence) {
            maxConfidence = predictions[i];
            maxIndex = i;
        }
    }
    
    // Assumes model output maps to indices: 0, 1, 2
    const classMapping = [
        { 
            color: 'yellow' as const, 
            severity: 'normal' as const,
            ratio: 'Normal (< 30 mg/g)',
            diagnosis: 'Normal kidney function detected. Your albumin-creatinine ratio appears to be within healthy limits.',
            recommendations: [
                'Continue maintaining a healthy lifestyle',
                'Stay hydrated with 8-10 glasses of water daily',
                'Maintain a balanced diet low in sodium',
                'Schedule regular check-ups with your healthcare provider',
                'Keep monitoring your kidney health annually'
            ]
        },
        { 
            color: 'orange' as const, 
            severity: 'high-risk' as const,
            ratio: 'Elevated (30-300 mg/g)',
            diagnosis: 'Elevated albumin-creatinine ratio detected. This indicates potential kidney stress or early-stage kidney disease.',
            recommendations: [
                'Consult with a nephrologist within 2-4 weeks',
                'Monitor blood pressure regularly',
                'Follow a kidney-friendly diet (low sodium, moderate protein)',
                'Increase water intake and maintain hydration',
                'Avoid NSAIDs and nephrotoxic medications',
                'Schedule follow-up tests in 3-6 months'
            ]
        },
        { 
            color: 'green' as const, 
            severity: 'danger' as const,
            ratio: 'Critical (> 300 mg/g)',
            diagnosis: 'Critical albumin-creatinine ratio detected. This indicates significant kidney damage requiring immediate medical attention.',
            recommendations: [
                'URGENT: Contact a nephrologist immediately',
                'Schedule comprehensive kidney function tests',
                'Monitor blood pressure and blood sugar closely',
                'Follow strict dietary restrictions as advised by doctor',
                'Consider medication adjustment with healthcare provider',
                'Prepare for possible dialysis or transplant evaluation'
            ]
        }
    ];
    
    const result = classMapping[maxIndex] || classMapping[0];
    
    return {
        confidence: maxConfidence,
        diagnosis: result.diagnosis,
        recommendations: result.recommendations,
        severity: result.severity,
        colorDetected: result.color,
        albuminCreatinineRatio: result.ratio,
        timestamp: new Date().toISOString()
    };
};

// --- Main Analysis Function ---

/**
 * Analyze image using the loaded TensorFlow model.
 */
export const analyzeImageWithModel = async (imageFile: File): Promise<AnalysisResult> => {
    let preprocessedImage: tf.Tensor | null = null;
    let prediction: tf.Tensor | null = null;

    try {
        const loadedModel = await loadModel();
        
        // Preprocess image
        preprocessedImage = await preprocessImage(imageFile);
        
        // Make prediction
        prediction = loadedModel.predict(preprocessedImage) as tf.Tensor;
        
        // **FIX**: Use async .data() instead of synchronous .dataSync() to prevent UI freezing (white screen).
        const predictionData = await prediction.data();
        
        // Interpret results
        const result = interpretPrediction(predictionData as Float32Array);
        
        console.log('Prediction results:', {
            confidence: result.confidence,
            color: result.colorDetected,
            severity: result.severity
        });
        
        return result;
        
    } catch (error) {
        console.error('CRITICAL Error during model analysis:', error);
        
        // Fallback to mock data if model fails
        return {
            confidence: 0.0,
            diagnosis: 'Model analysis failed due to an unexpected error. Check the console for details.',
            recommendations: [
                'Check the console for model or preprocessing errors.',
                'Ensure model.json is correctly configured.'
            ],
            severity: 'normal',
            colorDetected: 'yellow',
            albuminCreatinineRatio: 'Unable to determine',
            timestamp: new Date().toISOString()
        };
    } finally {
        // Clean up tensors regardless of success or failure
        if (preprocessedImage) preprocessedImage.dispose();
        if (prediction) prediction.dispose();
    }
};

// --- Local Storage Utilities ---

/**
 * Save analysis result to localStorage
 */
export const saveAnalysisResult = (result: AnalysisResult): void => {
    const existingResults = getAnalysisHistory();
    const updatedResults = [result, ...existingResults];
    localStorage.setItem('carenest_analysis_history', JSON.stringify(updatedResults));
};

/**
 * Get analysis history from localStorage
 */
export const getAnalysisHistory = (): AnalysisResult[] => {
    const stored = localStorage.getItem('carenest_analysis_history');
    return stored ? JSON.parse(stored) : [];
};
