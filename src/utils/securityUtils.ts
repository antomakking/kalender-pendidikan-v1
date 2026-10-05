// Security & PIN Management for SMK IT Ibnul Qayyim Calendar
const PIN_STORAGE_KEY = 'smk_it_admin_pin_v2';
const SESSION_UNLOCK_KEY = 'smk_it_admin_session_unlocked_v1';
const SESSION_EXPIRY_KEY = 'smk_it_admin_session_expiry_v1';
const RECOVERY_EMAIL_KEY = 'smk_it_admin_recovery_email_v1';
const CUSTOM_QA_STORAGE_KEY = 'smk_it_admin_custom_qa_v1';
const RECOVERY_OTP_KEY = 'smk_it_admin_recovery_otp_v1';

export const DEFAULT_PIN = '6789';
export const SESSION_DURATION_MS = 15 * 60 * 1000; // 15 Minutes

// Master Administrative Emails
export const PREDEFINED_MASTER_EMAILS = [
  'antomakking@gmail.com',
  'admin@smkitibnulqayyim.sch.id',
  'kurikulum@smkitibnulqayyim.sch.id',
  'kepsek@smkitibnulqayyim.sch.id',
];

export interface SecurityQuestion {
  id: string;
  question: string;
  defaultKeywords: string[];
}

export const PREDEFINED_SECURITY_QUESTIONS: SecurityQuestion[] = [
  {
    id: 'q_location',
    question: 'Apa nama jalan / lokasi kampus SMK IT Ibnul Qayyim?',
    defaultKeywords: ['goa ria', 'taman bunga', 'laikang', 'biringkanaya', 'makassar'],
  },
  {
    id: 'q_major_rpl',
    question: 'Apa singkatan konsentrasi keahlian software/aplikasi di sekolah?',
    defaultKeywords: ['rpl', 'rekayasa perangkat lunak'],
  },
  {
    id: 'q_major_bd',
    question: 'Apa singkatan konsentrasi keahlian bisnis di sekolah?',
    defaultKeywords: ['bd', 'bisnis digital'],
  },
  {
    id: 'q_year',
    question: 'Tahun ajaran kalender akademik aktif saat ini?',
    defaultKeywords: ['2026', '2026/2027', '2027', '26/27'],
  },
];

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
 * Checks if the current browser session is unlocked and not expired.
 * Automatically locks if the 15-minute window has passed.
 */
export function isSessionUnlocked(): boolean {
  try {
    const isUnlocked = sessionStorage.getItem(SESSION_UNLOCK_KEY) === 'true';
    if (!isUnlocked) return false;

    const expiryStr = sessionStorage.getItem(SESSION_EXPIRY_KEY);
    if (!expiryStr) {
      setSessionUnlocked(false);
      return false;
    }

    const expiryTime = parseInt(expiryStr, 10);
    if (isNaN(expiryTime) || Date.now() > expiryTime) {
      setSessionUnlocked(false);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sets the session unlock status with 15-minute auto expiration.
 */
export function setSessionUnlocked(unlocked: boolean): void {
  try {
    if (unlocked) {
      const expiryTime = Date.now() + SESSION_DURATION_MS;
      sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true');
      sessionStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
    } else {
      sessionStorage.removeItem(SESSION_UNLOCK_KEY);
      sessionStorage.removeItem(SESSION_EXPIRY_KEY);
    }
  } catch (e) {
    console.error('Failed to update session lock state', e);
  }
}

/**
 * Gets remaining session time in seconds.
 */
export function getRemainingSessionSeconds(): number {
  try {
    const expiryStr = sessionStorage.getItem(SESSION_EXPIRY_KEY);
    if (!expiryStr) return 0;
    const expiryTime = parseInt(expiryStr, 10);
    if (isNaN(expiryTime)) return 0;
    const remainingMs = expiryTime - Date.now();
    return Math.max(0, Math.floor(remainingMs / 1000));
  } catch {
    return 0;
  }
}

/**
 * Formats seconds into MM:SS string
 */
export function formatRemainingTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Verifies if an email is authorized for master PIN recovery.
 */
export function isAuthorizedMasterEmail(email: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return false;

  if (PREDEFINED_MASTER_EMAILS.map((e) => e.toLowerCase()).includes(cleanEmail)) {
    return true;
  }

  // Check custom recovery email from localStorage
  try {
    const customEmail = localStorage.getItem(RECOVERY_EMAIL_KEY);
    if (customEmail && customEmail.toLowerCase() === cleanEmail) {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

/**
 * Generates an OTP Recovery Code for email verification
 */
export function generateEmailRecoveryOtp(email: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  try {
    sessionStorage.setItem(
      RECOVERY_OTP_KEY,
      JSON.stringify({ email: email.trim().toLowerCase(), otp, expiry })
    );
  } catch {
    // ignore
  }
  return otp;
}

/**
 * Verifies the Recovery OTP
 */
export function verifyRecoveryOtp(inputOtp: string, email: string): boolean {
  try {
    const raw = sessionStorage.getItem(RECOVERY_OTP_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiry) return false;
    if (parsed.email !== email.trim().toLowerCase()) return false;
    return parsed.otp === inputOtp.trim();
  } catch {
    return false;
  }
}

/**
 * Verifies answer for a security question
 */
export function verifySecurityAnswer(questionId: string, answer: string): boolean {
  const cleanAnswer = answer.trim().toLowerCase();
  if (!cleanAnswer) return false;

  // 1. Check custom answer in localStorage
  try {
    const rawCustom = localStorage.getItem(CUSTOM_QA_STORAGE_KEY);
    if (rawCustom) {
      const customMap = JSON.parse(rawCustom);
      if (customMap[questionId]) {
        return cleanAnswer === customMap[questionId].toLowerCase();
      }
    }
  } catch {
    // ignore
  }

  // 2. Check predefined keywords
  const qObj = PREDEFINED_SECURITY_QUESTIONS.find((q) => q.id === questionId);
  if (!qObj) return false;

  return qObj.defaultKeywords.some((keyword) => cleanAnswer.includes(keyword.toLowerCase()));
}

/**
 * Resets the PIN and unlocks the session
 */
export function resetPinAndUnlock(newPin: string): boolean {
  const success = setStoredPin(newPin);
  if (success) {
    setSessionUnlocked(true);
    try {
      sessionStorage.removeItem(RECOVERY_OTP_KEY);
    } catch {
      // ignore
    }
  }
  return success;
}


