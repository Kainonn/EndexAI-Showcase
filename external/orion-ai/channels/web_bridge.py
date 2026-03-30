#!/usr/bin/env python3

"""
Public showcase bridge for Orion web chat.
Implementation removed for confidentiality.
"""

import argparse
import json


def build_visual_state(message: str) -> dict:
    normalized = (message or "").lower()
    focus = "SYSTEM"

    if any(token in normalized for token in ["analysis", "analisis", "pipeline"]):
        focus = "ANALYTICS"

    return {
        "state": "CALMA",
        "emotion": "calma",
        "energy": 0.44,
        "focus": focus,
        "intensity": 0.36,
        "animations": {
            "blink": True,
            "breath": True,
            "saccade": True,
            "thinking": False,
        },
    }


def build_showcase_response(message: str) -> str:
    normalized = (message or "").lower()

    if "automat" in normalized or normalized.startswith("/tool"):
        return (
            "Showcase mode: Orion mapped the request to an automation-ready capability and "
            "returned a simulated execution summary. Implementation removed for confidentiality."
        )

    if "analysis" in normalized or "analisis" in normalized:
        return (
            "Showcase mode: Orion completed a staged analysis pipeline and generated a safe mock "
            "business insight report. Implementation removed for confidentiality."
        )

    return (
        "Showcase mode: Orion accepted the request and produced a synthetic autonomous reasoning "
        "result for portfolio demonstration. Implementation removed for confidentiality."
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--message", required=True)
    parser.add_argument("--user-id", type=int, default=0)
    parser.add_argument("--user-name", default="Terminal")
    args = parser.parse_args()

    payload = {
        "response": build_showcase_response(args.message),
        "orion": build_visual_state(args.message),
        "meta": {
            "mode": "showcase",
            "user_id": args.user_id,
            "user_name": args.user_name,
        },
    }

    print(json.dumps(payload, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
