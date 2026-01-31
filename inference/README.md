# ANVL Inference Pipeline

ANVL Inference Pipeline is a microservice that hosts machine learning models for vehicle detection, license plate recognition, and vehicle attribute inference.

## Features

- Hosts YOLOv8 vehicle detection models
- Performs license plate detection and OCR
- Infers vehicle make, model, and color
- Provides REST API for inference operations
- Supports GPU acceleration
- Configurable confidence thresholds
- Scalable and horizontally deployable

## Architecture

```
Edge Node → Inference Pipeline → Central Hub
```

## API Endpoints

### Health Check

```
GET /health
```

Returns JSON with service status.

### Vehicle Detection

```
POST /api/detect/vehicles
```

Accepts image data and returns vehicle detections with bounding boxes and confidence scores.

### License Plate Extraction

```
POST /api/detect/license-plates
```

Accepts image data and returns license plate text with confidence score.

### Vehicle Attribute Inference

```
POST /api/infer/attributes
```

Accepts vehicle image and returns make, model, and color with confidence scores.

## Configuration

The inference pipeline can be configured through environment variables:

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port for the API server | `8082` |
| `VEHICLE_DETECTION_MODEL` | Path to vehicle detection model | `./models/yolov8_vehicle.pt` |
| `LICENSE_PLATE_DETECTION_MODEL` | Path to license plate detection model | `./models/plate_detector.pt` |
| `OCR_MODEL` | Path to OCR model | `./models/ocr_model` |
| `VEHICLE_ATTRIBUTES_MODEL` | Path to vehicle attributes model | `./models/vehicle_attributes.pt` |
| `VEHICLE_DETECTION_THRESHOLD` | Confidence threshold for vehicle detection | `0.5` |
| `LICENSE_PLATE_THRESHOLD` | Confidence threshold for license plate detection | `0.7` |
| `OCR_THRESHOLD` | Confidence threshold for OCR | `0.8` |
| `VEHICLE_ATTRIBUTES_THRESHOLD` | Confidence threshold for vehicle attributes | `0.8` |
| `LOG_FILE` | Path to log file | `/var/log/anvil/inference.log` |
| `USE_GPU` | Enable GPU acceleration | `true` |
| `GPU_DEVICE` | GPU device ID | `0` |
| `MAX_CONCURRENT_REQUESTS` | Maximum concurrent requests | `10` |
| `REQUEST_TIMEOUT` | Request timeout in milliseconds | `30000` |

## Building and Running

### Prerequisites

- Docker
- Docker Compose

### Build

```bash
docker build -t anvl-inference-pipeline .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Data Format

### Vehicle Detection Response

```json
{
  "detections": [
    {
      "vehicle_type": "car",
      "bbox": [100, 150, 300, 200],
      "confidence": 0.95
    }
  ],
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### License Plate Response

```json
{
  "plate": {
    "text": "ABC-1234",
    "confidence": 0.92,
    "bbox": [50, 100, 200, 50]
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Vehicle Attributes Response

```json
{
  "attributes": {
    "make": "Toyota",
    "model": "Camry",
    "color": "blue",
    "make_confidence": 0.95,
    "model_confidence": 0.88,
    "color_confidence": 0.91
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Deployment

The inference pipeline is designed to be deployed as a microservice that can run either centrally or at the edge. It supports:

- GPU acceleration for ML inference
- Horizontal scaling
- Containerized deployment with Docker
- Integration with the edge node and central hub
- Configurable thresholds for different environments