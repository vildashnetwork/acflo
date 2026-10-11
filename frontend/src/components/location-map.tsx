import { useEffect, useState } from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { communityLocation } from '../lib/content';

export function LocationMap() {
  const [allowed, setAllowed] = useState(false);
  const key = import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY'];
  useEffect(() => {
    setAllowed(/\.(lovable\.app|lovableproject\.com)$/.test(window.location.hostname));
  }, []);
  const query = encodeURIComponent(communityLocation.mapQuery);
  return <div className="mt-9">
    <h3 className="font-display text-lg font-bold">{communityLocation.name}</h3>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{communityLocation.area}</p>
    <div className="mt-4 h-72 overflow-hidden rounded-md border border-border bg-secondary">
      {key && allowed ? <iframe title="ZOZAC Community location on Google Maps" src={`https://www.google.com/maps/embed/v1/place?key=${key}&q=${query}`} className="h-full w-full border-0" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <div className="grid h-full place-content-center justify-items-center gap-3 px-5 text-center"><MapPin size={32} className="text-primary" /><strong>{communityLocation.name}</strong><span className="text-sm text-muted-foreground">{communityLocation.area}</span></div>}
    </div>
    <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open in Google Maps <ArrowUpRight size={16} /></a>
  </div>;
}