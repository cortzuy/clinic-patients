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
        Schema::table('patients', function (Blueprint $table) {
            $table->string('nationality', 100)->nullable();
            $table->string('race', 100)->nullable();
            $table->string('religion', 100)->nullable();
            $table->string('address', 255)->nullable();
            $table->string('other_mobile', 20)->nullable();
            $table->string('parent_guardian_1', 100)->nullable();
            $table->string('parent_guardian_2', 100)->nullable();
            $table->boolean('show_parent_guardian_names')->default(false);
            $table->string('occupation', 100)->nullable();
            $table->string('employer_name', 100)->nullable();
            $table->string('employer_address', 255)->nullable();
            $table->string('employer_phone', 20)->nullable();
            $table->string('hmo', 100)->nullable();
            $table->string('emergency_contact_name', 100)->nullable();
            $table->string('emergency_contact_number', 20)->nullable();
            $table->string('emergency_contact_relationship', 50)->nullable();
            $table->string('referring_physician', 100)->nullable();
            $table->string('primary_care_physician', 100)->nullable();
            $table->string('other_physicians', 255)->nullable();
            $table->boolean('consent')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
