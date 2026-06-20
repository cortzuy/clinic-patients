import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreVertical, Search } from 'lucide-react';
import { type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Patients',
        href: '/patients',
    },
];

interface Patient {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    birth_date?: string;
    sex?: 'male' | 'female';
}

function getInitials(first_name: string, last_name: string): string {
    return (first_name.charAt(0) + last_name.charAt(0)).toUpperCase();
}

function calculateAge(birthDate: string | undefined): number | null {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function groupPatientsByFirstLetter(patients: Patient[]): Record<string, Patient[]> {
    return patients.reduce((acc, patient) => {
        const letter = patient.last_name.charAt(0).toUpperCase();
        if (!acc[letter]) {
            acc[letter] = [];
        }
        acc[letter].push(patient);
        return acc;
    }, {} as Record<string, Patient[]>);
}

export default function PatientsList() {
    const page = usePage<SharedData>();
    const patients = page.props.patients as Patient[];
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPatients = useMemo(() => {
        if (!searchQuery.trim()) return patients;
        return patients.filter((patient) =>
            `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [patients, searchQuery]);

    const groupedPatients = useMemo(() => {
        const sorted = [...filteredPatients].sort((a, b) =>
            a.last_name.localeCompare(b.last_name)
        );
        return groupPatientsByFirstLetter(sorted);
    }, [filteredPatients]);

    const letters = Object.keys(groupedPatients).sort();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="rounded-3xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:bg-black/40 dark:border-sidebar-border">
                    <div className="mb-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-foreground/80">Patient Directory</p>
                                <h1 className="mt-2 text-3xl font-semibold">All Patients</h1>
                            </div>
                            <Link href={route('patients.create')} className="flex items-center gap-2">
                                <Button className="rounded-full h-12 w-12 p-0 flex items-center justify-center text-lg font-bold">
                                    +
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                <Input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button variant="outline" size="sm">
                                SORT BY
                            </Button>
                            <Button variant="outline" size="sm">
                                FILTER
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {letters.length > 0 ? (
                            letters.map((letter) => (
                                <div key={letter}>
                                    <h2 className="mb-3 text-lg font-semibold text-neutral-700 dark:text-neutral-300">{letter}</h2>
                                    <div className="space-y-2">
                                        {groupedPatients[letter].map((patient) => {
                                            const age = calculateAge(patient.birth_date);
                                            const initials = getInitials(patient.first_name, patient.last_name);

                                            return (
                                                <div
                                                    key={patient.id}
                                                    className="flex items-center justify-between rounded-3xl border border-input/60 bg-background p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-12 w-12 bg-neutral-300 dark:bg-neutral-600">
                                                            <AvatarFallback className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                                                {initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-base font-semibold text-neutral-900 dark:text-white">
                                                                {patient.last_name.toUpperCase()}, {patient.first_name}
                                                            </p>
                                                            <div className="mt-1 flex gap-4 text-xs uppercase tracking-[0.05em] text-neutral-500 dark:text-neutral-400">
                                                                {age !== null && <span>AGE {age}</span>}
                                                                {patient.sex && <span>GENDER {patient.sex}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                                    >
                                                        <MoreVertical className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-3xl border border-input/60 bg-background p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                No patients found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
