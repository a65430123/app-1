import { NavLink } from 'react-router-dom';
import { House, LayoutGrid, Search, Calculator, User } from 'lucide-react';

const items = [
  { to: '/', label: '首頁', icon: House, end: true },
  { to: '/trades', label: '工種', icon: LayoutGrid },
  { to: '/search', label: '搜尋', icon: Search },
  { to: '/tools', label: '計算機', icon: Calculator },
  { to: '/me', label: '我的', icon: User },
];

export function BottomNav() {
  return (
    <nav aria-label="主選單" className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface">
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-[68px] flex-col items-center justify-center gap-0.5 text-sm font-bold ${
                  isActive ? 'text-primary-ink' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-8 w-14 items-center justify-center rounded-full ${isActive ? 'bg-primary/15' : ''}`}>
                    <Icon className="size-7" strokeWidth={isActive ? 2.5 : 2} aria-hidden />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
