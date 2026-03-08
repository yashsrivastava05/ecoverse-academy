import { motion, AnimatePresence } from 'framer-motion';
import { getEcosystemStage } from '@/lib/types';

interface EcosystemViewerProps {
  ecoPoints: number;
  className?: string;
  darkWrapper?: boolean;
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} className="animate-float" style={{ animationDuration: '8s' }}>
      <ellipse cx="0" cy="0" rx="30" ry="12" fill="white" opacity="0.7" />
      <ellipse cx="15" cy="-5" rx="20" ry="10" fill="white" opacity="0.6" />
      <ellipse cx="-10" cy="-3" rx="18" ry="9" fill="white" opacity="0.65" />
    </g>
  );
}

function Tree({ x, y, scale = 1, variant = 0 }: { x: number; y: number; scale?: number; variant?: number }) {
  const swayDelay = variant * 0.5;
  const greens = ['#2D6A4F', '#40916C', '#52B788', '#74C69D'];
  const fill = greens[variant % greens.length];
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} className="animate-sway" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${swayDelay}s` }}>
      <rect x="-4" y="-5" width="8" height="22" rx="3" fill="#8B6914" />
      <ellipse cx="0" cy="-22" rx="18" ry="22" fill={fill} stroke="#1B4332" strokeWidth="1.5" />
      <ellipse cx="-6" cy="-18" rx="8" ry="10" fill="#52B788" opacity="0.5" />
    </g>
  );
}

function DeadTree({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-3" y="-5" width="6" height="25" rx="2" fill="#8B6914" opacity="0.6" />
      <line x1="0" y1="-5" x2="-12" y2="-18" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <line x1="0" y1="-10" x2="10" y2="-22" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

function River({ width, clarity }: { width: number; clarity: number }) {
  const opacity = 0.4 + (clarity / 100) * 0.4;
  return (
    <g>
      <path
        d={`M0,380 Q${width * 0.2},360 ${width * 0.4},375 Q${width * 0.6},390 ${width * 0.8},370 Q${width},350 ${width + 50},380 L${width + 50},400 L0,400 Z`}
        fill="#48CAE4"
        opacity={opacity}
      />
      <path
        d={`M0,382 Q${width * 0.3},365 ${width * 0.5},378`}
        stroke="white" strokeWidth="1.5" fill="none" opacity={0.3}
        className="animate-flow"
      />
    </g>
  );
}

function Bird({ startX, startY }: { startX: number; startY: number }) {
  return (
    <motion.g
      initial={{ x: startX, y: startY }}
      animate={{ x: startX + 300, y: startY - 30 }}
      transition={{ duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
    >
      <path d="M-6,0 Q0,-6 6,0" stroke="#1B4332" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
    </motion.g>
  );
}

function Flowers({ count }: { count: number }) {
  const flowers = Array.from({ length: count }, (_, i) => ({
    x: 80 + i * 120 + Math.random() * 60,
    y: 368 + Math.random() * 12,
    color: ['#E76F51', '#F4A261', '#B197FC', '#48CAE4'][i % 4],
  }));
  return (
    <g>
      {flowers.map((f, i) => (
        <g key={i} className="animate-float" style={{ animationDelay: `${i * 0.8}s`, animationDuration: '4s' }}>
          <circle cx={f.x} cy={f.y} r={5} fill={f.color} opacity={0.85} />
          <circle cx={f.x} cy={f.y} r={2.5} fill="#FDF8F0" opacity={0.7} />
          <rect x={f.x - 1} y={f.y} width={2} height={10} rx={1} fill="#40916C" />
        </g>
      ))}
    </g>
  );
}

function AnimalSilhouette({ type, x, y }: { type: 'deer' | 'rabbit' | 'fox'; x: number; y: number }) {
  return (
    <motion.g
      initial={{ x }}
      animate={{ x: x + 30 }}
      transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
    >
      <text x={0} y={y} fontSize="18" opacity="0.7">
        {type === 'deer' ? '🦌' : type === 'rabbit' ? '🐇' : '🦊'}
      </text>
    </motion.g>
  );
}

export default function EcosystemViewer({ ecoPoints, className = '', darkWrapper = false }: EcosystemViewerProps) {
  const stage = getEcosystemStage(ecoPoints);

  const skyColors: Record<number, [string, string]> = {
    0: ['#D4A574', '#C4956A'],
    1: ['#B8D4E3', '#D4E8F0'],
    2: ['#87CEEB', '#B0E0F0'],
    3: ['#7EC8E3', '#A0D8EF'],
    4: ['#6BBFE0', '#8ED0E8'],
    5: ['#5AB0D5', '#7CC5E0'],
    6: ['#4AA0C8', '#6BB8D8'],
  };
  const sky = skyColors[stage];

  const wrapperClass = darkWrapper
    ? `rounded-3xl bg-bg-dark-panel p-3 ${className}`
    : `${className}`;

  return (
    <div className={wrapperClass}>
      <div className="relative overflow-hidden rounded-2xl">
        <svg viewBox="0 0 800 450" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sky[0]} />
              <stop offset="100%" stopColor={sky[1]} />
            </linearGradient>
            <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stage === 0 ? '#A0845C' : '#52B788'} />
              <stop offset="100%" stopColor={stage === 0 ? '#8B6914' : '#2D6A4F'} />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="800" height="450" fill="url(#skyGrad)" />

          {/* Sun */}
          {stage > 0 && (
            <g>
              <circle cx="650" cy="80" r="35" fill="#F4A261" opacity="0.9" />
              <circle cx="650" cy="80" r="50" fill="#F4A261" opacity="0.15">
                <animate attributeName="r" values="50;60;50" dur="4s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Clouds */}
          {stage >= 2 && <><Cloud x={150} y={60} /><Cloud x={500} y={90} scale={0.8} /></>}
          {stage >= 3 && <Cloud x={350} y={45} scale={1.2} />}

          {/* Mountains */}
          {stage >= 3 && (
            <g opacity="0.25">
              <polygon points="0,300 100,180 200,280 300,200 400,300" fill="#2D6A4F" />
              <polygon points="400,300 500,200 600,260 700,190 800,300" fill="#40916C" />
            </g>
          )}

          {/* Birds */}
          {stage >= 2 && <Bird startX={-20} startY={100} />}
          {stage >= 3 && <Bird startX={-50} startY={130} />}

          {/* Ground */}
          <rect x="0" y="370" width="800" height="80" rx="0" fill="url(#groundGrad)" />
          {/* Grass tufts */}
          {stage >= 1 && Array.from({ length: 12 }).map((_, i) => (
            <ellipse key={i} cx={60 + i * 65} cy={370} rx={20} ry={4} fill="#74C69D" opacity={0.4} />
          ))}

          {/* Cracked earth for stage 0 */}
          {stage === 0 && (
            <g opacity="0.4">
              <line x1="100" y1="380" x2="130" y2="400" stroke="#C4956A" strokeWidth="1.5" />
              <line x1="300" y1="375" x2="340" y2="395" stroke="#C4956A" strokeWidth="1.5" />
              <line x1="500" y1="385" x2="520" y2="400" stroke="#C4956A" strokeWidth="1.5" />
              <line x1="650" y1="378" x2="680" y2="398" stroke="#C4956A" strokeWidth="1.5" />
            </g>
          )}

          {/* Dead tree for stage 0 */}
          {stage === 0 && <DeadTree x={400} y={370} />}

          {/* Seedling for stage 1 */}
          {stage === 1 && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 1 }}
              style={{ transformOrigin: '400px 370px' }}
            >
              <rect x="398" y="352" width="4" height="18" rx="2" fill="#40916C" />
              <ellipse cx="394" cy="349" rx="7" ry="5" fill="#52B788" stroke="#2D6A4F" strokeWidth="1" />
              <ellipse cx="406" cy="351" rx="6" ry="4" fill="#74C69D" stroke="#2D6A4F" strokeWidth="1" />
              <ellipse cx="400" cy="345" rx="5" ry="4" fill="#95D5B2" stroke="#2D6A4F" strokeWidth="1" />
            </motion.g>
          )}

          {/* Trees for stage 2+ */}
          <AnimatePresence>
            {stage >= 2 && <Tree x={400} y={370} scale={0.8 + (stage - 2) * 0.15} variant={0} />}
            {stage >= 3 && <><Tree x={300} y={372} scale={0.7 + (stage - 3) * 0.1} variant={1} /><Tree x={500} y={368} scale={0.9} variant={2} /></>}
            {stage >= 4 && <><Tree x={200} y={374} scale={0.7} variant={3} /><Tree x={600} y={370} scale={0.85} variant={0} /><Tree x={150} y={372} scale={0.6} variant={1} /><Tree x={650} y={374} scale={0.65} variant={2} /></>}
            {stage >= 5 && <><Tree x={100} y={370} scale={0.75} variant={3} /><Tree x={250} y={368} scale={0.9} variant={0} /><Tree x={550} y={372} scale={0.8} variant={1} /><Tree x={700} y={370} scale={0.7} variant={2} /></>}
          </AnimatePresence>

          {/* Golden tree of life for stage 6 */}
          {stage >= 6 && (
            <g>
              <rect x="395" y="328" width="10" height="42" rx="4" fill="#F4A261" />
              <ellipse cx="400" cy="306" rx="32" ry="38" fill="#F4A261" opacity="0.7" stroke="#E76F51" strokeWidth="1.5" />
              <circle cx="400" cy="306" r="45" fill="#F4A261" opacity="0.1">
                <animate attributeName="r" values="45;55;45" dur="4s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Rainbow for stage 5+ */}
          {stage >= 5 && (
            <path d="M100,350 Q400,100 700,350" stroke="#E76F51" strokeWidth="3" fill="none" opacity="0.15" />
          )}

          {/* River */}
          {stage >= 2 && <River width={800} clarity={Math.min(100, (stage - 2) * 25)} />}

          {/* Flowers */}
          {stage >= 2 && <Flowers count={Math.min(6, stage)} />}

          {/* Animals */}
          {stage >= 3 && <AnimalSilhouette type="deer" x={120} y={363} />}
          {stage >= 4 && <AnimalSilhouette type="rabbit" x={620} y={366} />}
          {stage >= 5 && <AnimalSilhouette type="fox" x={350} y={364} />}

          {/* Butterflies */}
          {stage >= 1 && (
            <motion.g
              animate={{ x: [0, 50, 20, 80, 0], y: [0, -20, -10, -30, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
              <text x="450" y="340" fontSize="14" opacity="0.8">🦋</text>
            </motion.g>
          )}
          {stage >= 4 && (
            <motion.g
              animate={{ x: [0, -40, -20, -60, 0], y: [0, -15, -25, -10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              <text x="250" y="348" fontSize="12" opacity="0.7">🦋</text>
            </motion.g>
          )}

          {/* Leaves drifting */}
          {stage >= 3 && (
            <motion.g
              animate={{ y: [0, 200], x: [0, 30], opacity: [0.7, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 2 }}
            >
              <text x="350" y="250" fontSize="10">🍃</text>
            </motion.g>
          )}
        </svg>
      </div>
    </div>
  );
}
