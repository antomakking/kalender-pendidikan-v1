import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck, ShieldAlert, X, Settings2, CheckCircle2 } from 'lucide-react';
import { DEFAULT_PIN, getStoredPin, setStoredPin, verifyPin } from '../utils/securityUtils.ts';

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
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);

  // Change PIN states
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');
  const [changeSuccessMsg, setChangeSuccessMsg] = useState<string | null>(null);

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
    setChangeSuccessMsg(null);

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
      setChangeSuccessMsg('PIN pengelola berhasil diperbarui!');
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmNewPinInput('');
      setTimeout(() => {
        setIsChangingPin(false);
        setChangeSuccessMsg(null);
      }, 1500);
    } else {
      setErrorMsg('Gagal menyimpan PIN baru. Silakan coba lagi.');
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-[#143c14]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Strip */}
        <div className="bg-[#143c14] text-white p-4 border-b-4 border-[#ffcc00] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ffcc00] text-[#143c14] flex items-center justify-center font-bold shadow-xs">
              <Lock className="w-4 h-4 text-[#143c14] stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-tight">
                {isChangingPin ? 'Pengaturan PIN Pengelola' : 'Otorisasi Pengelola'}
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
          {!isChangingPin ? (
            <div>
              <div className="text-center space-y-1 mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-[#143c14] mb-1">
                  <KeyRound className="w-6 h-6 text-[#143c14]" />
                </div>
                <h4 className="text-sm font-black text-slate-900">
                  {actionTitle}
                </h4>
                <p className="text-xs text-slate-500">
                  Fitur ini dibatasi khusus untuk pihak yang berkepentingan (Wakasek Kurikulum, Panitia, & Staf Akademik).
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

                {/* Numeric Keypad for Quick Mobile / Touch Entry */}
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

                {/* Default PIN reminder & Change PIN button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    PIN Default Awal: <strong className="text-slate-800 font-bold">{DEFAULT_PIN}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPin(true);
                      setErrorMsg(null);
                    }}
                    className="text-[#143c14] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Settings2 className="w-3 h-3" />
                    <span>Ubah PIN</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Change PIN Form */
            <form onSubmit={handleChangePinSubmit} className="space-y-3.5 text-xs">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#143c14]" />
                  <span>Ubah PIN Keamanan Pengelola</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Ganti PIN standar agar penambahan/pengeditan agenda hanya bisa dilakukan oleh petugas yang berwenang.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  PIN Lama Saat Ini
                </label>
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
                  PIN Baru (Minimal 4 digit/karakter)
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
                <label className="block font-bold text-slate-700 mb-1">
                  Ulangi PIN Baru
                </label>
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

              {changeSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{changeSuccessMsg}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(false);
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
        </div>
      </div>
    </div>
  );
};
