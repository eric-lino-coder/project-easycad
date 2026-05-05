/**
 * Input masks and validators for Brazilian documents and phone numbers
 */

/**
 * Accepts only letters (A-Z) and accented characters
 */
export const maskApenasLetras = (value: string): string => {
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
};

/**
 * Accepts only numbers (0-9)
 */
export const maskApenasNumeros = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Formats value as Brazilian CPF: 000.000.000-00
 */
export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);
};

/**
 * Formats value as Brazilian CEP: 00000-000
 */
export const maskCEP = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

/**
 * Formats value as Brazilian cell phone number: (00) 00000-0000
 */
export const maskCelular = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    .substring(0, 15);
};

/**
 * Formats value as Brazilian landline phone number: (00) 0000-0000
 */
export const maskTelefoneFixo = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d{1,4})$/, "$1-$2")
    .substring(0, 14);
};

/**
 * Formats value as Brazilian phone number: (00) 00000-0000 or (00) 0000-0000
 */
export const maskTelefone = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2")
    .substring(0, 15);
};

/**
 * Validates Brazilian CPF number
 * @param cpf - CPF string with or without formatting
 * @returns true if CPF is valid, false otherwise
 */
export const validarCPF = (cpf: string): boolean => {
  const s = cpf.replace(/\D/g, "");

  // Check length and reject sequences of same digits
  if (s.length !== 11 || !!s.match(/(\d)\1{10}/)) {
    return false;
  }

  // Validate with check digits
  const calcCheckDigit = (t: number): number => {
    let n = 0;
    for (let i = 0; i < t; i++) {
      n += parseInt(s.charAt(i)) * (t + 1 - i);
    }
    n = (n * 10) % 11;
    return n === 10 ? 0 : n;
  };

  const digit1 = calcCheckDigit(9);
  const digit2 = calcCheckDigit(10);

  return parseInt(s.charAt(9)) === digit1 && parseInt(s.charAt(10)) === digit2;
};

/**
 * Validates Brazilian email address
 * @param email - Email string
 * @returns true if email is valid, false otherwise
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
