import * as tf from '@tensorflow/tfjs';


export interface AnalysisResult {
        confidence: number;
        diagnosis: string;
        recommendations: string[];
        severity: 'normal' | 'high-risk' | 'danger';
        timestamp: string;
        colorDetected: 'yellow' | 'orange' | 'green';
        albuminCreatinineRatio: string;
      }
      
      // Global model variable
      let model: tf.LayersModel | null = null;
      
      /**
       * Load the TensorFlow.js model
       * Place your keras_Model.h5 file in the public folder
       */
      // model.ts
      
      export const loadModel = async (): Promise<tf.LayersModel> => {
         if (model) return model;
         
         try {
           // PREVIOUS: model = await tf.loadLayersModel('/model/model.json');
          // CORRECTED: Since model.json is in the public root, the path is simpler.
           model = await tf.loadLayersModel('/model.json'); // ✨ CORRECTED PATH
           console.log('Model loaded successfully');
           return model;
         } catch (error) {
           console.error('Error loading model:', error);
           throw new Error('Failed to load kidney analysis model. Please ensure model.json is in the public folder.');
         }
      };
      
      /**
       * Preprocess image for model prediction
       * Matches the preprocessing from your Python code
       */
      const preprocessImage = async (imageFile: File): Promise<tf.Tensor> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            // Create canvas for image processing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }
            
            // Resize to 224x224 (model input size)
            canvas.width = 224;
            canvas.height = 224;
            
            // Draw and resize image
            ctx.drawImage(img, 0, 0, 224, 224);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, 224, 224);
            const data = imageData.data;
            
            // Convert to tensor and normalize (matching Python code)
            const tensor = tf.tidy(() => {
              // Convert RGBA to RGB and normalize
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
          
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = URL.createObjectURL(imageFile);
        });
      };
      
      /**
       * Interpret model prediction results
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
        
        // Map predictions to your color classifications
        // Adjust these mappings based on your model's class order
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
      
      /**
       * Analyze image using the loaded TensorFlow model
       * This function replicates your Python code logic in JavaScript
       */
      export const analyzeImageWithModel = async (imageFile: File): Promise<AnalysisResult> => {
        try {
          // Load model if not already loaded
          const loadedModel = await loadModel();
          
          // Preprocess image
          const preprocessedImage = await preprocessImage(imageFile);
          
          // Make prediction
          const prediction = loadedModel.predict(preprocessedImage) as tf.Tensor;
          const predictionData = await prediction.data();
          
          // Clean up tensors
          preprocessedImage.dispose();
          prediction.dispose();
          
          // Interpret results
          const result = interpretPrediction(predictionData as Float32Array);
          
          console.log('Prediction results:', {
            confidence: result.confidence,
            color: result.colorDetected,
            severity: result.severity
          });
          
          return result;
          
        } catch (error) {
          console.error('Error during model analysis:', error);
          
          // Fallback to mock data if model fails
          return {
            confidence: 0.0,
            diagnosis: 'Model analysis failed. Please ensure the keras_Model.h5 file is properly uploaded to the public folder.',
            recommendations: [
              'Check that keras_Model.h5 is in the public folder',
              'Refresh the page and try again',
              'Contact support if the issue persists'
            ],
            severity: 'normal',
            colorDetected: 'yellow',
            albuminCreatinineRatio: 'Unable to determine',
            timestamp: new Date().toISOString()
          };
        }
      };
      
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
