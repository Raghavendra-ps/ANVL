// Configuration for ANVL Inference Pipeline
export const config = {
  // Port for the inference API
  port: parseInt(process.env.PORT || '8082', 10),
  
  // Model paths
  models: {
    vehicle_detection: process.env.VEHICLE_DETECTION_MODEL || './models/yolov8_vehicle.pt',
    license_plate_detection: process.env.LICENSE_PLATE_DETECTION_MODEL || './models/plate_detector.pt',
    ocr: process.env.OCR_MODEL || './models/ocr_model',
    vehicle_attributes: process.env.VEHICLE_ATTRIBUTES_MODEL || './models/vehicle_attributes.pt'
  },
  
  // Confidence thresholds
  thresholds: {
    vehicle_detection: parseFloat(process.env.VEHICLE_DETECTION_THRESHOLD || '0.5'),
    license_plate: parseFloat(process.env.LICENSE_PLATE_THRESHOLD || '0.7'),
    ocr: parseFloat(process.env.OCR_THRESHOLD || '0.8'),
    vehicle_attributes: parseFloat(process.env.VEHICLE_ATTRIBUTES_THRESHOLD || '0.8')
  },
  
  // Logging configuration
  logging: {
    file: process.env.LOG_FILE || '/var/log/anvil/inference.log',
    level: process.env.LOG_LEVEL || 'info'
  },
  
  // GPU configuration
  gpu: {
    enabled: process.env.USE_GPU === 'true' || true,
    device: parseInt(process.env.GPU_DEVICE || '0', 10)
  },
  
  // Performance settings
  performance: {
    max_concurrent_requests: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '10', 10),
    timeout_ms: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10)
  }
};