<?php
// database/seeders/RegionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('regions')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Country IDs
        $anguillaId = 1;
        $antiguaId = 2;
        $arubaId = 3;
        $bahamasId = 4;
        $barbadosId = 5;
        $belizeId = 6;
        $bermudaId = 7;
        $bonaireId = 8;
        $bviId = 9;
        $caymanId = 10;
        $cubaId = 11;
        $curacaoId = 12;
        $dominicaId = 13;
        $drId = 14;
        $grenadaId = 15;
        $guadeloupeId = 16;
        $guyanaId = 17;
        $haitiId = 18;
        $jamaicaId = 19;
        $martiniqueId = 20;
        $montserratId = 21;
        $puertoRicoId = 22;
        $sabaId = 23;
        $stBarthelemyId = 24;
        $stKittsNevisId = 25;
        $stLuciaId = 26;
        $stMartinId = 27;
        $stVincentId = 28;
        $sintEustatiusId = 29;
        $surinameId = 30;
        $trinidadId = 31;
        $turksCaicosId = 32;
        $usviId = 33;

        $usaId = 34;
        $canadaId = 35;
        $ukId = 36;
        $franceId = 37;
        $netherlandsId = 38;
        $spainId = 39;
        $panamaId = 40;
        $costaRicaId = 41;

        // Region Type IDs
        $districtVillageId = 1;
        $parishDependencyId = 2;
        $regionDistrictId = 3;
        $islandId = 4;
        $parishId = 5;
        $districtId = 6;
        $parishMunicipalityId = 7;
        $provinceId = 9;
        $provinceNationalDistrictId = 10;
        $regionId = 12;
        $departmentId = 13;
        $territoryId = 17;
        $areaId = 18;
        $municipalityTobagoId = 19;
        $stateId = 20;
        $provinceTerritoryId = 21;
        $countryRegionId = 22;
        $autonomousCommunityId = 25;
        $islandIslandGroupId = 26;
        $districtIslandId = 27;
        $provinceSpecialMunicipalityId = 28;
        $cityLocalAreaId = 29;

        $regions = [];

        // ==================== CARIBBEAN ====================

        // Anguilla → Area
        foreach (['All Anguilla', 'West', 'Central', 'East'] as $i => $name) {
            $regions[] = $this->makeRegion($anguillaId, $areaId, $name, $i + 1);
        }

        // Antigua and Barbuda → Parish / Dependency (Redonda removed)
        foreach (['Saint George', 'Saint John', 'Saint Mary', 'Saint Paul', 'Saint Peter', 'Saint Philip', 'Barbuda'] as $i => $name) {
            $regions[] = $this->makeRegion($antiguaId, $parishDependencyId, $name, $i + 1);
        }

        // Aruba → Region
        foreach (
            [
                'All regions',
                'Noord / Tanki Leendert',
                'Oranjestad West',
                'Oranjestad East',
                'Paradera',
                'Santa Cruz',
                'Savaneta',
                'San Nicolas North',
                'San Nicolas South',
            ] as $i => $name
        ) {
            $regions[] = $this->makeRegion($arubaId, $regionId, $name, $i + 1);
        }

        // Bahamas → Island / Island Group
        foreach (
            [
                'All Bahamas',
                'New Providence',
                'Grand Bahama',
                'Abaco',
                'Andros',
                'Eleuthera',
                'Exuma',
                'Other Family Islands',
            ] as $i => $name
        ) {
            $regions[] = $this->makeRegion($bahamasId, $islandIslandGroupId, $name, $i + 1);
        }

        // Barbados → Parish
        foreach (['Christ Church', 'Saint Andrew', 'Saint George', 'Saint James', 'Saint John', 'Saint Joseph', 'Saint Lucy', 'Saint Michael', 'Saint Peter', 'Saint Philip', 'Saint Thomas'] as $i => $name) {
            $regions[] = $this->makeRegion($barbadosId, $parishId, $name, $i + 1);
        }

        // Belize → District
        foreach (['Belize', 'Cayo', 'Corozal', 'Orange Walk', 'Stann Creek', 'Toledo'] as $i => $name) {
            $regions[] = $this->makeRegion($belizeId, $districtId, $name, $i + 1);
        }

        // Bermuda → Parish / Municipality
        foreach (
            [
                'All parishes / municipalities',
                'Devonshire',
                'Hamilton Parish',
                'Paget',
                'Pembroke',
                'Sandys',
                'Smith\'s',
                'Southampton',
                'St. George\'s Parish',
                'Warwick',
                'City of Hamilton',
                'Town of St. George',
            ] as $i => $name
        ) {
            $regions[] = $this->makeRegion($bermudaId, $parishMunicipalityId, $name, $i + 1);
        }

        // Bonaire → District
        foreach (['All districts', 'Amboina', 'Antriol', 'Nikiboko', 'Noord Salina', 'Rincon', 'Tera Kora'] as $i => $name) {
            $regions[] = $this->makeRegion($bonaireId, $districtId, $name, $i + 1);
        }

        // British Virgin Islands → Island
        foreach (['All islands', 'Anegada', 'Jost Van Dyke', 'Tortola', 'Virgin Gorda'] as $i => $name) {
            $regions[] = $this->makeRegion($bviId, $islandId, $name, $i + 1);
        }

        // Cayman Islands → District / Island
        foreach (['All districts / islands', 'George Town', 'West Bay', 'Bodden Town', 'North Side', 'East End', 'Cayman Brac', 'Little Cayman'] as $i => $name) {
            $regions[] = $this->makeRegion($caymanId, $districtIslandId, $name, $i + 1);
        }

        // Cuba → Province / Special Municipality
        foreach (['Pinar del Río', 'Artemisa', 'Havana', 'Mayabeque', 'Matanzas', 'Villa Clara', 'Cienfuegos', 'Sancti Spíritus', 'Ciego de Ávila', 'Camagüey', 'Las Tunas', 'Holguín', 'Granma', 'Santiago de Cuba', 'Guantánamo', 'Isla de la Juventud'] as $i => $name) {
            $regions[] = $this->makeRegion($cubaId, $provinceSpecialMunicipalityId, $name, $i + 1);
        }

        // Curaçao → Area
        foreach (['All areas', 'Bandabou', 'Western Willemstad', 'Central Willemstad', 'Eastern Willemstad', 'Bandariba'] as $i => $name) {
            $regions[] = $this->makeRegion($curacaoId, $areaId, $name, $i + 1);
        }

        // Dominica → Parish
        foreach (['Saint Andrew', 'Saint David', 'Saint George', 'Saint John', 'Saint Joseph', 'Saint Luke', 'Saint Mark', 'Saint Patrick', 'Saint Paul', 'Saint Peter'] as $i => $name) {
            $regions[] = $this->makeRegion($dominicaId, $parishId, $name, $i + 1);
        }

        // Dominican Republic → Province / National District
        $drRegions = ['All provinces / National District', 'Distrito Nacional', 'Santo Domingo', 'Santiago', 'La Vega', 'San Cristóbal', 'Puerto Plata', 'Duarte', 'San Pedro de Macorís', 'La Romana', 'Espaillat', 'Peravia', 'Azua', 'Barahona', 'San Juan', 'La Altagracia', 'Monte Cristi', 'Samaná', 'María Trinidad Sánchez', 'Valverde', 'Monseñor Nouel', 'Sánchez Ramírez', 'Hermanas Mirabal', 'Dajabón', 'El Seibo', 'Hato Mayor', 'Independencia', 'Pedernales', 'Bahoruco', 'Elías Piña', 'San José de Ocoa', 'Santiago Rodríguez', 'Monte Plata'];
        foreach ($drRegions as $i => $name) {
            $regions[] = $this->makeRegion($drId, $provinceNationalDistrictId, $name, $i + 1);
        }

        // Grenada → Parish / Dependency
        foreach (['Saint Andrew', 'Saint David', 'Saint George', 'Saint John', 'Saint Mark', 'Saint Patrick', 'Carriacou and Petite Martinique'] as $i => $name) {
            $regions[] = $this->makeRegion($grenadaId, $parishDependencyId, $name, $i + 1);
        }

        // Guadeloupe → Area
        foreach (['All Guadeloupe', 'Grande-Terre', 'Basse-Terre', 'Marie-Galante', 'Les Saintes', 'La Désirade'] as $i => $name) {
            $regions[] = $this->makeRegion($guadeloupeId, $areaId, $name, $i + 1);
        }

        // Guyana → Region
        foreach (['Barima-Waini', 'Pomeroon-Supenaam', 'Essequibo Islands-West Demerara', 'Demerara-Mahaica', 'Mahaica-Berbice', 'East Berbice-Corentyne', 'Cuyuni-Mazaruni', 'Potaro-Siparuni', 'Upper Takutu-Upper Essequibo', 'Upper Demerara-Berbice'] as $i => $name) {
            $regions[] = $this->makeRegion($guyanaId, $regionId, $name, $i + 1);
        }

        // Haiti → Department
        foreach (['Artibonite', 'Centre', 'Grand\'Anse', 'Nippes', 'Nord', 'Nord-Est', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Est'] as $i => $name) {
            $regions[] = $this->makeRegion($haitiId, $departmentId, $name, $i + 1);
        }

        // Jamaica → Parish
        foreach (['Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary', 'St. Ann', 'Trelawny', 'St. James', 'Hanover', 'Westmoreland', 'St. Elizabeth', 'Manchester', 'Clarendon', 'St. Catherine'] as $i => $name) {
            $regions[] = $this->makeRegion($jamaicaId, $parishId, $name, $i + 1);
        }

        // Martinique → Area
        foreach (['All Martinique', 'Central', 'North Caribbean', 'North Atlantic', 'South'] as $i => $name) {
            $regions[] = $this->makeRegion($martiniqueId, $areaId, $name, $i + 1);
        }

        // Montserrat → REMOVED (no secondary geography)

        // Puerto Rico → Area
        foreach (['All Puerto Rico', 'San Juan Metro', 'North', 'East', 'South', 'West', 'Central', 'Vieques & Culebra'] as $i => $name) {
            $regions[] = $this->makeRegion($puertoRicoId, $areaId, $name, $i + 1);
        }

        // Saba → REMOVED
        // Saint Barthélemy → REMOVED

        // Saint Kitts and Nevis → Island
        foreach (['All Saint Kitts and Nevis', 'Saint Kitts', 'Nevis'] as $i => $name) {
            $regions[] = $this->makeRegion($stKittsNevisId, $islandId, $name, $i + 1);
        }

        // Saint Lucia → District
        foreach (['Anse la Raye', 'Canaries', 'Castries', 'Choiseul', 'Dennery', 'Gros Islet', 'Laborie', 'Micoud', 'Soufrière', 'Vieux Fort'] as $i => $name) {
            $regions[] = $this->makeRegion($stLuciaId, $districtId, $name, $i + 1);
        }

        // Saint Martin / Sint Maarten → Territory
        foreach (['All Saint Martin / Sint Maarten', 'Saint-Martin (French side)', 'Sint Maarten (Dutch side)'] as $i => $name) {
            $regions[] = $this->makeRegion($stMartinId, $territoryId, $name, $i + 1);
        }

        // Saint Vincent and the Grenadines → Parish
        foreach (['Charlotte', 'Grenadines', 'Saint Andrew', 'Saint David', 'Saint George', 'Saint Patrick'] as $i => $name) {
            $regions[] = $this->makeRegion($stVincentId, $parishId, $name, $i + 1);
        }

        // Sint Eustatius → REMOVED

        // Suriname → District
        foreach (['Paramaribo', 'Wanica', 'Nickerie', 'Coronie', 'Saramacca', 'Commewijne', 'Marowijne', 'Para', 'Brokopondo', 'Sipaliwini'] as $i => $name) {
            $regions[] = $this->makeRegion($surinameId, $districtId, $name, $i + 1);
        }

        // Trinidad and Tobago → Municipality / Tobago
        foreach (
            [
                'All Trinidad and Tobago',
                'Arima',
                'Chaguanas',
                'Couva-Tabaquite-Talparo',
                'Diego Martin',
                'Mayaro-Rio Claro',
                'Penal-Debe',
                'Point Fortin',
                'Port of Spain',
                'Princes Town',
                'San Fernando',
                'San Juan-Laventille',
                'Sangre Grande',
                'Siparia',
                'Tobago',
                'Tunapuna-Piarco',
            ] as $i => $name
        ) {
            $regions[] = $this->makeRegion($trinidadId, $municipalityTobagoId, $name, $i + 1);
        }

        // Turks and Caicos Islands → Island
        foreach (['All Turks and Caicos Islands', 'Grand Turk', 'Middle Caicos', 'North Caicos', 'Providenciales', 'Salt Cay', 'South Caicos'] as $i => $name) {
            $regions[] = $this->makeRegion($turksCaicosId, $islandId, $name, $i + 1);
        }

        // United States Virgin Islands → Island
        foreach (['All U.S. Virgin Islands', 'Saint Croix', 'Saint John', 'Saint Thomas'] as $i => $name) {
            $regions[] = $this->makeRegion($usviId, $islandId, $name, $i + 1);
        }

        // ==================== DIASPORA ====================

        // United States → State
        foreach (['New York', 'Florida', 'New Jersey', 'Connecticut', 'Georgia', 'Maryland', 'Massachusetts', 'Pennsylvania', 'Texas', 'California', 'Virginia', 'North Carolina', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'Colorado', 'Delaware', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Mexico', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Utah', 'Vermont', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'] as $i => $name) {
            $regions[] = $this->makeRegion($usaId, $stateId, $name, $i + 1);
        }

        // Canada → Province / Territory
        foreach (['Ontario', 'Quebec', 'Alberta', 'British Columbia', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island', 'Northwest Territories', 'Nunavut', 'Yukon'] as $i => $name) {
            $regions[] = $this->makeRegion($canadaId, $provinceTerritoryId, $name, $i + 1);
        }

        // France → Region
        foreach (
            [
                'All regions',
                'Auvergne-Rhône-Alpes',
                'Bourgogne-Franche-Comté',
                'Brittany',
                'Centre-Val de Loire',
                'Corsica',
                'French Guiana (Guyane)',
                'Grand Est',
                'Guadeloupe',
                'Hauts-de-France',
                'Île-de-France',
                'Martinique',
                'Mayotte',
                'Normandy',
                'Nouvelle-Aquitaine',
                'Occitanie',
                'Pays de la Loire',
                'Provence-Alpes-Côte d\'Azur',
                'Réunion',
            ] as $i => $name
        ) {
            $regions[] = $this->makeRegion($franceId, $regionId, $name, $i + 1);
        }

        // Netherlands → Area
        foreach (['All Netherlands', 'Amsterdam & North Holland', 'Rotterdam & The Hague', 'Utrecht & Central Netherlands', 'Other Netherlands'] as $i => $name) {
            $regions[] = $this->makeRegion($netherlandsId, $areaId, $name, $i + 1);
        }

        // Spain → Autonomous Community
        foreach (['All autonomous communities', 'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country', 'Canary Islands', 'Cantabria', 'Castile and León', 'Castilla-La Mancha', 'Catalonia', 'Extremadura', 'Galicia', 'La Rioja', 'Madrid', 'Murcia', 'Navarre', 'Valencia'] as $i => $name) {
            $regions[] = $this->makeRegion($spainId, $autonomousCommunityId, $name, $i + 1);
        }

        // Panama → Province
        foreach (['Panamá', 'Colón', 'Panamá Oeste', 'Bocas del Toro', 'Chiriquí', 'Coclé', 'Darién', 'Herrera', 'Los Santos', 'Veraguas'] as $i => $name) {
            $regions[] = $this->makeRegion($panamaId, $provinceId, $name, $i + 1);
        }

        // Costa Rica → Province
        foreach (['Limón', 'San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas'] as $i => $name) {
            $regions[] = $this->makeRegion($costaRicaId, $provinceId, $name, $i + 1);
        }

        // Bulk insert all non-UK regions
        DB::table('regions')->insert($regions);

        // ==================== UNITED KINGDOM (3-level hierarchy) ====================
        // England / Scotland / Wales / Northern Ireland → parent_id = NULL
        // Cities → parent_id = England.id / Scotland.id / Wales.id / Northern Ireland.id

        $ukHierarchy = [
            'England' => [
                'Birmingham',
                'Bradford',
                'Brighton & Hove',
                'Bristol',
                'Cambridge',
                'Coventry',
                'Derby',
                'Hull',
                'Leeds',
                'Leicester',
                'Liverpool',
                'London',
                'Manchester',
                'Newcastle upon Tyne',
                'Nottingham',
                'Oxford',
                'Peterborough',
                'Plymouth',
                'Portsmouth',
                'Reading',
                'Sheffield',
                'Southampton',
                'Stoke-on-Trent',
                'Sunderland',
                'Wolverhampton',
                'York',
            ],
            'Scotland' => ['Aberdeen', 'Dundee', 'Edinburgh', 'Glasgow', 'Inverness', 'Perth', 'Stirling'],
            'Wales'    => ['Bangor', 'Cardiff', 'Newport', 'St Davids', 'Swansea', 'Wrexham'],
            'Northern Ireland' => ['Belfast', 'Derry/Londonderry', 'Lisburn', 'Newry'],
        ];

        $ukParentOrder = 1;
        foreach ($ukHierarchy as $parentName => $cities) {
            // Insert parent (England / Scotland / Wales / Northern Ireland) with parent_id = NULL
            $parentId = DB::table('regions')->insertGetId([
                'country_id'     => $ukId,
                'parent_id'      => null,
                'region_type_id' => $countryRegionId,
                'name'           => $parentName,
                'slug'           => Str::slug($parentName),
                'is_active'      => true,
                'display_order'  => $ukParentOrder++,
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            // Insert cities as children of this parent
            $cityRows = [];
            foreach ($cities as $i => $city) {
                $cityRows[] = [
                    'country_id'     => $ukId,
                    'parent_id'      => $parentId,
                    'region_type_id' => $cityLocalAreaId,
                    'name'           => $city,
                    'slug'           => Str::slug($city),
                    'is_active'      => true,
                    'display_order'  => $i + 1,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ];
            }
            DB::table('regions')->insert($cityRows);
        }
    }

    /**
     * Helper: create a region row (parent_id = null by default)
     */
    private function makeRegion($countryId, $regionTypeId, $name, $displayOrder)
    {
        return [
            'country_id'     => $countryId,
            'parent_id'      => null,
            'region_type_id' => $regionTypeId,
            'name'           => trim($name),
            'slug'           => Str::slug(trim($name)),
            'is_active'      => true,
            'display_order'  => $displayOrder,
            'created_at'     => now(),
            'updated_at'     => now(),
        ];
    }
}
