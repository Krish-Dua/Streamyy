import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const typeMappings = {
  'home': [], 
  'tv-shows': ['TV_SERIES', 'TV_MINI_SERIES', 'TV_SPECIAL', 'TV_MOVIE'],
  'movies': ['MOVIE'],
  'video-games': ['VIDEO_GAME']
}

const Navbar = React.memo(({ activeTab, setActiveTab }) => {
  const tabs = ['Home', 'TV Shows', 'Movies', 'Video Games', 'Profile']

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-indigo-600">Streamyy</h1>
          </div>
          <div className="flex space-x-4 sm:space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setActiveTab(tab.toLowerCase().replace(' ', '-'))
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === tab.toLowerCase().replace(' ', '-')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
})

const HeroSection = React.memo(({ topShow }) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="relative h-120 bg-linear-to-r from-indigo-500 to-violet-600 overflow-hidden"
  >
    <div className="absolute inset-0 bg-black/20"></div>
    {topShow.poster && topShow.poster.includes('http') && (
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        src={topShow.poster}
        alt={topShow.title}
        onError={(e) => { e.target.style.display = 'none' }}
        className="w-full h-full object-cover "
      />
    )}
    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-bold text-white mb-2"
        >
          {topShow.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-slate-200 mb-4 max-w-2xl"
        >
          {topShow.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center space-x-4"
        >
          <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
            ★ {topShow.rating}
          </span>
          <span className="text-slate-300">{topShow.year}</span>
        </motion.div>
      </div>
    </div>
  </motion.section>
))

const MovieCardSkeleton = () => (
  <div className="group text-left">
    <div className="relative overflow-hidden rounded-lg bg-slate-100 animate-pulse">
      <div className="aspect-2/3 w-full bg-slate-200 rounded-lg"></div>
      <div className="absolute top-2 right-2 bg-slate-300 h-6 w-12 rounded"></div>
      <div className="absolute bottom-2 right-2 bg-slate-300 h-8 w-8 rounded-full"></div>
    </div>
    <div className="mt-2">
      <div className="h-4 bg-slate-200 rounded mb-1"></div>
      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
    </div>
  </div>
)

const MovieCard = React.memo(({ movie, onSelect, onToggleWatchlist, isInWatchlist }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.05 }}
    className="group text-left"
  >
    <div className="relative overflow-hidden rounded-lg bg-slate-100 transition hover:-translate-y-1 hover:shadow-lg">
      <button
        type="button"
        onClick={() => onSelect(movie)}
        className="w-full"
      >
        <img
          src={movie.primaryImage?.url}
          alt={movie.primaryTitle}
          loading="lazy"
          onError={(e) => {
            e.target.style.backgroundColor = '#e2e8f0'
            e.target.alt = '📺 No Image'
          }}
          className="aspect-2/3 w-full object-cover rounded-lg transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
          ★ {movie.rating?.aggregateRating || 'N/A'}
        </div>
      </button>
      <button
        type="button"
        title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        onClick={(e) => {
          e.stopPropagation()
          onToggleWatchlist(movie)
        }}
        className="absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition"
      >
        {isInWatchlist ? '✓' : '+'}
      </button>
    </div>
    <div className="mt-2">
      <h3 className="text-sm font-medium text-slate-900 truncate">{movie.primaryTitle}</h3>
      <p className="text-xs text-slate-500">{movie.startYear || 'N/A'}</p>
    </div>
  </motion.div>
))

const ContentGrid = React.memo(({ items, loading, error, title, onLoadMore, hasMore, onSelectMovie, onToggleWatchlist, watchlist }) => {
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (!hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  if (error) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">Error loading content: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-slate-900 mb-6"
        >
          {title}
        </motion.h2>
        {loading && items.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm"
          >
            No titles found for this category yet.
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {items.map((item) => (
                <MovieCard 
                  key={item.id} 
                  movie={item} 
                  onSelect={onSelectMovie}
                  onToggleWatchlist={onToggleWatchlist}
                  isInWatchlist={watchlist.some((movie) => movie.id === item.id)}
                />
              ))}
            </motion.div>
            {hasMore && (
              <div ref={sentinelRef} className="h-10 flex items-center justify-center">
                {loading && <div className="text-slate-500">Loading more...</div>}
              </div>
            )}
          </>
        )}
      </div>
    </motion.section>
  )
})

const ProfileView = React.memo(({ watchHistory, watchlist, onSignOut, onSelectMovie }) => (
  <motion.section
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    className="py-12 bg-slate-50"
  >
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-3xl font-bold text-slate-900 mb-8"
      >
        Profile
      </motion.h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Watch History</h3>
          {watchHistory.length === 0 ? (
            <p className="text-slate-500">No history yet.</p>
          ) : (
            <ul className="space-y-3">
              {watchHistory.slice(0, 10).map((movie) => (
                <li key={movie.id}>
                  <button
                    type="button"
                    onClick={() => onSelectMovie(movie)}
                    className="w-full text-left rounded-3xl bg-slate-50 p-4 transition hover:bg-slate-100 hover:shadow-md"
                  >
                    <p className="font-medium text-slate-900">{movie.primaryTitle}</p>
                    <p className="text-xs text-slate-500">{movie.startYear || 'N/A'}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Watchlist</h3>
          {watchlist.length === 0 ? (
            <p className="text-slate-500">No items saved.</p>
          ) : (
            <ul className="space-y-3">
              {watchlist.slice(0, 10).map((movie) => (
                <li key={movie.id}>
                  <button
                    type="button"
                    onClick={() => onSelectMovie(movie)}
                    className="w-full text-left rounded-3xl bg-slate-50 p-4 transition hover:bg-slate-100 hover:shadow-md"
                  >
                    <p className="font-medium text-slate-900">{movie.primaryTitle}</p>
                    <p className="text-xs text-slate-500">{movie.startYear || 'N/A'}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center">
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-3xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  </motion.section>
))

const Home = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pageToken, setPageToken] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [watchlist, setWatchlist] = useState([])
  const [watchHistory, setWatchHistory] = useState([])
  const [apiCache, setApiCache] = useState(new Map())
  const [topShow, setTopShow] = useState({
    id: 'tt0111161',
    title: "Today's Top Show",
    poster: null,
    description: "This is the most popular show today. A thrilling adventure awaits.",
    rating: 9.2,
    year: 2023
  })

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
    const storedHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]')
    setWatchlist(storedWatchlist)
    setWatchHistory(storedHistory)
  }, [])


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [watchlist])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('watchHistory', JSON.stringify(watchHistory))
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [watchHistory])


  const fetchItems = useCallback(async (tab, token = null, append = false) => {
    if (tab === 'profile') {
      setLoading(false)
      setHasMore(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const url = new URL(API_BASE)
      url.searchParams.set('limit', '12') 
      if (token) url.searchParams.set('pageToken', token)
      const types = typeMappings[tab]
      types.forEach((type) => url.searchParams.append('types', type))

      const cacheKey = url.toString()
      
      if (!append && apiCache.has(cacheKey)) {
        const cachedData = apiCache.get(cacheKey)
        setItems(cachedData.titles || [])
        setPageToken(cachedData.nextPageToken || null)
        setHasMore(!!cachedData.nextPageToken)
        setLoading(false)
        return
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 10000)
      const response = await fetch(url.toString(), { signal: controller.signal })
      clearTimeout(timeoutId)
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      
      const data = await response.json()
      const newItems = data.titles || []

       const topItem = data.titles?.[6]
      
      if (topItem) {
        setTopShow({
          id: topItem.id,
          title: topItem.primaryTitle,
          poster: topItem.primaryImage?.url || null,
          description: topItem.plot || 'No description available.',
          rating: topItem.rating?.aggregateRating || 'N/A',
          year: topItem.startYear
        })
      }
      
      if (!append) {
        setApiCache(prev => new Map(prev).set(cacheKey, data))
      }
      
      setItems(prev => append ? [...prev, ...newItems] : newItems)
      setPageToken(data.nextPageToken || null)
      setHasMore(!!data.nextPageToken)
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError(err.message)
      }
      setItems([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [apiCache])

  useEffect(() => {
    setItems([])
    setPageToken(null)
    setHasMore(true)
    fetchItems(activeTab, null, false)
  }, [activeTab, fetchItems])

  const handleLoadMore = useCallback(() => {
    if (pageToken && !loading) {
      fetchItems(activeTab, pageToken, true)
    }
  }, [pageToken, activeTab, fetchItems, loading])

  const handleOpenDetails = useCallback((movie) => {
    setWatchHistory((prev) => (prev.some((item) => item.id === movie.id) ? prev : [movie, ...prev]))
    navigate(`/home/details/${movie.id}`, { state: { movie } })
  }, [navigate])

  const handleToggleWatchlist = useCallback((movie) => {
    setWatchlist((prev) =>
      prev.some((item) => item.id === movie.id)
        ? prev.filter((item) => item.id !== movie.id)
        : [movie, ...prev]
    )
  }, [])

  const handleSignOut = useCallback(() => {
    navigate('/')
  }, [navigate])

  const titleMap = {
    'home': 'All Content',
    'tv-shows': 'TV Shows',
    'movies': 'Movies',
    'video-games': 'Video Games',
    'profile': 'Profile'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <AnimatePresence mode="wait">
        {activeTab === 'home' && <HeroSection key="hero" topShow={topShow} />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <ProfileView key="profile" watchHistory={watchHistory} watchlist={watchlist} onSignOut={handleSignOut} onSelectMovie={handleOpenDetails} />
        ) : (
          <ContentGrid
            key={`grid-${activeTab}`}
            items={items}
            loading={loading}
            error={error}
            title={titleMap[activeTab]}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            onSelectMovie={handleOpenDetails}
            onToggleWatchlist={handleToggleWatchlist}
            watchlist={watchlist}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home
