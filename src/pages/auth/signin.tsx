import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function SignIn() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linkedin-bg p-6">
      <div className="max-w-md w-full bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-linkedin-blue text-center">Welcome to FinSight</h1>
        <p className="text-sm text-center text-linkedin-gray mt-2">Sign in to continue</p>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            <i className="fab fa-google"></i>
            <span>Continue with Google</span>
          </button>
          <button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-black text-white py-2 rounded"
          >
            <i className="fab fa-github"></i>
            <span>Continue with GitHub</span>
          </button>
        </div>

        <p className="text-sm text-center text-linkedin-gray mt-4">
          Don’t have an account?{' '}
          <Link href="/auth/signup" className="text-linkedin-blue hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}