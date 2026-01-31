// Simple authentication without sessions or cookies
// Uses sessionStorage - clears when browser/tab closes

const AUTH_KEY = 'party_zala_simple_auth';

export const simpleAuth = {
  // Check if user is logged in
  isLoggedIn(): boolean {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  },

  // Mark user as logged in
  setLoggedIn(): void {
    sessionStorage.setItem(AUTH_KEY, 'true');
  },

  // Mark user as logged out
  setLoggedOut(): void {
    sessionStorage.removeItem(AUTH_KEY);
  },

  // Clear all auth data
  clear(): void {
    sessionStorage.removeItem(AUTH_KEY);
  }
};
