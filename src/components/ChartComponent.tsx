import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ChartComponentProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  xAxisKey?: string;
  yAxisKey?: string;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', 
  '#ff0000', '#00ffff', '#ff00ff', '#ffff00', '#000080'
];

export const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  type,
  title,
  xAxisKey = 'name',
  yAxisKey = 'value',
  colors = DEFAULT_COLORS
}) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxisKey} fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yAxisKey} stroke={colors[0]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={yAxisKey} stroke={colors[0]} fill={colors[0]} fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={yAxisKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        ?? {title}
      </h3>
      {data.length > 0 ? (
        renderChart()
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">??</div>
          <p>No data available for chart</p>
        </div>
      )}
    </div>
  );
};

// Analytics utilities
export const generateChartData = (
  sheetData: any[][],
  xColumn: number,
  yColumn: number,
  maxItems: number = 10
): ChartData[] => {
  if (!sheetData || sheetData.length < 2) return [];

  const headers = sheetData[0];
  const rows = sheetData.slice(1);

  // Group and aggregate data
  const dataMap = new Map<string, number>();
  
  rows.forEach(row => {
    if (row[xColumn] !== undefined && row[yColumn] !== undefined) {
      const key = String(row[xColumn]);
      const value = parseFloat(String(row[yColumn])) || 0;
      
      if (dataMap.has(key)) {
        dataMap.set(key, dataMap.get(key)! + value);
      } else {
        dataMap.set(key, value);
      }
    }
  });

  // Convert to chart data and limit items
  const chartData = Array.from(dataMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, maxItems);

  return chartData;
};

export const detectChartableColumns = (sheetData: any[][]) => {
  if (!sheetData || sheetData.length < 2) return { textColumns: [], numberColumns: [] };

  const headers = sheetData[0];
  const rows = sheetData.slice(1);
  
  const textColumns: number[] = [];
  const numberColumns: number[] = [];

  headers.forEach((header, index) => {
    const sampleValues = rows.slice(0, 10).map(row => row[index]);
    const numberValues = sampleValues.filter(val => !isNaN(parseFloat(String(val))));
    
    if (numberValues.length > sampleValues.length * 0.7) {
      numberColumns.push(index);
    } else {
      textColumns.push(index);
    }
  });

  return { textColumns, numberColumns };
};