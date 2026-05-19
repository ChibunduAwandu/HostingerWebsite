import { Menu, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { sceneAnchors, type SectionId } from '../../data/scenes.config';

type NavBarProps = {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
  isCompact: boolean;
};

export const NavBar = ({ activeSection, onNavigate, isCompact }: NavBarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const items = useMemo(
    () =>
      sceneAnchors.map((scene) => ({
        id: scene.id,
        label: scene.navLabel
      })),
    []
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 md:px-8">
      <div className="pointer-events-auto w-full max-w-6xl rounded-[28px] border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-2xl md:px-6">
        <div className="flex items-center justify-between gap-4">
          <button
            className="font-heading text-left text-sm font-semibold uppercase tracking-[0.35em] text-white"
            onClick={() => onNavigate('lab')}
            type="button"
          >
            <span className="block">CA / Lab</span>
            <span className="mt-1 block text-[10px] font-medium tracking-[0.28em] text-slate-400">
              Systems · Vision · Markets
            </span>
          </button>

          <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
            {items.map((item) => {
              const active = item.id === activeSection;

              return (
                <button
                  aria-current={active ? 'page' : undefined}
                  key={item.id}
                  className={`nav-pill ${active ? 'nav-pill-active bg-cyan/15 text-cyan shadow-neon' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                  onClick={() => onNavigate(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {isCompact ? (
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white md:hidden"
              onClick={() => setMenuOpen((current) => !current)}
              type="button"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          ) : (
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-slate-400 md:block">
              Runtime: immersive
            </div>
          )}
        </div>

        {menuOpen ? (
          <div className="mt-4 grid gap-2 md:hidden">
            {items.map((item) => {
              const active = item.id === activeSection;

              return (
                <button
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-2xl px-4 py-3 text-left text-sm transition ${active ? 'bg-cyan/15 text-cyan' : 'bg-white/5 text-slate-300'}`}
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMenuOpen(false);
                  }}
                  type="button"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </header>
  );
};
