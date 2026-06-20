<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
{
    protected $model = Patient::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sex = $this->faker->randomElement(['male', 'female', 'other']);
        $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'NA'];
        $civilStatuses = ['Single', 'Married', 'Separated', 'Widowed'];

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'middle_name' => $this->faker->optional()->firstName(),
            'suffix' => $this->faker->optional()->suffix(),
            'nickname' => $this->faker->optional()->firstName(),
            'birth_date' => $this->faker->optional()->date(),
            'sex' => $sex,
            'email' => $this->faker->unique()->safeEmail(),
            'primary_mobile' => '+63'.$this->faker->numerify('9########'),
            'invite_to_nowserving' => $this->faker->boolean(25),
            'blood_type' => $this->faker->randomElement($bloodTypes),
            'civil_status' => $this->faker->randomElement($civilStatuses),
            'philhealth_no' => $this->faker->optional()->bothify('PHIL-#####'),
            'patient_tags' => $this->faker->randomElements(['New Patient', 'Follow-up', 'Urgent', 'Chronic Care'], $this->faker->numberBetween(1, 3)),
            'avatar_url' => $this->faker->optional()->imageUrl(256, 256, 'people'),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}
