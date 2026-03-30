async def run_database(orion, args):
    return await orion.tool_database_query(args)


async def run_dbadmin(orion, args):
    return await orion.tool_database_admin(args)


TOOL_HANDLERS = {
    "database": {
        "description": "Consulta datos estructurados del sistema",
        "run": run_database,
    },
    "dbadmin": {
        "description": "Administración SQL de la base de datos Laravel",
        "run": run_dbadmin,
    },
}
