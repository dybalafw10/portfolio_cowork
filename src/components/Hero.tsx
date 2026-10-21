import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { organizations } from '../data/organizations';
import { OrganizationMark } from './OrganizationMark';
export function Hero() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hovered ?? selected;
  const reduced = useReducedMotion();
  return <section id="home" className="hero" aria-label="COWORK 포트폴리오" onKeyDown={event => { if (event.key === 'Escape') { setHovered(null); setSelected(null); } }}>
    <motion.div className="brand" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [.22, 1, .36, 1] }}>
      <h1><span>CO</span>WORK.</h1>
      <div className="brand-definitions"><div><p><span>C</span><i>—</i> Creativity</p><small>새로운 가치를 기획하는 창의성</small></div><div><p><span>O</span><i>—</i> Organizational Expertise</p><small>조직과 사람을 이해하는 전문성</small></div></div>
    </motion.div>
    <div className="organization-field" aria-label="함께한 기관과 수행 사업">{organizations.map((org, index) => <OrganizationMark key={org.id} organization={org} index={index} active={active === org.id} dimmed={active !== null && active !== org.id} hover={() => setHovered(org.id)} leave={() => setHovered(current => current === org.id ? null : current)} select={() => { setHovered(null); setSelected(current => current === org.id ? null : org.id); }} />)}</div>
    <div className="hero-bottom"><span>CREATIVITY. EXPERTISE. EXECUTION.</span><a href="#about" aria-label="자기소개로 스크롤">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a><span>HRD & HRM PORTFOLIO</span></div>
  </section>;
}
