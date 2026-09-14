'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
export default function Modal({ title, onClose, children, small = false }: { title: string; onClose: () => void; children: React.ReactNode; small?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    function keys(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); close.current(); }
      if (e.key !== 'Tab') return;
      const controls = Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]') || []).filter(n => n.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first) { e.preventDefault(); return; }
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', keys);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keys); previous?.focus(); };
  }, []);
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`modal ${small ? 'small-modal' : ''}`}><div className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label="Đóng cửa sổ" onClick={onClose}><X/></button></div>{children}</section></div>;
}
