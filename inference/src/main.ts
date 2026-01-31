// Path: ANVL-main/inference/src/main.ts
import * as express from 'express';
import * as http from 'http';
import { config } from './config/config';
import { detectVehicles } from './services/vehicleDetection';
import { extractLicensePlates } from './services/licensePlateExtraction';
import { inferVehicleAttributes } from './services/vehicleAttributes';
import { 
  VehicleDetectionResponse, 
  LicensePlateResponse,
  VehicleAttributesResponse
} from '@anvl/shared/types/inference';

// Create Express app
const app = express();
const server = http.createServer(app);

// Middleware - Use raw body parser for image data
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));

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
    
    if (!imageData || imageData.length === 0) {
      return res.status(400).json({
        error: 'No image data provided'
      });
    }

    const detections = await detectVehicles(imageData);
    
    const response: VehicleDetectionResponse = {
      detections,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
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
    
    if (!imageData || imageData.length === 0) {
      return res.status(400).json({
        error: 'No image data provided'
      });
    }

    const plateResult = await extractLicensePlates(imageData);
    
    const response: LicensePlateResponse = {
      plate: plateResult,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
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
    
    if (!imageData || imageData.length === 0) {
      return res.status(400).json({
        error: 'No image data provided'
      });
    }

    const attributes = await inferVehicleAttributes(imageData);
    
    const response: VehicleAttributesResponse = {
      attributes,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
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