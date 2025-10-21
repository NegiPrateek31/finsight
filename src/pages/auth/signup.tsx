import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function SignUp() {
  const handleGoogleSignup = () => {
    signIn('google', { callbackUrl: '/' })
  }

  const handleGithubSignup = () => {
    signIn('github', { callbackUrl: '/' })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linkedin-bg p-6">
      <div className="max-w-md w-full bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-linkedin-blue text-center">
          Create your FinSight account
        </h1>
        <p className="text-sm text-center text-linkedin-gray mt-2">
          Choose a sign up method
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            <i className="fab fa-google" aria-hidden="true"></i>
            <span>Sign up with Google</span>
          </button>

          <button
            type="button"
            onClick={handleGithubSignup}
            className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-black text-white py-2 rounded"
          >
            <i className="fab fa-github" aria-hidden="true"></i>
            <span>Sign up with GitHub</span>
          </button>
        </div>

        <p className="text-sm text-center text-linkedin-gray mt-4">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-linkedin-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}