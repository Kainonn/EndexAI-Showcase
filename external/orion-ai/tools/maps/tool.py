TOOL_NAME = "maps"
TOOL_DESCRIPTION = "Busca negocios y leads en Google Maps"


async def run(orion, args):
    return await orion.tool_maps_scraper(args)
