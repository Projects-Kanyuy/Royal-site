// src/pages/admin/AnalyticsDashboard.js
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import apiClient from "../../api/axios";
import {
  Users,
  Vote,
  DollarSign,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Color palette
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
const PAYMENT_METHOD_COLORS = {
  fapshi: "#0088FE",
  Banknote: "#00C49F",
  bank_transfer: "#FFBB28",
  mobile_money: "#FF8042",
};

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const { data } = await apiClient.get(
        `/api/admin/analytics?range=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`, // ← ADD SPACE HERE
          },
        }
      );
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch analytics data");
      console.error("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleExport = () => {
    // Basic export functionality
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={fetchAnalytics} />;

  return (
    <div className="space-y-6 mt-8 animate-fade-in">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">Real-time voting and revenue insights</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>

          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Total Artists"
          value={analytics.totalArtists}
          change={null}
          loading={loading}
        />

        <MetricCard
          icon={<Vote className="w-6 h-6 text-green-600" />}
          title="Total Votes"
          value={analytics.totalVotes || 0}
          change={null}
          loading={loading}
        />

        <MetricCard
          icon={<CreditCard className="w-6 h-6 text-purple-600" />}
          title="Online Revenue"
          value={`${(analytics.onlineRevenue || 0).toLocaleString()} XAF`}
          change={null}
          loading={loading}
        />

        <MetricCard
          icon={<Banknote className="w-6 h-6 text-orange-600" />}
          title="Manual Revenue"
          value={`${(analytics.manualRevenue || 0).toLocaleString()} XAF`}
          change={null}
          loading={loading}
        />
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue Breakdown"
          icon={<BarChart3 className="w-5 h-5" />}
        >
          <RevenuePieChart data={analytics} />
        </ChartCard>

        <ChartCard
          title="Vote Distribution"
          icon={<PieChart className="w-5 h-5" />}
        >
          <VoteDistributionChart data={analytics} />
        </ChartCard>
      </div>

      {/* Trends Section */}
      <ChartCard
        title="Voting Trends Over Time"
        icon={<Calendar className="w-5 h-5" />}
        fullWidth
      >
        <VotingTrendsChart data={analytics} />
      </ChartCard>

      {/* Transactions Section */}
      {/* not need now */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionSection
          title="Online Payments"
          icon={<CreditCard className="w-5 h-5" />}
          data={analytics.paymentStats}
          type="online"
        />

        <TransactionSection
          title="Manual Votes"
          icon={<Banknote className="w-5 h-5" />}
          data={analytics.manualVoteStats}
          type="manual"
        />
      </div> */}
    </div>
  );
};

// ==================== SUPPORTING COMPONENTS ====================

const MetricCard = ({ icon, title, value, change, loading }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
      {change && (
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            change.isPositive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {change.isPositive ? "↑" : "↓"} {change.value}%
        </span>
      )}
    </div>

    <div className="space-y-1">
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">
        {loading ? "--" : value}
      </p>
    </div>
  </div>
);

const ChartCard = ({ title, icon, children, fullWidth = false }) => (
  <div
    className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${
      fullWidth ? "col-span-1 lg:col-span-2" : ""
    }`}
  >
    <div className="flex items-center gap-2 mb-6">
      {icon}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="h-80">{children}</div>
  </div>
);

const RevenuePieChart = ({ data }) => {
  // Use the main revenue values, not transaction amounts
  const onlineRevenue = data.onlineRevenue || 0;
  const manualRevenue = data.manualRevenue || 0;
  const totalRevenue = onlineRevenue + manualRevenue;

  const chartData = [
    { name: "Online Payments", value: onlineRevenue },
    { name: "Manual Votes", value: manualRevenue },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <AlertCircle className="w-8 h-8 mr-2" />
        No revenue data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value.toLocaleString()} XAF`, "Amount"]}
        />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  );
};

const VoteDistributionChart = ({ data }) => {
  const chartData = [
    { name: "Online Votes", value: data.voteStats?.totalCamPayVotes || 0 },
    { name: "Manual Votes", value: data.voteStats?.totalManualVotes || 0 },
    { name: "Hand Votes", value: data.voteStats?.totalHandVotes || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} votes`, "Votes"]} />
      </RePieChart>
    </ResponsiveContainer>
  );
};

const VotingTrendsChart = ({ data }) => {
  // This would use your time-based data from analytics.voteTrends
  const trendData =
    data.onlineVoteTrends?.map((trend) => ({
      date: trend._id,
      votes: trend.votes,
      revenue: trend.revenue,
    })) || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={trendData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [
            name === "votes" ? `${value} votes` : `${value} XAF`,
            name === "votes" ? "Votes" : "Revenue",
          ]}
        />
        <Legend />
        <Bar dataKey="votes" fill="#0088FE" name="Votes" />
        <Bar dataKey="revenue" fill="#00C49F" name="Revenue (XAF)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const TransactionSection = ({ title, icon, data, type }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center gap-2 mb-6">
      {icon}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>

    {!data || data.length === 0 ? (
      <div className="text-center py-12 text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No {type} transactions recorded</p>
      </div>
    ) : (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{item._id}</p>
              <p className="text-sm text-gray-600">
                {item.transactionCount} transactions
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{item.totalVotes} votes</p>
              <p className="text-sm text-gray-600">{item.totalAmount} XAF</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6 mt-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="text-center py-12">
    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
    <p className="text-red-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Try Again
    </button>
  </div>
);

export default AnalyticsDashboard;
