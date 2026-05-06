import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Ocheverse').slice(0, 120);
  const category = (searchParams.get('category') || '').slice(0, 40);
  const author = searchParams.get('author') || 'David Gideon';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #7c3aed 100%)',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(168,85,247,0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(59,130,246,0) 70%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #60a5fa, #c084fc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            O
          </div>
          <span>Ocheverse.ng</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {category && (
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#c084fc',
                display: 'flex',
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              fontSize: title.length > 60 ? 64 : 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              display: 'flex',
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26, opacity: 0.85 }}>
          <span style={{ fontWeight: 600 }}>{author}</span>
          <span>ocheverse.ng</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
