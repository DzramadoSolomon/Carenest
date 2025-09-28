# Carenest - AI-Powered Kidney Health Monitoring

Carenest is a modern web application that uses artificial intelligence to analyze kidney health through image-based albumin-creatinine ratio detection. The application provides instant analysis, personalized recommendations, and comprehensive health tracking.

## 🚀 Features

- **AI-Powered Analysis**: Upload images for instant kidney health assessment using trained machine learning models
- **Color-Based Detection**: Analyzes yellow (normal), orange (high-risk), and green (danger) indicators
- **Mobile-Optimized**: Fully responsive design with touch-friendly interface
- **Real-Time Camera**: Capture images directly from device camera
- **Health Dashboard**: Track analysis history and health trends
- **Expert Consultation**: Connect with healthcare professionals
- **Secure Authentication**: User accounts with secure login/signup
- **Contact Integration**: Direct email contact with development team

## 🧠 AI Model Integration

Carenest supports integration with custom-trained Keras (.h5) models for kidney health analysis. The system:

- Processes images at 224x224 resolution
- Normalizes pixel values using `(pixel_value / 127.5) - 1`
- Detects three classification levels based on albumin-creatinine ratios
- Provides confidence scores and detailed recommendations
- Falls back gracefully if model loading fails

### Model Setup
1. Place your `keras_Model.h5` file in the `public/` folder
2. Install dependencies: `npm install @tensorflow/tfjs`
3. Update class mappings in `src/utils/model.ts` if needed
4. See `MODEL_INTEGRATION_GUIDE.md` for detailed instructions

## 📱 Mobile Optimization

The application is fully optimized for mobile devices with:
- Responsive grid layouts that adapt to screen size
- Touch-friendly buttons and navigation
- Collapsible sidebar for mobile navigation
- Optimized image capture and upload
- Mobile-first CSS design patterns

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with WebGL support (for AI model)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/carenest.git
cd carenest

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Configure Supabase credentials (optional)
3. Add any additional environment variables

## 🔧 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI/ML**: TensorFlow.js for browser-based model inference
- **UI Components**: Radix UI, Shadcn/ui
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Authentication**: Supabase (optional)
- **Styling**: Tailwind CSS with custom components

## 📊 How the AI Chatbot Works

The integrated AI chatbot provides instant support through:

### 1. Intent Recognition
- Analyzes user queries to understand intent
- Categorizes questions into health, technical, or general topics
- Routes complex queries to appropriate response systems

### 2. Knowledge Base Integration
- Accesses comprehensive kidney health information
- Provides evidence-based medical guidance
- References latest research and clinical guidelines

### 3. Contextual Responses
- Maintains conversation context for follow-up questions
- Personalizes responses based on user history
- Escalates complex cases to human experts

### 4. Supported Topics
- Kidney health basics and prevention
- Understanding test results and recommendations
- Technical support for app features
- General health and wellness guidance

## 📧 Contact & Support

### Development Team
- **Solomon Kennedy Dzramado**: solomonkendzramado@gmail.com
- **Gabriel Agana Anongwin**: gabrielagana123@gmail.com

### Contact Features
- Direct email integration with pre-filled contact forms
- Mobile-optimized contact page with team information
- Working contact forms that open default email client
- Responsive design for all device types

## 🚀 Deployment Options

### GitHub Pages
1. Build the project: `npm run build`
2. Deploy the `dist` folder to GitHub Pages
3. Configure custom domain if needed

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings (auto-detected)
3. Deploy with automatic CI/CD

### Netlify
1. Connect repository or drag-and-drop build folder
2. Configure build command: `npm run build`
3. Set publish directory: `dist`

### Manual Deployment
1. Run `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure server to serve `index.html` for all routes

## 🔒 Security & Privacy

- All image processing happens locally in the browser
- No sensitive data is transmitted to external servers
- User authentication is handled securely through Supabase
- HTTPS encryption for all data transmission
- Regular security updates and dependency management

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See `LICENSE` file for details.

## 🆘 Support & Troubleshooting

### Common Issues
- **Model not loading**: Ensure `keras_Model.h5` is in `public/` folder
- **Camera not working**: Check browser permissions for camera access
- **Build errors**: Clear `node_modules` and reinstall dependencies
- **Mobile issues**: Test on actual devices, not just browser dev tools

### Getting Help
1. Check the browser console for error messages
2. Review `MODEL_INTEGRATION_GUIDE.md` for AI model issues
3. Contact the development team via email
4. Create an issue on GitHub with detailed error information

---

**Carenest** - Empowering proactive kidney health management through AI technology.
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📧 Contact Form Integration

The contact form opens the user's default email client with pre-filled information to send messages to:
- Solomon Kennedy Dzramado: solomonkendzramado@gmail.com
- Gabriel Agana Anongwin: gabrielagana123@gmail.com

## 🤖 AI Chatbot Explanation

The Carenest AI chatbot works through:

### Intent Recognition
- Analyzes user questions to understand intent
- Matches queries with predefined response categories
- Provides contextually relevant answers

### Knowledge Base
- Medical information about kidney health
- Testing procedures and guidelines
- Symptom explanations and recommendations

### Supported Question Types
- **Testing**: "How do I take a test?", "What images should I upload?"
- **Symptoms**: "What does blood in urine mean?", "Should I be worried about...?"
- **Results**: "What do my results mean?", "Is this normal?"
- **General**: "What is Carenest?", "How accurate is the AI?"

### Response Features
- Instant responses (no API delays)
- Context-aware conversations
- Medical disclaimers for safety
- Helpful suggestions and next steps

## 🧪 TensorFlow Model Integration

The app is structured for easy AI model integration:

### Current Implementation
- **File**: `src/utils/model.ts`
- **Function**: `analyzeImageWithModel(imageFile)`
- **Returns**: Mock analysis results

### For Real Model Integration
1. Replace the mock function in `src/utils/model.ts`
2. Add TensorFlow.js dependencies
3. Load your trained model
4. Process image data and return predictions

```typescript
// Example integration
import * as tf from '@tensorflow/tfjs';

export const analyzeImageWithModel = async (imageFile: File) => {
  // Load your model
  const model = await tf.loadLayersModel('/path/to/model.json');
  
  // Process image
  const tensor = tf.browser.fromPixels(imageElement);
  const prediction = model.predict(tensor);
  
  // Return results
  return {
    confidence: prediction.confidence,
    result: prediction.class,
    recommendations: generateRecommendations(prediction)
  };
};
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication pages
│   ├── chat/          # AI chatbot
│   ├── contact/       # Contact form
│   ├── dashboard/     # Main dashboard
│   ├── history/       # Test history
│   ├── test/          # Kidney testing
│   └── ui/            # Reusable UI components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── lib/               # Utilities and config
├── pages/             # Page components
└── utils/             # Helper functions
```

## 🚀 Uploading to GitHub

### Method 1: GitHub Web Interface
1. Go to [github.com](https://github.com) and sign in
2. Click "New repository"
3. Name it "carenest" and add description
4. Choose public/private
5. Click "Create repository"
6. Upload files using "uploading an existing file" link

### Method 2: Command Line (Recommended)
1. **Initialize Git** (if not already done):
   ```bash
   git init
   ```

2. **Add all files**:
   ```bash
   git add .
   ```

3. **Commit changes**:
   ```bash
   git commit -m "Initial commit: Carenest kidney testing app"
   ```

4. **Add remote repository**:
   ```bash
   git remote add origin https://github.com/yourusername/carenest.git
   ```

5. **Push to GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Method 3: GitHub Desktop
1. Download GitHub Desktop
2. Click "Add an Existing Repository"
3. Select your project folder
4. Click "Publish repository"

## 🔒 Environment Variables

For production deployment, you may need:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 👥 Team

- **Solomon Kennedy Dzramado** - Lead Developer & Co-Founder
  - Email: solomonkendzramado@gmail.com
  
- **Gabriel Agana Anongwin** - Developer & Co-Founder
  - Email: gabrielagana123@gmail.com

## 📄 License

© Carenest 2025. All Rights Reserved.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, contact our team through the in-app contact form or email us directly.