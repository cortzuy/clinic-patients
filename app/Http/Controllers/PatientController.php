<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatientStoreRequest;
use App\Models\Patient;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index()
    {
        return Inertia::render('patients-list', [
            'patients' => Patient::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('patients', [
            'patients' => Patient::latest()->take(10)->get(),
        ]);
    }

    public function store(PatientStoreRequest $request)
    {
        $validated = $request->validated();

        if ($request->filled('patient_tags')) {
            $validated['patient_tags'] = [$validated['patient_tags']];
        } else {
            $validated['patient_tags'] = null;
        }

        $validated['primary_mobile'] = $validated['primary_mobile'] ?? '';

        Patient::create($validated);

        return to_route('patients');
    }
}
