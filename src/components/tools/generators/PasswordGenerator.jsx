import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy, FiRefreshCw, FiEye, FiEyeOff } = FiIcons;

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [showPassword, setShowPassword] = useState(true);
  const [strength, setStrength] = useState(0);

  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const similarChars = 'il1Lo0O';
  const ambiguousChars = '{}[]()/\\\'"`~,;.<>';

  const calculateStrength = (pwd) => {
    let score = 0;
    
    // Length bonus
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    
    // Character variety
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
    
    // Patterns (negative points)
    if (/(.)\1{2,}/.test(pwd)) score -= 1; // Repeated characters
    if (/123|abc|qwe/i.test(pwd)) score -= 1; // Common sequences
    
    return Math.max(0, Math.min(5, score));
  };

  const generatePassword = () => {
    let charset = '';
    
    if (options.uppercase) charset += charSets.uppercase;
    if (options.lowercase) charset += charSets.lowercase;
    if (options.numbers) charset += charSets.numbers;
    if (options.symbols) charset += charSets.symbols;
    
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !ambiguousChars.includes(char)).join('');
    }
    
    if (!charset) {
      setPassword('Please select at least one character type');
      setStrength(0);
      return;
    }
    
    let result = '';
    
    // Ensure at least one character from each selected type
    if (options.uppercase) result += charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)];
    if (options.lowercase) result += charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)];
    if (options.numbers) result += charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)];
    if (options.symbols) result += charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)];
    
    // Fill the rest randomly
    for (let i = result.length; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    result = result.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(result);
    setStrength(calculateStrength(result));
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0: 
      case 1: 
        return 'bg-red-500';
      case 2: 
        return 'bg-orange-500';
      case 3: 
        return 'bg-yellow-500';
      case 4: 
        return 'bg-blue-500';
      case 5: 
        return 'bg-green-500';
      default: 
        return 'bg-gray-500';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 0: 
      case 1: 
        return 'Very Weak';
      case 2: 
        return 'Weak';
      case 3: 
        return 'Fair';
      case 4: 
        return 'Strong';
      case 5: 
        return 'Very Strong';
      default: 
        return 'Unknown';
    }
  };

  React.useEffect(() => {
    generatePassword();
  }, [length, options]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Password Generator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="form-label">Password Length: {length}</label>
            <input
              type="range"
              min="4"
              max="128"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Character Types</h4>
            
            {[
              { key: 'uppercase', label: 'Uppercase (A-Z)' },
              { key: 'lowercase', label: 'Lowercase (a-z)' },
              { key: 'numbers', label: 'Numbers (0-9)' },
              { key: 'symbols', label: 'Symbols (!@#$...)' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={(e) => setOptions({...options, [key]: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Options</h4>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => setOptions({...options, excludeSimilar: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm">Exclude similar characters (i, l, 1, L, o, 0, O)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => setOptions({...options, excludeAmbiguous: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm">Exclude ambiguous characters</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Generated Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input font-mono pr-20"
                value={password}
                readOnly
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(password)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={!password}
                >
                  <SafeIcon icon={FiCopy} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {password && (
            <div>
              <label className="form-label">Password Strength</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getStrengthText()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Score: {strength}/5
                </div>
              </div>
            </div>
          )}

          <button onClick={generatePassword} className="btn-primary w-full flex items-center justify-center">
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Generate New Password
          </button>

          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div>Character count: {password.length}</div>
            <div>
              Entropy: ~{Math.log2(Math.pow(
                (options.uppercase ? 26 : 0) + 
                (options.lowercase ? 26 : 0) + 
                (options.numbers ? 10 : 0) + 
                (options.symbols ? 32 : 0), 
                length
              )).toFixed(1)} bits
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Password Security Tips:</h4>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Use at least 12 characters for better security</li>
          <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
          <li>• Avoid common words, names, or predictable patterns</li>
          <li>• Use a unique password for each account</li>
          <li>• Consider using a password manager</li>
          <li>• Enable two-factor authentication when available</li>
        </ul>
      </div>
    </div>
  );
}

export default PasswordGenerator;