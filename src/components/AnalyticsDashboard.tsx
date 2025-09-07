import React, { useMemo } from 'react';
import { ChartComponent, generateChartData, detectChartableColumns, ChartData } from './ChartComponent';

interface AnalyticsDashboardProps {
  fileSessions: Array<{
    id: string;
    fileName: string;
    sheets: { [key: string]: any[][] };
    uploadedAt?: any;
  }>;
  activeFile?: {
    id: string;
    fileName: string;
    sheets: { [key: string]: any[][] };
  } | null;
  activeSheetName?: string | null;
}

interface DataStats {
  totalRows: number;
  totalColumns: number;
  numericColumns: number;
  textColumns: number;
  emptyRows: number;
  completeness: number;
}

interface ColumnStats {
  name: string;
  type: 'number' | 'text' | 'mixed';
  uniqueValues: number;
  nullCount: number;
  min?: number;
  max?: number;
  avg?: number;
  sum?: number;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  fileSessions,
  activeFile,
  activeSheetName
}) => {
  // Overall statistics
  const overallStats = useMemo(() => {
    const totalFiles = fileSessions.length;
    const totalSheets = fileSessions.reduce((sum, file) => sum + Object.keys(file.sheets).length, 0);
    const totalRows = fileSessions.reduce((sum, file) => {
      return sum + Object.values(file.sheets).reduce((sheetSum, sheet) => sheetSum + Math.max(0, sheet.length - 1), 0);
    }, 0);

    return { totalFiles, totalSheets, totalRows };
  }, [fileSessions]);

  // Active sheet statistics
  const sheetStats = useMemo((): DataStats | null => {
    if (!activeFile || !activeSheetName || !activeFile.sheets[activeSheetName]) {
      return null;
    }

    const sheetData = activeFile.sheets[activeSheetName];
    if (sheetData.length === 0) return null;

    const headers = sheetData[0];
    const rows = sheetData.slice(1);
    
    const totalRows = rows.length;
    const totalColumns = headers.length;
    
    let numericColumns = 0;
    let textColumns = 0;
    let emptyRows = 0;

    // Analyze columns
    headers.forEach((header, colIndex) => {
      const columnValues = rows.map(row => row[colIndex]);
      const numericValues = columnValues.filter(val => !isNaN(parseFloat(String(val))));
      
      if (numericValues.length > columnValues.length * 0.7) {
        numericColumns++;
      } else {
        textColumns++;
      }
    });

    // Count empty rows
    rows.forEach(row => {
      const filledCells = row.filter(cell => cell !== null && cell !== undefined && cell !== '');
      if (filledCells.length === 0) emptyRows++;
    });

    const completeness = totalRows > 0 ? ((totalRows - emptyRows) / totalRows) * 100 : 0;

    return {
      totalRows,
      totalColumns,
      numericColumns,
      textColumns,
      emptyRows,
      completeness
    };
  }, [activeFile, activeSheetName]);

  // Column-wise statistics
  const columnStats = useMemo((): ColumnStats[] => {
    if (!activeFile || !activeSheetName || !activeFile.sheets[activeSheetName]) {
      return [];
    }

    const sheetData = activeFile.sheets[activeSheetName];
    if (sheetData.length < 2) return [];

    const headers = sheetData[0];
    const rows = sheetData.slice(1);

    return headers.map((header, colIndex) => {
      const columnValues = rows.map(row => row[colIndex]).filter(val => val !== null && val !== undefined && val !== '');
      const uniqueValues = new Set(columnValues).size;
      const nullCount = rows.length - columnValues.length;
      
      const numericValues = columnValues
        .map(val => parseFloat(String(val)))
        .filter(val => !isNaN(val));

      const isNumeric = numericValues.length > columnValues.length * 0.7;
      
      let stats: ColumnStats = {
        name: String(header),
        type: isNumeric ? 'number' : columnValues.length > 0 ? 'text' : 'mixed',
        uniqueValues,
        nullCount
      };

      if (isNumeric && numericValues.length > 0) {
        stats.min = Math.min(...numericValues);
        stats.max = Math.max(...numericValues);
        stats.avg = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
        stats.sum = numericValues.reduce((sum, val) => sum + val, 0);
      }

      return stats;
    });
  }, [activeFile, activeSheetName]);

  // Generate charts for numeric columns
  const chartData = useMemo(() => {
    if (!activeFile || !activeSheetName || !activeFile.sheets[activeSheetName]) {
      return [];
    }

    const sheetData = activeFile.sheets[activeSheetName];
    const { textColumns, numberColumns } = detectChartableColumns(sheetData);
    
    const charts: Array<{ title: string; data: ChartData[]; type: 'bar' | 'pie' | 'line' }> = [];

    // Create charts for combinations of text and number columns
    textColumns.slice(0, 2).forEach(textCol => {
      numberColumns.slice(0, 3).forEach(numCol => {
        const data = generateChartData(sheetData, textCol, numCol, 8);
        if (data.length > 0) {
          charts.push({
            title: `${sheetData[0][textCol]} vs ${sheetData[0][numCol]}`,
            data,
            type: 'bar'
          });
        }
      });
    });

    // Add pie chart for first text column if available
    if (textColumns.length > 0 && numberColumns.length > 0) {
      const pieData = generateChartData(sheetData, textColumns[0], numberColumns[0], 6);
      if (pieData.length > 0) {
        charts.push({
          title: `Distribution: ${sheetData[0][textColumns[0]]}`,
          data: pieData,
          type: 'pie'
        });
      }
    }

    return charts.slice(0, 4); // Limit to 4 charts
  }, [activeFile, activeSheetName]);

  // Files over time chart
  const filesOverTime = useMemo(() => {
    const filesByDate = fileSessions.reduce((acc, file) => {
      if (file.uploadedAt) {
        const date = new Date(file.uploadedAt.seconds * 1000).toDateString();
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(filesByDate)
      .map(([date, count]) => ({ name: date, value: count }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [fileSessions]);

  if (!activeFile && fileSessions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">??</div>
        <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
        <p className="text-gray-600">Upload some files to see analytics and insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          ?? Analytics Dashboard
        </h1>
        <p className="text-gray-600">Insights and statistics from your data</p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Files</p>
              <p className="text-3xl font-bold">{overallStats.totalFiles}</p>
            </div>
            <div className="text-4xl opacity-80">??</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Sheets</p>
              <p className="text-3xl font-bold">{overallStats.totalSheets}</p>
            </div>
            <div className="text-4xl opacity-80">??</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Rows</p>
              <p className="text-3xl font-bold">{overallStats.totalRows.toLocaleString()}</p>
            </div>
            <div className="text-4xl opacity-80">??</div>
          </div>
        </div>
      </div>

      {/* Files Over Time Chart */}
      {filesOverTime.length > 0 && (
        <ChartComponent
          data={filesOverTime}
          type="line"
          title="Files Uploaded Over Time"
        />
      )}

      {/* Active Sheet Analysis */}
      {activeFile && activeSheetName && sheetStats && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              ?? Current Sheet Analysis: {activeSheetName}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{sheetStats.totalRows}</div>
                <div className="text-sm text-gray-600">Rows</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{sheetStats.totalColumns}</div>
                <div className="text-sm text-gray-600">Columns</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{sheetStats.numericColumns}</div>
                <div className="text-sm text-gray-600">Numeric</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{sheetStats.completeness.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>

          {/* Column Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ?? Column Statistics
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Column</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Type</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Unique Values</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Null Count</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Min</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Max</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Average</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Sum</th>
                  </tr>
                </thead>
                <tbody>
                  {columnStats.map((stat, index) => (
                    <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="py-2 px-3 font-medium">{stat.name}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          stat.type === 'number' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {stat.type}
                        </span>
                      </td>
                      <td className="py-2 px-3">{stat.uniqueValues}</td>
                      <td className="py-2 px-3">{stat.nullCount}</td>
                      <td className="py-2 px-3">{stat.min !== undefined ? stat.min.toFixed(2) : '-'}</td>
                      <td className="py-2 px-3">{stat.max !== undefined ? stat.max.toFixed(2) : '-'}</td>
                      <td className="py-2 px-3">{stat.avg !== undefined ? stat.avg.toFixed(2) : '-'}</td>
                      <td className="py-2 px-3">{stat.sum !== undefined ? stat.sum.toFixed(2) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chartData.map((chart, index) => (
                <ChartComponent
                  key={index}
                  data={chart.data}
                  type={chart.type}
                  title={chart.title}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};