
export type Zone = 'caba' | 'gba1' | 'gba2' | 'gba3' | 'rest';

export interface LocationData {
    province: string;
    cities: { name: string; zone: Zone }[];
}


export const CABA_ZONES: { name: string; zone: Zone }[] = [
    { name: "Ciudad Autónoma de Buenos Aires", zone: 'caba' }
];

// GBA Zones Data
// Classification based on logistics rings usually used in Argentina
const GBA_1: string[] = [
    "Avellaneda", "Lanús", "Lomas de Zamora", "San Martín", "Tres de Febrero",
    "Morón", "Vicente López", "San Isidro"
];

const GBA_2: string[] = [
    "Quilmes", "Berazategui", "Florencio Varela", "Almirante Brown",
    "Esteban Echeverría", "Ezeiza", "Moreno", "Merlo", "Hurlingham",
    "Ituzaingó", "San Miguel", "José C. Paz", "Malvinas Argentinas",
    "Tigre", "San Fernando", "La Matanza"
];

const GBA_3: string[] = [
    "La Plata", "Berisso", "Ensenada", "San Vicente", "Presidente Perón",
    "Marcos Paz", "General Rodríguez", "Escobar", "Pilar", "Cañuelas"
];

// Helper to build city objects
const buildCities = (names: string[], zone: Zone) => names.map(name => ({ name, zone }));

export const BUENOS_AIRES_CITIES = [
    ...buildCities(GBA_1, 'gba1'),
    ...buildCities(GBA_2, 'gba2'),
    ...buildCities(GBA_3, 'gba3'),
    { name: "Mar del Plata", zone: 'rest' as Zone },
    { name: "Bahía Blanca", zone: 'rest' as Zone },
    { name: "Tandil", zone: 'rest' as Zone },
    { name: "San Nicolás", zone: 'rest' as Zone },
    { name: "Pergamino", zone: 'rest' as Zone },
    { name: "Olavarría", zone: 'rest' as Zone },
    { name: "Junín", zone: 'rest' as Zone },
    { name: "Otra localidad de Buenos Aires", zone: 'rest' as Zone }
].sort((a, b) => a.name.localeCompare(b.name));


export const LOCATION_DATA: LocationData[] = [
    {
        province: "Ciudad Autónoma de Buenos Aires",
        cities: CABA_ZONES
    },
    {
        province: "Buenos Aires",
        cities: BUENOS_AIRES_CITIES
    },
    {
        province: "Córdoba",
        cities: [{ name: "Córdoba Capital", zone: 'rest' }, { name: "Otras Localidades", zone: 'rest' }]
    },
    {
        province: "Santa Fe",
        cities: [{ name: "Rosario", zone: 'rest' }, { name: "Santa Fe Capital", zone: 'rest' }, { name: "Otras Localidades", zone: 'rest' }]
    },
    {
        province: "Mendoza",
        cities: [{ name: "Mendoza Capital", zone: 'rest' }, { name: "Otras Localidades", zone: 'rest' }]
    }
    // For other provinces, we can simplify for now as costs are 'rest' anyway
];

export const OTHER_PROVINCES = [
    "Catamarca", "Chaco", "Chubut", "Corrientes", "Entre Ríos", "Formosa",
    "Jujuy", "La Pampa", "La Rioja", "Misiones", "Neuquén", "Río Negro",
    "Salta", "San Juan", "San Luis", "Santa Cruz", "Santiago del Estero",
    "Tierra del Fuego", "Tucumán"
];

// Fill the rest
OTHER_PROVINCES.forEach(prov => {
    LOCATION_DATA.push({
        province: prov,
        cities: [{ name: "Cualquier Localidad", zone: 'rest' }]
    });
});

export const getCityZone = (provinceName: string, cityName: string): Zone => {
    const province = LOCATION_DATA.find(p => p.province === provinceName);
    if (!province) return 'rest';

    // Default to rest if not found, but try to find it
    const city = province.cities.find(c => c.name === cityName);
    return city ? city.zone : 'rest';
};
