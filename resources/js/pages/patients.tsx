import { FormEventHandler, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Patients', href: '/patients' },
];

/** Reusable label+field row with right-aligned label */
function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[160px_1fr] items-start gap-4">
            <span className="pt-2 text-right text-sm text-neutral-600 dark:text-neutral-400">
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
            </span>
            <div>{children}</div>
        </div>
    );
}

export default function Patients() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showAdditionalInformation, setShowAdditionalInformation] = useState(false);
    const [showConsentTerms, setShowConsentTerms] = useState(false);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        first_name: '',
        last_name: '',
        middle_name: '',
        suffix: '',
        nickname: '',
        birth_date: '',
        sex: '' as 'male' | 'female' | '',
        email: '',
        primary_mobile: '',
        invite_to_nowserving: false,
        blood_type: 'NA',
        civil_status: 'Single',
        philhealth_no: '',
        patient_tags: '',
        notes: '',
        nationality: '',
        race: '',
        religion: '',
        address: '',
        other_mobile: '',
        parent_guardian_1: '',
        parent_guardian_2: '',
        show_parent_guardian_names: false,
        occupation: '',
        employer_name: '',
        employer_address: '',
        employer_phone: '',
        hmo: '',
        emergency_contact_name: '',
        emergency_contact_number: '',
        emergency_contact_relationship: '',
        referring_physician: '',
        primary_care_physician: '',
        other_physicians: '',
        consent: false,
    });

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('patients.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Patient" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                <form onSubmit={submit}>
                    {/* ── Header ── */}
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">New Patient</p>
                            <h1 className="mt-1 text-2xl font-semibold">Patient Record</h1>
                        </div>

                        {/* Avatar top-right */}
                        <div className="relative cursor-pointer" onClick={handleAvatarClick} aria-label="Upload patient photo">
                            <Avatar className="h-20 w-20 border border-input bg-neutral-100 dark:bg-neutral-800">
                                {avatarPreview ? (
                                    <AvatarImage src={avatarPreview} alt="Patient avatar" />
                                ) : (
                                    <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-neutral-400">
                                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                        </svg>
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-input bg-white shadow-sm dark:bg-neutral-900">
                                <Plus className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-300" />
                            </span>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-hidden="true" />
                        </div>
                    </div>

                    {/* ── Personal Information ── */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Personal Information</h2>

                        <FieldRow label="First Name" required>
                            <Input placeholder="First Name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                            <InputError className="mt-1" message={errors.first_name} />
                        </FieldRow>

                        <FieldRow label="Last Name" required>
                            <Input placeholder="Last Name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                            <InputError className="mt-1" message={errors.last_name} />
                        </FieldRow>

                        <FieldRow label="Middle Name">
                            <Input placeholder="Middle Name" value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} />
                        </FieldRow>

                        <FieldRow label="Suffix">
                            <Input placeholder="ex. Jr, Sr, etc" value={data.suffix} onChange={(e) => setData('suffix', e.target.value)} />
                        </FieldRow>

                        <FieldRow label="Nickname">
                            <Input placeholder="Nickname" value={data.nickname} onChange={(e) => setData('nickname', e.target.value)} />
                        </FieldRow>

                        <FieldRow label="Date of Birth" required>
                            <Input type="date" value={data.birth_date} onChange={(e) => setData('birth_date', e.target.value)} />
                            <InputError className="mt-1" message={errors.birth_date} />
                        </FieldRow>

                        <FieldRow label="Sex" required>
                            <ToggleGroup
                                type="single"
                                value={data.sex}
                                onValueChange={(v) => v && setData('sex', v as 'male' | 'female')}
                                className="flex gap-2"
                                aria-required="true"
                            >
                                <ToggleGroupItem value="male" className="rounded-full border border-input px-5 py-1.5 text-sm" aria-label="Male">Male</ToggleGroupItem>
                                <ToggleGroupItem value="female" className="rounded-full border border-input px-5 py-1.5 text-sm" aria-label="Female">Female</ToggleGroupItem>
                            </ToggleGroup>
                            <InputError className="mt-1" message={errors.sex} />
                        </FieldRow>

                        <FieldRow label="Email">
                            <Input type="email" placeholder="Email address" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError className="mt-1" message={errors.email} />
                        </FieldRow>

                        <FieldRow label="Primary Mobile" required>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md border border-input bg-muted px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300">
                                    🇵🇭 +63
                                </span>
                                <Input placeholder="9XXXXXXXXX" value={data.primary_mobile} onChange={(e) => setData('primary_mobile', e.target.value)} />
                            </div>
                            <InputError className="mt-1" message={errors.primary_mobile} />
                        </FieldRow>

                        {/* Invite toggle */}
                        <FieldRow label="">
                            <div className="rounded-xl border border-input bg-neutral-50 p-4 dark:bg-neutral-900">
                                <div className="flex items-start gap-3">
                                    {/* Switch */}
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={data.invite_to_nowserving}
                                        onClick={() => setData('invite_to_nowserving', !data.invite_to_nowserving)}
                                        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${data.invite_to_nowserving ? 'bg-primary' : 'bg-input'}`}
                                    >
                                        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${data.invite_to_nowserving ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Invite patient to NowServing App</p>
                                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                            Once your patient accepts the invite and links this record on the NowServing app, they can view the records you share with them, book appointments, and chat with you.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </FieldRow>

                        {/* Blood Type */}
                        <FieldRow label="Blood Type">
                            <ToggleGroup
                                type="single"
                                value={data.blood_type}
                                onValueChange={(v) => v && setData('blood_type', v)}
                                className="flex flex-wrap gap-1.5"
                            >
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'NA'].map((bt) => (
                                    <ToggleGroupItem key={bt} value={bt} className="rounded-full border border-input px-3 py-1 text-xs" aria-label={bt}>{bt}</ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </FieldRow>

                        {/* Civil Status */}
                        <FieldRow label="Civil Status">
                            <ToggleGroup
                                type="single"
                                value={data.civil_status}
                                onValueChange={(v) => v && setData('civil_status', v)}
                                className="flex flex-wrap gap-1.5"
                            >
                                {['Single', 'Married', 'Separated', 'Widowed'].map((cs) => (
                                    <ToggleGroupItem key={cs} value={cs} className="rounded-full border border-input px-3 py-1 text-xs" aria-label={cs}>{cs}</ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </FieldRow>

                        <FieldRow label="Philhealth No.">
                            <Input placeholder="Philhealth number" value={data.philhealth_no} onChange={(e) => setData('philhealth_no', e.target.value)} />
                        </FieldRow>

                        <FieldRow label="Patient Tags">
                            <Select value={data.patient_tags} onValueChange={(v) => setData('patient_tags', v)}>
                                <SelectTrigger aria-label="Patient tags"><SelectValue placeholder="Select Patient Tags" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New Patient</SelectItem>
                                    <SelectItem value="follow-up">Follow-up</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                    <SelectItem value="chronic">Chronic Care</SelectItem>
                                </SelectContent>
                            </Select>
                        </FieldRow>
                    </section>

                    {/* ── Additional Information toggle divider ── */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <button
                            type="button"
                            onClick={() => setShowAdditionalInformation((c) => !c)}
                            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline focus:outline-none"
                        >
                            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={showAdditionalInformation ? 'opacity-0' : ''} />
                            </svg>
                            {showAdditionalInformation ? 'Hide' : 'Show'} Additional Information
                        </button>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    {showAdditionalInformation && (
                        <div className="space-y-8">
                            {/* ── Additional fields ── */}
                            <section className="space-y-4">
                                <FieldRow label="Nationality">
                                    <Input placeholder="Nationality" value={data.nationality} onChange={(e) => setData('nationality', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Race">
                                    <Input placeholder="Race" value={data.race} onChange={(e) => setData('race', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Religion">
                                    <Input placeholder="Religion" value={data.religion} onChange={(e) => setData('religion', e.target.value)} />
                                </FieldRow>
                            </section>

                            {/* ── Contact Information ── */}
                            <section className="space-y-4">
                                <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Contact Information</h2>
                                <FieldRow label="Address">
                                    <Input placeholder="Address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Other Mobile">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-md border border-input bg-muted px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300">
                                            🇵🇭 +63
                                        </span>
                                        <Input placeholder="9XXXXXXXXX" value={data.other_mobile} onChange={(e) => setData('other_mobile', e.target.value)} />
                                    </div>
                                </FieldRow>
                                <FieldRow label="Parent/Guardian #1">
                                    <Input placeholder="Name" value={data.parent_guardian_1} onChange={(e) => setData('parent_guardian_1', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Parent/Guardian #2">
                                    <Input placeholder="Name" value={data.parent_guardian_2} onChange={(e) => setData('parent_guardian_2', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="">
                                    {/* Show Parents/Guardians Names toggle */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={data.show_parent_guardian_names}
                                            onClick={() => setData('show_parent_guardian_names', !data.show_parent_guardian_names)}
                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${data.show_parent_guardian_names ? 'bg-primary' : 'bg-input'}`}
                                        >
                                            <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${data.show_parent_guardian_names ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </button>
                                        <span className="text-sm text-neutral-700 dark:text-neutral-300">Show Parents/Guardians' Names</span>
                                    </div>
                                </FieldRow>
                            </section>

                            {/* ── Employment Information ── */}
                            <section className="space-y-4">
                                <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Employment Information</h2>
                                <FieldRow label="Occupation">
                                    <Input placeholder="Occupation" value={data.occupation} onChange={(e) => setData('occupation', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Employer's Name">
                                    <Input placeholder="Employer" value={data.employer_name} onChange={(e) => setData('employer_name', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Employer's Address">
                                    <Input placeholder="Employer address" value={data.employer_address} onChange={(e) => setData('employer_address', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Employer's Phone">
                                    <Input placeholder="Employer phone" value={data.employer_phone} onChange={(e) => setData('employer_phone', e.target.value)} />
                                </FieldRow>
                            </section>

                            {/* ── HMO ── */}
                            <section className="space-y-4">
                                <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Health Maintenance Organization (HMO)</h2>
                                <FieldRow label="HMO">
                                    <Select value={data.hmo} onValueChange={(v) => setData('hmo', v)}>
                                        <SelectTrigger aria-label="Select HMO"><SelectValue placeholder="Select HMO" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            <SelectItem value="hmo-1">HMO 1</SelectItem>
                                            <SelectItem value="hmo-2">HMO 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FieldRow>
                            </section>

                            {/* ── Emergency Contact ── */}
                            <section className="space-y-4">
                                <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Emergency Contact Information</h2>
                                <FieldRow label="Name">
                                    <Input placeholder="Contact name" value={data.emergency_contact_name} onChange={(e) => setData('emergency_contact_name', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Contact Number">
                                    <Input placeholder="Contact number" value={data.emergency_contact_number} onChange={(e) => setData('emergency_contact_number', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Relationship">
                                    <ToggleGroup
                                        type="single"
                                        value={data.emergency_contact_relationship}
                                        onValueChange={(v) => v && setData('emergency_contact_relationship', v)}
                                        className="flex flex-wrap gap-1.5"
                                    >
                                        {['Parent', 'Spouse', 'Guardian', 'Others'].map((r) => (
                                            <ToggleGroupItem key={r} value={r} className="rounded-full border border-input px-3 py-1 text-xs" aria-label={r}>{r}</ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </FieldRow>
                            </section>

                            {/* ── Physician Information ── */}
                            <section className="space-y-4">
                                <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Physician Information</h2>
                                <FieldRow label="Referring Physician">
                                    <Input placeholder="Referring physician" value={data.referring_physician} onChange={(e) => setData('referring_physician', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Primary Care Physician">
                                    <Input placeholder="Primary care physician" value={data.primary_care_physician} onChange={(e) => setData('primary_care_physician', e.target.value)} />
                                </FieldRow>
                                <FieldRow label="Other Physicians">
                                    <Input placeholder="Other physicians" value={data.other_physicians} onChange={(e) => setData('other_physicians', e.target.value)} />
                                </FieldRow>
                            </section>
                        </div>
                    )}

                    {/* ── Patient Consent sticky bar ── */}
                    <div className="mt-8 rounded-xl border border-input bg-neutral-50 dark:bg-neutral-900">
                        <div className="flex items-start gap-3 p-4">
                            <input
                                id="consent"
                                type="checkbox"
                                checked={data.consent}
                                onChange={() => setData('consent', !data.consent)}
                                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
                                aria-required="true"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="consent" className="font-semibold">
                                        Patient Consent <span className="text-destructive">*</span>
                                    </Label>
                                    <button
                                        type="button"
                                        onClick={() => setShowConsentTerms((c) => !c)}
                                        className="text-xs font-medium text-primary hover:underline focus:outline-none"
                                    >
                                        {showConsentTerms ? 'Hide Terms' : 'Show Terms'}
                                    </button>
                                </div>

                                {showConsentTerms ? (
                                    <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                                        I consent to my healthcare provider and SeriousMD collecting, storing, and processing my health information for treatment, billing,
                                        appointment coordination via SMS, legal compliance, and care improvement. My doctor, clinic staff, and SeriousMD will access this data.
                                        Under the Philippine Data Privacy Act (RA 10173), I have the right to request access, correction, or object to processing of my information.
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        I consent to the collection and processing of my personal data as described.
                                    </p>
                                )}

                                <InputError className="mt-1" message={errors.consent} />
                            </div>
                        </div>
                    </div>

                    {/* ── Submit ── */}
                    <div className="mt-6 flex items-center gap-4">
                        <Button disabled={processing} type="submit">Save patient</Button>
                        {recentlySuccessful && <span className="text-sm text-neutral-500">Saved</span>}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
