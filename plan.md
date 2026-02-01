# ANVL Project Execution Plan

Execute these tasks sequentially. Do not proceed to the next task until the current one is complete and verified.

---
### Phase 1: Unify Development Environment & Configuration

**Goal:** Create a single, simple command to run the entire application stack locally and standardize configuration.

-   **Task 1.1: Create Root Docker Compose:**
    -   DELETE `edge/docker-compose.yml`.
    -   DELETE `hub/backend/docker-compose.yml`.
    -   DELETE `inference/docker-compose.yml`.
    -   CREATE a single `docker-compose.yml` file in the project root that defines and networks all services (`edge-node`, `inference-pipeline`, `hub-backend`, `database`).
    -   Ensure services can communicate using their service names (e.g., `http://hub-backend:8083`).

-   **Task 1.2: Standardize Environment Variables:**
    -   For each service (`edge`, `hub/backend`, `inference`), CREATE a `.env.example` file with all required environment variables.
    -   Update the root `docker-compose.yml` to use `.env` files (`env_file: ./edge/.env`, etc.).
    -   Update all `config.ts` files to correctly reference the new service names for inter-service communication (e.g., `CENTRAL_HUB_URL=http://hub-backend:8083`).

-   **Task 1.3: Clean Up Old Configuration:**
    -   DELETE `config/edge/edge_config.yml`.
    -   DELETE `development.yml`.
    -   Verify that the application runs correctly using `docker-compose up` from the root directory.

---
### Phase 2: Implement Core Service Logic

**Goal:** Make the application functionally complete according to the architecture.

-   **Task 2.1: Implement Edge Node Offline Buffering:**
    -   In `edge/src/main.ts`, modify the `detectionLoop` to include a `try/catch` block around the `sendToCentralHub` call.
    -   On failure, the `catch` block must call a new function, `bufferDetectionEvent`, which saves the `DetectionEvent` JSON object as a file in a dedicated buffer directory (e.g., `/tmp/anvil_buffer`).
    -   Create a separate, asynchronous loop (`processBuffer`) that runs periodically (e.g., every 30 seconds). This loop will read event files from the buffer directory, try to send them to the Central Hub, and delete the file on success.

-   **Task 2.2: Implement Hub Database Persistence:**
    -   In `hub/backend/src/main.ts`, modify the `/api/detections` endpoint.
    -   After receiving a `DetectionEvent`, use the `Vehicle` Sequelize model to create a new record in the database.
    -   Map the `DetectionEvent` fields to the `Vehicle` model fields. Ensure data types (like timestamps) are handled correctly.
    -   Add robust error handling for database write failures.

---
### Phase 3: Ensure Quality and Reliability

**Goal:** Add automated checks to prevent regressions and ensure code quality.

-   **Task 3.1: Write Unit Tests:**
    -   In `edge/`, create a unit test for `edge/src/services/inferenceClient.ts` that mocks `http.request` and verifies that the correct API endpoints are being called.
    -   In `hub/backend/`, create a unit test for the `/api/detections` endpoint that mocks the `Vehicle` model and ensures it is called with the correct data.

-   **Task 3.2: Write an Integration Test:**
    -   In the root `tests/` directory, create a new integration test that:
        1. Starts all services using Docker Compose.
        2. Makes a request to a new test-only endpoint on the `Edge Node` that triggers a single `detectionLoop`.
        3. Polls an endpoint on the `Hub` to verify that the corresponding detection record was created in the database.

-   **Task 3.3: Create CI Pipeline:**
    -   In `.github/workflows/`, CREATE a `ci.yml` file.
    -   This GitHub Actions workflow should trigger on every push to the `main` branch.
    -   It should have jobs to install dependencies, build the TypeScript code, and run tests for each service (`edge`, `hub`, `inference`). The workflow should fail if any step fails.

---
### Phase 4: Finalize and Document

**Goal:** Clean up the codebase and ensure it is easy for a new developer to understand and use.

-   **Task 4.1: Update All READMEs:**
    -   Edit `edge/README.md`, `hub/README.md`, and `inference/README.md` to be consistent with the final architecture.
    -   Remove incorrect information (e.g., `Edge Node` running its own models).
    -   Update the root `README.md` with instructions on how to set up the `.env` files and run the entire project with `docker-compose up`.

-   **Task 4.2: Code and File Cleanup:**
    -   DELETE the entire `src/edge/` directory and its contents, as it is a legacy remnant.
    -   Review the code for any remaining `//TODO` comments or hardcoded values and address them.

-   **Task 4.3: Harden Security:**
    -   In all `.env.example` files, replace any default secrets (e.g., `your_api_key_here`, `admin_password`) with secure, randomly generated placeholders (e.g., `CHANGE_ME_IN_ENV_FILE_A_RANDOM_SECRET`).
    -   Add comments to the `.env.example` files instructing the user to change these values.
