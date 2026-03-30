#!/usr/bin/env python3
"""
Public showcase feedback memory module.
Implementation removed for confidentiality.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class FeedbackRule:
    topic: str
    learned_rule: str
    importance: str = "media"


class OrionFeedbackMemory:
    """Synthetic feedback memory used in showcase mode."""

    def __init__(self) -> None:
        self.rules = [
            FeedbackRule(
                topic="showcase",
                learned_rule="Use synthetic outputs and avoid proprietary operational details.",
                importance="alta",
            )
        ]

    def register_feedback(self, user_message: str, orion_last_response: str, conversation_context: str = "") -> FeedbackRule:
        del user_message, orion_last_response, conversation_context
        # Implementation removed for confidentiality.
        return self.rules[0]

    def get_relevant_corrections(self, message: str) -> list[FeedbackRule]:
        del message
        return self.rules

    def get_corrections_prompt(self, message: str) -> str:
        del message
        return (
            "Showcase memory note: apply safe outputs only. "
            "Implementation removed for confidentiality."
        )
