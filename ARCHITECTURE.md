# ARCHITECTURE

## Overview

Orion is organized as a layered autonomous system that separates interface channels, orchestration logic, and execution tooling.

Implementation removed for confidentiality.

## Layers

1. Experience Layer (Laravel + Inertia)
- user authentication and access controls
- chat UI and telemetry presentation
- visual state controls for Orion persona

2. Integration Gateway Layer
- web bridge contract between Laravel and Python runtime
- normalized payload format for response + visual state
- showcase-safe mock execution path

3. Autonomous Core Layer
- intent interpretation
- analysis pipeline staging
- decision routing to capability modules

4. Capability Modules Layer
- extraction module boundary (maps scraper stub)
- knowledge/feedback memory boundary (stub)
- database administration boundary (stub)
- communications adapters (Discord/Email stubs)

5. Persistence Layer
- Laravel models for chat history, visual states, and prospect records
- showcase data storage with sanitized content

## Design Characteristics

- decoupled adapters for integration readiness
- deterministic interfaces between modules
- replaceable runtime components by environment
- architecture preserved while implementation details are hidden

## Deployment Posture (Showcase)

- production-mode launch is disabled
- operational scripts are intentionally non-runnable
- external dependencies are represented as placeholders only
