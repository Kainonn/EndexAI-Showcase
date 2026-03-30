#!/usr/bin/env python3
"""
Public showcase maps scraper stub.
Implementation removed for confidentiality.
"""

from __future__ import annotations

import argparse
import json


def build_mock_results(category: str, location: str, limit: int) -> dict:
    sample = []
    for index in range(1, max(limit, 1) + 1):
        sample.append(
            {
                "name": f"{category.title()} Demo {index}",
                "location": f"{location} (synthetic)",
                "confidence": round(max(0.15, 0.95 - (index * 0.03)), 2),
                "status": "mock",
            }
        )

    return {
        "mode": "showcase",
        "summary": "Synthetic extraction output for portfolio mode.",
        "items": sample,
        "note": "Implementation removed for confidentiality.",
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("category", nargs="?", default="businesses")
    parser.add_argument("location", nargs="?", default="sample-city")
    parser.add_argument("--limit", type=int, default=5)
    args = parser.parse_args()

    print(json.dumps(build_mock_results(args.category, args.location, args.limit), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
