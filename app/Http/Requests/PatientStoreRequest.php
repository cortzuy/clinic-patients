<?php

namespace App\Http\Requests;

use App\Models\Patient;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PatientStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'suffix' => ['nullable', 'string', 'max:50'],
            'nickname' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['required', 'date'],
            'sex' => ['required', Rule::in(['male', 'female'])],
            'email' => ['nullable', 'string', 'email', 'max:180', Rule::unique(Patient::class)],
            'primary_mobile' => ['required', 'string', 'max:20'],
            'invite_to_nowserving' => ['required', 'boolean'],
            'blood_type' => ['required', Rule::in(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'NA'])],
            'civil_status' => ['required', Rule::in(['Single', 'Married', 'Separated', 'Widowed'])],
            'philhealth_no' => ['nullable', 'string', 'max:100'],
            'patient_tags' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:65535'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'race' => ['nullable', 'string', 'max:100'],
            'religion' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'other_mobile' => ['nullable', 'string', 'max:20'],
            'parent_guardian_1' => ['nullable', 'string', 'max:100'],
            'parent_guardian_2' => ['nullable', 'string', 'max:100'],
            'show_parent_guardian_names' => ['required', 'boolean'],
            'occupation' => ['nullable', 'string', 'max:100'],
            'employer_name' => ['nullable', 'string', 'max:100'],
            'employer_address' => ['nullable', 'string', 'max:255'],
            'employer_phone' => ['nullable', 'string', 'max:20'],
            'hmo' => ['nullable', 'string', 'max:100'],
            'emergency_contact_name' => ['nullable', 'string', 'max:100'],
            'emergency_contact_number' => ['nullable', 'string', 'max:20'],
            'emergency_contact_relationship' => ['nullable', 'string', 'max:50'],
            'referring_physician' => ['nullable', 'string', 'max:100'],
            'primary_care_physician' => ['nullable', 'string', 'max:100'],
            'other_physicians' => ['nullable', 'string', 'max:255'],
            'consent' => ['required', 'accepted'],
        ];
    }
}
