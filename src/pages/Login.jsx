import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const isSignup = mode === 'signup'

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/home')
  }

  const handleGuest = () => {
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/70 backdrop-blur-sm">
    

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Streamyy</p>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {isSignup
              ? 'Start streaming with a new account and enjoy a lighter browsing experience.'
              : 'Sign in to continue or choose guest access for a quick preview.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {isSignup && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:opacity-95"
          >
            {isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-slate-500">
          <span className="h-px w-10 bg-slate-200"></span>
          Continue as a guest
          <span className="h-px w-10 bg-slate-200"></span>
        </div>

        <button
          onClick={handleGuest}
          className="mt-6 w-full rounded-3xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Continue as guest
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          {isSignup ? 'Already have an account?' : 'New here?'}{' '}
          <button
            type="button"
            onClick={() => setMode(isSignup ? 'login' : 'signup')}
            className="font-semibold text-slate-900 underline decoration-indigo-300 underline-offset-4 transition hover:text-indigo-600"
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
