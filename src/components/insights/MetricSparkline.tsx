import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MetricSparklineProps {
  data: number[];
  color?: string;
}

export const MetricSparkline = ({ data, color = "hsl(var(--primary))" }: MetricSparklineProps) => {
  const chartData = data.map((value, index) => ({ week: index, value }));
  
  return (
    <ResponsiveContainer width="100%" height={24}>
      <LineChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};