# ANVL Architecture Documentation (v2.0)

## Overview
ANVL is a production-grade, distributed computer vision platform for vehicle detection, license plate recognition, and analytics at toll booths. It is designed as a system of loosely-coupled microservices.

## Repository Structure

anvil/
├── .github/
├── docs/
├── edge/ # Edge Node Service
├── hub/ # Central Hub (Backend & Frontend)
├── inference/ # Inference Pipeline Service
├── shared/ # Shared TypeScript types, schemas, and utilities
├── scripts/
├── config/
├── tests/
└── README.md

## Service Boundaries

### 1. Edge Node (Toll Booth Agent)
**Responsibilities:**
- Connect to IP/RTSP cameras and sample frames.
- **Orchestrate vision processing**:
    - Sends frames to the **Inference Pipeline** for vehicle detection.
    - Crops vehicles from frames based on detection results.
    - Sends cropped vehicle images to the **Inference Pipeline** for license plate extraction and attribute inference.
- Package results into a `DetectionEvent` JSON object with metadata (timestamp, booth ID, etc.).
- Send the `DetectionEvent` to the Central Hub's ingestion API.
- Buffer `DetectionEvent` data locally if the Central Hub is unreachable and send it upon reconnection.

### 2. Inference Pipeline
**Responsibilities:**
- **Host and execute all ML models.** This service is the single source of truth for all computer vision tasks.
- Provide a REST API for inference:
    - `/api/detect/vehicles`: Accepts an image frame, returns vehicle detections.
    - `/api/detect/license-plates`: Accepts a cropped vehicle image, returns license plate text and confidence.
    - `/api/infer/attributes`: Accepts a cropped vehicle image, returns vehicle make, model, and color.
- Designed to be stateless, scalable, and GPU-accelerated.

### 3. Central Hub (Backend)
**Responsibilities:**
- Accept `DetectionEvent` ingestion from Edge Nodes via a secure API endpoint.
- Validate and persist detection data into a PostgreSQL database.
- Provide secure query APIs for the Web Dashboard to search, filter, and retrieve vehicle detection history.
- Manage authentication and authorization.

### 4. Central Hub UI (Web Dashboard)
**Responsibilities:**
- Provide a user interface for viewing and analyzing detection data.
- Consume APIs from the Central Hub Backend.
- (Further implementation is out of scope for the current plan).

### 5. Shared Code (`@anvl/shared`)
**Responsibilities:**
- Provide a single source of truth for shared data structures and types used across services.
- Key types include `DetectionEvent`, `VehicleDetection`, `LicensePlate`, and `VehicleAttributes`.
- This ensures type safety and consistency in the communication between services.

## Data Flow
The data flow is linear and strictly enforced:
`Camera Stream → Edge Node → Inference Pipeline (for analysis) → Edge Node (for packaging) → Central Hub → Web UI`

1.  **Edge Node** captures a frame.
2.  **Edge Node** POSTs the frame to the **Inference Pipeline's** vehicle detection endpoint.
3.  **Inference Pipeline** returns bounding boxes for detected vehicles.
4.  For each vehicle, **Edge Node** crops the image and POSTs it to the **Inference Pipeline's** license plate and attribute endpoints.
5.  **Inference Pipeline** returns the vision processing results.
6.  **Edge Node** assembles all information into a `DetectionEvent` and POSTs it to the **Central Hub**.
7.  **Central Hub** persists the event in the database.
8.  **Web UI** queries the **Central Hub** to display data.

## Configuration Strategy
- **Environment Variables are Primary:** All configuration for all services (database connections, API keys, ports, etc.) MUST be managed through environment variables.
- **`.env` for Local Development:** Each service will have a `.env.example` file. For local development, this can be copied to a `.env` file, which will be loaded by the application. The `.env` file is git-ignored.
- **No Hardcoded Configuration:** There should be no hardcoded ports, URLs, or credentials in the source code.

## Technology Stack
- **Language**: TypeScript (Node.js)
- **ML Framework**: YOLOv8, PaddleOCR (simulated in the current scope)
- **Database**: PostgreSQL
- **API**: Express.js
- **Frontend**: Next.js, React
- **Containerization**: Docker
- **Local Orchestration**: Docker Compose
