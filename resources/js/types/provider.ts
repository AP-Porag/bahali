// export type Region = {
//     id: number;
//     name: string;
// };

// export type RegionType = {
//     id: number;
//     name: string;
//     regions: Region[];
// };

// export type Country = {
//     id: number;
//     name: string;
//     region_types: RegionType[];
//     code: string;
//     is_caribbean: boolean;
//     is_diaspora: boolean;
// };

// export type Profession = {
//     id: number;
//     name: string;
// };

// export type ProfessionCategory = {
//     id: number;
//     name: string;
//     slug: string;
//     professions: Profession[];
// };

export type RegionType = {
    id: number;
    name: string;
    label: string;
    created_at: string | null;
    updated_at: string | null;
};

export type Region = {
    id: number;
    name: string;
    country_id: number;
    region_type: RegionType;
    region_type_id: number;
    slug: string;
    is_active: number;
    display_order: number;
    created_at: string;
    updated_at: string;
};

export type Country = {
    id: number;
    name: string;
    code: string;
    regions: Region[];
    is_caribbean: boolean;
    is_diaspora: boolean;
    display_order: number;
    created_at: string | null;
    updated_at: string | null;
};

export type ProfessionCategory = {
    id: number;
    name: string;
    label: string;
    professions: Profession[];
};

export type Profession = {
    id: number;
    name: string;
    category_id: number;
};
export type Credential = {
    id: number;
    name: string;
};
export type SupportArea = {
    id: number;
    name: string;
};


