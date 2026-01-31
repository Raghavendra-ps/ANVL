# ANVL Architecture Documentation

## Overview
ANVL is a production-grade, distributed computer vision platform for vehicle detection, license plate recognition, and analytics at toll booths.

## Repository Structure

```
anvil/
├── .github/                  # GitHub workflows and templates
│   ├── workflows/            # CI/CD pipelines
│   └── ISSUE_TEMPLATE.md     # Issue templates
├── docs/                     # Documentation
│   ├── architecture/         # Architecture diagrams
│   ├── deployment/           # Deployment guides
│   ├── api/                  # API documentation
│   └── operations/           # Operations manuals
├── edge/                     # Edge Node Service
│   ├── src/                  # Source code
│   │   ├── config/           # Configuration
│   │   ├── lib/              # Core libraries
│   │   ├── services/         # Service implementations
│   │   ├── models/           # ML models
│   │   ├── utils/            # Utilities
│   │   └── main.ts           # Entry point
│   ├── Dockerfile            # Docker build
│   ├── docker-compose.yml    # Local development
│   ├── README.md             # Edge node documentation
│   └── package.json          # Dependencies
├── inference/                # Inference Pipeline
│   ├── src/                  # Source code
│   │   ├── api/              # API server
│   │   ├── models/           # ML models
│   │   ├── preprocessing/    # Image preprocessing
│   │   ├── detectors/        # Detection logic
│   │   ├── ocr/              # OCR engines
│   │   └── main.ts           # Entry point
│   ├── Dockerfile            # Docker build
│   ├── docker-compose.yml    # Local development
│   ├── README.md             # Inference documentation
│   └── package.json          # Dependencies
├── hub/                      # Central Hub
│   ├── backend/              # Backend API
│   │   ├── src/              # Source code
│   │   ├── migrations/       # Database migrations
│   │   ├── config/           # Configuration
│   │   └── package.json      # Dependencies
│   ├── frontend/             # Web Dashboard
│   │   ├── src/              # Source code
│   │   ├── public/           # Static assets
│   │   ├── next.config.js    # Next.js config
│   │   └── package.json      # Dependencies
│   ├── Dockerfile            # Docker build
│   ├── docker-compose.yml    # Local development
│   └── README.md             # Hub documentation
├── shared/                   # Shared code
│   ├── types/                # TypeScript types
│   ├── schemas/              # Data schemas
│   ├── utils/                # Shared utilities
│   └── config/               # Shared configuration
├── scripts/                  # Deployment scripts
├── config/                   # Global configuration
├── tests/                    # Integration tests
└── README.md                 # Main documentation
```

## Service Boundaries

### 1. Edge Node (Toll Booth Agent)

**Responsibilities:**
- Connect to IP/RTSP cameras
- Sample frames at configurable FPS
- Run YOLOv8 vehicle detection
- Crop detected vehicles
- Detect and crop license plates
- Perform OCR on plates
- Run vehicle attribute inference (make, model, color)
- Attach metadata (timestamp, booth ID, camera ID, GPS)
- Send results to Central Hub
- Buffer data locally if offline

**Interfaces:**
- Input: RTSP/IP camera stream
- Output: JSON detection events to Central Hub
- Configuration: YAML/environment variables

**Deployment:**
- Runs on Linux (Jetson/GPU accelerated)
- Docker container
- Can run on-premise at toll booth

### 2. Inference Pipeline

**Responsibilities:**
- Host ML models for inference
- Provide REST/gRPC API for predictions
- Handle vehicle detection
- Handle license plate detection
- Handle OCR
- Handle vehicle attribute classification
- Support batch processing

**Interfaces:**
- Input: Image frames or cropped regions
- Output: JSON predictions with confidence scores
- API: REST/gRPC endpoints
- Configuration: Model paths, thresholds

**Deployment:**
- Runs as microservice
- GPU-accelerated
- Scalable horizontally
- Can be deployed centrally or at edge

### 3. Central Hub (Backend)

**Responsibilities:**
- Accept ingestion from edge nodes
- Validate and persist detections
- Index vehicles by time, location, attributes
- Provide query APIs
- Maintain vehicle detection history
- Manage authentication and authorization
- Generate analytics

**Interfaces:**
- Input: Detection events from edge nodes
- Output: Query results, analytics
- API: REST endpoints
- Database: PostgreSQL

**Deployment:**
- Runs as central service
- Stateless (except for sessions)
- Scalable horizontally
- Docker container

### 4. Central Hub UI (Web Dashboard)

**Responsibilities:**
- Live detection feed
- Historical search
- Advanced filters
- Vehicle profile view
- Detection timeline
- Export to CSV/JSON
- User management

**Interfaces:**
- Input: User interactions
- Output: Visualizations, reports
- API: Consumes Central Hub API
- Deployment: Static files + Next.js server

## Data Flow

```
Camera Stream → Edge Node → Inference Pipeline → Central Hub → Web UI
```

1. Edge Node captures frames from camera
2. Edge Node sends frames to Inference Pipeline for processing
3. Inference Pipeline returns detection results
4. Edge Node packages results with metadata and sends to Central Hub
5. Central Hub stores and indexes data
6. Web UI queries Central Hub for display

## Key Design Decisions

1. **Separation of Concerns**: Each subsystem is independently deployable
2. **Stateless Services**: Edge nodes and Inference Pipeline are stateless
3. **Centralized Data**: All detection data stored in Central Hub
4. **GPU Acceleration**: Critical path operations use GPU
5. **Offline Support**: Edge nodes buffer data during outages
6. **Configurable Thresholds**: All confidence thresholds configurable

## Non-Functional Requirements

- **Latency**: Per-vehicle detection < 500ms
- **Scalability**: Support 1000+ toll booths
- **Reliability**: 99.9% uptime (excluding network issues)
- **Security**: TLS everywhere, API key auth, RBAC
- **Observability**: Structured logging, metrics, alerts

## Technology Stack

- **Language**: TypeScript (Node.js)
- **ML Framework**: YOLOv8, PaddleOCR
- **Database**: PostgreSQL
- **API**: Express.js
- **Frontend**: Next.js, React
- **Containerization**: Docker
- **Orchestration**: Kubernetes (production), Docker Compose (dev)
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack or Loki