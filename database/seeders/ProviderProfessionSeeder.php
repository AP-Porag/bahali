<?php
// database/seeders/ProviderProfessionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProviderProfessionCategory;
use App\Models\ProviderProfession;

class ProviderProfessionSeeder extends Seeder
{
    public function run(): void
    {
        $professions = [
            'clinical-mental-health' => [
                ['name' => 'Psychologist', 'is_clinical' => true],
                ['name' => 'Clinical Psychologist', 'is_clinical' => true],
                ['name' => 'Counseling Psychologist', 'is_clinical' => true],
                ['name' => 'Neuropsychologist', 'is_clinical' => true],
                ['name' => 'School Psychologist', 'is_clinical' => true],
                ['name' => 'Psychiatrist', 'is_clinical' => true],
                ['name' => 'Psychiatric Nurse Practitioner', 'is_clinical' => true],
                ['name' => 'Licensed Clinical Social Worker (LCSW)', 'is_clinical' => true],
                ['name' => 'Clinical Social Worker', 'is_clinical' => true],
                ['name' => 'Mental Health Counselor', 'is_clinical' => true],
                ['name' => 'Professional Counselor', 'is_clinical' => true],
                ['name' => 'Marriage & Family Therapist', 'is_clinical' => true],
                ['name' => 'Psychotherapist', 'is_clinical' => true],
                ['name' => 'Psychoanalyst', 'is_clinical' => true],
                ['name' => 'Behavioral Therapist', 'is_clinical' => true],
                ['name' => 'Trauma Therapist', 'is_clinical' => true],
                ['name' => 'Child Therapist', 'is_clinical' => true],
                ['name' => 'Adolescent Therapist', 'is_clinical' => true],
                ['name' => 'Family Therapist', 'is_clinical' => true],
                ['name' => 'Couples Therapist', 'is_clinical' => true],
                ['name' => 'Grief Counselor', 'is_clinical' => true],
                ['name' => 'Addiction Counselor', 'is_clinical' => true],
                ['name' => 'Rehabilitation Counselor', 'is_clinical' => true],
                ['name' => 'Substance Use Counselor', 'is_clinical' => true],
                ['name' => 'Crisis Counselor', 'is_clinical' => true],
            ],
            'assessment-educational' => [
                ['name' => 'Psychological Assessment Specialist', 'is_clinical' => true],
                ['name' => 'Cognitive Assessment Specialist', 'is_clinical' => true],
                ['name' => 'ADHD Evaluation Specialist', 'is_clinical' => true],
                ['name' => 'Autism Evaluation Specialist', 'is_clinical' => true],
                ['name' => 'Learning Disability Specialist', 'is_clinical' => true],
                ['name' => 'Educational Psychologist', 'is_clinical' => true],
                ['name' => 'School Counselor', 'is_clinical' => false],
                ['name' => 'Guidance Counselor', 'is_clinical' => false],
                ['name' => 'School Social Worker', 'is_clinical' => false],
                ['name' => 'Social Emotional Learning (SEL) Specialist', 'is_clinical' => false],
                ['name' => 'Special Education Consultant', 'is_clinical' => false],
                ['name' => 'Behavioral Intervention Specialist', 'is_clinical' => false],
                ['name' => 'Academic Support Specialist', 'is_clinical' => false],
            ],
            'medical-health' => [
                ['name' => 'Primary Care Physician', 'is_clinical' => true],
                ['name' => 'Pediatrician', 'is_clinical' => true],
                ['name' => 'Neurologist', 'is_clinical' => true],
                ['name' => 'Occupational Therapist', 'is_clinical' => true],
                ['name' => 'Speech-Language Pathologist', 'is_clinical' => true],
                ['name' => 'Physical Therapist', 'is_clinical' => true],
                ['name' => 'Registered Nurse', 'is_clinical' => true],
                ['name' => 'Community Health Nurse', 'is_clinical' => true],
                ['name' => 'Public Health Professional', 'is_clinical' => false],
                ['name' => 'Health Educator', 'is_clinical' => false],
            ],
            'family-parenting-perinatal' => [
                ['name' => 'Parenting Coach', 'is_clinical' => false],
                ['name' => 'Parent Educator', 'is_clinical' => false],
                ['name' => 'Family Support Specialist', 'is_clinical' => false],
                ['name' => 'Perinatal Mental Health Specialist', 'is_clinical' => true],
                ['name' => 'Postpartum Support Specialist', 'is_clinical' => false],
                ['name' => 'Infant Mental Health Specialist', 'is_clinical' => true],
                ['name' => 'Doula', 'is_clinical' => false],
                ['name' => 'Birth Worker', 'is_clinical' => false],
                ['name' => 'Lactation Consultant', 'is_clinical' => false],
                ['name' => 'Fertility Support Counselor', 'is_clinical' => false],
            ],
            'faith-based-spiritual' => [
                ['name' => 'Pastoral Counselor', 'is_clinical' => false],
                ['name' => 'Pastor', 'is_clinical' => false],
                ['name' => 'Minister', 'is_clinical' => false],
                ['name' => 'Chaplain', 'is_clinical' => false],
                ['name' => 'Faith-Based Counselor', 'is_clinical' => false],
                ['name' => 'Spiritual Director', 'is_clinical' => false],
                ['name' => 'Spiritual Care Provider', 'is_clinical' => false],
                ['name' => 'Youth Ministry Leader', 'is_clinical' => false],
                ['name' => 'Church Wellness Coordinator', 'is_clinical' => false],
                ['name' => 'Community Ministry Leader', 'is_clinical' => false],
            ],
            'community-based' => [
                ['name' => 'Community Health Worker', 'is_clinical' => false],
                ['name' => 'Community Wellness Advocate', 'is_clinical' => false],
                ['name' => 'Peer Support Specialist', 'is_clinical' => false],
                ['name' => 'Recovery Coach', 'is_clinical' => false],
                ['name' => 'Youth Mentor', 'is_clinical' => false],
                ['name' => 'Life Coach', 'is_clinical' => false],
                ['name' => 'Wellness Coach', 'is_clinical' => false],
                ['name' => 'Community Outreach Worker', 'is_clinical' => false],
                ['name' => 'Case Manager', 'is_clinical' => false],
                ['name' => 'Victim Advocate', 'is_clinical' => false],
                ['name' => 'Violence Prevention Specialist', 'is_clinical' => false],
                ['name' => 'Disaster Recovery Support Worker', 'is_clinical' => false],
                ['name' => 'Community Resilience Facilitator', 'is_clinical' => false],
                ['name' => 'Family Advocate', 'is_clinical' => false],
                ['name' => 'Social Services Provider', 'is_clinical' => false],
            ],
            'creative-holistic' => [
                ['name' => 'Art Therapist', 'is_clinical' => true],
                ['name' => 'Music Therapist', 'is_clinical' => true],
                ['name' => 'Dance/Movement Therapist', 'is_clinical' => true],
                ['name' => 'Recreational Therapist', 'is_clinical' => true],
                ['name' => 'Mindfulness Facilitator', 'is_clinical' => false],
                ['name' => 'Meditation Instructor', 'is_clinical' => false],
                ['name' => 'Yoga Therapist', 'is_clinical' => false],
                ['name' => 'Wellness Practitioner', 'is_clinical' => false],
                ['name' => 'Holistic Health Practitioner', 'is_clinical' => false],
            ],
            'aging-caregiver' => [
                ['name' => 'Geriatric Specialist', 'is_clinical' => true],
                ['name' => 'Geropsychology Provider', 'is_clinical' => true],
                ['name' => 'Dementia Care Specialist', 'is_clinical' => true],
                ['name' => 'Elder Care Coordinator', 'is_clinical' => false],
                ['name' => 'Caregiver Support Specialist', 'is_clinical' => false],
                ['name' => 'Memory Care Provider', 'is_clinical' => false],
            ],
            'organizational-program' => [
                ['name' => 'Nonprofit Organization', 'is_clinical' => false],
                ['name' => 'Community Organization', 'is_clinical' => false],
                ['name' => 'Mental Health Clinic', 'is_clinical' => true],
                ['name' => 'Faith-Based Organization', 'is_clinical' => false],
                ['name' => 'School-Based Program', 'is_clinical' => false],
                ['name' => 'Wellness Center', 'is_clinical' => false],
                ['name' => 'Youth Development Program', 'is_clinical' => false],
                ['name' => 'Disaster Relief Organization', 'is_clinical' => false],
                ['name' => 'Support Group Facilitator', 'is_clinical' => false],
            ],
        ];

        foreach ($professions as $categorySlug => $professionList) {
            $category = ProviderProfessionCategory::where('slug', $categorySlug)->first();

            if ($category) {
                foreach ($professionList as $index => $profession) {
                    ProviderProfession::create([
                        'provider_profession_category_id' => $category->id,
                        'name' => $profession['name'],
                        'slug' => \Illuminate\Support\Str::slug($profession['name']),
                        'description' => $profession['name'] . ' providing support services',
                        'is_clinical' => $profession['is_clinical'],
                        'display_order' => $index + 1,
                    ]);
                }
            }
        }
    }
}
