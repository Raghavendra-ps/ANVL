// Path: ANVL-main/edge/src/main.ts
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { detectVehicles, extractLicensePlates, inferVehicleAttributes } from './services/inferenceClient';
import { sendToCentralHub } from './services/dataSender';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config/config';
import { DetectionEvent } from '@anvl/shared/types/events';

// Create logs directory if it doesn't exist
const logDir = path.dirname(config.logging.file);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Logging function
function log(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  fs.appendFileSync(config.logging.file, logMessage);
}

// Initialize edge node
async function initializeEdgeNode() {
  log(`Initializing ANVL Edge Node for booth ${config.toll_booth_id}`);
  
  // Validate configuration
  if (!config.camera_ids || config.camera_ids.length === 0) {
    log('ERROR: No camera IDs configured');
    process.exit(1);
  }

  log('Edge node initialized successfully');
}

// Main detection loop
async function detectionLoop() {
  log('Starting detection loop');
  
  try {
    // Simulate camera frame capture
    const frameData = await captureFrame();
    
    if (!frameData) {
      log('No frame data captured');
      return;
    }

    // Run vehicle detection
    const detections = await detectVehicles(frameData);
    
    if (detections && detections.length > 0) {
      log(`Detected ${detections.length} vehicles`);
      
      for (const detection of detections) {
        try {
          // Crop vehicle image
          const croppedVehicle = await cropVehicle(frameData, detection.bbox);
          
          // Extract license plate
          const plateResult = await extractLicensePlates(croppedVehicle);
          
          // Infer vehicle attributes
          const attributes = await inferVehicleAttributes(croppedVehicle);
          
          // Create detection event
          const detectionEvent: DetectionEvent = {
            detection_id: uuidv4(),
            timestamp: new Date().toISOString(),
            toll_booth_id: config.toll_booth_id,
            camera_id: detection.camera_id || config.camera_ids[0], // Use a default camera_id
            vehicle_type: detection.vehicle_type,
            license_plate_text: plateResult?.text || null,
            license_plate_confidence: plateResult?.confidence || null,
            make: attributes?.make || null,
            model: attributes?.model || null,
            color: attributes?.color || null,
            make_confidence: attributes?.make_confidence || null,
            model_confidence: attributes?.model_confidence || null,
            color_confidence: attributes?.color_confidence || null,
            image_url: null // Will be set to actual URL in production
          };

          // Send to central hub
          await sendToCentralHub(detectionEvent);
          
          log(`Sent detection event for vehicle ${detectionEvent.detection_id}`);
        } catch (error) {
          log(`Error processing detection: ${error}`);
        }
      }
    } else {
      log('No vehicles detected in frame');
    }
  } catch (error) {
    log(`Error in detection loop: ${error}`);
  }
}

// Simulate camera frame capture
async function captureFrame(): Promise<Buffer | null> {
  // In production, this would connect to RTSP camera
  // For now, we'll simulate by returning a dummy frame or null
  log('Capturing frame from camera');
  return Buffer.from('dummy_frame_data');
}

// Simulate vehicle cropping
async function cropVehicle(frameData: Buffer, bbox: any): Promise<Buffer> {
  // In production, this would crop the actual frame
  log('Cropping vehicle from frame');
  return frameData;
}

// Start the edge node service
async function startEdgeNode() {
  await initializeEdgeNode();
  
  // Start main detection loop
  setInterval(detectionLoop, config.detection_interval * 1000);
  
  log('Edge node service started');
  
  // Create HTTP server for health checks
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'edge-node',
      booth_id: config.toll_booth_id,
      timestamp: new Date().toISOString()
    }));
  });

  server.listen(config.port, () => {
    log(`Edge node HTTP server running on port ${config.port}`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

// Start the service
startEdgeNode().catch(error => {
  console.error('Failed to start edge node:', error);
  log(`ERROR: Failed to start edge node: ${error}`);
  process.exit(1);
});