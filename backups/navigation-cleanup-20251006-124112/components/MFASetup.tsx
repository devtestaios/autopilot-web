'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Smartphone, Key, CheckCircle, AlertTriangle, Eye, EyeOff, Copy, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/EnhancedAuthContext';

// ===============================================
// MFA SETUP COMPONENT
// ===============================================

interface MFASetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
  enforced?: boolean;
}

export default function MFASetup({ onComplete, onCancel, enforced = false }: MFASetupProps) {
  const { user, enableMFA, verifyMFA } = useAuth();
  const [step, setStep] = useState<'intro' | 'setup' | 'verify' | 'backup' | 'complete'>('intro');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Generate MFA setup data
  useEffect(() => {
    if (step === 'setup') {
      generateMFASetup();
    }
  }, [step]);

  const generateMFASetup = async () => {
    try {
      setLoading(true);
      setError('');

      // Generate TOTP secret
      const secret = generateTOTPSecret();
      const issuer = 'PulseBridge.ai';
      const accountName = user?.email || 'user@pulsebridge.ai';
      
      // Create TOTP URL for QR code
      const totpUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
      
      setSecretKey(secret);
      setQrCodeUrl(totpUrl);

      // Generate backup codes
      const codes = generateBackupCodes();
      setBackupCodes(codes);
    } catch (err) {
      setError('Failed to generate MFA setup. Please try again.');
      console.error('MFA setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateTOTPSecret = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateBackupCodes = (): string[] => {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substr(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const handleVerification = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Verify the TOTP code
      const isValid = await verifyMFACode(verificationCode, secretKey);
      
      if (!isValid) {
        setError('Invalid verification code. Please try again.');
        return;
      }

      // Enable MFA for the user
      await enableMFA(secretKey, backupCodes);
      setStep('complete');
    } catch (err) {
      setError('Failed to verify code. Please try again.');
      console.error('MFA verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyMFACode = async (code: string, secret: string): Promise<boolean> => {
    // In production, this would verify against the TOTP algorithm
    // For now, simulate verification (accept any 6-digit code)
    return code.length === 6 && /^\d{6}$/.test(code);
  };

  const copyToClipboard = async (text: string, type: 'secret' | 'backup') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'secret') {
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      } else {
        setCopiedBackup(true);
        setTimeout(() => setCopiedBackup(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleCancel = () => {
    if (onCancel && !enforced) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Two-Factor Authentication
            </h2>
          </div>
          {enforced && (
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
              MFA is required for your account security
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'intro' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Secure Your Account
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Two-factor authentication adds an extra layer of security to your account by requiring a code from your mobile device.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Enhanced Security</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Protect against unauthorized access</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Works Offline</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generate codes without internet connection</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Backup Codes</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Emergency access when device is unavailable</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('setup')}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Get Started
                </button>
                {!enforced && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'setup' && (
            <div>
              <div className="text-center mb-6">
                <Smartphone className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Scan QR Code
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator to scan this QR code.
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
              ) : (
                <>
                  {/* QR Code */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <QRCodeSVG 
                        value={qrCodeUrl} 
                        size={200}
                        level="M"
                        includeMargin={true}
                      />
                    </div>
                  </div>

                  {/* Manual Setup */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Can't scan? Enter this code manually:
                    </p>
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-3 py-2">
                      <code className="text-sm font-mono text-gray-900 dark:text-white">
                        {showSecretKey ? secretKey : '•'.repeat(32)}
                      </code>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowSecretKey(!showSecretKey)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(secretKey, 'secret')}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {copiedSecret && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Copied to clipboard!</p>
                    )}
                  </div>
                </>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('verify')}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  Continue
                </button>
                <button
                  onClick={() => setStep('intro')}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 'verify' && (
            <div>
              <div className="text-center mb-6">
                <Key className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Verify Setup
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter the 6-digit code from your authenticator app to verify the setup.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                    setError('');
                  }}
                  placeholder="000000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={6}
                />
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {error}
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleVerification}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
                <button
                  onClick={() => setStep('setup')}
                  disabled={loading}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  MFA Setup Complete!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your account is now protected with two-factor authentication.
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      Save Your Backup Codes
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                      Store these backup codes in a safe place. You can use them to access your account if you lose your device.
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded border p-3">
                      <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                        {backupCodes.map((code, index) => (
                          <div key={index} className="text-gray-900 dark:text-white">
                            {code}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => copyToClipboard(backupCodes.join('\n'), 'backup')}
                        className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy all codes
                      </button>
                      {copiedBackup && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">Copied to clipboard!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Complete Setup
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}