import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function GraficoPrioridades({ altas, medias, bajas }) {

  const data = [
    { name: "Alta", value: altas },
    { name: "Media", value: medias },
    { name: "Baja", value: bajas }
  ];

  const COLORS = ["#ff7a9e", "#ffbf69", "#90d7a7"];

  return (
    <div className="chart-shell">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={62}
            outerRadius={105}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(255,255,255,0.8)"
                strokeWidth={2}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: "14px",
              border: "1px solid #f8bbd0",
              boxShadow: "0 12px 32px rgba(236, 72, 153, 0.12)"
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoPrioridades;