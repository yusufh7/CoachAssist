export function passwordCriteria(password: string) {
  return { length: password.length >= 8, uppercase: /[A-Z]/.test(password), lowercase: /[a-z]/.test(password), number: /\d/.test(password), special: /[^A-Za-z0-9\s]/.test(password) };
}
export function validPassword(password: string, confirmation: string) {
  return password === confirmation && Object.values(passwordCriteria(password)).every(Boolean);
}