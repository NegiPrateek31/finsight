import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Head>
        <title>FinSight - Connect with Finance Professionals</title>
        <meta
          name="description"
          content="FinSight - The professional network dedicated to finance professionals, analysts, and financial experts."
        />
      </Head>

      <div className="min-h-screen bg-linkedin-bg">
        {/* Navigation Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <nav className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linkedin-blue rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Fi</span>
                </div>
                <span className="text-xl font-bold text-linkedin-blue">FinSight</span>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl mx-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for finance professionals, reports, analysis..."
                    className="w-full py-2 px-4 bg-linkedin-bg rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
                  />
                  <i className="fas fa-search absolute right-3 top-2.5 text-linkedin-gray"></i>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex items-center space-x-6">
                <a href="#" className="flex flex-col items-center text-linkedin-gray hover:text-linkedin-blue">
                  <i className="fas fa-home text-xl"></i>
                  <span className="text-xs mt-1">Home</span>
                </a>
                <a href="#" className="flex flex-col items-center text-linkedin-gray hover:text-linkedin-blue">
                  <i className="fas fa-user-friends text-xl"></i>
                  <span className="text-xs mt-1">My Network</span>
                </a>
                <a href="#" className="flex flex-col items-center text-linkedin-gray hover:text-linkedin-blue">
                  <i className="fas fa-briefcase text-xl"></i>
                  <span className="text-xs mt-1">Jobs</span>
                </a>
                <a href="#" className="flex flex-col items-center text-linkedin-gray hover:text-linkedin-blue">
                  <i className="fas fa-comment-dots text-xl"></i>
                  <span className="text-xs mt-1">Messaging</span>
                </a>
                <a href="#" className="flex flex-col items-center text-linkedin-gray hover:text-linkedin-blue">
                  <i className="fas fa-bell text-xl"></i>
                  <span className="text-xs mt-1">Notifications</span>
                </a>

                {/* User Profile */}
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Image src="https://picsum.photos/32?random=1" alt="Profile" width={32} height={32} className="rounded-full" />
                  <span className="text-sm text-linkedin-gray">
                    Me <i className="fas fa-caret-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Main */}
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-center -mt-12 mb-4">
                  <Image src="https://picsum.photos/64?random=2" alt="User profile" width={64} height={64} className="rounded-full mx-auto border-4 border-white" />
                </div>
                <h3 className="font-semibold text-center text-linkedin-text">Sarah Johnson</h3>
                <p className="text-sm text-linkedin-gray text-center mb-4">
                  Senior Financial Analyst
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-linkedin-gray">Profile viewers</span>
                    <span className="font-semibold">128</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-linkedin-gray">Post impressions</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                </div>
              </div>

              {/* Recent Analysis */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h4 className="font-semibold mb-3">Recent Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-chart-line text-linkedin-blue"></i>
                    <span className="text-sm">Q4 Market Trends Report</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-file-invoice-dollar text-linkedin-blue"></i>
                    <span className="text-sm">Portfolio Performance Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-balance-scale text-linkedin-blue"></i>
                    <span className="text-sm">Risk Assessment Framework</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-4">
              {/* Create Post */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex space-x-4 mb-4">
                  <Image src="https://picsum.photos/48?random=3" alt="User avatar" width={48} height={48} className="rounded-full" />
                  <button className="flex-1 text-left px-4 py-2 bg-linkedin-bg rounded-full text-linkedin-gray hover:bg-gray-200">
                    Share financial analysis, market insights...
                  </button>
                </div>
                <div className="flex justify-between text-linkedin-gray">
                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-linkedin-bg rounded">
                    <i className="fas fa-chart-bar text-linkedin-blue"></i>
                    <span>Analysis</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-linkedin-bg rounded">
                    <i className="fas fa-file-alt text-green-500"></i>
                    <span>Report</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-linkedin-bg rounded">
                    <i className="fas fa-poll text-purple-500"></i>
                    <span>Survey</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-linkedin-bg rounded">
                    <i className="fas fa-calendar-alt text-orange-500"></i>
                    <span>Event</span>
                  </button>
                </div>
              </div>

              {/* Example Feed Post */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Image src="https://picsum.photos/48?random=4" alt="User avatar" width={40} height={40} className="rounded-full" />
                    <div>
                      <h4 className="font-semibold">Michael Chen</h4>
                      <p className="text-sm text-linkedin-gray">Portfolio Manager • 2h ago</p>
                    </div>
                  </div>
                  <p className="mb-4">
                    Just published my latest market analysis on emerging market opportunities in Southeast Asia.
                    Key findings suggest strong growth potential in tech and renewable energy sectors.
                  </p>
                  <div className="bg-linkedin-bg p-4 rounded-lg mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="fas fa-chart-line text-linkedin-blue"></i>
                      <span className="font-semibold">Market Analysis: Southeast Asia Q3 2024</span>
                    </div>
                    <p className="text-sm text-linkedin-gray">
                      Comprehensive analysis of investment opportunities, risk factors, and growth projections across key markets.
                    </p>
                  </div>
                  <div className="flex justify-between text-linkedin-gray text-sm">
                    <button className="flex items-center space-x-1 hover:text-linkedin-blue">
                      <i className="far fa-thumbs-up"></i>
                      <span>124</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-linkedin-blue">
                      <i className="far fa-comment"></i>
                      <span>37</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-linkedin-blue">
                      <i className="far fa-share-square"></i>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h4 className="font-semibold mb-3">Trending in Finance</h4>
                <ul className="space-y-2 text-sm text-linkedin-gray">
                  <li>#InflationTrends 2024</li>
                  <li>#RenewableEnergyInvestments</li>
                  <li>#AIinFinance</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
