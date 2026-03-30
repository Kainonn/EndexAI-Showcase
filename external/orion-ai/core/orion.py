#!/usr/bin/env python3

"""
Public showcase Orion core.
Implementation removed for confidentiality.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


class OrionAI:
    """Showcase-safe Orion orchestrator with mock autonomous behavior."""

    def __init__(self, config_path: str = "config.json") -> None:
        self.config_path = config_path
        self.config = self.load_config()

    def load_config(self) -> dict[str, Any]:
        config_file = Path(self.config_path)
        if not config_file.exists():
            return {
                "orion": {"name": "Orion Showcase", "mode": "showcase"},
                "tools": {"enabled": []},
            }

        with config_file.open("r", encoding="utf-8") as handle:
            loaded = json.load(handle)

        loaded.setdefault("orion", {})
        loaded["orion"]["mode"] = "showcase"
        return loaded

    async def process_message(
        self,
        message: str,
        source: str = "web",
        user_id: int | str | None = None,
        user_name: str | None = None,
        context: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        # Implementation removed for confidentiality.
        del source, user_id, user_name, context

        response = self._mock_response(message)

        return {
            "response": response,
            "tools_used": ["mock_pipeline"],
            "mode": "showcase",
        }

    async def get_vision_response(self, prompt: str, image_data: bytes) -> str:
        del prompt, image_data
        return (
            "Showcase mode: vision analysis is represented with synthetic output only. "
            "Implementation removed for confidentiality."
        )

    def create_memory(
        self,
        user_id: int | str,
        user_name: str,
        message: str,
        response: str,
        context: dict[str, Any] | None = None,
        tools_used: list[str] | None = None,
    ) -> dict[str, Any]:
        return {
            "user_id": str(user_id),
            "user_name": user_name,
            "message": message,
            "response": response,
            "context": context or {},
            "tools_used": tools_used or [],
            "showcase": True,
        }

    async def save_memory(self, memory: dict[str, Any]) -> None:
        del memory

    def _mock_response(self, message: str) -> str:
        text = (message or "").lower()

        if "analysis" in text or "analisis" in text:
            return (
                "Orion showcase: analysis pipeline completed with synthetic findings and "
                "decision-ready mock KPIs. Implementation removed for confidentiality."
            )

        if "autom" in text or text.startswith("/tool"):
            return (
                "Orion showcase: autonomous tool-selection flow executed in simulation mode. "
                "Implementation removed for confidentiality."
            )

        return (
            "Orion showcase: autonomous request orchestration completed using safe placeholders. "
            "Implementation removed for confidentiality."
        )
