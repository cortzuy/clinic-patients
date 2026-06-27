<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class SoapNoteController extends Controller
{
    public function store(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'chief_complaint' => ['nullable', 'string', 'max:65535'],
            'history_of_present_illness' => ['nullable', 'string', 'max:65535'],
            'remarks' => ['nullable', 'string', 'max:65535'],
            'diagnosis' => ['nullable', 'string', 'max:65535'],
            'plan' => ['nullable', 'string', 'max:65535'],
        ]);

        $patient->soapNotes()->create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return back();
    }
}
