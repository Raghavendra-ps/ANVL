# ANVL Edge Node

ANVL Edge Node is the toll booth agent responsible for capturing camera feeds, performing computer vision operations, and sending detection results to the Central Hub.

## Features

- Connects to IP/RTSP cameras
- Samples frames at configurable FPS
- Runs YOLOv8 vehicle detection
- Crops detected vehicles
- Detects and crops license plates
- Performs OCR on plates
- Runs vehicle attribute inference (make, model, color)
- Attaches metadata (timestamp, booth ID, camera ID, GPS)
- Sends results to Central Hub
- Buffers data locally if offline

## Architecture

```
Camera Stream → Edge Node → Inference Pipeline → Central Hub → Web UI
```

## Configuration

The edge node can be configured through environment variables or a YAML configuration file:

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TOLL_BOOTH_ID` | Unique identifier for this toll booth | `1` |
| `CAMERA_IDS` | Comma-separated list of camera IDs | `main_camera` |
| `FPS` | Frame sampling rate | `5` |
| `DETECTION_INTERVAL` | Seconds between detection cycles | `10` |
| `OCR_THRESHOLD` | Minimum OCR confidence threshold | `0.8` |
| `LOG_FILE` | Path to log file | `/var/log/anvil/edge.log` |
| `CENTRAL_HUB_URL` | URL of Central Hub API | `http://localhost:8083` |
| `CENTRAL_HUB_API_KEY` | API key for Central Hub authentication | `default-api-key` |
| `OFFLINE_MODE` | Whether to enable offline buffering | `true` |
| `BUFFER_SIZE` | Maximum number of buffered detections | `10` |
| `PORT` | Port for health checks | `8081` |

## Building and Running

### Prerequisites

- Docker
- Docker Compose

### Build

```bash
docker build -t anvl-edge-node .
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

## API Endpoints

### Health Check

```
GET /health
```

Returns JSON with service status.

## Data Format

Each detection event follows this JSON structure:

```json
{
  "detection_id": "uuid",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "toll_booth_id": 1,
  "camera_id": "main_camera",
  "vehicle_type": "car",
  "license_plate_text": "ABC-1234",
  "license_plate_confidence": 0.92,
  "make": "Toyota",
  "model": "Camry",
  "color": "blue",
  "make_confidence": 0.95,
  "model_confidence": 0.88,
  "color_confidence": 0.91,
  "image_url": null
}
```

## Deployment

The edge node is designed to run on Linux systems with GPU acceleration capabilities (Jetson, CUDA). It can be deployed at each toll booth location and will automatically:

- Connect to configured cameras
- Process frames at specified intervals
- Send results to the Central Hub
- Buffer data locally during network outages
- Resume transmission when network is restored