// Configuration for ANVL Edge Node
export const config = {
  // Toll booth identifier
  toll_booth_id: process.env.TOLL_BOOTH_ID || 1,
  
  // Camera configuration
  camera_ids: process.env.CAMERA_IDS ? process.env.CAMERA_IDS.split(',') : ['main_camera'],
  
  // Frame sampling rate (FPS)
  fps: parseInt(process.env.FPS || '5', 10),
  
  // Detection interval in seconds
  detection_interval: parseInt(process.env.DETECTION_INTERVAL || '10', 10),
  
  // OCR confidence threshold
  ocr_threshold: parseFloat(process.env.OCR_THRESHOLD || '0.8'),
  
  // Logging configuration
  logging: {
    file: process.env.LOG_FILE || '/var/log/anvil/edge.log',
    level: process.env.LOG_LEVEL || 'info'
  },
  
  // Inference pipeline configuration
  inference_pipeline: {
    url: process.env.INFERENCE_PIPELINE_URL || 'http://localhost:8082'
  },
  
  // Network configuration
  network: {
    buffer_size: parseInt(process.env.BUFFER_SIZE || '10', 10),
    offline_mode: process.env.OFFLINE_MODE === 'true' || true
  },
  
  // Central hub configuration
  central_hub: {
    url: process.env.CENTRAL_HUB_URL || 'http://localhost:8083',
    api_key: process.env.CENTRAL_HUB_API_KEY || 'default-api-key'
  },
  
  // Port for health checks
  port: parseInt(process.env.PORT || '8081', 10)
};