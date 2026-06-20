import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

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

import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function Patients() {
    const page = usePage<SharedData>();
    const patients = page.props.patients as Array<{
        id: number;
        first_name: string;
        last_name: string;
        email?: string;
    }>;

    const [sex, setSex] = useState<'male' | 'female'>('male');
    const [bloodType, setBloodType] = useState<string>('NA');
    const [civilStatus, setCivilStatus] = useState<'Single' | 'Married' | 'Separated' | 'Widowed'>('Single');
    const [inviteToNowServing, setInviteToNowServing] = useState<boolean>(false);
    const [patientTags, setPatientTags] = useState<string>('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="rounded-3xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:bg-black/40 dark:border-sidebar-border">
                    <div className="mb-6 flex flex-col gap-2">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-foreground/80">Personal Information</p>
                            <h1 className="mt-2 text-3xl font-semibold">New patient record</h1>
                        </div>
                        <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
                            Add a new patient profile with their contact, identification, and referral details.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" placeholder="First name" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" placeholder="Last name" />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="middle-name">Middle Name</Label>
                                    <Input id="middle-name" placeholder="Middle name" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="suffix">Suffix</Label>
                                    <Input id="suffix" placeholder="ex. Jr, Sr, etc" />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="nickname">Nickname</Label>
                                    <Input id="nickname" placeholder="Nickname" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="birth-date">Date of Birth</Label>
                                    <Input id="birth-date" type="date" />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="sex">Sex</Label>
                                    <ToggleGroup type="single" value={sex} onValueChange={(value) => value && setSex(value as 'male' | 'female')} className="grid grid-cols-2 gap-2">
                                        <ToggleGroupItem value="male" className="rounded-full border border-input px-4 py-2 text-sm" aria-label="Male">
                                            Male
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="female" className="rounded-full border border-input px-4 py-2 text-sm" aria-label="Female">
                                            Female
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="Email address" />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Primary Mobile</Label>
                                    <div className="flex items-center gap-2 rounded-md border border-input bg-background p-1.5">
                                        <span className="inline-flex items-center rounded-md border border-input bg-muted px-3 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                                            +63
                                        </span>
                                        <Input id="phone" placeholder="9XXXXXXXXX" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tags">Patient Tags</Label>
                                    <Select value={patientTags} onValueChange={setPatientTags}>
                                        <SelectTrigger aria-label="Patient tags">
                                            <SelectValue placeholder="Select patient tags" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New Patient</SelectItem>
                                            <SelectItem value="follow-up">Follow-up</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                            <SelectItem value="chronic">Chronic Care</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-accent/20 bg-accent/10 p-4 text-sm text-neutral-700 dark:border-accent/30 dark:bg-accent/10 dark:text-neutral-200">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">Invite patient to NowServing App</p>
                                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                            Once your patient accepts the invite and links this record, they can view the records you share with them, book appointments, and chat with you.
                                        </p>
                                    </div>
                                    <Button variant={inviteToNowServing ? 'default' : 'outline'} size="sm" onClick={() => setInviteToNowServing((current) => !current)}>
                                        {inviteToNowServing ? 'Invited' : 'Invite'}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="philhealth">Philhealth No.</Label>
                                    <Input id="philhealth" placeholder="Philhealth number" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="blood-type">Blood Type</Label>
                                    <ToggleGroup type="single" value={bloodType} onValueChange={(value) => value && setBloodType(value)} className="grid grid-cols-4 gap-2">
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'NA'].map((type) => (
                                            <ToggleGroupItem key={type} value={type} className="rounded-full border border-input px-3 py-2 text-sm">
                                                {type}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="civil-status">Civil Status</Label>
                                <ToggleGroup type="single" value={civilStatus} onValueChange={(value) => value && setCivilStatus(value as 'Single' | 'Married' | 'Separated' | 'Widowed')} className="grid grid-cols-4 gap-2">
                                    {['Single', 'Married', 'Separated', 'Widowed'].map((status) => (
                                        <ToggleGroupItem key={status} value={status} className="rounded-full border border-input px-3 py-2 text-sm">
                                            {status}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </div>

                            <div className="flex justify-end">
                                <Button>Save patient</Button>
                            </div>
                        </div>

                        <div className="space-y-6 rounded-3xl border border-sidebar-border/70 bg-white/70 p-6 shadow-sm dark:bg-black/40 dark:border-sidebar-border">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-24 w-24 overflow-hidden rounded-full border border-input bg-muted">
                                    <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=4&w=256&h=256&q=80" alt="Patient avatar" />
                                    <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">PP</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-lg font-semibold">Patient profile</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Upload a profile image or use default initials.</p>
                                </div>
                            </div>
                            <div className="rounded-3xl border border-input/50 bg-background p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium">Profile photo</p>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Add a picture to help find the patient record faster.</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Camera className="h-4 w-4" />
                                        Upload
                                    </Button>
                                </div>
                            </div>
                            <div className="rounded-3xl border border-input/50 bg-background p-4">
                                <p className="text-sm font-semibold">Next steps</p>
                                <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    <li>• Confirm contact and emergency details</li>
                                    <li>• Add insurance or billing information</li>
                                    <li>• Review referral or appointment notes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-sidebar-border/70 bg-white/70 p-6 shadow-sm dark:bg-black/40 dark:border-sidebar-border">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Recent patients</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">A quick list of the latest patient records.</p>
                        </div>
                        <Button>New patient</Button>
                    </div>

                    <div className="space-y-3">
                        {patients.length > 0 ? (
                            patients.map((patient) => (
                                <div key={patient.id} className="rounded-3xl border border-input/60 bg-background p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-base font-semibold">{patient.first_name} {patient.last_name}</p>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{patient.email ?? 'No email provided'}</p>
                                        </div>
                                        <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-secondary-foreground">Patient</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-3xl border border-input/60 bg-background p-6 text-sm text-neutral-500 dark:text-neutral-400">
                                No patients have been added yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
