import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
// Chart not used yet

type Report = {
  id: string
  reason: string
  status: 'PENDING' | 'RESOLVED' | 'REJECTED'
  createdAt: string
  reporter: {
    name: string
    email: string
  }
  post: {
    title: string
    authorId: string
  }
}

type UserStats = {
  totalUsers: number
  newUsersThisWeek: number
  activeUsers: number
}

type ContentStats = {
  totalPosts: number
  totalComments: number
  postsThisWeek: number
}

export default function AdminDashboard() {
  const sessionHook = useSession()
  const session = sessionHook?.data
  const status = sessionHook?.status
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [contentStats, setContentStats] = useState<ContentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  if (status === 'loading') return

  if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    // Fetch user role and redirect if not admin
    const checkAdminAccess = async () => {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.role !== 'ADMIN') {
        router.push('/')
      }
    }

    const fetchData = async () => {
      try {
        // Fetch reports
        const reportsRes = await fetch('/api/admin/reports')
        const reportsData = await reportsRes.json()
        setReports(reportsData)

        // Fetch user stats
        const userStatsRes = await fetch('/api/admin/stats/users')
        const userStatsData = await userStatsRes.json()
        setUserStats(userStatsData)

        // Fetch content stats
        const contentStatsRes = await fetch('/api/admin/stats/content')
        const contentStatsData = await contentStatsRes.json()
        setContentStats(contentStatsData)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching admin data:', error)
        setLoading(false)
      }
    }

    checkAdminAccess()
    fetchData()
  }, [session, status, router])

  const handleReportAction = async (reportId: string, action: 'resolve' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (res.ok) {
        // Update reports list
        setReports(reports.map(report => 
          report.id === reportId 
            ? { ...report, status: action === 'resolve' ? 'RESOLVED' : 'REJECTED' }
            : report
        ))
      }
    } catch (error) {
      console.error('Error updating report:', error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* User Stats Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          {userStats && (
            <div className="space-y-2">
              <p>Total Users: {userStats.totalUsers}</p>
              <p>New Users This Week: {userStats.newUsersThisWeek}</p>
              <p>Active Users: {userStats.activeUsers}</p>
            </div>
          )}
        </div>

        {/* Content Stats Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Content Statistics</h2>
          {contentStats && (
            <div className="space-y-2">
              <p>Total Posts: {contentStats.totalPosts}</p>
              <p>Total Comments: {contentStats.totalComments}</p>
              <p>New Posts This Week: {contentStats.postsThisWeek}</p>
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button 
              className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
              onClick={() => router.push('/admin/users')}
            >
              Manage Users
            </button>
            <button 
              className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
              onClick={() => router.push('/admin/content')}
            >
              Manage Content
            </button>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4">{report.reporter.name}</td>
                  <td className="px-6 py-4">{report.post.title}</td>
                  <td className="px-6 py-4">{report.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {report.status === 'PENDING' && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleReportAction(report.id, 'resolve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'reject')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}