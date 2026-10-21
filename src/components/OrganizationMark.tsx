import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Organization } from '../data/organizations';
interface Props { organization: Organization; index: number; active: boolean; dimmed: boolean; select: () => void; hover: () => void; leave: () => void; }
export function OrganizationMark({ organization: org, index, active, dimmed, select, hover, leave }: Props) {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [org.logo]);
  return <div className={`organization organization-${org.id}`}>
    <div className="floating-mark" style={{ animationDelay: `${-index * 1.3}s`, animationDuration: `${6 + index * .7}s`, animationPlayState: active ? 'paused' : 'running', animationName: reduced ? 'none' : undefined }}>
      <motion.button className="organization-button" type="button" aria-label={`${org.name} 수행 사업`} aria-expanded={active} aria-controls={`projects-${org.id}`} onPointerEnter={event => { if (event.pointerType === 'mouse') hover(); }} onPointerLeave={event => { if (event.pointerType === 'mouse') leave(); }} onFocus={hover} onBlur={leave} onClick={select} animate={{ scale: active ? 1.25 : dimmed ? .85 : 1, opacity: dimmed ? .6 : 1 }} transition={{ duration: reduced ? 0 : .3 }}>
        {org.logo && !failed ? <img src={`${import.meta.env.BASE_URL}${org.logo}`} alt={org.name} onError={() => setFailed(true)} /> : <span className="text-mark"><span>{org.shortName}</span><span className="mark-english">{org.english}</span></span>}
      </motion.button>
    </div>
    <motion.div id={`projects-${org.id}`} className="organization-projects" aria-hidden={!active} initial={false} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8, visibility: active ? 'visible' : 'hidden' }} transition={{ duration: reduced ? 0 : .23 }}>
      {org.projects.map(project => <p key={project}>{project}</p>)}
    </motion.div>
  </div>;
}
