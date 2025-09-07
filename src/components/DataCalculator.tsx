import React, { useState, useMemo } from 'react';

interface CalculatorProps {
  sheetData: any[][];
  onClose: () => void;
}

interface CalculationResult {
  operation: string;
  column: string;
  result: number;
  count: number;
}

export const DataCalculator: React.FC<CalculatorProps> = ({ sheetData, onClose }) => {
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [selectedOperation, setSelectedOperation] = useState<'sum' | 'avg' | 'count' | 'min' | 'max'>('sum');
  const [results, setResults] = useState<CalculationResult[]>([]);

  const headers = sheetData.length > 0 ? sheetData[0] : [];
  const rows = sheetData.length > 1 ? sheetData.slice(1) : [];

  // Get numeric columns
  const numericColumns = useMemo(() => {
    return headers.map((header, index) => {
      const columnValues = rows.map(row => row[index]);
      const numericValues = columnValues.filter(val => !isNaN(parseFloat(String(val))));
      return {
        index,
        header: String(header),
        isNumeric: numericValues.length > columnValues.length * 0.7,
        numericCount: numericValues.length
      };
    }).filter(col => col.isNumeric);
  }, [headers, rows]);

  const calculateValue = () => {
    if (numericColumns.length === 0) return;

    const column = numericColumns.find(col => col.index === selectedColumn);
    if (!column) return;

    const columnValues = rows
      .map(row => parseFloat(String(row[selectedColumn])))
      .filter(val => !isNaN(val));

    if (columnValues.length === 0) return;

    let result: number;
    switch (selectedOperation) {
      case 'sum':
        result = columnValues.reduce((sum, val) => sum + val, 0);
        break;
      case 'avg':
        result = columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length;
        break;
      case 'count':
        result = columnValues.length;
        break;
      case 'min':
        result = Math.min(...columnValues);
        break;
      case 'max':
        result = Math.max(...columnValues);
        break;
      default:
        return;
    }

    const newResult: CalculationResult = {
      operation: selectedOperation.toUpperCase(),
      column: column.header,
      result,
      count: columnValues.length
    };

    setResults(prev => [newResult, ...prev].slice(0, 10)); // Keep last 10 results
  };

  const clearResults = () => {
    setResults([]);
  };

  const copyResult = (result: CalculationResult) => {
    navigator.clipboard.writeText(result.result.toString());
  };

  const exportResults = () => {
    const csvContent = [
      'Operation,Column,Result,Count',
      ...results.map(r => `${r.operation},${r.column},${r.result},${r.count}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculations.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            ?? Data Calculator
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        {numericColumns.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">??</div>
            <p className="text-xl text-gray-600">No numeric columns found</p>
            <p className="text-sm text-gray-500 mt-2">This sheet doesn't contain any numeric data to calculate</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Column
                </label>
                <select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {numericColumns.map(col => (
                    <option key={col.index} value={col.index}>
                      {col.header} ({col.numericCount} numeric values)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operation
                </label>
                <select
                  value={selectedOperation}
                  onChange={(e) => setSelectedOperation(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sum">SUM - Add all values</option>
                  <option value="avg">AVERAGE - Mean of all values</option>
                  <option value="count">COUNT - Number of values</option>
                  <option value="min">MIN - Smallest value</option>
                  <option value="max">MAX - Largest value</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={calculateValue}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  ?? Calculate
                </button>
                <button
                  onClick={clearResults}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Quick Stats */}
              {selectedColumn !== null && numericColumns.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {['sum', 'avg', 'count', 'min', 'max'].map(op => {
                      const columnValues = rows
                        .map(row => parseFloat(String(row[selectedColumn])))
                        .filter(val => !isNaN(val));
                      
                      let value: number;
                      switch (op) {
                        case 'sum':
                          value = columnValues.reduce((sum, val) => sum + val, 0);
                          break;
                        case 'avg':
                          value = columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length;
                          break;
                        case 'count':
                          value = columnValues.length;
                          break;
                        case 'min':
                          value = Math.min(...columnValues);
                          break;
                        case 'max':
                          value = Math.max(...columnValues);
                          break;
                        default:
                          value = 0;
                      }

                      return (
                        <div key={op} className="text-center">
                          <div className="font-bold text-lg">
                            {op === 'count' ? value : value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-gray-600 uppercase text-xs">{op}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Calculation History</h3>
                {results.length > 0 && (
                  <button
                    onClick={exportResults}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    ?? Export
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">??</div>
                  <p>No calculations yet</p>
                  <p className="text-sm mt-1">Select a column and operation to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {result.operation}({result.column})
                          </div>
                          <div className="text-2xl font-bold text-blue-600 my-1">
                            {result.result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                          </div>
                          <div className="text-sm text-gray-500">
                            Based on {result.count} values
                          </div>
                        </div>
                        <button
                          onClick={() => copyResult(result)}
                          className="text-gray-400 hover:text-gray-600 p-2"
                          title="Copy result"
                        >
                          ??
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};