import { MapPin, X } from "lucide-react";
import type { RecentSearchItem } from "../types/weather";
interface RecentSearchesProps { items: RecentSearchItem[]; onSelect: (id: string) => void; onRemove: (id: string) => void }
export function RecentSearches({ items, onSelect, onRemove }: RecentSearchesProps) {
  return (
    <section className="panel recent-panel" aria-labelledby="recent-title">
      <div className="section-title"><h3 id="recent-title">Recent places</h3><span>{items.length.toString().padStart(2, "0")}</span></div>
      {items.length === 0 ? <p className="empty-searches">Your next destination starts with a search. Recently viewed places will appear here.</p> : items.map((item) => (
        <div className="recent-row" key={item.id}>
          <button className="recent-place" onClick={() => onSelect(item.id)}><MapPin size={18} aria-hidden="true" /><span><strong>{item.name}</strong><small>{item.country}</small></span></button>
          <button className="icon-button" aria-label={`Remove ${item.name} from recent places`} onClick={() => onRemove(item.id)}><X size={16} aria-hidden="true" /></button>
        </div>
      ))}
    </section>
  );
}
