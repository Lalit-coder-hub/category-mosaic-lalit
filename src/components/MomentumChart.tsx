import { TrendScored } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface MomentumChartProps {
  trend: TrendScored;
}

export function MomentumChart({ trend }: MomentumChartProps) {
  // Build 6-month data: months 4,5,6 are earlier months, 1,2,3 are the recent trailing
  const m4 = trend.month4 || Math.round(trend.month1 * 0.7);
  const m5 = trend.month5 || Math.round(trend.month1 * 0.8);
  const m6 = trend.month6 || Math.round(trend.month1 * 0.9);

  const rawValues = [m4, m5, m6, trend.month1, trend.month2, trend.month3];
  const maxVal = Math.max(...rawValues);

  const data = [
    { month: 'Month 1', value: Math.round((rawValues[0] / maxVal) * 100) },
    { month: 'Month 2', value: Math.round((rawValues[1] / maxVal) * 100) },
    { month: 'Month 3', value: Math.round((rawValues[2] / maxVal) * 100) },
    { month: 'Month 4', value: Math.round((rawValues[3] / maxVal) * 100) },
    { month: 'Month 5', value: Math.round((rawValues[4] / maxVal) * 100) },
    { month: 'Month 6', value: Math.round((rawValues[5] / maxVal) * 100) },
  ];

  return (
    <div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(220, 20%, 18%)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(221, 39%, 11%)',
                border: '1px solid hsl(220, 20%, 18%)',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'hsl(210, 20%, 90%)',
              }}
              formatter={(value: number) => [`${value}`, 'Interest Index']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(173, 80%, 40%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(173, 80%, 40%)', r: 3 }}
              activeDot={{ r: 5, fill: 'hsl(173, 80%, 40%)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">
        Momentum reflects acceleration in consumer interest for this trend.
      </p>
    </div>
  );
}
