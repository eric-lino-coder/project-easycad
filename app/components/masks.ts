// Impede qualquer coisa que não seja letra (A-Z)
export const maskApenasLetras = (value: string) => {
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
};

// Impede qualquer coisa que não seja número (0-9)
export const maskApenasNumeros = (value: string) => {
  return value.replace(/\D/g, "");
};

export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após o terceiro dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após o sexto dígito
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // Coloca hífen antes dos últimos 2 dígitos
    .substring(0, 14); // Limita ao tamanho máximo do CPF formatado (000.000.000-00)
};

// Máscara de CEP: 00000-000
export const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1"); // Limita a 8 números
};

// Máscara de Telefone: (00) 00000-0000
// (11) 99999-5526 ou (11) 4444-4444
export const maskTelefone = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2") // Adiciona parênteses no DDD
    .replace(/(\d)(\d{4})$/, "$1-$2") // Adiciona hífen antes dos últimos 4 dígitos
    .substring(0, 15);
};

// Validação de CPF. Retorna true se for válido, false caso contrário.
export const validarCPF = (cpf: string): boolean => {
  const s = cpf.replace(/\D/g, "");
  if (s.length !== 11 || !!s.match(/(\d)\1{10}/)) return false;

  const calc = (t: number) => {
    let n = 0;
    for (let i = 0; i < t; i++) {
      n += parseInt(s.charAt(i)) * (t + 1 - i);
    }
    n = (n * 10) % 11;
    return n === 10 ? 0 : n;
  };

  const digito1 = calc(9);
  const digito2 = calc(10);

  return (
    digito1 === parseInt(s.charAt(9)) && digito2 === parseInt(s.charAt(10))
  );
};

// masks.ts

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
