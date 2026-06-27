<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SoapNote extends Model
{
    protected $fillable = [
        'patient_id',
        'user_id',
        'chief_complaint',
        'history_of_present_illness',
        'remarks',
        'diagnosis',
        'plan',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
