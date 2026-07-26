// Self-contained auth client - works without Supabase.
// Stores a simple token in localStorage.

const TOKEN_KEY = 'lamix_staff_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export async function signIn(email: string, password: string) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'signIn', email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Sign-in failed');
  setToken(data.session.access_token);
  // Notify other components
  window.dispatchEvent(new CustomEvent('lamix-auth-change'));
  return data;
}

export async function signOut() {
  const token = getToken();
  if (token) {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signOut', token }),
      });
    } catch {}
  }
  setToken(null);
  window.dispatchEvent(new CustomEvent('lamix-auth-change'));
}

export async function checkStaff(): Promise<{ staff: boolean; email?: string; name?: string }> {
  const token = getToken();
  if (!token) return { staff: false };
  try {
    const res = await fetch('/api/staff-status', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return { staff: !!data.staff, email: data.email, name: data.name };
  } catch {
    return { staff: false };
  }
}

export async function getAuthHeader(): Promise<Record<string, string>> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}