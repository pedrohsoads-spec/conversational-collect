/**
 * Aplica máscara de telefone brasileiro
 * Formato: (99) 99999-9999
 */
export const applyPhoneMask = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara progressivamente
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  
  // Limita a 11 dígitos
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * Remove a máscara e retorna apenas os números
 */
export const removePhoneMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Valida se o telefone tem o formato correto (11 dígitos)
 */
export const isValidPhone = (value: string): boolean => {
  const numbers = removePhoneMask(value);
  return numbers.length === 11;
};
