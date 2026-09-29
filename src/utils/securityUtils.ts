// Security & PIN Management for SMK IT Ibnul Qayyim Calendar
const PIN_STORAGE_KEY = 'smk_it_admin_pin_v1';
const SESSION_UNLOCK_KEY = 'smk_it_admin_session_unlocked_v1';
export const DEFAULT_PIN = '1234';

/**
 * Gets the configured admin PIN/Password. Defaults to '1234'.
 */
export function getStoredPin(): string {
  try {
    const pin = localStorage.getItem(PIN_STORAGE_KEY);
    return pin ? pin : DEFAULT_PIN;
  } catch (e) {
    console.error('Failed to read PIN from storage', e);
    return DEFAULT_PIN;
  }
}

/**
 * Sets a new admin PIN/Password.
 */
export function setStoredPin(newPin: string): boolean {
  try {
    if (!newPin || newPin.trim().length < 4) {
      return false;
    }
    localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
    return true;
  } catch (e) {
    console.error('Failed to save PIN to storage', e);
    return false;
  }
}

/**
 * Verifies if the provided PIN matches the stored PIN.
 */
export function verifyPin(inputPin: string): boolean {
  const currentPin = getStoredPin();
  return inputPin.trim() === currentPin.trim();
}

/**
 * Checks if the current browser session is unlocked.
 */
export function isSessionUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_UNLOCK_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Sets the session unlock status.
 */
export function setSessionUnlocked(unlocked: boolean): void {
  try {
    if (unlocked) {
      sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true');
    } else {
      sessionStorage.removeItem(SESSION_UNLOCK_KEY);
    }
  } catch (e) {
    console.error('Failed to update session lock state', e);
  }
}
