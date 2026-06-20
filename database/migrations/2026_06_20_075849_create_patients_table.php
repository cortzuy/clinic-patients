<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('middle_name', 100)->nullable();
            $table->string('suffix', 50)->nullable();
            $table->string('nickname', 100)->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('sex', ['male', 'female', 'other'])->nullable();
            $table->string('email', 180)->nullable()->unique();
            $table->string('primary_mobile', 20);
            $table->boolean('invite_to_nowserving')->default(false);
            $table->enum('blood_type', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'NA'])->default('NA');
            $table->enum('civil_status', ['Single', 'Married', 'Separated', 'Widowed'])->default('Single');
            $table->string('philhealth_no', 100)->nullable();
            $table->json('patient_tags')->nullable();
            $table->string('avatar_url', 255)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
