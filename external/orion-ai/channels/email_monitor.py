#!/usr/bin/env python3
"""
Public showcase email monitor.
Implementation removed for confidentiality.
"""

from __future__ import annotations

from typing import Any


class EmailMonitor:
    """Simulated email monitor used for portfolio demonstrations."""

    def __init__(self, config: dict[str, Any]) -> None:
        self.config = config
        self.running = False

    def connect_imap(self) -> bool:
        # Implementation removed for confidentiality.
        return False

    def disconnect_imap(self) -> None:
        return None

    def get_unread_emails(self) -> list[dict[str, Any]]:
        # Implementation removed for confidentiality.
        return [
            {
                "id": "showcase-1",
                "from": "sample@showcase.local",
                "subject": "Synthetic inbound request",
                "body": "This is mock data for portfolio demonstration.",
                "date": "2026-03-30T00:00:00Z",
                "message_id": "showcase-message-1",
            }
        ]

    def send_email(
        self,
        to_address: str,
        subject: str,
        body: str,
        reply_to: str | None = None,
        sender_address: str | None = None,
        sender_password: str | None = None,
        sender_name: str | None = None,
    ) -> bool:
        del to_address, subject, body, reply_to, sender_address, sender_password, sender_name
        # Implementation removed for confidentiality.
        return True


def main() -> int:
    monitor = EmailMonitor(config={})
    samples = monitor.get_unread_emails()
    print(f"Showcase email monitor ready. Mock samples: {len(samples)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
