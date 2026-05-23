<?php
// database/seeders/LanguageSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Language;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            // Major World Languages
            ['name' => 'English', 'code' => 'en'],
            ['name' => 'French', 'code' => 'fr'],
            ['name' => 'Spanish', 'code' => 'es'],
            ['name' => 'Arabic', 'code' => 'ar'],
            ['name' => 'Mandarin Chinese', 'code' => 'zh'],
            ['name' => 'Portuguese', 'code' => 'pt'],
            ['name' => 'Russian', 'code' => 'ru'],
            ['name' => 'German', 'code' => 'de'],
            ['name' => 'Japanese', 'code' => 'ja'],
            ['name' => 'Korean', 'code' => 'ko'],
            ['name' => 'Italian', 'code' => 'it'],
            ['name' => 'Dutch', 'code' => 'nl'],
            ['name' => 'Turkish', 'code' => 'tr'],
            ['name' => 'Vietnamese', 'code' => 'vi'],
            ['name' => 'Thai', 'code' => 'th'],
            ['name' => 'Hindi', 'code' => 'hi'],
            ['name' => 'Bengali', 'code' => 'bn'],
            ['name' => 'Urdu', 'code' => 'ur'],
            ['name' => 'Persian (Farsi)', 'code' => 'fa'],
            ['name' => 'Swahili', 'code' => 'sw'],

            // Haitian Languages (Given this is Bahali, likely Haiti-focused)
            ['name' => 'Haitian Creole', 'code' => 'ht'],
            ['name' => 'French Creole', 'code' => 'fr-creole'],

            // Caribbean Languages
            ['name' => 'Jamaican Patois', 'code' => 'jam'],
            ['name' => 'Papiamento', 'code' => 'pap'],
            ['name' => 'Sranan Tongo', 'code' => 'srn'],

            // African Languages
            ['name' => 'Yoruba', 'code' => 'yo'],
            ['name' => 'Igbo', 'code' => 'ig'],
            ['name' => 'Hausa', 'code' => 'ha'],
            ['name' => 'Amharic', 'code' => 'am'],
            ['name' => 'Somali', 'code' => 'so'],
            ['name' => 'Wolof', 'code' => 'wo'],
            ['name' => 'Lingala', 'code' => 'ln'],
            ['name' => 'Kinyarwanda', 'code' => 'rw'],
            ['name' => 'Kirundi', 'code' => 'rn'],

            // Indigenous American Languages
            ['name' => 'Quechua', 'code' => 'qu'],
            ['name' => 'Guarani', 'code' => 'gn'],
            ['name' => 'Aymara', 'code' => 'ay'],
            ['name' => 'Nahuatl', 'code' => 'nah'],

            // Southeast Asian Languages
            ['name' => 'Tagalog (Filipino)', 'code' => 'tl'],
            ['name' => 'Indonesian', 'code' => 'id'],
            ['name' => 'Malay', 'code' => 'ms'],
            ['name' => 'Khmer (Cambodian)', 'code' => 'km'],
            ['name' => 'Lao', 'code' => 'lo'],
            ['name' => 'Burmese', 'code' => 'my'],

            // South Asian Languages
            ['name' => 'Tamil', 'code' => 'ta'],
            ['name' => 'Telugu', 'code' => 'te'],
            ['name' => 'Marathi', 'code' => 'mr'],
            ['name' => 'Gujarati', 'code' => 'gu'],
            ['name' => 'Punjabi', 'code' => 'pa'],
            ['name' => 'Nepali', 'code' => 'ne'],
            ['name' => 'Sinhala', 'code' => 'si'],

            // European Languages
            ['name' => 'Polish', 'code' => 'pl'],
            ['name' => 'Ukrainian', 'code' => 'uk'],
            ['name' => 'Romanian', 'code' => 'ro'],
            ['name' => 'Greek', 'code' => 'el'],
            ['name' => 'Czech', 'code' => 'cs'],
            ['name' => 'Hungarian', 'code' => 'hu'],
            ['name' => 'Swedish', 'code' => 'sv'],
            ['name' => 'Danish', 'code' => 'da'],
            ['name' => 'Norwegian', 'code' => 'no'],
            ['name' => 'Finnish', 'code' => 'fi'],
            ['name' => 'Serbian', 'code' => 'sr'],
            ['name' => 'Croatian', 'code' => 'hr'],
            ['name' => 'Bulgarian', 'code' => 'bg'],
            ['name' => 'Albanian', 'code' => 'sq'],
            ['name' => 'Armenian', 'code' => 'hy'],
            ['name' => 'Georgian', 'code' => 'ka'],

            // Middle Eastern Languages
            ['name' => 'Hebrew', 'code' => 'he'],
            ['name' => 'Kurdish', 'code' => 'ku'],
            ['name' => 'Pashto', 'code' => 'ps'],
            ['name' => 'Dari', 'code' => 'prs'],

            // East Asian Languages
            ['name' => 'Cantonese', 'code' => 'yue'],
            ['name' => 'Taiwanese Hokkien', 'code' => 'nan'],
            ['name' => 'Mongolian', 'code' => 'mn'],

            // Pacific Languages
            ['name' => 'Samoan', 'code' => 'sm'],
            ['name' => 'Tongan', 'code' => 'to'],
            ['name' => 'Maori', 'code' => 'mi'],
            ['name' => 'Fijian', 'code' => 'fj'],

            // Sign Languages
            ['name' => 'American Sign Language (ASL)', 'code' => 'ase'],
            ['name' => 'French Sign Language (LSF)', 'code' => 'fsl'],
            ['name' => 'Haitian Sign Language (LSH)', 'code' => 'haitian-sign'],
            ['name' => 'International Sign', 'code' => 'ils'],

            // Other Important Languages for Humanitarian Context
            ['name' => 'Tigrinya', 'code' => 'ti'],
            ['name' => 'Oromo', 'code' => 'om'],
            ['name' => 'Bambara', 'code' => 'bm'],
            ['name' => 'Fulfulde', 'code' => 'ff'],
            ['name' => 'Mandinka', 'code' => 'mnk'],
            ['name' => 'Moore', 'code' => 'mos'],
            ['name' => 'Zulu', 'code' => 'zu'],
            ['name' => 'Xhosa', 'code' => 'xh'],
            ['name' => 'Afrikaans', 'code' => 'af'],
            ['name' => 'Malagasy', 'code' => 'mg'],
            ['name' => 'Comorian', 'code' => 'swb'],
        ];

        // Use a transaction for better performance
        DB::transaction(function () use ($languages) {
            foreach ($languages as $language) {
                Language::firstOrCreate(
                    ['code' => $language['code']],
                    [
                        'name' => $language['name'],
                        'is_active' => true,
                    ]
                );
            }
        });

        $this->command->info('Languages seeded successfully: ' . count($languages) . ' languages added.');

        // Optional: Display summary of languages added
        $this->command->table(
            ['Name', 'Code'],
            collect($languages)->take(10)->map(function ($lang) {
                return [$lang['name'], $lang['code']];
            })->toArray()
        );

        if (count($languages) > 10) {
            $this->command->info('... and ' . (count($languages) - 10) . ' more languages.');
        }
    }
}
