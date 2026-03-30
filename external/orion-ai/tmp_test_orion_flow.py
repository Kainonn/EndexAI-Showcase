"""Showcase flow tester. Implementation removed for confidentiality."""

import asyncio
from core.orion import OrionAI


async def main() -> None:
    orion = OrionAI(config_path="config.json")
    payload = await orion.process_message("simulate autonomous business workflow")
    print(payload)


if __name__ == "__main__":
    asyncio.run(main())
