import { useCallback, useEffect, useState } from 'react';

const DEFAULTS = {
  google_reviews_url: 'https://maps.google.com/?q=Lamix+Skin+Jagat+Farm+Greater+Noida',
  google_maps_url: 'https://maps.google.com/?q=Jagat+Farm+Greater+Noida',
  whatsapp_number: '919999999999',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  youtube_url: 'https://youtube.com',
  twitter_url: 'https://x.com',
  phone_number: '+91 99999 99999',
  email_address: 'hello@lamixskin.com',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/site-settings');
      const data = await res.json();
      if (res.ok) setSettings({ ...DEFAULTS, ...data });
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { settings, setSettings, loading, refresh };
}