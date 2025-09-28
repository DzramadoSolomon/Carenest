# Carenest .h5 Model Integration Guide

## Overview
This guide explains how to integrate your trained Keras .h5 model for kidney health analysis into the Carenest application.

## Model Requirements
Your model should be trained to detect three color classifications:
- **Yellow**: Normal kidney health (Albumin-Creatinine Ratio < 30 mg/g)
- **Orange**: High risk (Albumin-Creatinine Ratio 30-300 mg/g)  
- **Green**: Danger - immediate attention needed (Albumin-Creatinine Ratio > 300 mg/g)

## Setup Instructions

### 1. Install Dependencies
First, install the required TensorFlow.js dependency:
```bash
npm install @tensorflow/tfjs
```

### 2. Convert Your Model (If Needed)
If your model is in .h5 format, you may need to convert it to TensorFlow.js format:

```bash
# Install tensorflowjs converter
pip install tensorflowjs

# Convert .h5 to TensorFlow.js format
tensorflowjs_converter --input_format=keras \
                       --output_format=tfjs_layers_model \
                       keras_Model.h5 \
                       ./public/model/
```

### 3. Upload Model Files
Place your model files in the `public` folder:

**Option A: Direct .h5 file (current implementation)**
```
public/
├── keras_Model.h5
└── labels.txt (optional)
```

**Option B: TensorFlow.js format (recommended for better performance)**
```
public/
└── model/
    ├── model.json
    └── model_weights.bin
```

### 4. Update Model Loading (if using TensorFlow.js format)
If you converted to TensorFlow.js format, update the `loadModel` function in `src/utils/model.ts`:

```typescript
// Change this line:
model = await tf.loadLayersModel('/keras_Model.h5');

// To this:
model = await tf.loadLayersModel('/model/model.json');
```

## Model Configuration

### Image Preprocessing
The current implementation matches your Python code:
- Resizes images to 224x224 pixels
- Converts to RGB format
- Normalizes pixel values: `(pixel_value / 127.5) - 1`
- Adds batch dimension for prediction

### Class Mapping
Update the `classMapping` array in `src/utils/model.ts` to match your model's output classes:

```typescript
const classMapping = [
  { color: 'yellow', severity: 'normal', ... },     // Index 0
  { color: 'orange', severity: 'high-risk', ... },  // Index 1  
  { color: 'green', severity: 'danger', ... }       // Index 2
];
```

**Important**: Ensure the array indices match your model's class order.

## Testing Your Model

### 1. Check Browser Console
Open browser developer tools and look for:
- "Model loaded successfully" - confirms model loading
- Prediction results with confidence scores
- Any error messages

### 2. Test Images
Upload test images and verify:
- Color detection matches expected results
- Confidence scores are reasonable (> 0.5 for good predictions)
- Recommendations are appropriate for each severity level

### 3. Fallback Behavior
If model loading fails, the app will:
- Show an error message in results
- Log detailed error information to console
- Continue functioning with mock data

## Troubleshooting

### Common Issues

**Model not loading:**
- Ensure file is in correct location (`public/keras_Model.h5`)
- Check file permissions and size
- Verify model file is not corrupted

**Incorrect predictions:**
- Verify class mapping indices match your model
- Check image preprocessing matches training data
- Ensure model expects 224x224 RGB input

**Performance issues:**
- Consider converting to TensorFlow.js format for faster loading
- Use model quantization to reduce file size
- Implement model caching for repeated use

### Browser Compatibility
TensorFlow.js requires:
- Modern browsers with WebGL support
- Sufficient memory for model loading
- JavaScript enabled

## Model Performance Optimization

### 1. Model Quantization
Reduce model size while maintaining accuracy:
```bash
tensorflowjs_converter --input_format=keras \
                       --output_format=tfjs_layers_model \
                       --quantize_float16 \
                       keras_Model.h5 \
                       ./public/model/
```

### 2. WebGL Backend
TensorFlow.js automatically uses WebGL for GPU acceleration when available.

### 3. Model Caching
The current implementation caches the loaded model in memory to avoid reloading.

## Security Considerations

- Model files are publicly accessible in the `public` folder
- Consider implementing server-side analysis for sensitive applications
- Validate all user inputs before processing
- Implement rate limiting for API calls

## Support

For technical issues:
- Check browser console for detailed error messages
- Verify model file integrity and format
- Test with different image formats (JPG, PNG)
- Contact the development team with specific error logs

## Model Updates

To update your model:
1. Replace the model file in the `public` folder
2. Update class mappings if needed
3. Test thoroughly with known samples
4. Deploy changes to production

Remember to clear browser cache after model updates to ensure the new version loads correctly.