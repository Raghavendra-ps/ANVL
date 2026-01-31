// Path: ANVL-main/hub/backend/src/main.ts
import * as express from 'express';
import * as http from 'http';
import { config } from './config/config';
import { testConnection } from './config/database';
import { Vehicle } from './models/vehicle';
import { DetectionEvent } from '@anvl/shared/types/events';

// Create Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: config.performance.maxPayloadSize }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'central-hub',
    timestamp: new Date().toISOString()
  });
});

// API endpoints
app.post('/api/detections', async (req, res) => {
  try {
    // In a real implementation, this would validate and store the detection
    const detection: DetectionEvent = req.body;
    
    // Here we would validate the detection data against a schema
    // and then save it to the database using the Vehicle model.
    console.log('Received detection:', detection.detection_id);

    // Example of saving (in a real app, this logic would be in a service layer):
    // await Vehicle.create({ ...detection, timestamp: new Date(detection.timestamp) });
    
    res.status(201).json({
      message: 'Detection received successfully',
      detection_id: detection.detection_id || 'generated-id',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Detection ingestion error:', error);
    res.status(500).json({
      error: 'Detection ingestion failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/vehicles/search', async (req, res) => {
  try {
    // In a real implementation, this would query the database with filters
    const { 
      time_start, 
      time_end, 
      toll_booth_id, 
      plate, 
      make, 
      model, 
      color 
    } = req.query;
    
    // Here we would perform the actual database query
    // For now, we'll return mock data
    res.status(200).json({
      vehicles: [],
      count: 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/vehicles/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, this would return the detection history for a vehicle
    // For now, we'll return mock data
    res.status(200).json({
      vehicle_id: id,
      history: [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      error: 'History retrieval failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Initialize database connection and start server
async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Sync models (in production, use migrations instead)
    await Vehicle.sync({ alter: true });
    
    // Start server
    const PORT = config.server.port;
    server.listen(PORT, () => {
      console.log(`Central Hub server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down Central Hub server');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down Central Hub server');
  process.exit(0);
});

// Start the server
startServer();

export { app, server };