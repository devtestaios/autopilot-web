import SimplifiedDashboard from '@/components/SimplifiedDashboard';

export default function HomePage() {
  return <SimplifiedDashboard />;
}
                <Bell className="h-4 w-4" />
                View All Alerts
              </Link>
            </div>

            {alertsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : alerts.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">All Systems Normal</h4>
                  <p className="text-black">No active alerts detected. Your campaigns are performing well!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {alert.severity === 'critical' ? (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          ) : alert.severity === 'high' ? (
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                          ) : (
                            <Bell className="h-5 w-5 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{alert.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              alert.severity === 'critical' 
                                ? 'bg-red-100 text-red-800' 
                                : alert.severity === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          {alert.campaignName && (
                            <p className="text-xs text-gray-500 mt-1">Campaign: {alert.campaignName}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {alerts.length > 0 && (
                  <div className="text-center pt-2">
                    <Link
                      href="/alerts"
                      className="text-orange-600 hover:text-orange-800 font-medium text-sm"
                    >
                      View {smartAlertEngine.getAlerts({ dismissed: false }).length - alerts.length > 0 
                        ? `${smartAlertEngine.getAlerts({ dismissed: false }).length - alerts.length} more alerts` 
                        : 'all alerts'} →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <GoogleAdsIntegration onSync={loadCampaigns} loading={loading} />
          </div>

          {/* Enhanced Performance Charts */}
          <div className="mt-8">
            <EnhancedPerformanceCharts loading={loading} />
          </div>

          <div className="mt-8">
            <GoogleAdsPerformanceDashboard campaigns={campaigns} />
          </div>

          <div className="mt-8">
            <CampaignOptimizationEngine campaigns={campaigns} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              <strong>Error:</strong> {error}
              <button 
                onClick={loadCampaigns}
                className="ml-4 text-red-600 underline hover:text-red-800"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Campaigns</h2>
              {campaigns.length > 6 && (
                <Link
                  href="/campaigns"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All →
                </Link>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first marketing campaign.</p>
                <Link
                  href="/campaigns/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Your First Campaign
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.slice(0, 6).map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onDelete={handleDeleteCampaign}
                    onEdit={(campaign) => {
                      window.location.href = `/campaigns/${campaign.id}/edit`;
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
