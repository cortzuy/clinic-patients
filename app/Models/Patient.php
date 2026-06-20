<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    /** @use HasFactory<\Database\Factories\PatientFactory> */
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
    ];

    protected $casts = [
        'birth_date' => 'date',
        'invite_to_nowserving' => 'boolean',
        'patient_tags' => 'array',
    ];
}
