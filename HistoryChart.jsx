import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function HistoryChart({ history }) {
  // Process history data for charts
  const chartData = history.map(entry => ({
    ...entry,
    date: new Date(entry.timestamp).toLocaleDateString(),
    time: new Date(entry.timestamp).toLocaleTimeString(),
    promptLength: entry.prompt.length,
    resultLength: entry.result.length
  }));

  // Count skills by type (extract skill name from prompt)
  const skillCounts = history.reduce((acc, entry) => {
    const skillName = entry.prompt.includes('Weekly Industry Brief') ? 'Weekly Industry Brief' :
                     entry.prompt.includes('Competitor Comparison') ? 'Competitor Comparison' : 'Other';
    acc[skillName] = (acc[skillName] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(skillCounts).map(([name, value]) => ({
    name,
    value
  }));

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="space-y-6">
      {/* Activity Over Time Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Skill Usage Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name === 'promptLength' ? 'Prompt Length' : 'Result Length']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="promptLength" 
              stroke="#8884d8" 
              name="Prompt Length"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="resultLength" 
              stroke="#82ca9d" 
              name="Result Length"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Distribution Pie Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Skill Usage Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{history.length}</div>
            <div className="text-sm text-gray-600">Total Executions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {history.length > 0 ? new Date(history[0].timestamp).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Latest Execution</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {history.length > 0 ? Math.round(history.reduce((sum, entry) => sum + entry.prompt.length, 0) / history.length) : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Prompt Length</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {history.length > 0 ? Math.round(history.reduce((sum, entry) => sum + entry.result.length, 0) / history.length) : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Result Length</div>
          </div>
        </div>
      </div>
    </div>
  );
} 