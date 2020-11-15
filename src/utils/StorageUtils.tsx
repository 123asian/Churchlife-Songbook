import { Plugins } from '@capacitor/core';

/**
 * Utilities for storing Simple Key-Value pair data locally.
 * On web this uses browser cache, on Android it uses SharedPreferences, on iOS it uses UserDefaults.
 */

const { Storage } = Plugins;

export const YES = 'yes';
export const NO = 'no';

/**
 * Stores an item with given key/value pair. The value can be any string, including JSON strings.
 * If an item with that key already existed, it will overwrite the value.
 */
export async function storeItem(key: string, value: string) {
  return Storage.set({
    key: key,
    value: value,
  }).catch((error) => {
    console.log(`Error storing item because ${error}.`);
  });
}

/**
 * Retrieves an item with the given key, or blank if not found.
 */
export async function getItem(key: string): Promise<string> {
  let value = (await Storage.get({ key: key })).value;
  if (value === null) {
    return '';
  }
  return value;
}

/**
 * Clears all values from the storage cache.
 */
export function clearCache(): void {
  console.log('Clearing Local Cache.');
  Storage.clear();
}
