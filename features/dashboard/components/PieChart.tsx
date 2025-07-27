"use client";

import { useState, useEffect } from "react";
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function PieChart() {
  const [windowReady, setWindowReady] = useState(false);

  useEffect(() => {
    setWindowReady(true);
  }, []);

  const data = [
    { name: "CSC426", value: 35, color: "#FF5656" },
    { name: "CSC104", value: 40, color: "#32BA77" },
    { name: "CSC446", value: 25, color: "#FBC11B" },
  ];

  if (!windowReady) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        Loading chart...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }} className="flex flex-col items-center">
      <div style={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-4 gap-6">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
