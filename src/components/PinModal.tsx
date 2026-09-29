import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  Send,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  DEFAULT_PIN,
  PREDEFINED_MASTER_EMAILS,
  PREDEFINED_SECURITY_QUESTIONS,
  generateEmailRecoveryOtp,
  getStoredPin,
  isAuthorizedMasterEmail,
  resetPinAndUnlock,
  setStoredPin,
  verifyPin,
  verifyRecoveryOtp,
  verifySecurityAnswer,
} from '../utils/securityUtils.ts';

type ModalMode = 'verify' | 'change' | 'forgot' | 'reset_new_pin';
type RecoveryTab = 'email' | 'question';

interface PinModalProps {
  isOpen: boolean;
  actionTitle?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  actionTitle = 'Tambah / Kelola Agenda',
  onSuccess,
  onClose,
}) => {
  const [mode, setMode] = useState<ModalMode>('verify');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Change PIN states
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');

  // Forgot PIN states
  const [recoveryTab, setRecoveryTab] = useState<RecoveryTab>('email');
  const [emailInput, setEmailInput] = useState('antomakking@gmail.com');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtpCode, setGeneratedOtpCode] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');

  // Security Question states
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    PREDEFINED_SECURITY_QUESTIONS[0].id
  );
  const [securityAnswerInput, setSecurityAnswerInput] = useState('');

  // Reset New PIN states after recovery
  const [resetNewPin, setResetNewPin] = useState('');
  const [resetConfirmPin, setResetConfirmPin] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setErrorMsg('Silakan masukkan PIN atau password pengelola.');
      return;
    }

    if (verifyPin(pin)) {
      setErrorMsg(null);
      setPin('');
      onSuccess();
    } else {
      setErrorMsg('PIN atau password salah! Akses ditolak.');
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!verifyPin(currentPinInput)) {
      setErrorMsg('PIN lama yang Anda masukkan tidak sesuai.');
      return;
    }

    if (!newPinInput || newPinInput.length < 4) {
      setErrorMsg('PIN baru minimal harus 4 karakter/digit.');
      return;
    }

    if (newPinInput !== confirmNewPinInput) {
      setErrorMsg('Konfirmasi PIN baru tidak cocok.');
      return;
    }

    const saved = setStoredPin(newPinInput);
    if (saved) {
      setSuccessMsg('PIN pengelola berhasil diperbarui!');
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmNewPinInput('');
      setTimeout(() => {
        setMode('verify');
        setSuccessMsg(null);
      }, 1500);
    } else {
      setErrorMsg('Gagal menyimpan PIN baru. Silakan coba lagi.');
    }
  };

  // Send Recovery Email OTP
  const handleSendRecoveryEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isAuthorizedMasterEmail(emailInput)) {
      setErrorMsg(
        'Email tidak terdaftar sebagai Email Administratif Master yang berwenang (contoh: antomakking@gmail.com atau @smkitibnulqayyim.sch.id).'
      );
      return;
    }

    const code = generateEmailRecoveryOtp(emailInput);
    setGeneratedOtpCode(code);
    setOtpSent(true);
    setSuccessMsg(`Kode pemulihan telah diterbitkan untuk ${emailInput}.`);
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (verifyRecoveryOtp(otpInput, emailInput)) {
      setSuccessMsg('Verifikasi Email Master Berhasil!');
      setTimeout(() => {
        setMode('reset_new_pin');
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 800);
    } else {
      setErrorMsg('Kode pemulihan OTP salah atau sudah kedaluwarsa.');
    }
  };

  // Verify Security Question
  const handleVerifySecurityQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!securityAnswerInput.trim()) {
      setErrorMsg('Silakan masukkan jawaban pertanyaan keamanan.');
      return;
    }

    if (verifySecurityAnswer(selectedQuestionId, securityAnswerInput)) {
      setSuccessMsg('Verifikasi Pertanyaan Keamanan Berhasil!');
      setTimeout(() => {
        setMode('reset_new_pin');
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 800);
    } else {
      setErrorMsg('Jawaban tidak sesuai. Silakan periksa kembali atau pilih pertanyaan lain.');
    }
  };

  // Submit Final New PIN after Recovery
  const handleFinalResetPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!resetNewPin || resetNewPin.length < 4) {
      setErrorMsg('PIN baru minimal 4 digit / karakter.');
      return;
    }

    if (resetNewPin !== resetConfirmPin) {
      setErrorMsg('Konfirmasi PIN baru tidak sesuai.');
      return;
    }

    const saved = resetPinAndUnlock(resetNewPin);
    if (saved) {
      setSuccessMsg('PIN baru berhasil disimpan dan sesi 15 menit telah aktif!');
      setTimeout(() => {
        setMode('verify');
        setResetNewPin('');
        setResetConfirmPin('');
        onSuccess();
      }, 1000);
    } else {
      setErrorMsg('Gagal menyetel PIN baru.');
    }
  };

  const handleNumberClick = (num: string) => {
    if (pin.length < 12) {
      setPin((prev) => prev + num);
      setErrorMsg(null);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-modal-backdrop">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-[#143c14]/20 overflow-hidden animate-modal-slide-in">
        {/* Header Strip */}
        <div className="bg-[#143c14] text-white p-4 border-b-4 border-[#ffcc00] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ffcc00] text-[#143c14] flex items-center justify-center font-bold shadow-xs">
              {mode === 'forgot' ? (
                <HelpCircle className="w-5 h-5 text-[#143c14] stroke-[2.5]" />
              ) : mode === 'reset_new_pin' ? (
                <Sparkles className="w-5 h-5 text-[#143c14] stroke-[2.5]" />
              ) : (
                <Lock className="w-4 h-4 text-[#143c14] stroke-[2.5]" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-tight">
                {mode === 'verify' && 'Otorisasi Pengelola'}
                {mode === 'change' && 'Pengaturan PIN Pengelola'}
                {mode === 'forgot' && 'Pemulihan PIN (Forgot PIN)'}
                {mode === 'reset_new_pin' && 'Setel Ulang PIN Baru'}
              </h3>
              <span className="text-[11px] text-emerald-200 block">
                SMK IT Ibnul Qayyim Makassar
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* MODE 1: STANDARD VERIFICATION */}
          {mode === 'verify' && (
            <div>
              <div className="text-center space-y-1 mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-[#143c14] mb-1">
                  <KeyRound className="w-6 h-6 text-[#143c14]" />
                </div>
                <h4 className="text-sm font-black text-slate-900">{actionTitle}</h4>
                <p className="text-xs text-slate-500">
                  Fitur ini dibatasi khusus pihak berwenang. Sesi aktif selama{' '}
                  <strong>15 menit</strong> setelah verifikasi.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Masukkan PIN / Password Pengelola
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoFocus
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder="Masukkan 4 digit PIN..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-900 font-bold tracking-widest text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#143c14]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title={showPassword ? 'Sembunyikan' : 'Lihat'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleNumberClick(num)}
                      className="py-2.5 text-sm font-bold bg-slate-100 hover:bg-slate-200 active:bg-emerald-100 rounded-lg text-slate-800 transition-colors cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPin('')}
                    className="py-2.5 text-xs font-semibold bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-500 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNumberClick('0')}
                    className="py-2.5 text-sm font-bold bg-slate-100 hover:bg-slate-200 active:bg-emerald-100 rounded-lg text-slate-800 transition-colors cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleBackspace}
                    className="py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                  >
                    ⌫
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#143c14] hover:bg-[#0f2c0f] text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#ffcc00]" />
                    <span>Verifikasi & Lanjutkan</span>
                  </button>
                </div>

                {/* Footer options: Default reminder, Change PIN, and Forgot PIN */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>
                      PIN Default: <strong className="text-slate-800 font-bold">{DEFAULT_PIN}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('change');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[#143c14] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Settings2 className="w-3 h-3" />
                      <span>Ubah PIN</span>
                    </button>
                  </div>

                  {/* Forgot PIN Action Link */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                        setOtpSent(false);
                      }}
                      className="text-slate-500 hover:text-[#143c14] font-semibold underline cursor-pointer inline-flex items-center gap-1 text-[11px]"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Lupa PIN? Pulihkan via Email Master / Pertanyaan Keamanan</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* MODE 2: CHANGE PIN WITH CURRENT PIN */}
          {mode === 'change' && (
            <form onSubmit={handleChangePinSubmit} className="space-y-3.5 text-xs">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#143c14]" />
                  <span>Ubah PIN Keamanan Pengelola</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Ganti PIN standar agar pengelolaan agenda hanya dapat dilakukan petugas berwenang.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PIN Lama Saat Ini</label>
                <input
                  type="password"
                  required
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="Masukkan PIN lama (default: 1234)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#143c14]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  PIN Baru (Minimal 4 karakter/digit)
                </label>
                <input
                  type="password"
                  required
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Buat PIN baru..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#143c14]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ulangi PIN Baru</label>
                <input
                  type="password"
                  required
                  value={confirmNewPinInput}
                  onChange={(e) => setConfirmNewPinInput(e.target.value)}
                  placeholder="Ketik ulang PIN baru..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#143c14]"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('verify');
                    setErrorMsg(null);
                  }}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#143c14] hover:bg-[#0f2c0f] text-white font-extrabold rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Simpan PIN Baru
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: FORGOT PIN RECOVERY CENTER */}
          {mode === 'forgot' && (
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('verify');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali ke Login PIN</span>
                </button>
              </div>

              {/* Recovery Method Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryTab('email');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    recoveryTab === 'email'
                      ? 'bg-white text-[#143c14] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Master</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryTab('question');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    recoveryTab === 'question'
                      ? 'bg-white text-[#143c14] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Pertanyaan Keamanan</span>
                </button>
              </div>

              {/* TAB A: Master Email Recovery */}
              {recoveryTab === 'email' && (
                <div className="space-y-3">
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Masukkan email administratif master pengelola (misal: <strong>antomakking@gmail.com</strong> atau email resmi sekolah) untuk menerima kode verifikasi pemulihan.
                  </p>

                  {!otpSent ? (
                    <form onSubmit={handleSendRecoveryEmail} className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Email Administratif Master
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="nama@email.com"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#143c14]"
                          />
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#143c14] hover:bg-[#0f2c0f] text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-[#ffcc00]" />
                        <span>Kirim Kode Verifikasi OTP</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-3 animate-in fade-in duration-150">
                      {/* Simulated In-App Master Notification Box */}
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-amber-700" />
                            <span>Kode Pemulihan Email Master</span>
                          </span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono">
                            10 Menit
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          Kode OTP terkirim ke <strong>{emailInput}</strong>:
                        </p>
                        <div className="text-center py-1.5 bg-white border border-amber-300 rounded-lg font-mono font-black text-lg text-slate-900 tracking-widest shadow-2xs">
                          {generatedOtpCode}
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpInput(generatedOtpCode || '')}
                          className="text-[10px] text-[#143c14] font-bold underline hover:text-[#0f2c0f] block w-full text-center cursor-pointer"
                        >
                          Klik untuk Tempel Otomatis ({generatedOtpCode})
                        </button>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Masukkan 6 Digit Kode OTP
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder="6 Digit OTP..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-slate-900 tracking-widest text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#143c14]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                        >
                          Ganti Email
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-[#143c14] hover:bg-[#0f2c0f] text-white font-extrabold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#ffcc00]" />
                          <span>Verifikasi & Setel Ulang PIN</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB B: Security Question Recovery */}
              {recoveryTab === 'question' && (
                <form onSubmit={handleVerifySecurityQuestion} className="space-y-3">
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Jawab pertanyaan keamanan resmi terkait institusi sekolah SMK IT Ibnul Qayyim Makassar untuk memulihkan akses.
                  </p>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Pilih Pertanyaan Keamanan
                    </label>
                    <select
                      value={selectedQuestionId}
                      onChange={(e) => setSelectedQuestionId(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#143c14]"
                    >
                      {PREDEFINED_SECURITY_QUESTIONS.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.question}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Jawaban Anda
                    </label>
                    <input
                      type="text"
                      required
                      value={securityAnswerInput}
                      onChange={(e) => setSecurityAnswerInput(e.target.value)}
                      placeholder="Ketik jawaban..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#143c14]"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Petunjuk: Jawaban tidak peka huruf besar/kecil (contoh: Taman Bunga, RPL, atau 2026).
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#143c14] hover:bg-[#0f2c0f] text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ffcc00]" />
                    <span>Verifikasi Jawaban & Setel PIN</span>
                  </button>
                </form>
              )}

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* MODE 4: RESET NEW PIN AFTER SUCCESSFUL RECOVERY */}
          {mode === 'reset_new_pin' && (
            <form onSubmit={handleFinalResetPinSubmit} className="space-y-3.5 text-xs animate-in fade-in duration-150">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Otorisasi Identitas Terkonfirmasi</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Silakan buat PIN / Password baru untuk pengelola kalender akademik.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  PIN Baru (Minimal 4 Karakter / Digit)
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={resetNewPin}
                  onChange={(e) => setResetNewPin(e.target.value)}
                  placeholder="Buat PIN baru..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#143c14]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Konfirmasi PIN Baru
                </label>
                <input
                  type="password"
                  required
                  value={resetConfirmPin}
                  onChange={(e) => setResetConfirmPin(e.target.value)}
                  placeholder="Ulangi PIN baru..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#143c14]"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#143c14] hover:bg-[#0f2c0f] text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#ffcc00]" />
                <span>Simpan PIN Baru & Masuk Sesi (15 Menit)</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
