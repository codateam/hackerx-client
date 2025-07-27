"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export function BarChart() {
  const data = [
    {
      name: "CSC426",
      performance: 8,
      average: 5,
    },
    {
      name: "CSC104",
      performance: 9,
      average: 4,
    },
    {
      name: "CSC446",
      performance: 10,
      average: 6,
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} barGap={8}>
          <XAxis
            dataKey="name"
            stroke="#32BA77"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#32BA77"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Bar
            dataKey="performance"
            fill="#32BA77"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Bar
            dataKey="average"
            fill="#a7f3d0"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
