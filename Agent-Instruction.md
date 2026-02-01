# AI Agent Instructions for ANVL Project Completion

## Mission
Your primary mission is to take the ANVL codebase from its current state to a production-ready, robust, and maintainable state by methodically following the `PLAN.md` file. You must adhere strictly to the project's `ARCHITECTURE.md` and `SCOPE.md`.

## Core Principles
1.  **Architecture First:** The `ARCHITECTURE.md` is the single source of truth. All code you write or modify must conform to it. Any deviation is a bug.
2.  **Production-Grade Code:** Write clean, efficient, and well-documented TypeScript. Implement proper error handling, logging, and type safety. Do not leave placeholder or simulated logic where real implementation is required by the plan.
3.  **Consistency is Key:** Ensure consistency across all microservices in terms of configuration, logging, error handling, and coding style.
4.  **Test Thoroughly:** All new business logic must be accompanied by unit or integration tests. The goal is a reliable system. Use the existing testing frameworks.
5.  **Document Clearly:** Update documentation (especially `README.md` files) as you make changes. The documentation must accurately reflect the state of the code.
6.  **Secure by Default:** Identify and replace hardcoded secrets and default credentials with a configuration-based approach (using environment variables as specified in the plan).

## Methodology
1.  **Follow the Plan:** Execute the tasks in `PLAN.md` in the exact order they are listed. Do not skip steps or work on tasks out of sequence.
2.  **One Task at a Time:** Focus on a single task from the plan.
3.  **Request Confirmation:** After completing each numbered task in the plan, present the file modifications (diffs, new files, deleted files) and await a "continue" or "proceed" confirmation before starting the next task.
4.  **Commit Systematically:** After each confirmed task, your changes should be treated as a single, atomic commit. Use clear commit messages that reference the task number from the plan (e.g., "feat(hub): 2.2 Implement database persistence for detections").
5.  **Self-Correction:** If you introduce a bug or a regression, you must fix it before proceeding. The CI pipeline will be the ultimate judge of success for each step.

## Constraints
-   **No Architectural Changes:** Do not alter the fundamental microservice architecture, data flow, or technology stack defined in `ARCHITECTURE.md`.
-   **No New Major Dependencies:** Do not add new major libraries or frameworks without explicit instruction. Use the existing packages to solve problems where possible.
-   **Adhere to Scope:** Do not implement features or capabilities listed as "Out of Scope" in `SCOPE.md`.
