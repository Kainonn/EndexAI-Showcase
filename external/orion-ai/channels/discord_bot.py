#!/usr/bin/env python3
"""
Public showcase Discord adapter.
Implementation removed for confidentiality.
"""

from __future__ import annotations

import asyncio
from typing import Any


class OrionDiscordBot:
    """Simulated Discord bot facade for architecture showcase."""

    def __init__(self, config: dict[str, Any], orion: Any = None) -> None:
        self.config = config
        self.orion = orion
        self.enabled = bool(config.get("discord", {}).get("enabled", False))
        self.ready = False

    async def start(self) -> None:
        # Implementation removed for confidentiality.
        self.ready = True
        await asyncio.sleep(0)

    async def stop(self) -> None:
        self.ready = False
        await asyncio.sleep(0)

    async def send_notification(self, title: str, message: str, color: Any = None) -> None:
        del title, message, color
        await asyncio.sleep(0)

    async def notify_new_email(self, sender: str, subject: str, preview: str = "") -> None:
        del sender, subject, preview
        await asyncio.sleep(0)

    async def notify_auto_response(self, recipient: str, subject: str) -> None:
        del recipient, subject
        await asyncio.sleep(0)

    async def notify_sent_email(self, recipient: str, subject: str) -> None:
        del recipient, subject
        await asyncio.sleep(0)

    async def notify_error(self, component: str, message: str) -> None:
        del component, message
        await asyncio.sleep(0)
