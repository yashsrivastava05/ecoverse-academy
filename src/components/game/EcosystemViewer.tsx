import { motion, AnimatePresence } from 'framer-motion';
import { getEcosystemStage } from '@/lib/types';

interface EcosystemViewerProps {
  ecoPoints: number;
  className?: string;
}

function Stars() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    cx: Math.random() * 800,
    cy: Math.random() * 200,
    r: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 3,
  }));
  return (
    <g>
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={0.6} className="animate-twinkle" style={{ animationDelay: `${s.delay}s` }} />
      ))}
    </g>
  );
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} className="animate-float" style={{ animationDuration: '8s' }}>
      <ellipse cx="0" cy="0" rx="30" ry="12" fill="white" opacity="0.15" />
      <ellipse cx="15" cy="-5" rx="20" ry="10" fill="white" opacity="0.1" />
      <ellipse cx="-10" cy="-3" rx="18" ry="9" fill="white" opacity="0.12" />
    </g>
  );
}

function Tree({ x, y, scale = 1, variant = 0 }: { x: number; y: number; scale?: number; variant?: number }) {
  const swayDelay = variant * 0.5;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} className="animate-sway" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${swayDelay}s` }}>
      <rect x="-3" y="-5" width="6" height="20" rx="2" fill="#5D4037" />
      <ellipse cx="0" cy="-20" rx="15" ry="20" fill="#2D6A4F" />
      <ellipse cx="0" cy="-20" rx="15" ry="20" fill="url(#treeGlow)" opacity="0.3" />
    </g>
  );
}

function DeadTree({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-3" y="-5" width="6" height="25" rx="1" fill="#5D4037" opacity="0.5" />
      <line x1="0" y1="-5" x2="-12" y2="-18" stroke="#5D4037" strokeWidth="2" opacity="0.4" />
      <line x1="0" y1="-10" x2="10" y2="-22" stroke="#5D4037" strokeWidth="2" opacity="0.4" />
    </g>
  );
}

function River({ width, clarity }: { width: number; clarity: number }) {
  const opacity = 0.3 + (clarity / 100) * 0.5;
  return (
    <g>
      <path
        d={`M0,380 Q${width * 0.2},360 ${width * 0.4},375 Q${width * 0.6},390 ${width * 0.8},370 Q${width},350 ${width + 50},380 L${width + 50},400 L0,400 Z`}
        fill="hsl(195 74% 59%)"
        opacity={opacity}
      />
      <path
        d={`M0,382 Q${width * 0.3},365 ${width * 0.5},378`}
        stroke="white" strokeWidth="1" fill="none" opacity={0.15}
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
      <path d="M-5,0 Q0,-5 5,0" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" opacity="0.5" />
    </motion.g>
  );
}

function Fireflies({ count }: { count: number }) {
  const flies = Array.from({ length: count }, (_, i) => ({
    x: 100 + Math.random() * 600,
    y: 200 + Math.random() * 200,
    delay: Math.random() * 4,
    dur: 3 + Math.random() * 3,
  }));
  return (
    <g>
      {flies.map((f, i) => (
        <motion.circle
          key={i}
          cx={f.x} cy={f.y} r={2}
          fill="#00FF87"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0], y: [f.y, f.y - 20, f.y] }}
          transition={{ duration: f.dur, repeat: Infinity, delay: f.delay }}
        />
      ))}
    </g>
  );
}

function Flowers({ count }: { count: number }) {
  const flowers = Array.from({ length: count }, (_, i) => ({
    x: 80 + i * 120 + Math.random() * 60,
    y: 370 + Math.random() * 15,
    color: ['#FF6B6B', '#FFB703', '#7B2FBE', '#48CAE4'][i % 4],
  }));
  return (
    <g>
      {flowers.map((f, i) => (
        <g key={i} className="animate-float" style={{ animationDelay: `${i * 0.8}s`, animationDuration: '4s' }}>
          <circle cx={f.x} cy={f.y} r={4} fill={f.color} opacity={0.8} />
          <circle cx={f.x} cy={f.y} r={2} fill="white" opacity={0.5} />
          <rect x={f.x - 0.5} y={f.y} width={1} height={8} fill="#2D6A4F" />
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
      <text x={0} y={y} fontSize="16" opacity="0.6">
        {type === 'deer' ? '🦌' : type === 'rabbit' ? '🐇' : '🦊'}
      </text>
    </motion.g>
  );
}

export default function EcosystemViewer({ ecoPoints, className = '' }: EcosystemViewerProps) {
  const stage = getEcosystemStage(ecoPoints);
  const isNight = (() => { const h = new Date().getHours(); return h < 6 || h >= 18; })();

  const skyGradients: Record<number, [string, string]> = {
    0: ['#8B6914', '#4A3728'],
    1: ['#607D8B', '#90A4AE'],
    2: ['#64B5F6', '#90CAF9'],
    3: ['#42A5F5', '#64B5F6'],
    4: ['#1E88E5', '#42A5F5'],
    5: ['#0D47A1', '#1565C0'],
    6: ['#0A0E27', '#1A237E'],
  };
  const sky = isNight && stage > 2 ? ['#0A0E27', '#1A237E'] : skyGradients[stage];

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border ${className}`}>
      <svg viewBox="0 0 800 450" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sky[0]} />
            <stop offset="100%" stopColor={sky[1]} />
          </linearGradient>
          <radialGradient id="treeGlow">
            <stop offset="0%" stopColor="#00FF87" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00FF87" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stage === 0 ? '#5D4037' : '#2D6A4F'} />
            <stop offset="100%" stopColor={stage === 0 ? '#3E2723' : '#1B5E20'} />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="800" height="450" fill="url(#skyGrad)" />

        {/* Stars (night or high stage) */}
        {(isNight || stage >= 6) && <Stars />}

        {/* Sun/Moon */}
        {stage > 0 && !isNight && (
          <circle cx="650" cy="80" r="30" fill="#FFB703" opacity="0.8">
            <animate attributeName="opacity" values="0.7;0.9;0.7" dur="4s" repeatCount="indefinite" />
          </circle>
        )}
        {isNight && stage > 2 && (
          <circle cx="650" cy="80" r="20" fill="#E0E0E0" opacity="0.7" />
        )}

        {/* Clouds */}
        {stage >= 2 && <><Cloud x={150} y={60} /><Cloud x={500} y={90} scale={0.8} /></>}
        {stage >= 3 && <Cloud x={350} y={50} scale={1.2} />}

        {/* Mountains (higher stages) */}
        {stage >= 3 && (
          <g opacity="0.3">
            <polygon points="0,300 100,180 200,280 300,200 400,300" fill="#1B5E20" />
            <polygon points="400,300 500,200 600,260 700,190 800,300" fill="#2E7D32" />
          </g>
        )}

        {/* Birds */}
        {stage >= 2 && <Bird startX={-20} startY={100} />}
        {stage >= 3 && <Bird startX={-50} startY={130} />}

        {/* Ground */}
        <rect x="0" y="370" width="800" height="80" fill="url(#groundGrad)" />

        {/* Cracked earth for stage 0 */}
        {stage === 0 && (
          <g opacity="0.3">
            <line x1="100" y1="380" x2="130" y2="400" stroke="#8B6914" strokeWidth="1" />
            <line x1="300" y1="375" x2="340" y2="395" stroke="#8B6914" strokeWidth="1" />
            <line x1="500" y1="385" x2="520" y2="400" stroke="#8B6914" strokeWidth="1" />
            <line x1="650" y1="378" x2="680" y2="398" stroke="#8B6914" strokeWidth="1" />
          </g>
        )}

        {/* Dead tree for stage 0 */}
        {stage === 0 && <DeadTree x={400} y={370} />}

        {/* Seedling for stage 1 */}
        {stage === 1 && (
          <g>
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 1 }}
              style={{ transformOrigin: '400px 370px' }}
            >
              <rect x="398" y="355" width="4" height="15" rx="1" fill="#4CAF50" />
              <ellipse cx="395" cy="352" rx="6" ry="4" fill="#66BB6A" />
              <ellipse cx="405" cy="354" rx="5" ry="3" fill="#81C784" />
              <ellipse cx="400" cy="348" rx="4" ry="3" fill="#A5D6A7" />
            </motion.g>
            {/* Glow around seedling */}
            <circle cx="400" cy="358" r="15" fill="#00FF87" opacity="0.1">
              <animate attributeName="r" values="15;20;15" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.1;0.2;0.1" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Trees for stage 2+ */}
        <AnimatePresence>
          {stage >= 2 && <Tree x={400} y={370} scale={0.8 + (stage - 2) * 0.15} variant={0} />}
          {stage >= 3 && <><Tree x={300} y={372} scale={0.7 + (stage - 3) * 0.1} variant={1} /><Tree x={500} y={368} scale={0.9} variant={2} /></>}
          {stage >= 4 && <><Tree x={200} y={374} scale={0.7} variant={3} /><Tree x={600} y={370} scale={0.85} variant={4} /><Tree x={150} y={372} scale={0.6} variant={5} /><Tree x={650} y={374} scale={0.65} variant={6} /></>}
          {stage >= 5 && <><Tree x={100} y={370} scale={0.75} variant={7} /><Tree x={250} y={368} scale={0.9} variant={8} /><Tree x={550} y={372} scale={0.8} variant={9} /><Tree x={700} y={370} scale={0.7} variant={10} /></>}
        </AnimatePresence>

        {/* Golden tree of life for stage 6 */}
        {stage >= 6 && (
          <g>
            <rect x="395" y="330" width="10" height="40" rx="3" fill="#FFB703" />
            <ellipse cx="400" cy="310" rx="30" ry="35" fill="#FFB703" opacity="0.6" />
            <circle cx="400" cy="310" r="40" fill="#FFB703" opacity="0.1">
              <animate attributeName="r" values="40;50;40" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.1;0.2;0.1" dur="4s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* River */}
        {stage >= 2 && <River width={800} clarity={Math.min(100, (stage - 2) * 25)} />}

        {/* Flowers */}
        {stage >= 2 && <Flowers count={Math.min(6, stage)} />}

        {/* Animals */}
        {stage >= 3 && <AnimalSilhouette type="deer" x={120} y={365} />}
        {stage >= 4 && <AnimalSilhouette type="rabbit" x={620} y={368} />}
        {stage >= 5 && <AnimalSilhouette type="fox" x={350} y={366} />}

        {/* Fireflies at night or high stage */}
        {(isNight || stage >= 5) && <Fireflies count={stage >= 5 ? 15 : 8} />}

        {/* Butterflies */}
        {stage >= 1 && (
          <motion.g
            animate={{ x: [0, 50, 20, 80, 0], y: [0, -20, -10, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          >
            <text x="450" y="340" fontSize="12" opacity="0.7">🦋</text>
          </motion.g>
        )}
        {stage >= 4 && (
          <motion.g
            animate={{ x: [0, -40, -20, -60, 0], y: [0, -15, -25, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <text x="250" y="350" fontSize="10" opacity="0.6">🦋</text>
          </motion.g>
        )}
      </svg>

      {/* Overlay gradient at bottom for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card/80 to-transparent" />
    </div>
  );
}
