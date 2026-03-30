async def run_memory(orion, args):
    return await orion.tool_search_memory(args)


async def run_system(orion, args):
    return await orion.tool_system_info(args)


async def run_email(orion, args):
    return await orion.tool_send_email(args)


async def run_help(orion, args):
    return await orion.tool_help(args)


async def run_feedback(orion, args):
    return await orion.tool_feedback_stats(args)


TOOL_HANDLERS = {
    "memory": {
        "description": "Busca términos en la memoria persistente de Orion",
        "run": run_memory,
    },
    "system": {
        "description": "Devuelve métricas del sistema donde corre Orion",
        "run": run_system,
    },
    "email": {
        "description": "Envía correo electrónico vía SMTP",
        "run": run_email,
    },
    "help": {
        "description": "Muestra ayuda de herramientas disponibles",
        "run": run_help,
    },
    "feedback": {
        "description": "Estadísticas y reglas del aprendizaje asistido",
        "run": run_feedback,
    },
}
