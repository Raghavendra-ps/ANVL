# ANVL Project Scope

This document defines the deliverables for the current project plan.

## In-Scope (What WILL be delivered)

1.  **Fully Functional Data Pipeline:**
    -   A containerized development environment managed by a single root `docker-compose.yml` file.
    -   The Edge Node correctly calls the Inference Pipeline for all CV tasks.
    -   The Central Hub correctly receives data from the Edge Node and persists it into the PostgreSQL database.

2.  **Core Feature Implementation:**
    -   **Offline Buffering:** The Edge Node will reliably buffer detection events to the local filesystem during network outages and send them when the connection to the Central Hub is restored.
    -   **Database Persistence:** The Central Hub's `/api/detections` endpoint will save all valid incoming detection events to the `vehicles` table in the database.

3.  **Standardized Configuration:**
    -   All services will be configured exclusively via environment variables.
    -   Each service will contain a `.env.example` file for easy setup.
    -   All redundant and unused configuration files (`.yml`) will be removed.

4.  **Testing and CI:**
    -   Basic unit tests for critical functions (e.g., data sending, inference client).
    -   At least one integration test for the main data flow (Edge -> Inference -> Hub).
    -   A GitHub Actions CI pipeline that automatically runs `npm install`, `build`, and `test` for all services on every push.

5.  **Documentation and Cleanup:**
    -   All `README.md` files will be updated to reflect the final, working state of the architecture and provide clear setup instructions.
    -   All dead, unused, or legacy code (e.g., in `src/edge`) will be removed.
    -   Hardcoded secrets will be replaced with environment variable placeholders.

## Out-of-Scope (What WILL NOT be delivered)

1.  **Real Machine Learning Model Implementation:** The Inference Pipeline will continue to return mocked/simulated data. No actual model loading or GPU execution will be implemented.
2.  **Real Camera Integration:** The Edge Node will continue to use a simulated frame capture function. No real RTSP/IP camera streams will be processed.
3.  **Advanced Web UI Features:** The Web UI will not be developed beyond its current state. No work will be done on analytics, dashboards, or advanced filtering.
4.  **Production Deployment Scripts:** While the application will be production-ready, no Kubernetes manifests, Helm charts, or cloud-specific deployment scripts will be created. The focus is on a robust Docker Compose setup.
5.  **User Management and Authentication:** The API key system and user management features will remain in their basic, placeholder state.
