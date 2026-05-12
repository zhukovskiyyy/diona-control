import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const data = [
  { value: 22 },
  { value: 44 },
  { value: 36 },
  { value: 60 },
  { value: 48 },
  { value: 72 },
  { value: 64 },
  { value: 78 }
];

function SystemChart() {
  return (
    <div className="chart-panel">
      <div className="chart-header">
        <div>
          <h3>Infrastructure Load</h3>
          <p>Realtime monitoring preview</p>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#d54dff"
              strokeWidth={4}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SystemChart;