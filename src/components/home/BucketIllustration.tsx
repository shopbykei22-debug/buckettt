interface RosePalette {
  outer: string;
  mid: string;
  inner: string;
}

const ROSE_BLUSH: RosePalette = { outer: '#FBD0DF', mid: '#F8A9C6', inner: '#E0729A' };
const ROSE_PINK: RosePalette = { outer: '#F8BBD0', mid: '#F48FB1', inner: '#C9557F' };
const ROSE_CREAM: RosePalette = { outer: '#FFF0F5', mid: '#FADADB', inner: '#E8A0BA' };

interface RoseProps {
  x: number;
  y: number;
  r: number;
  palette: RosePalette;
}

function Rose({ x, y, r, palette }: RoseProps) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={palette.outer} />
      <path
        d={`M${x - r * 0.9} ${y + r * 0.1} Q${x - r * 0.4} ${y - r * 0.95} ${x + r * 0.8} ${y - r * 0.4} Q${x + r * 0.95} ${y + r * 0.6} ${x - r * 0.1} ${y + r * 0.8}`}
        fill="none"
        stroke={palette.mid}
        strokeWidth={r * 0.14}
        strokeLinecap="round"
      />
      <circle cx={x} cy={y} r={r * 0.68} fill={palette.mid} />
      <path
        d={`M${x - r * 0.45} ${y} Q${x} ${y - r * 0.6} ${x + r * 0.45} ${y} Q${x} ${y + r * 0.5} ${x - r * 0.45} ${y}`}
        fill="none"
        stroke={palette.inner}
        strokeWidth={r * 0.1}
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx={x} cy={y} r={r * 0.2} fill={palette.inner} />
    </g>
  );
}

interface LeafProps {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
}

function Leaf({ x, y, rotate, scale = 1 }: LeafProps) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={30 * scale}
      ry={13 * scale}
      fill="#A7C4B5"
      transform={`rotate(${rotate} ${x} ${y})`}
    />
  );
}

const BUCKET_STRIPES = [-0.7, -0.35, 0, 0.35, 0.7].map((t) => ({
  top: 200 + t * 108,
  bottom: 200 + t * 74,
}));

interface BucketIllustrationProps {
  layer: 'back' | 'front';
  className?: string;
}

export default function BucketIllustration({ layer, className }: BucketIllustrationProps) {
  if (layer === 'front') {
    return (
      <svg viewBox="0 0 400 420" className={className} aria-hidden="true" focusable="false">
        <Rose x={150} y={222} r={30} palette={ROSE_PINK} />
        <Rose x={250} y={224} r={32} palette={ROSE_BLUSH} />
        <Rose x={200} y={236} r={24} palette={ROSE_CREAM} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 420" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="bucket-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBD0DF" />
          <stop offset="1" stopColor="#E98AAE" />
        </linearGradient>
      </defs>

      <ellipse cx="200" cy="396" rx="104" ry="10" fill="#E9D5DC" opacity="0.7" />

      <path
        d="M118 214 C 112 70, 288 70, 282 214"
        fill="none"
        stroke="#C48B9F"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.75"
      />

      <Leaf x={92} y={168} rotate={-38} />
      <Leaf x={308} y={166} rotate={38} />
      <Leaf x={142} y={96} rotate={-18} scale={0.9} />
      <Leaf x={262} y={92} rotate={20} scale={0.9} />

      <path
        d="M90 212 L310 212 L276 382 Q274 392 262 392 L138 392 Q126 392 124 382 Z"
        fill="url(#bucket-body)"
      />
      <ellipse cx="200" cy="212" rx="110" ry="15" fill="#F8BBD0" />
      <ellipse cx="200" cy="212" rx="96" ry="9" fill="#E9A0BC" opacity="0.6" />

      {BUCKET_STRIPES.map((stripe) => (
        <line
          key={stripe.top}
          x1={stripe.top}
          y1={224}
          x2={stripe.bottom}
          y2={380}
          stroke="#FFFFFF"
          strokeWidth="2"
          opacity="0.28"
        />
      ))}

      <path d="M200 286 C 178 262 156 272 166 292 C 172 304 192 296 200 286 Z" fill="#C48B9F" />
      <path d="M200 286 C 222 262 244 272 234 292 C 228 304 208 296 200 286 Z" fill="#C48B9F" />
      <circle cx="200" cy="288" r="5" fill="#A87388" />

      <g style={{ transformOrigin: '200px 230px', transformBox: 'view-box' }} className="animate-sway">
        <Rose x={200} y={150} r={38} palette={ROSE_PINK} />
        <Rose x={112} y={130} r={44} palette={ROSE_BLUSH} />
        <Rose x={290} y={136} r={42} palette={ROSE_PINK} />
        <Rose x={200} y={74} r={46} palette={ROSE_BLUSH} />
        <Rose x={64} y={190} r={28} palette={ROSE_CREAM} />
        <Rose x={338} y={192} r={30} palette={ROSE_CREAM} />
        <Rose x={160} y={198} r={34} palette={ROSE_CREAM} />
        <Rose x={244} y={200} r={32} palette={ROSE_PINK} />
      </g>
    </svg>
  );
}
