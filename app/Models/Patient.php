<?php

namespace App\Models;

use Database\Factories\PatientFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    /** @use HasFactory<PatientFactory> */
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'suffix',
        'nickname',
        'birth_date',
        'sex',
        'email',
        'primary_mobile',
        'invite_to_nowserving',
        'blood_type',
        'civil_status',
        'philhealth_no',
        'patient_tags',
        'avatar_url',
        'notes',
        'nationality',
        'race',
        'religion',
        'address',
        'other_mobile',
        'parent_guardian_1',
        'parent_guardian_2',
        'show_parent_guardian_names',
        'occupation',
        'employer_name',
        'employer_address',
        'employer_phone',
        'hmo',
        'emergency_contact_name',
        'emergency_contact_number',
        'emergency_contact_relationship',
        'referring_physician',
        'primary_care_physician',
        'other_physicians',
        'consent',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'invite_to_nowserving' => 'boolean',
        'patient_tags' => 'array',
        'show_parent_guardian_names' => 'boolean',
        'consent' => 'boolean',
    ];

    public function soapNotes(): HasMany
    {
        return $this->hasMany(SoapNote::class)->latest();
    }
}
