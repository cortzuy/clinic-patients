import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type SharedData } from '@/types';
import { useState } from 'react';
import {
    CalendarPlus,
    ClipboardList,
    Pencil,
    ChevronDown,
    ChevronLeft,
    FileText,
    LayoutList,
    Activity,
    FlaskConical,
    AlignJustify,
    Settings,
    Plus,
    Search,
    AlignLeft,
    MoreHorizontal,
    Minus,
    CalendarCheck,
    X,
} from 'lucide-react';

interface SoapNote {
    id: number;
    patient_id: number;
    user_id: number;
    chief_complaint: string | null;
    history_of_present_illness: string | null;
    remarks: string | null;
    diagnosis: string | null;
    plan: string | null;
    created_at: string;
    user?: { name: string };
}

interface Patient {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    suffix?: string;
    nickname?: string;
    birth_date?: string;
    sex?: 'male' | 'female';
    email?: string;
    primary_mobile?: string;
    blood_type?: string;
    civil_status?: string;
    philhealth_no?: string;
    nationality?: string;
    race?: string;
    religion?: string;
    address?: string;
    other_mobile?: string;
    occupation?: string;
    employer_name?: string;
    hmo?: string;
    emergency_contact_name?: string;
    emergency_contact_number?: string;
    emergency_contact_relationship?: string;
    referring_physician?: string;
    primary_care_physician?: string;
    avatar_url?: string;
    notes?: string;
    created_at?: string;
    soap_notes?: SoapNote[];
}

function calculateAge(birthDate: string | undefined): string {
    if (!birthDate) return '—';
    const today = new Date();
    const birth = new Date(birthDate);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    const days = today.getDate() - birth.getDate();
    let totalMonths = years * 12 + months + (days < 0 ? -1 : 0);
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    const parts = [];
    if (y > 0) parts.push(`${y} year${y !== 1 ? 's' : ''}`);
    if (m > 0) parts.push(`${m} month${m !== 1 ? 's' : ''}`);
    return parts.join(', ') || '< 1 month';
}

function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

export default function PatientsShow() {
    const page = usePage<SharedData & { patient: Patient }>();
    const patient = page.props.patient;
    const [activeTab, setActiveTab] = useState('Notes');
    const [showNewRecord, setShowNewRecord] = useState(false);
    const [recordSearch, setRecordSearch] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
    const [notesView, setNotesView] = useState<'records' | 'list' | 'prescriptions'>('records');

    const { data, setData, post, processing, reset } = useForm({
        chief_complaint: '',
        history_of_present_illness: '',
        remarks: '',
        diagnosis: '',
        plan: '',
    });

    const isSoapDirty = Object.values(data).some((v) => v.trim() !== '');

    const handleSaveSoap = () => {
        post(route('patients.soap-notes.store', patient.id), {
            onSuccess: () => {
                reset();
                setSelectedRecord(null);
                setShowNewRecord(false);
            },
        });
    };

    const resetSoap = () => reset();

    const recordTypes = [
        {
            label: 'Medical History',
            preview: (
                <div className="space-y-1 p-2">
                    <div className="h-2 w-3/4 rounded bg-neutral-300" />
                    <div className="h-1.5 w-full rounded bg-neutral-200" />
                    <div className="h-1.5 w-full rounded bg-neutral-200" />
                    <div className="h-1.5 w-2/3 rounded bg-neutral-200" />
                    <div className="mt-1 h-2 w-1/2 rounded bg-neutral-300" />
                    <div className="h-1.5 w-full rounded bg-neutral-200" />
                </div>
            ),
        },
        {
            label: 'Lab Results',
            preview: (
                <div className="flex h-full items-center justify-center">
                    <svg viewBox="0 0 60 60" className="h-14 w-14 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2">
                        <ellipse cx="30" cy="42" rx="14" ry="10" />
                        <path d="M22 28 L18 42" />
                        <path d="M38 28 L42 42" />
                        <rect x="20" y="10" width="20" height="20" rx="2" />
                        <line x1="30" y1="10" x2="30" y2="6" />
                        <line x1="24" y1="10" x2="24" y2="6" />
                        <line x1="36" y1="10" x2="36" y2="6" />
                    </svg>
                </div>
            ),
        },
        {
            label: 'Vitals',
            preview: (
                <div className="space-y-2 p-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-red-400">♥</span>
                        <span className="font-semibold text-neutral-600">68</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-red-300">◎</span>
                        <span className="font-semibold text-neutral-600">115/70</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-yellow-400">🌡</span>
                        <span className="font-semibold text-neutral-600">36</span>
                    </div>
                </div>
            ),
        },
        {
            label: 'SOAP',
            preview: (
                <div className="space-y-1 p-2 text-[9px] text-neutral-400">
                    <div className="font-semibold">CC</div>
                    <div className="h-1.5 w-full rounded bg-neutral-200" />
                    <div className="mt-1 font-semibold">HPI</div>
                    <div className="h-1.5 w-full rounded bg-neutral-200" />
                    <div className="mt-1 font-semibold">DIAGNOSIS</div>
                    <div className="h-1.5 w-3/4 rounded bg-neutral-200" />
                    <div className="mt-1 font-semibold">PLAN</div>
                    <div className="h-1.5 w-full rounded bg-neutral-200" />
                </div>
            ),
        },
        {
            label: 'Prescription',
            preview: (
                <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-serif font-bold text-blue-400">Rx</div>
                        <div className="mt-1 space-y-1">
                            <div className="h-1.5 w-16 rounded bg-neutral-200 mx-auto" />
                            <div className="h-1.5 w-12 rounded bg-neutral-200 mx-auto" />
                            <div className="h-1.5 w-14 rounded bg-neutral-200 mx-auto" />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            label: 'Test Request',
            preview: (
                <div className="flex h-full items-center justify-center">
                    <svg viewBox="0 0 60 60" className="h-14 w-14 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="22" cy="38" r="10" />
                        <line x1="29" y1="45" x2="46" y2="54" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="22" cy="22" r="6" />
                        <line x1="22" y1="16" x2="22" y2="10" />
                        <line x1="28" y1="18" x2="32" y2="14" />
                    </svg>
                </div>
            ),
        },
        {
            label: 'Text',
            preview: (
                <div className="space-y-1 p-2">
                    <div className="h-2 w-1/3 rounded bg-blue-300" />
                    <div className="h-1.5 w-full rounded bg-neutral-200" />
                    <div className="h-1.5 w-full rounded bg-neutral-200" />
                    <div className="h-1.5 w-4/5 rounded bg-neutral-200" />
                    <div className="mt-1 h-1.5 w-full rounded bg-neutral-200" />
                </div>
            ),
        },
        {
            label: 'Image Templates',
            preview: (
                <div className="flex h-full items-center justify-center">
                    <svg viewBox="0 0 60 70" className="h-14 w-10 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <ellipse cx="30" cy="18" rx="8" ry="8" />
                        <path d="M16 34 Q18 26 30 26 Q42 26 44 34 L46 58 Q44 64 30 64 Q16 64 14 58 Z" />
                        <line x1="22" y1="38" x2="38" y2="38" />
                        <line x1="20" y1="32" x2="18" y2="46" />
                        <line x1="40" y1="32" x2="42" y2="46" />
                    </svg>
                </div>
            ),
        },
        {
            label: 'Educational Mat...',
            preview: (
                <div className="flex h-full items-center justify-center">
                    <div className="relative">
                        <div className="h-14 w-10 rounded border-2 border-blue-300 bg-blue-50 flex items-end justify-end p-0.5">
                            <div className="space-y-0.5">
                                <div className="h-1 w-6 rounded bg-blue-200" />
                                <div className="h-1 w-5 rounded bg-blue-200" />
                                <div className="h-1 w-6 rounded bg-blue-200" />
                            </div>
                        </div>
                        <div className="absolute -right-2 -top-1 h-4 w-3 rounded-sm border border-blue-300 bg-white" />
                    </div>
                </div>
            ),
        },
    ];

    const filteredRecordTypes = recordTypes.filter((r) =>
        r.label.toLowerCase().includes(recordSearch.toLowerCase()),
    );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Patients', href: route('patients') },
        { title: `${patient.last_name}, ${patient.first_name}`, href: route('patients.show', patient.id) },
    ];

    const tabs = [
        { label: 'Notes', icon: <FileText className="h-4 w-4" /> },
        { label: 'History', icon: <LayoutList className="h-4 w-4" /> },
        { label: 'Vitals', icon: <Activity className="h-4 w-4" /> },
        { label: 'Labs', icon: <FlaskConical className="h-4 w-4" /> },
        { label: 'Virtual Sessions', icon: <AlignJustify className="h-4 w-4" /> },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${patient.first_name} ${patient.last_name}`} />

            <div className="relative flex h-full flex-1 flex-col overflow-hidden">
                {/* ── Top action bar ── */}
                <div className="flex items-center justify-end gap-2 border-b border-border px-6 py-3">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <CalendarPlus className="h-3.5 w-3.5" />
                        Schedule an Appointment
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <ClipboardList className="h-3.5 w-3.5" />
                        Admit Patient
                    </Button>
                    <Link href={route('patients.create')}>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Button>
                    </Link>
                </div>

                {/* ── Patient header ── */}
                <div className="border-b border-border bg-white px-8 py-6 dark:bg-neutral-950">
                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <Avatar className="h-20 w-20 shrink-0 bg-neutral-200 text-neutral-500 dark:bg-neutral-700">
                            {patient.avatar_url ? (
                                <AvatarImage src={patient.avatar_url} alt={`${patient.first_name} ${patient.last_name}`} />
                            ) : (
                                <AvatarFallback className="text-2xl font-semibold text-neutral-500 dark:text-neutral-300">
                                    {getInitials(patient.first_name, patient.last_name)}
                                </AvatarFallback>
                            )}
                        </Avatar>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            {/* Name + chevron */}
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                                    {patient.last_name}, {patient.first_name}
                                    {patient.suffix ? ` ${patient.suffix}` : ''}
                                </h1>
                                <ChevronDown className="h-4 w-4 text-neutral-400" />
                            </div>

                            {/* DOB | Age | Sex */}
                            <div className="mt-1 flex items-center gap-0 text-sm text-neutral-600 dark:text-neutral-400">
                                {patient.birth_date && (
                                    <>
                                        <span>{formatDate(patient.birth_date)}</span>
                                        <span className="mx-3 text-neutral-300 dark:text-neutral-600">|</span>
                                        <span>{calculateAge(patient.birth_date)}</span>
                                        <span className="mx-3 text-neutral-300 dark:text-neutral-600">|</span>
                                    </>
                                )}
                                {patient.sex && (
                                    <span className="capitalize">{patient.sex}</span>
                                )}
                            </div>

                            {/* Metadata rows */}
                            <div className="mt-3 space-y-0.5">
                                <div className="flex items-baseline gap-4">
                                    <span className="w-36 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Last Appointment</span>
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">-</span>
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <span className="w-36 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Blood Type</span>
                                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{patient.blood_type ?? 'NA'}</span>
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <span className="w-36 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">HMO</span>
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{patient.hmo ? patient.hmo : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tab bar ── */}
                <div className="flex items-center justify-between border-b border-border bg-white px-8 dark:bg-neutral-950">
                    <div className="flex items-center gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.label}
                                type="button"
                                onClick={() => setActiveTab(tab.label)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 my-2 text-sm font-medium transition-colors ${
                                    activeTab === tab.label
                                        ? 'bg-primary text-white'
                                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            <Settings className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowNewRecord(true)}
                            className="rounded-full bg-primary p-1.5 text-white hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* ── Tab content ── */}
                <div className="flex flex-1 flex-col bg-neutral-100 dark:bg-neutral-950">
                    {activeTab === 'Notes' && (
                        <>
                            {/* View toggle */}
                            <div className="flex justify-end px-6 pt-4 pb-2">
                                <div className="flex items-center gap-1 rounded-full bg-white border border-input p-0.5 dark:bg-neutral-900">
                                    {(['records', 'list', 'prescriptions'] as const).map((view) => (
                                        <button
                                            key={view}
                                            type="button"
                                            onClick={() => setNotesView(view)}
                                            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                                                notesView === view
                                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                            }`}
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Records list */}
                            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
                                {(patient.soap_notes ?? []).length === 0 ? (
                                    <div className="flex items-center justify-center pt-16">
                                        <div className="rounded-xl border border-input bg-white p-10 text-center shadow-sm dark:bg-neutral-900" style={{ minWidth: 480 }}>
                                            <p className="text-sm text-neutral-400">
                                                No record found. To start adding Notes, click the '+' button above.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    (patient.soap_notes ?? []).map((note) => (
                                        <div key={note.id} className="rounded-xl border border-input bg-white p-5 shadow-sm dark:bg-neutral-900">
                                            {/* Card header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <p className="text-base font-semibold text-neutral-900 dark:text-white">Health Record</p>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                                        {note.user?.name && <span>{note.user.name}</span>}
                                                        <span>No Clinic</span>
                                                        <span>·</span>
                                                        <span>{formatDate(note.created_at)}</span>
                                                        <span>·</span>
                                                        <span>{calculateAge(patient.birth_date)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button type="button" className="text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                                                        CREATE FOLLOWUP
                                                    </button>
                                                    <button type="button" className="rounded p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* SOAP fields */}
                                            <div className="space-y-1.5">
                                                {[
                                                    { key: 'CHIEF COMPLAINT', value: note.chief_complaint },
                                                    { key: 'HPI', value: note.history_of_present_illness },
                                                    { key: 'REMARKS', value: note.remarks },
                                                    { key: 'DIAGNOSIS', value: note.diagnosis },
                                                    { key: 'PLAN', value: note.plan },
                                                ].filter((row) => row.value && row.value.trim() !== '').map((row) => (
                                                    <div key={row.key} className="grid grid-cols-[140px_1fr] gap-2 text-sm">
                                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pt-0.5">{row.key}</span>
                                                        <span className="text-neutral-700 dark:text-neutral-300">{row.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {activeTab !== 'Notes' && (
                        <div className="flex flex-1 items-center justify-center p-8">
                            <div className="rounded-xl border border-input bg-white p-10 text-center shadow-sm dark:bg-neutral-900" style={{ minWidth: 480 }}>
                                <p className="text-sm text-neutral-400">
                                    No record found. To start adding {activeTab}, click the '+' button above.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Create New Record panel ── */}
                {/* Backdrop */}
                {showNewRecord && !selectedRecord && (
                    <div
                        className="absolute inset-0 z-20 bg-black/30"
                        onClick={() => setShowNewRecord(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Slide-in panel */}
                <div
                    className={`absolute right-0 top-0 z-30 flex h-full w-80 flex-col bg-white shadow-2xl dark:bg-neutral-900 transition-transform duration-300 ease-in-out ${showNewRecord && !selectedRecord ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    {/* Panel header */}
                    <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                        <button
                            type="button"
                            onClick={() => setShowNewRecord(false)}
                            className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            aria-label="Close panel"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h2 className="flex-1 text-center text-base font-semibold text-neutral-900 dark:text-white">
                            Create New Record
                        </h2>
                    </div>

                    {/* Search */}
                    <div className="px-4 pt-3 pb-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder="Search"
                                value={recordSearch}
                                onChange={(e) => setRecordSearch(e.target.value)}
                                className="pl-9 text-sm"
                            />
                        </div>
                    </div>

                    {/* Record type grid */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        <div className="grid grid-cols-3 gap-3">
                            {filteredRecordTypes.map((record) => (
                                <button
                                    key={record.label}
                                    type="button"
                                    onClick={() => setSelectedRecord(record.label)}
                                    className="flex flex-col overflow-hidden rounded-xl border border-input bg-neutral-50 hover:border-primary/50 hover:bg-primary/5 transition-colors dark:bg-neutral-800"
                                >
                                    <div className="flex h-20 w-full items-center justify-center bg-white dark:bg-neutral-700">
                                        {record.preview}
                                    </div>
                                    <div className="px-1.5 py-1.5">
                                        <p className="text-center text-[11px] leading-tight text-neutral-600 dark:text-neutral-300">
                                            {record.label}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Panel footer */}
                    <div className="flex items-center justify-center border-t border-border px-4 py-3">
                        <button type="button" className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                            <AlignLeft className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* ── SOAP / Record form view ── */}
                {selectedRecord && (
                    <div className="absolute inset-0 z-40 flex bg-neutral-100 dark:bg-neutral-950">
                        {/* Left sidebar: record type list */}
                        <div className="flex w-28 flex-col border-r border-border bg-white dark:bg-neutral-900 overflow-y-auto">
                            <div className="flex items-center justify-between px-3 py-3 border-b border-border">
                                <button
                                    type="button"
                                    onClick={() => { setSelectedRecord(null); setShowNewRecord(true); }}
                                    className="text-neutral-500 hover:text-neutral-700"
                                    aria-label="Back"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Add Notes</span>
                            </div>
                            <div className="px-2 py-2">
                                <div className="relative mb-2">
                                    <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-neutral-400" />
                                    <input placeholder="Search" className="w-full rounded border border-input bg-neutral-50 py-1 pl-6 pr-2 text-[10px] outline-none dark:bg-neutral-800" />
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {recordTypes.map((r) => (
                                        <button
                                            key={r.label}
                                            type="button"
                                            onClick={() => setSelectedRecord(r.label)}
                                            className={`flex flex-col items-center overflow-hidden rounded-lg border transition-colors ${selectedRecord === r.label ? 'border-primary bg-primary/5' : 'border-input bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800'}`}
                                        >
                                            <div className="flex h-12 w-full items-center justify-center bg-white dark:bg-neutral-700 text-[8px]">
                                                {r.preview}
                                            </div>
                                            <p className="w-full px-0.5 py-0.5 text-center text-[9px] leading-tight text-neutral-600 dark:text-neutral-300 truncate">
                                                {r.label}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main form — switches per record type */}
                        <div className="flex flex-1 flex-col overflow-hidden">
                            {/* Form header */}
                            <div className="flex items-center justify-between border-b border-border bg-white px-6 py-3 dark:bg-neutral-900">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {selectedRecord === 'Prescription' ? 'NEW PRESCRIPTION' : 'SOAP Note'}
                                    </span>
                                    {selectedRecord !== 'Prescription' && (
                                        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                            <span>No Error</span>
                                            <span>·</span>
                                            <span>{formatDate(new Date().toISOString())}</span>
                                            <span>·</span>
                                            <span>{calculateAge(patient.birth_date)}</span>
                                            <Pencil className="h-3 w-3 cursor-pointer hover:text-neutral-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedRecord === 'SOAP' && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            disabled={!isSoapDirty || processing}
                                            onClick={handleSaveSoap}
                                            className="h-7 px-3 text-xs"
                                        >
                                            {processing ? 'Saving...' : 'Save'}
                                        </Button>
                                    )}
                                    {selectedRecord === 'Prescription' && (
                                        <>
                                            <button type="button" className="text-xs text-neutral-500 hover:text-neutral-700 px-2">SAVE Rx</button>
                                            <button type="button" className="text-xs text-neutral-500 hover:text-neutral-700 px-2">SAVE AND PRINT</button>
                                            <button type="button" className="text-xs text-neutral-500 hover:text-neutral-700 px-2">SAVE AND SEND</button>
                                        </>
                                    )}
                                    <button type="button" className="rounded p-1 text-neutral-400 hover:bg-neutral-100">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                    <button type="button" className="rounded p-1 text-neutral-400 hover:bg-neutral-100">
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedRecord(null); setShowNewRecord(false); resetSoap(); }}
                                        className="rounded p-1 text-neutral-400 hover:bg-neutral-100"
                                        aria-label="Close"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* ── SOAP form ── */}
                            {selectedRecord === 'SOAP' && (
                                <>
                                    {/* Status pills */}
                                    <div className="flex items-center gap-2 border-b border-border bg-white px-6 py-2 dark:bg-neutral-900">
                                        <span className="rounded-full border border-input px-3 py-0.5 text-xs text-neutral-500">SIMPLIFY SOAP</span>
                                        <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-white">APPROVED SOAP</span>
                                    </div>

                                    {/* Scrollable form body */}
                                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                                        <SoapSection title="SUBJECTIVE">
                                            <SoapField label="Chief Complaint" value={data.chief_complaint} onChange={(v) => setData('chief_complaint', v)} />
                                            <SoapField label="History of Present Illness" rows={4} value={data.history_of_present_illness} onChange={(v) => setData('history_of_present_illness', v)} />
                                            <p className="text-[10px] text-neutral-400">Subjective: Define information from this visit record to select Name, Last Remarks, Vitals, too.</p>
                                            <SoapField label="Remarks" rows={3} value={data.remarks} onChange={(v) => setData('remarks', v)} />
                                            <button type="button" className="flex items-center gap-1 text-xs text-primary hover:underline">
                                                <Plus className="h-3 w-3" /> Add Remarks
                                            </button>
                                        </SoapSection>

                                        <SoapSection title="ASSESSMENT">
                                            <SoapField label="Diagnosis" rows={3} value={data.diagnosis} onChange={(v) => setData('diagnosis', v)} />
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                <SoapAddButton label="Add Diagnosis" />
                                                <SoapAddButton label="Add ICD 10" />
                                                <SoapAddButton label="Add Remarks" />
                                            </div>
                                        </SoapSection>

                                        <SoapSection title="PLAN">
                                            <SoapField label="Plan" rows={3} value={data.plan} onChange={(v) => setData('plan', v)} />
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                <SoapAddButton label="Add Plan" />
                                                <SoapAddButton label="Add Procedure" />
                                                <SoapAddButton label="Add PhilHealth" />
                                                <SoapAddButton label="Add Remarks" />
                                            </div>
                                        </SoapSection>

                                        <SoapSection title="Follow-up / Check-up">
                                            <button type="button" className="flex items-center gap-1.5 rounded-full border border-input bg-white px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300">
                                                <CalendarCheck className="h-3.5 w-3.5 text-primary" />
                                                Schedule Follow Up
                                            </button>
                                        </SoapSection>
                                    </div>
                                </>
                            )}

                            {/* ── Prescription form ── */}
                            {selectedRecord === 'Prescription' && (
                                <PrescriptionForm patient={patient} onClose={() => { setSelectedRecord(null); setShowNewRecord(false); }} />
                            )}

                            {/* ── Other record types placeholder ── */}
                            {selectedRecord !== 'SOAP' && selectedRecord !== 'Prescription' && (
                                <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
                                    {selectedRecord} form coming soon.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function SoapSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">{title}</p>
            {children}
        </div>
    );
}

function SoapField({ label, rows = 2, value, onChange }: { label: string; rows?: number; value: string; onChange: (v: string) => void }) {
    return (
        <div className="relative rounded-xl border border-input bg-white dark:bg-neutral-800">
            <textarea
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full resize-none rounded-xl bg-transparent px-4 pt-7 pb-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 dark:text-neutral-200"
            />
            <span className="absolute left-4 top-2.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
            <button type="button" className="absolute right-3 top-2.5 text-neutral-300 hover:text-neutral-500">
                <AlignLeft className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

function SoapAddButton({ label }: { label: string }) {
    return (
        <button type="button" className="flex items-center gap-1 rounded-full border border-input bg-white px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300">
            <Plus className="h-3 w-3" /> {label}
        </button>
    );
}

interface Medication {
    id: number;
    name: string;
    sig: string;
}

const FAVORITE_MEDICATIONS: Medication[] = [
    { id: 1, name: 'COAMOXICLAV 625 MG TABLET', sig: '1 TABLET 2X A DAY 7 DAYS' },
    { id: 2, name: 'LuteinCapsule', sig: '1 CAPSULE 1X A DAY' },
    { id: 3, name: 'AMOXICILLIN DROPS (ALTOMOX)', sig: '0.8 ML 3X A DAY 7 DAYS' },
    { id: 4, name: 'SALBUTAMOL SYRUP', sig: '4 ML 3X A DAY 5 DAYS' },
    { id: 5, name: 'OMX (OMX Capsule) Capsule', sig: '1 CAPSULE 3X A DAY 7 DAYS' },
    { id: 6, name: 'SALBUTAMOL + GUIAFENESIN SYRUP', sig: '3 ML 3X A DAY 5 DAYS' },
];

function PrescriptionForm({ onClose }: { patient: Patient; onClose: () => void }) {
    const [search, setSearch] = useState('');
    const [selectedMeds, setSelectedMeds] = useState<Medication[]>([]);
    const [saveAsTemplate, setSaveAsTemplate] = useState(false);
    const [editingMed, setEditingMed] = useState<Medication | null>(null);
    const [draftForm, setDraftForm] = useState({ generic_name: '', brand_name: '', dose: '', form: '', qty: 14, sig: '' });

    const filtered = FAVORITE_MEDICATIONS.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()),
    );

    const handleMedClick = (med: Medication) => {
        setEditingMed(med);
        setDraftForm({ generic_name: med.name, brand_name: '', dose: '', form: '', qty: 14, sig: med.sig });
    };

    const handleAdd = () => {
        if (editingMed && !selectedMeds.find((m) => m.id === editingMed.id)) {
            setSelectedMeds((prev) => [...prev, { ...editingMed, sig: draftForm.sig }]);
        }
        setEditingMed(null);
    };

    const removeMed = (id: number) => setSelectedMeds((prev) => prev.filter((m) => m.id !== id));

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Left panel */}
            <div className="flex w-64 flex-col border-r border-border bg-white dark:bg-neutral-900 overflow-hidden">
                {/* Header — switches between Select Medication and Add Prescription */}
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <button
                        type="button"
                        onClick={() => editingMed ? setEditingMed(null) : onClose()}
                        className="text-neutral-500 hover:text-neutral-700"
                        aria-label="Back"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                        {editingMed ? 'Add Prescription' : 'Select Medication'}
                    </span>
                </div>

                {/* ── Select Medication view ── */}
                {!editingMed && (
                    <>
                        <div className="px-3 py-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                <input
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-lg border border-input bg-neutral-50 py-1.5 pl-9 pr-3 text-sm outline-none dark:bg-neutral-800 dark:text-neutral-200"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
                            <p className="px-1 py-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Favorites</p>
                            {filtered.map((med) => (
                                <button
                                    key={med.id}
                                    type="button"
                                    onClick={() => handleMedClick(med)}
                                    className="w-full rounded-lg px-2 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                        {med.name}
                                        <span className="ml-1 text-xs font-normal text-neutral-400">SIG:</span>
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{med.sig}</p>
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-border px-3 py-2">
                            <button type="button" className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-primary dark:text-neutral-300">
                                <Plus className="h-4 w-4" /> Add Medication
                            </button>
                        </div>
                    </>
                )}

                {/* ── Add Prescription form ── */}
                {editingMed && (
                    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-3 space-y-4">
                        {/* Generic Name */}
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                                Generic Name <span className="text-destructive">*</span>
                            </label>
                            <input
                                value={draftForm.generic_name}
                                onChange={(e) => setDraftForm((p) => ({ ...p, generic_name: e.target.value }))}
                                className="w-full rounded border border-input bg-neutral-50 px-3 py-1.5 text-sm outline-none focus:border-primary dark:bg-neutral-800 dark:text-neutral-200"
                            />
                        </div>

                        {/* Brand Name */}
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Brand Name</label>
                            <input
                                value={draftForm.brand_name}
                                onChange={(e) => setDraftForm((p) => ({ ...p, brand_name: e.target.value }))}
                                className="w-full rounded border border-input bg-neutral-50 px-3 py-1.5 text-sm outline-none focus:border-primary dark:bg-neutral-800 dark:text-neutral-200"
                            />
                        </div>

                        {/* Dose */}
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Dose</label>
                            <input
                                value={draftForm.dose}
                                onChange={(e) => setDraftForm((p) => ({ ...p, dose: e.target.value }))}
                                className="w-40 rounded border border-input bg-neutral-50 px-3 py-1.5 text-sm outline-none focus:border-primary dark:bg-neutral-800 dark:text-neutral-200"
                            />
                        </div>

                        {/* Form */}
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Form</label>
                            <select
                                value={draftForm.form}
                                onChange={(e) => setDraftForm((p) => ({ ...p, form: e.target.value }))}
                                className="w-full rounded border border-input bg-neutral-50 px-3 py-1.5 text-sm outline-none focus:border-primary dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <option value="" />
                                <option value="Tablet">Tablet</option>
                                <option value="Capsule">Capsule</option>
                                <option value="Syrup">Syrup</option>
                                <option value="Drops">Drops</option>
                                <option value="Injection">Injection</option>
                                <option value="Cream">Cream</option>
                                <option value="Ointment">Ointment</option>
                            </select>
                        </div>

                        {/* Qty */}
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Qty</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={draftForm.qty}
                                    onChange={(e) => setDraftForm((p) => ({ ...p, qty: Number(e.target.value) }))}
                                    className="w-16 rounded border border-input bg-neutral-50 px-3 py-1.5 text-center text-sm outline-none focus:border-primary dark:bg-neutral-800 dark:text-neutral-200"
                                />
                                <button type="button" onClick={() => setDraftForm((p) => ({ ...p, qty: p.qty + 1 }))} className="rounded border border-input p-1 hover:bg-neutral-100">
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                                <button type="button" onClick={() => setDraftForm((p) => ({ ...p, qty: Math.max(1, p.qty - 1) }))} className="rounded border border-input p-1 hover:bg-neutral-100">
                                    <Minus className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Sig */}
                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Sig</label>
                                <button type="button" className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 hover:text-primary">Advanced Option »</button>
                            </div>
                            <div className="w-full rounded border border-input bg-neutral-100 px-3 py-2 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                {draftForm.sig || '—'}
                            </div>
                        </div>

                        {/* ADD button */}
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!draftForm.generic_name.trim()}
                            className="mt-2 rounded border border-input bg-white px-6 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 dark:bg-neutral-800 dark:text-neutral-200"
                        >
                            ADD
                        </button>
                    </div>
                )}
            </div>

            {/* Right: prescription area */}
            <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950">
                {/* Sub-header */}
                <div className="flex items-center justify-between border-b border-border bg-white px-6 py-2 dark:bg-neutral-900">
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Prescription</span>
                    <div className="flex items-center gap-3">
                        {/* Save as Template toggle */}
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={saveAsTemplate}
                                onClick={() => setSaveAsTemplate((v) => !v)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${saveAsTemplate ? 'bg-primary' : 'bg-input'}`}
                            >
                                <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${saveAsTemplate ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                            Save as Template
                        </div>
                    </div>
                </div>

                {/* Prescription content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {selectedMeds.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-sm text-neutral-400">Choose from the list</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedMeds.map((med, index) => (
                                <div key={med.id} className="flex items-start justify-between rounded-xl border border-input bg-white p-4 shadow-sm dark:bg-neutral-800">
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                            {index + 1}. {med.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                            <span className="font-medium text-neutral-600 dark:text-neutral-300">Sig: </span>{med.sig}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeMed(med.id)}
                                        className="ml-3 mt-0.5 shrink-0 rounded p-0.5 text-neutral-300 hover:bg-neutral-100 hover:text-neutral-500 dark:hover:bg-neutral-700"
                                        aria-label="Remove medication"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                {selectedMeds.length > 0 && (
                    <div className="flex items-center justify-end gap-2 border-t border-border bg-white px-6 py-3 dark:bg-neutral-900">
                        <Button variant="outline" size="sm" type="button">Save Rx</Button>
                        <Button variant="outline" size="sm" type="button">Save and Print</Button>
                        <Button size="sm" type="button">Save and Send</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
