"""Showcase helper script. Implementation removed for confidentiality."""

import asyncio
from core.orion import OrionAI


async def main() -> None:
    orion = OrionAI(config_path="config.json")
    result = await orion.process_message(message="simulate /tool pipeline", source="discord")
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
