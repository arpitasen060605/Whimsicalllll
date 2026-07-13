import { Link } from 'react-router-dom'
import { format } from 'date-fns'

// A handful of fixed tilt angles, cycled through for visual variety without true randomness
// (true randomness would cause the layout to jump around on every re-render)
const TILTS = [-6, 4, -3, 7, -8, 2, -4, 6]

function PolaroidCard({ item, index }) {
  const tilt = TILTS[index % TILTS.length]

  return (
    <Link
      to={`/read/${item.entryId}`}
      className="block bg-white rounded-sm p-3 pb-10 shadow-lg hover:z-10 hover:scale-105 transition-transform relative"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* washi tape effect */}
      <div
        className="absolute w-14 h-5 opacity-80 rounded-sm"
        style={{
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%) rotate(-3deg)',
          backgroundColor: 'var(--moon-accent)',
        }}
      />

      <div className="w-full aspect-square bg-gray-100 overflow-hidden relative">
        {item.type === 'video' ? (
          <>
            <video src={item.url} className="w-full h-full object-cover" muted />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white text-lg">
                ▶
              </div>
            </div>
          </>
        ) : (
          <img src={item.url} alt={item.entryTitle} className="w-full h-full object-cover" />
        )}
      </div>

      <p className="text-center text-gray-700 text-xs mt-3 font-serif truncate px-1">
        {format(new Date(item.createdAt), 'MMM d, yyyy')}
      </p>
    </Link>
  )
}

export default PolaroidCard