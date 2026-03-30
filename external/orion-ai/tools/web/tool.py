TOOL_NAME = "web"
TOOL_DESCRIPTION = "Busca información en internet"


async def run(orion, args):
    return await orion.tool_web_search(args)
