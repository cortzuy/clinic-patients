<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_save_a_patient()
    {
        $this->actingAs(User::factory()->create());

        $response = $this->withSession(['_token' => csrf_token()])->post('/patients', [
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'middle_name' => 'Del',
            'suffix' => 'Jr',
            'nickname' => 'Mia',
            'birth_date' => '1990-05-10',
            'sex' => 'female',
            'email' => 'maria.santos@example.com',
            'primary_mobile' => '9123456789',
            'invite_to_nowserving' => true,
            'blood_type' => 'O+',
            'civil_status' => 'Single',
            'philhealth_no' => '1234567890',
            'patient_tags' => 'new',
            'notes' => 'Test patient record.',
            'nationality' => 'Filipino',
            'race' => 'Asian',
            'religion' => 'Catholic',
            'address' => '123 Main St',
            'other_mobile' => '9171234567',
            'parent_guardian_1' => 'Jose Santos',
            'parent_guardian_2' => 'Ana Santos',
            'show_parent_guardian_names' => false,
            'occupation' => 'Teacher',
            'employer_name' => 'Sunrise School',
            'employer_address' => '456 School Rd',
            'employer_phone' => '9123456788',
            'hmo' => 'hmo-1',
            'emergency_contact_name' => 'Jose Santos',
            'emergency_contact_number' => '9178765432',
            'emergency_contact_relationship' => 'Parent',
            'referring_physician' => 'Dr. Cruz',
            'primary_care_physician' => 'Dr. Reyes',
            'other_physicians' => 'Dr. Tan',
            'consent' => true,
        ]);

        $response->assertRedirect('/patients');

        $this->assertDatabaseHas('patients', [
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'email' => 'maria.santos@example.com',
            'primary_mobile' => '9123456789',
            'blood_type' => 'O+',
            'nationality' => 'Filipino',
            'religion' => 'Catholic',
            'hmo' => 'hmo-1',
            'consent' => true,
        ]);
    }
}
