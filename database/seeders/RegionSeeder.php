<?php
// database/seeders/RegionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Countries ID Reference
        // Caribbean Countries
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

        // Diaspora Countries
        $usaId = 34;
        $canadaId = 35;
        $ukId = 36;
        $franceId = 37;
        $netherlandsId = 38;
        $spainId = 39;
        $panamaId = 40;
        $costaRicaId = 41;

        // Region Types ID Reference
        $districtVillageId = 1;           // District / Village
        $parishDependencyId = 2;          // Parish / Dependency
        $regionDistrictId = 3;            // Region / District
        $islandDistrictId = 4;            // Island / District
        $parishId = 5;                    // Parish
        $districtId = 6;                  // District
        $parishMunicipalityId = 7;        // Parish / Municipality
        $districtAreaId = 8;              // District / Area
        $provinceId = 9;                  // Province
        $provinceNationalDistrictId = 10; // Province / National District
        $arrondissementCommuneId = 11;    // Arrondissement / Commune
        $regionId = 12;                   // Region
        $departmentId = 13;               // Department
        $municipalityId = 14;             // Municipality
        $villageAreaId = 15;              // Village / Area
        $quarterAreaId = 16;              // Quarter / Area
        $territoryAreaId = 17;            // Territory / Area
        $areaId = 18;                     // Area
        $municipalityBoroughId = 19;      // Municipality / Borough / City / Ward
        $stateId = 20;                    // State
        $provinceTerritoryId = 21;        // Province / Territory
        $countryRegionId = 22;            // Country / Region
        $regionDepartmentId = 23;         // Region / Department
        $provinceMunicipalityId = 24;     // Province / Municipality
        $autonomousCommunityId = 25;      // Autonomous Community / Province

        $regions = [];

        // ==================== CARIBBEAN REGIONS ====================

        // Anguilla - District / Village (ID: 1)
        $regions = array_merge($regions, [
            $this->makeRegion($anguillaId, $districtVillageId, 'The Valley', 1),
            $this->makeRegion($anguillaId, $districtVillageId, 'Blowing Point', 2),
            $this->makeRegion($anguillaId, $districtVillageId, 'East End', 3),
            $this->makeRegion($anguillaId, $districtVillageId, 'West End', 4),
            $this->makeRegion($anguillaId, $districtVillageId, 'Island Harbour', 5),
            $this->makeRegion($anguillaId, $districtVillageId, 'Sandy Ground', 6),
        ]);

        // Antigua and Barbuda - Parish / Dependency (ID: 2)
        $regions = array_merge($regions, [
            $this->makeRegion($antiguaId, $parishDependencyId, 'Saint George', 1),
            $this->makeRegion($antiguaId, $parishDependencyId, 'Saint John', 2),
            $this->makeRegion($antiguaId, $parishDependencyId, 'Saint Mary', 3),
            $this->makeRegion($antiguaId, $parishDependencyId, 'Saint Paul', 4),
            $this->makeRegion($antiguaId, $parishDependencyId, 'Saint Peter', 5),
            $this->makeRegion($antiguaId, $parishDependencyId, 'Saint Philip', 6),
            $this->makeRegion($antiguaId, $parishDependencyId, 'Barbuda', 7),
            $this->makeRegion($antiguaId, $parishDependencyId, 'Redonda', 8),
        ]);

        // Aruba - Region / District (ID: 3)
        $regions = array_merge($regions, [
            $this->makeRegion($arubaId, $regionDistrictId, 'Noord', 1),
            $this->makeRegion($arubaId, $regionDistrictId, 'Oranjestad', 2),
            $this->makeRegion($arubaId, $regionDistrictId, 'Paradera', 3),
            $this->makeRegion($arubaId, $regionDistrictId, 'San Nicolas', 4),
            $this->makeRegion($arubaId, $regionDistrictId, 'Santa Cruz', 5),
            $this->makeRegion($arubaId, $regionDistrictId, 'Savaneta', 6),
        ]);

        // Bahamas - Island / District (ID: 4)
        $bahamasRegions = ['New Providence/Nassau', 'Grand Bahama/Freeport', 'Abaco', 'Andros', 'Bimini', 'Cat Island', 'Eleuthera', 'Exuma', 'Long Island', 'Mayaguana', 'Inagua', 'Acklins', 'Crooked Island', 'Berry Islands', 'Ragged Island', 'San Salvador', 'Rum Cay'];
        foreach ($bahamasRegions as $index => $region) {
            $regions[] = $this->makeRegion($bahamasId, $islandDistrictId, $region, $index + 1);
        }

        // Barbados - Parish (ID: 5)
        $barbadosRegions = ['Christ Church', 'Saint Andrew', 'Saint George', 'Saint James', 'Saint John', 'Saint Joseph', 'Saint Lucy', 'Saint Michael', 'Saint Peter', 'Saint Philip', 'Saint Thomas'];
        foreach ($barbadosRegions as $index => $region) {
            $regions[] = $this->makeRegion($barbadosId, $parishId, $region, $index + 1);
        }

        // Belize - District (ID: 6)
        $belizeRegions = ['Belize', 'Cayo', 'Corozal', 'Orange Walk', 'Stann Creek', 'Toledo'];
        foreach ($belizeRegions as $index => $region) {
            $regions[] = $this->makeRegion($belizeId, $districtId, $region, $index + 1);
        }

        // Bermuda - Parish / Municipality (ID: 7)
        $bermudaRegions = ['Devonshire', 'Hamilton Parish', 'Paget', 'Pembroke', 'Saint George\'s', 'Sandys', 'Smith\'s', 'Southampton', 'Warwick', 'Hamilton', 'St. George'];
        foreach ($bermudaRegions as $index => $region) {
            $regions[] = $this->makeRegion($bermudaId, $parishMunicipalityId, $region, $index + 1);
        }

        // Bonaire - District / Area (ID: 8)
        $bonaireRegions = ['Kralendijk', 'Rincon', 'Antriol', 'Nikiboko', 'Nort di Salina', 'Tera Kora'];
        foreach ($bonaireRegions as $index => $region) {
            $regions[] = $this->makeRegion($bonaireId, $districtAreaId, $region, $index + 1);
        }

        // British Virgin Islands - Island / District (ID: 4)
        $bviRegions = ['Tortola', 'Virgin Gorda', 'Anegada', 'Jost Van Dyke', 'Road Town'];
        foreach ($bviRegions as $index => $region) {
            $regions[] = $this->makeRegion($bviId, $islandDistrictId, $region, $index + 1);
        }

        // Cayman Islands - District / Island (ID: 4)
        $caymanRegions = ['George Town', 'West Bay', 'Bodden Town', 'North Side', 'East End', 'Cayman Brac', 'Little Cayman'];
        foreach ($caymanRegions as $index => $region) {
            $regions[] = $this->makeRegion($caymanId, $islandDistrictId, $region, $index + 1);
        }

        // Cuba - Province (ID: 9)
        $cubaRegions = ['Pinar del Río', 'Artemisa', 'Havana', 'Mayabeque', 'Matanzas', 'Villa Clara', 'Cienfuegos', 'Sancti Spíritus', 'Ciego de Ávila', 'Camagüey', 'Las Tunas', 'Holguín', 'Granma', 'Santiago de Cuba', 'Guantánamo', 'Isla de la Juventud'];
        foreach ($cubaRegions as $index => $region) {
            $regions[] = $this->makeRegion($cubaId, $provinceId, $region, $index + 1);
        }

        // Curaçao - District / Area (ID: 8)
        $curacaoRegions = ['Willemstad', 'Banda Abou', 'Banda Ariba', 'Barber', 'Westpunt', 'Jan Thiel'];
        foreach ($curacaoRegions as $index => $region) {
            $regions[] = $this->makeRegion($curacaoId, $districtAreaId, $region, $index + 1);
        }

        // Dominica - Parish (ID: 5)
        $dominicaRegions = ['Saint Andrew', 'Saint David', 'Saint George', 'Saint John', 'Saint Joseph', 'Saint Luke', 'Saint Mark', 'Saint Patrick', 'Saint Paul', 'Saint Peter'];
        foreach ($dominicaRegions as $index => $region) {
            $regions[] = $this->makeRegion($dominicaId, $parishId, $region, $index + 1);
        }

        // Dominican Republic - Province / National District (ID: 10)
        $drRegions = ['Distrito Nacional', 'Santo Domingo', 'Santiago', 'La Vega', 'San Cristóbal', 'Puerto Plata', 'Duarte', 'San Pedro de Macorís', 'La Romana', 'Espaillat', 'Peravia', 'Azua', 'Barahona', 'San Juan', 'La Altagracia', 'Monte Cristi', 'Samaná', 'María Trinidad Sánchez', 'Valverde', 'Monseñor Nouel', 'Sánchez Ramírez', 'Hermanas Mirabal', 'Dajabón', 'El Seibo', 'Hato Mayor', 'Independencia', 'Pedernales', 'Bahoruco', 'Elías Piña', 'San José de Ocoa', 'Santiago Rodríguez', 'Monte Plata'];
        foreach ($drRegions as $index => $region) {
            $regions[] = $this->makeRegion($drId, $provinceNationalDistrictId, $region, $index + 1);
        }

        // Grenada - Parish / Dependency (ID: 2)
        $grenadaRegions = ['Saint Andrew', 'Saint David', 'Saint George', 'Saint John', 'Saint Mark', 'Saint Patrick', 'Carriacou and Petite Martinique'];
        foreach ($grenadaRegions as $index => $region) {
            $regions[] = $this->makeRegion($grenadaId, $parishDependencyId, $region, $index + 1);
        }

        // Guadeloupe - Arrondissement / Commune (ID: 11)
        $guadeloupeRegions = ['Basse-Terre', 'Pointe-à-Pitre', 'Les Abymes', 'Baie-Mahault', 'Le Gosier', 'Sainte-Anne', 'Saint-François', 'Marie-Galante'];
        foreach ($guadeloupeRegions as $index => $region) {
            $regions[] = $this->makeRegion($guadeloupeId, $arrondissementCommuneId, $region, $index + 1);
        }

        // Guyana - Region (ID: 12)
        $guyanaRegions = ['Barima-Waini', 'Pomeroon-Supenaam', 'Essequibo Islands-West Demerara', 'Demerara-Mahaica', 'Mahaica-Berbice', 'East Berbice-Corentyne', 'Cuyuni-Mazaruni', 'Potaro-Siparuni', 'Upper Takutu-Upper Essequibo', 'Upper Demerara-Berbice'];
        foreach ($guyanaRegions as $index => $region) {
            $regions[] = $this->makeRegion($guyanaId, $regionId, $region, $index + 1);
        }

        // Haiti - Department (ID: 13)
        $haitiRegions = ['Artibonite', 'Centre', 'Grand\'Anse', 'Nippes', 'Nord', 'Nord-Est', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Est'];
        foreach ($haitiRegions as $index => $region) {
            $regions[] = $this->makeRegion($haitiId, $departmentId, $region, $index + 1);
        }

        // Jamaica - Parish (ID: 5)
        $jamaicaRegions = ['Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary', 'St. Ann', 'Trelawny', 'St. James', 'Hanover', 'Westmoreland', 'St. Elizabeth', 'Manchester', 'Clarendon', 'St. Catherine'];
        foreach ($jamaicaRegions as $index => $region) {
            $regions[] = $this->makeRegion($jamaicaId, $parishId, $region, $index + 1);
        }

        // Martinique - Arrondissement / Commune (ID: 11)
        $martiniqueRegions = ['Fort-de-France', 'La Trinité', 'Le Marin', 'Saint-Pierre', 'Le Lamentin', 'Schoelcher', 'Ducos', 'Sainte-Marie'];
        foreach ($martiniqueRegions as $index => $region) {
            $regions[] = $this->makeRegion($martiniqueId, $arrondissementCommuneId, $region, $index + 1);
        }

        // Montserrat - Parish / District (ID: 2)
        $montserratRegions = ['Saint Anthony', 'Saint Georges', 'Saint Peter', 'Brades', 'Salem'];
        foreach ($montserratRegions as $index => $region) {
            $regions[] = $this->makeRegion($montserratId, $parishDependencyId, $region, $index + 1);
        }

        // Puerto Rico - Municipality (ID: 14)
        $prRegions = ['San Juan', 'Bayamón', 'Ponce', 'Carolina', 'Caguas', 'Guaynabo', 'Mayagüez', 'Arecibo', 'Toa Baja', 'Trujillo Alto', 'Aguadilla', 'Humacao', 'Fajardo', 'Vieques', 'Culebra'];
        foreach ($prRegions as $index => $region) {
            $regions[] = $this->makeRegion($puertoRicoId, $municipalityId, $region, $index + 1);
        }

        // Saba - Village / Area (ID: 15)
        $sabaRegions = ['The Bottom', 'Windwardside', 'Zion\'s Hill', 'St. Johns'];
        foreach ($sabaRegions as $index => $region) {
            $regions[] = $this->makeRegion($sabaId, $villageAreaId, $region, $index + 1);
        }

        // Saint Barthélemy - Quarter / Area (ID: 16)
        $stBarthelemyRegions = ['Gustavia', 'Saint-Jean', 'Lorient', 'Colombier', 'Grand Cul-de-Sac', 'Flamands'];
        foreach ($stBarthelemyRegions as $index => $region) {
            $regions[] = $this->makeRegion($stBarthelemyId, $quarterAreaId, $region, $index + 1);
        }

        // Saint Kitts and Nevis - Parish (ID: 5)
        $sknRegions = ['Christ Church Nichola Town', 'Saint Anne Sandy Point', 'Saint George Basseterre', 'Saint George Gingerland', 'Saint James Windward', 'Saint John Capisterre', 'Saint John Figtree', 'Saint Mary Cayon', 'Saint Paul Capisterre', 'Saint Paul Charlestown', 'Saint Peter Basseterre', 'Saint Thomas Lowland', 'Saint Thomas Middle Island', 'Trinity Palmetto Point'];
        foreach ($sknRegions as $index => $region) {
            $regions[] = $this->makeRegion($stKittsNevisId, $parishId, $region, $index + 1);
        }

        // Saint Lucia - District (ID: 6)
        $stLuciaRegions = ['Anse la Raye', 'Canaries', 'Castries', 'Choiseul', 'Dennery', 'Gros Islet', 'Laborie', 'Micoud', 'Soufrière', 'Vieux Fort'];
        foreach ($stLuciaRegions as $index => $region) {
            $regions[] = $this->makeRegion($stLuciaId, $districtId, $region, $index + 1);
        }

        // Saint Martin / Sint Maarten - Territory / Area (ID: 17)
        $stMartinRegions = ['Marigot', 'Grand Case', 'Philipsburg', 'Simpson Bay', 'Cole Bay', 'Dutch Quarter', 'French Quarter'];
        foreach ($stMartinRegions as $index => $region) {
            $regions[] = $this->makeRegion($stMartinId, $territoryAreaId, $region, $index + 1);
        }

        // Saint Vincent and the Grenadines - Parish (ID: 5)
        $svgRegions = ['Charlotte', 'Grenadines', 'Saint Andrew', 'Saint David', 'Saint George', 'Saint Patrick'];
        foreach ($svgRegions as $index => $region) {
            $regions[] = $this->makeRegion($stVincentId, $parishId, $region, $index + 1);
        }

        // Sint Eustatius - Area (ID: 18)
        $sintEustatiusRegions = ['Oranjestad', 'Concordia', 'Golden Rock', 'Lynch Plantation'];
        foreach ($sintEustatiusRegions as $index => $region) {
            $regions[] = $this->makeRegion($sintEustatiusId, $areaId, $region, $index + 1);
        }

        // Suriname - District (ID: 6)
        $surinameRegions = ['Paramaribo', 'Wanica', 'Nickerie', 'Coronie', 'Saramacca', 'Commewijne', 'Marowijne', 'Para', 'Brokopondo', 'Sipaliwini'];
        foreach ($surinameRegions as $index => $region) {
            $regions[] = $this->makeRegion($surinameId, $districtId, $region, $index + 1);
        }

        // Trinidad and Tobago - Municipality / Borough / City / Ward (ID: 19)
        $ttRegions = ['Port of Spain', 'San Fernando', 'Arima', 'Chaguanas', 'Point Fortin', 'Couva-Tabaquite-Talparo', 'Diego Martin', 'Mayaro-Rio Claro', 'Penal-Debe', 'Princes Town', 'San Juan-Laventille', 'Sangre Grande', 'Siparia', 'Tunapuna-Piarco', 'Tobago'];
        foreach ($ttRegions as $index => $region) {
            $regions[] = $this->makeRegion($trinidadId, $municipalityBoroughId, $region, $index + 1);
        }

        // Turks and Caicos Islands - District / Island (ID: 4)
        $turksCaicosRegions = ['Providenciales', 'Grand Turk', 'North Caicos', 'Middle Caicos', 'South Caicos', 'Salt Cay'];
        foreach ($turksCaicosRegions as $index => $region) {
            $regions[] = $this->makeRegion($turksCaicosId, $islandDistrictId, $region, $index + 1);
        }

        // United States Virgin Islands - Island / District (ID: 4)
        $usviRegions = ['Saint Croix', 'Saint Thomas', 'Saint John', 'Water Island'];
        foreach ($usviRegions as $index => $region) {
            $regions[] = $this->makeRegion($usviId, $islandDistrictId, $region, $index + 1);
        }

        // ==================== DIASPORA REGIONS ====================

        // United States - State (ID: 20)
        $usStates = ['New York', 'Florida', 'New Jersey', 'Connecticut', 'Georgia', 'Maryland', 'Massachusetts', 'Pennsylvania', 'Texas', 'California', 'Virginia', 'North Carolina', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'Colorado', 'Delaware', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Mexico', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Utah', 'Vermont', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'];
        foreach ($usStates as $index => $region) {
            $regions[] = $this->makeRegion($usaId, $stateId, $region, $index + 1);
        }

        // Canada - Province / Territory (ID: 21)
        $canadaRegions = ['Ontario', 'Quebec', 'Alberta', 'British Columbia', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island', 'Northwest Territories', 'Nunavut', 'Yukon'];
        foreach ($canadaRegions as $index => $region) {
            $regions[] = $this->makeRegion($canadaId, $provinceTerritoryId, $region, $index + 1);
        }

        // United Kingdom - Country / Region (ID: 22)
        $ukRegions = ['England', 'Scotland', 'Wales', 'Northern Ireland', 'London', 'Birmingham', 'Manchester', 'Leeds', 'Bristol', 'Nottingham', 'Leicester', 'Liverpool'];
        foreach ($ukRegions as $index => $region) {
            $regions[] = $this->makeRegion($ukId, $countryRegionId, $region, $index + 1);
        }

        // France - Region / Department (ID: 23)
        $franceRegions = ['Île-de-France/Paris', 'Guadeloupe', 'Martinique', 'French Guiana', 'Réunion', 'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 'Centre-Val de Loire', 'Corsica', 'Grand Est', 'Hauts-de-France', 'Normandy', 'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'];
        foreach ($franceRegions as $index => $region) {
            $regions[] = $this->makeRegion($franceId, $regionDepartmentId, $region, $index + 1);
        }

        // Netherlands - Province / Municipality (ID: 24)
        $netherlandsRegions = ['North Holland/Amsterdam', 'South Holland/Rotterdam', 'South Holland/The Hague', 'Utrecht', 'Flevoland', 'Groningen', 'Friesland', 'Drenthe', 'Overijssel', 'Gelderland', 'Zeeland', 'Limburg', 'North Brabant'];
        foreach ($netherlandsRegions as $index => $region) {
            $regions[] = $this->makeRegion($netherlandsId, $provinceMunicipalityId, $region, $index + 1);
        }

        // Spain - Autonomous Community / Province (ID: 25)
        $spainRegions = ['Madrid', 'Catalonia/Barcelona', 'Valencia', 'Canary Islands', 'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country', 'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Extremadura', 'Galicia', 'La Rioja', 'Murcia', 'Navarre'];
        foreach ($spainRegions as $index => $region) {
            $regions[] = $this->makeRegion($spainId, $autonomousCommunityId, $region, $index + 1);
        }

        // Panama - Province (ID: 9)
        $panamaRegions = ['Panamá', 'Colón', 'Panamá Oeste', 'Bocas del Toro', 'Chiriquí', 'Coclé', 'Darién', 'Herrera', 'Los Santos', 'Veraguas'];
        foreach ($panamaRegions as $index => $region) {
            $regions[] = $this->makeRegion($panamaId, $provinceId, $region, $index + 1);
        }

        // Costa Rica - Province (ID: 9)
        $costaRicaRegions = ['Limón', 'San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas'];
        foreach ($costaRicaRegions as $index => $region) {
            $regions[] = $this->makeRegion($costaRicaId, $provinceId, $region, $index + 1);
        }

        // Insert all regions
        DB::table('regions')->insert($regions);
    }

    /**
     * Helper method to create a region array
     */
    private function makeRegion($countryId, $regionTypeId, $name, $displayOrder)
    {
        return [
            'country_id' => $countryId,
            'region_type_id' => $regionTypeId,
            'name' => trim($name),
            'slug' => Str::slug(trim($name)),
            'is_active' => true,
            'display_order' => $displayOrder,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
