import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type ProspectoRow = {
    id: number;
    nombre: string;
    giro: string | null;
    categoria: string | null;
    calificacion: number | null;
    direccion: string | null;
    ciudad: string | null;
    estado: string | null;
    telefono: string | null;
    sitio_web: string | null;
    horario: string | null;
    notas: string | null;
    estatus: string | null;
    url_maps: string | null;
};

type ProspectosPageProps = {
    filters: {
        q: string;
        estatus: string;
    };
    prospectos: {
        data: ProspectoRow[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Prospectos',
        href: '/prospectos',
    },
];

export default function ProspectosIndexPage({ filters, prospectos }: ProspectosPageProps) {
    const [search, setSearch] = useState(filters.q ?? '');
    const [estatus, setEstatus] = useState(filters.estatus ?? '');
    const [statusDrafts, setStatusDrafts] = useState<Record<number, string>>({});
    const [notesDrafts, setNotesDrafts] = useState<Record<number, string>>({});
    const [savingStatus, setSavingStatus] = useState<Record<number, boolean>>({});
    const [savingNotes, setSavingNotes] = useState<Record<number, boolean>>({});

    const csrfToken = useMemo(
        () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
        [],
    );

    useEffect(() => {
        const statuses: Record<number, string> = {};
        const notes: Record<number, string> = {};

        for (const item of prospectos.data) {
            statuses[item.id] = item.estatus ?? 'nuevo';
            notes[item.id] = item.notas ?? '';
        }

        setStatusDrafts(statuses);
        setNotesDrafts(notes);
    }, [prospectos.data]);

    async function patchProspecto(id: number, payload: { estatus?: string; notas?: string | null }) {
        await fetch(`/prospectos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(payload),
        });
    }

    async function updateStatus(id: number, value: string) {
        setStatusDrafts((prev) => ({ ...prev, [id]: value }));
        setSavingStatus((prev) => ({ ...prev, [id]: true }));

        try {
            await patchProspecto(id, { estatus: value });
        } finally {
            setSavingStatus((prev) => ({ ...prev, [id]: false }));
        }
    }

    async function updateNotes(id: number) {
        setSavingNotes((prev) => ({ ...prev, [id]: true }));

        try {
            await patchProspecto(id, { notas: notesDrafts[id] || null });
        } finally {
            setSavingNotes((prev) => ({ ...prev, [id]: false }));
        }
    }

    function submitSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            '/prospectos',
            {
                q: search.trim() || undefined,
                estatus: estatus || undefined,
            },
            {
                preserveState: false,
                replace: true,
            },
        );
    }

    function clearFilters() {
        setSearch('');
        setEstatus('');

        router.get('/prospectos', {}, { preserveState: false, replace: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prospectos" />

            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[#E6F1FF]">Prospectos</h1>
                        <p className="text-sm text-[#7B8AA0]">
                            Total: {prospectos.total} registros
                        </p>
                    </div>

                    <form onSubmit={submitSearch} className="flex items-center gap-2">
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar por nombre, giro, ciudad..."
                            className="h-9 w-72 rounded-lg border border-[#1A2236] bg-[#0B1020] px-3 text-sm text-[#E6F1FF] placeholder-[#7B8AA0] focus:border-[#00E5FF]/50 focus:outline-hidden"
                        />
                        <select
                            value={estatus}
                            onChange={(event) => setEstatus(event.target.value)}
                            className="h-9 rounded-lg border border-[#1A2236] bg-[#0B1020] px-3 text-sm text-[#E6F1FF] focus:border-[#00E5FF]/50 focus:outline-hidden"
                        >
                            <option value="">Estatus: Todos</option>
                            <option value="nuevo">Nuevo</option>
                            <option value="contactado">Contactado</option>
                            <option value="interesado">Interesado</option>
                            <option value="cliente">Cliente</option>
                            <option value="descartado">Descartado</option>
                        </select>
                        <button
                            type="submit"
                            className="h-9 rounded-lg bg-[#00E5FF]/20 px-4 text-sm font-medium text-[#00E5FF] hover:bg-[#00E5FF]/30"
                        >
                            Buscar
                        </button>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="h-9 rounded-lg border border-[#1A2236] px-4 text-sm font-medium text-[#E6F1FF] hover:bg-[#0F172A]"
                        >
                            Limpiar
                        </button>
                    </form>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#1A2236] bg-[#0B1020]/80">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#0F172A] text-[#7B8AA0]">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold">ID</th>
                                    <th className="px-3 py-2 text-left font-semibold">Nombre</th>
                                    <th className="px-3 py-2 text-left font-semibold">Giro</th>
                                    <th className="px-3 py-2 text-left font-semibold">Categoría</th>
                                    <th className="px-3 py-2 text-left font-semibold">Dirección</th>
                                    <th className="px-3 py-2 text-left font-semibold">Ubicación</th>
                                    <th className="px-3 py-2 text-left font-semibold">Calif.</th>
                                    <th className="px-3 py-2 text-left font-semibold">Teléfono</th>
                                    <th className="px-3 py-2 text-left font-semibold">Sitio Web</th>
                                    <th className="px-3 py-2 text-left font-semibold">Horario</th>
                                    <th className="px-3 py-2 text-left font-semibold">Notas</th>
                                    <th className="px-3 py-2 text-left font-semibold">Estatus</th>
                                    <th className="px-3 py-2 text-left font-semibold">Maps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prospectos.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={13}
                                            className="px-3 py-6 text-center text-[#7B8AA0]"
                                        >
                                            No hay prospectos para mostrar.
                                        </td>
                                    </tr>
                                ) : (
                                    prospectos.data.map((item) => (
                                        <tr key={item.id} className="border-t border-[#1A2236] text-[#E6F1FF]">
                                            <td className="px-3 py-2">{item.id}</td>
                                            <td className="px-3 py-2">{item.nombre}</td>
                                            <td className="px-3 py-2">{item.giro ?? '-'}</td>
                                            <td className="px-3 py-2">{item.categoria ?? '-'}</td>
                                            <td className="px-3 py-2">{item.direccion ?? '-'}</td>
                                            <td className="px-3 py-2">
                                                {[item.ciudad, item.estado].filter(Boolean).join(', ') || '-'}
                                            </td>
                                            <td className="px-3 py-2">{item.calificacion ?? '-'}</td>
                                            <td className="px-3 py-2">{item.telefono ?? '-'}</td>
                                            <td className="px-3 py-2">
                                                {item.sitio_web ? (
                                                    <a
                                                        href={item.sitio_web}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[#00E5FF] hover:underline"
                                                    >
                                                        Ver
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-3 py-2">{item.horario ?? '-'}</td>
                                            <td className="px-3 py-2">
                                                <textarea
                                                    value={notesDrafts[item.id] ?? ''}
                                                    onChange={(event) =>
                                                        setNotesDrafts((prev) => ({
                                                            ...prev,
                                                            [item.id]: event.target.value,
                                                        }))
                                                    }
                                                    onBlur={() => updateNotes(item.id)}
                                                    rows={2}
                                                    className="w-72 rounded-md border border-[#1A2236] bg-[#0F172A] px-2 py-1 text-xs text-[#E6F1FF] focus:border-[#00E5FF]/50 focus:outline-hidden"
                                                />
                                                {savingNotes[item.id] ? (
                                                    <div className="mt-1 text-[10px] text-[#7B8AA0]">Guardando...</div>
                                                ) : null}
                                            </td>
                                            <td className="px-3 py-2">
                                                <select
                                                    value={statusDrafts[item.id] ?? item.estatus ?? 'nuevo'}
                                                    onChange={(event) => updateStatus(item.id, event.target.value)}
                                                    className="h-8 rounded-md border border-[#1A2236] bg-[#0F172A] px-2 text-xs text-[#E6F1FF] focus:border-[#00E5FF]/50 focus:outline-hidden"
                                                >
                                                    <option value="nuevo">Nuevo</option>
                                                    <option value="contactado">Contactado</option>
                                                    <option value="interesado">Interesado</option>
                                                    <option value="cliente">Cliente</option>
                                                    <option value="descartado">Descartado</option>
                                                </select>
                                                {savingStatus[item.id] ? (
                                                    <div className="mt-1 text-[10px] text-[#7B8AA0]">Guardando...</div>
                                                ) : null}
                                            </td>
                                            <td className="px-3 py-2">
                                                {item.url_maps ? (
                                                    <a
                                                        href={item.url_maps}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[#00E5FF] hover:underline"
                                                    >
                                                        Ver
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-[#7B8AA0]">
                    <span className="rounded-lg border border-[#1A2236] bg-[#0F172A] px-3 py-1.5 text-[#E6F1FF]">
                        Página {prospectos.current_page} de {prospectos.last_page}
                    </span>

                    <div className="flex items-center gap-2">
                        {prospectos.prev_page_url ?
                            <Link
                                href={prospectos.prev_page_url}
                                className="inline-flex h-9 items-center rounded-lg border border-[#1A2236] bg-[#0F172A] px-4 text-[#E6F1FF] transition hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10"
                            >
                                ← Anterior
                            </Link>
                        :
                            <span className="inline-flex h-9 items-center rounded-lg border border-[#1A2236]/50 bg-[#0F172A]/50 px-4 text-[#4B5565]">
                                ← Anterior
                            </span>
                        }

                        {prospectos.next_page_url ?
                            <Link
                                href={prospectos.next_page_url}
                                className="inline-flex h-9 items-center rounded-lg border border-[#1A2236] bg-[#0F172A] px-4 text-[#E6F1FF] transition hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10"
                            >
                                Siguiente →
                            </Link>
                        :
                            <span className="inline-flex h-9 items-center rounded-lg border border-[#1A2236]/50 bg-[#0F172A]/50 px-4 text-[#4B5565]">
                                Siguiente →
                            </span>
                        }
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
