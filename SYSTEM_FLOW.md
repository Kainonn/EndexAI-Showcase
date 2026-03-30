# SYSTEM_FLOW

## Autonomous Request Lifecycle

1. Input Capture
- User submits message through the Orion interface.

2. Envelope Normalization
- Request metadata is normalized (source, actor, mode, payload schema).

3. Intent Classification
- Orion classifies whether the request targets analysis, automation, extraction, or conversational support.

4. Decision Routing
- Router selects the best capability path from available modules.
- In showcase mode, routing is preserved while execution is simulated.

5. Capability Execution (Simulated)
- Selected module returns safe mock output.
- No external APIs, scraping engines, or real databases are called.

6. Synthesis
- Orion composes a final autonomous-style response and confidence context.

7. Visual Telemetry
- Response includes visual-state metadata for UI animation and feedback.

8. Persistence
- Exchange is persisted in sanitized format for history and UX continuity.

Implementation removed for confidentiality.

## Decision-Making Emphasis

- autonomous intent-to-action mapping
- staged analysis pipeline behavior
- response synthesis as a final orchestration step
- module contracts designed for future real integrations
