import * as express from 'express';
import * as http from 'http';
import { config } from './config/config';
import { detectVehicles } from './services/vehicleDetection';
import { extractLicensePlates } from './services/licensePlateExtraction';
import { inferVehicleAttributes } from './services/vehicleAttributes';
import { Buffer } from 'buffer';

// Create Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.text({ type: 'image/*' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'inference-pipeline',
    timestamp: new Date().toISOString()
  });
});

// Vehicle detection endpoint
app.post('/api/detect/vehicles', async (req, res) => {
  try {
    const imageData = req.body;
    
    if (!imageData) {
      return res.status(400).json({
        error: 'No image data provided'
      });
    }

    const detections = await detectVehicles(imageData);
    
    res.status(200).json({
      detections,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Vehicle detection error:', error);
    res.status(500).json({
      error: 'Vehicle detection failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// License plate extraction endpoint
app.post('/api/detect/license-plates', async (req, res) => {
  try {
    const imageData = req.body;
    
    if (!imageData) {
      return res.status(400).json({
        error: 'No image data provided'
      });
    }

    const plateResult = await extractLicensePlates(imageData);
    
    res.status(200).json({
      plate: plateResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('License plate extraction error:', error);
    res.status(500).json({
      error: 'License plate extraction failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Vehicle attribute inference endpoint
app.post('/api/infer/attributes', async (req, res) => {
  try {
    const imageData = req.body;
    
    if (!imageData) {
      return res.status(400).json({
        error: 'No image data provided'
      });
    }

    const attributes = await inferVehicleAttributes(imageData);
    
    res.status(200).json({
      attributes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Vehicle attribute inference error:', error);
    res.status(500).json({
      error: 'Vehicle attribute inference failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`Inference pipeline server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down inference pipeline server');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down inference pipeline server');
  process.exit(0);
});

export { app, server };