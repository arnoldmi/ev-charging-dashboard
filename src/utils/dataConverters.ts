// src/utils/dataConverters.ts
// Fonctions utilitaires pour convertir les données API en types numériques corrects

/**
 * Convertit une valeur en nombre (float)
 * @param value - Valeur à convertir (peut être string, number, null, undefined)
 * @param defaultValue - Valeur par défaut si la conversion échoue (défaut: 0)
 * @returns Nombre converti
 */
export const toNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Convertit une valeur en entier
 * @param value - Valeur à convertir
 * @param defaultValue - Valeur par défaut si la conversion échoue (défaut: 0)
 * @returns Entier converti
 */
export const toInteger = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Normalise les données d'une recharge
 * @param charge - Recharge brute de l'API
 * @returns Recharge avec types numériques corrects
 */
export const normalizeCharge = (charge: any) => ({
  id: toInteger(charge.id),
  date: charge.date,
  kwh: toNumber(charge.kwh),
  cost: toNumber(charge.cost),
  mileage: toInteger(charge.mileage),
  location: charge.location || '',
  user_id: toInteger(charge.user_id),
  vehicle_id: toInteger(charge.vehicle_id),
});

/**
 * Normalise les données d'un véhicule
 * @param vehicle - Véhicule brut de l'API
 * @returns Véhicule avec types numériques corrects
 */
export const normalizeVehicle = (vehicle: any) => ({
  id: toInteger(vehicle.id),
  user_id: toInteger(vehicle.user_id),
  model: vehicle.model || '',
  battery_capacity: toInteger(vehicle.battery_capacity),
  range: toInteger(vehicle.range),
  color: vehicle.color || '',
});

/**
 * Normalise les données d'un utilisateur
 * @param user - Utilisateur brut de l'API
 * @returns Utilisateur avec types corrects
 */
export const normalizeUser = (user: any) => ({
  id: toInteger(user.id),
  name: user.name || '',
  email: user.email || '',
});

/**
 * Formate un nombre avec un nombre de décimales spécifique
 * @param value - Nombre à formater
 * @param decimals - Nombre de décimales (défaut: 2)
 * @returns String formaté
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

/**
 * Formate un nombre avec séparateur de milliers
 * @param value - Nombre à formater
 * @param locale - Locale à utiliser (défaut: 'fr-FR')
 * @returns String formaté
 */
export const formatWithThousands = (value: number, locale: string = 'fr-FR'): string => {
  return value.toLocaleString(locale);
};

/**
 * Calcule le coût par kWh de manière sécurisée
 * @param cost - Coût total
 * @param kwh - Énergie en kWh
 * @returns Coût par kWh ou 0 si division impossible
 */
export const calculateCostPerKwh = (cost: number, kwh: number): number => {
  if (kwh === 0 || isNaN(kwh) || isNaN(cost)) {
    return 0;
  }
  return cost / kwh;
};

/**
 * Calcule la consommation aux 100km
 * @param kwh - Énergie consommée
 * @param distance - Distance parcourue
 * @returns Consommation pour 100km ou 0
 */
export const calculateConsumptionPer100km = (kwh: number, distance: number): number => {
  if (distance === 0 || isNaN(distance) || isNaN(kwh)) {
    return 0;
  }
  return (kwh * 100) / distance;
};

/**
 * Vérifie si une valeur est un nombre valide
 * @param value - Valeur à vérifier
 * @returns true si la valeur est un nombre valide
 */
export const isValidNumber = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};