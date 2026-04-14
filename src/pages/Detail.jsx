import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const Detail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [movie, setMovie] = useState(location.state?.movie || null)
  const [watchlist, setWatchlist] = useState([])

  const isInWatchlist = watchlist.some((item) => item.id === id)

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
    setWatchlist(storedWatchlist)

    if (!movie) {
      const storedHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]')
      const storedTitles = [...storedHistory, ...storedWatchlist]
      const found = storedTitles.find((item) => item.id === id)
      if (found) {
        setMovie(found)
      }
    }
  }, [id, movie])

  useEffect(() => {
    if (!movie) return
    const storedHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]')
    if (!storedHistory.some((item) => item.id === movie.id)) {
      const nextHistory = [movie, ...storedHistory]
      localStorage.setItem('watchHistory', JSON.stringify(nextHistory))
    }
  }, [movie])

  const handleToggleWatchlist = () => {
    if (!movie) return
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
    const updated = storedWatchlist.some((item) => item.id === movie.id)
      ? storedWatchlist.filter((item) => item.id !== movie.id)
      : [movie, ...storedWatchlist]

    setWatchlist(updated)
    localStorage.setItem('watchlist', JSON.stringify(updated))
  }

  const details = useMemo(() => {
    if (!movie) return {}
    const runtimeMinutes = movie.runtimeSeconds ? Math.floor(movie.runtimeSeconds / 60) : null
    const runtimeHours = runtimeMinutes ? Math.floor(runtimeMinutes / 60) : null
    const runtimeDisplay = runtimeHours ? `${runtimeHours}h ${runtimeMinutes % 60}m` : runtimeMinutes ? `${runtimeMinutes}m` : 'Unknown'
    return {
      rating: movie.rating?.aggregateRating || 'N/A',
      count: movie.rating?.voteCount || '—',
      genres: movie.genres?.join(', ') || 'Not available',
      duration: runtimeDisplay,
      type: movie.type || 'Unknown',
      contentRating: movie.contentRating || 'Not rated',
      endYear: movie.endYear || null
    }
  }, [movie])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="mb-8 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          ← Back to browse
        </button>

        {!movie ? (
          <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-10 text-center shadow-2xl shadow-black/40">
            <h1 className="text-3xl font-semibold">No movie selected</h1>
            <p className="mt-4 text-slate-400">Please return to the home page and choose a title to view full details.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-4xl bg-slate-900/90 shadow-2xl shadow-black/30 ring-1 ring-white/10">
            <div className="relative h-112 w-full overflow-hidden">
              <img
                src={movie.primaryImage?.url || 'https://via.placeholder.com/1200x700?text=No+Image'}
                alt={movie.primaryTitle}
                className="h-full w-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                <div className="max-w-3xl space-y-4">
                  <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200">{details.type}</p>
                  <h1 className="text-4xl font-semibold sm:text-5xl">{movie.primaryTitle}</h1>
                  <p className="max-w-2xl text-sm text-slate-300 sm:text-base">{movie.plot || movie.synopses?.[0]?.text || 'No plot summary is available for this title.'}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                    <span>{movie.startYear || 'Unknown year'}{details.endYear ? ` - ${details.endYear}` : ''}</span>
                    <span>{details.duration}</span>
                    <span>{details.contentRating}</span>
                    <span>{details.genres}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8 p-8 sm:p-10">
              <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
                <div className="space-y-6">
                  <div className="rounded-4xl bg-slate-950/90 p-6 shadow-lg shadow-black/20 ring-1 ring-white/5">
                    <h2 className="text-xl font-semibold text-white">About</h2>
                    <p className="mt-4 text-slate-300 leading-relaxed">{movie.plot || movie.synopses?.[0]?.text || 'Detailed description unavailable.'}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-4xl bg-slate-950/90 p-6 shadow-lg shadow-black/20 ring-1 ring-white/5">
                      <p className="text-sm text-slate-400">Rating</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{details.rating}</p>
                      <p className="mt-1 text-sm text-slate-400">{details.count} votes</p>
                    </div>

                    <div className="rounded-4xl bg-slate-950/90 p-6 shadow-lg shadow-black/20 ring-1 ring-white/5">
                      <p className="text-sm text-slate-400">Content</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{details.contentRating}</p>
                      <p className="mt-1 text-sm text-slate-400">{details.genres}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-4xl bg-slate-950/90 p-6 shadow-lg shadow-black/20 ring-1 ring-white/5">
                  <div>
                    <p className="text-sm text-slate-400">Primary title</p>
                    <p className="mt-2 text-lg font-semibold text-white">{movie.primaryTitle}</p>
                  </div>
                  {movie.originalTitle && movie.originalTitle !== movie.primaryTitle && (
                    <div>
                      <p className="text-sm text-slate-400">Original title</p>
                      <p className="mt-2 text-lg font-semibold text-white">{movie.originalTitle}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-400">Release year</p>
                    <p className="mt-2 text-lg font-semibold text-white">{movie.startYear || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Type</p>
                    <p className="mt-2 text-lg font-semibold text-white">{details.type}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleToggleWatchlist}
                  className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Browse more titles
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Detail
