import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportOptions {
  fileName: string;
  data: any[][];
  format: 'csv' | 'json' | 'pdf';
}

export const exportData = async (options: ExportOptions) => {
  const { fileName, data, format } = options;
  
  switch (format) {
    case 'csv':
      exportToCSV(data, fileName);
      break;
    case 'json':
      exportToJSON(data, fileName);
      break;
    case 'pdf':
      exportToPDF(data, fileName);
      break;
  }
};

const exportToCSV = (data: any[][], fileName: string) => {
  const csvContent = data.map(row => 
    row.map(cell => {
      const cellStr = String(cell || '');
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return '"' + cellStr.replace(/"/g, '""') + '"';
      }
      return cellStr;
    }).join(',')
  ).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${fileName}.csv`);
};

const exportToJSON = (data: any[][], fileName: string) => {
  if (data.length === 0) return;

  const headers = data[0];
  const rows = data.slice(1);
  
  const jsonData = rows.map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  const jsonContent = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, `${fileName}.json`);
};

const exportToPDF = (data: any[][], fileName: string) => {
  const pdf = new jsPDF();
  
  // Add title
  pdf.setFontSize(16);
  pdf.text(fileName, 20, 20);
  
  if (data.length === 0) {
    pdf.text('No data to export', 20, 40);
  } else {
    const headers = data[0];
    const rows = data.slice(1);
    
    // Add table
    autoTable(pdf, {
      head: [headers],
      body: rows,
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue color
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251], // Light gray
      },
      margin: { top: 30, right: 20, bottom: 20, left: 20 },
    });
  }
  
  pdf.save(`${fileName}.pdf`);
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

interface ExportButtonProps {
  data: any[][];
  fileName: string;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  fileName, 
  className = "" 
}) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    setIsExporting(true);
    try {
      await exportData({ fileName, data, format });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 ${className}`}
      >
        {isExporting ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            Exporting...
          </>
        ) : (
          <>
            ?? Export
          </>
        )}
      </button>

      {showMenu && !isExporting && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
          <button
            onClick={() => handleExport('csv')}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-lg flex items-center gap-2"
          >
            ?? CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            ?? JSON
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-lg flex items-center gap-2"
          >
            ?? PDF
          </button>
        </div>
      )}
    </div>
  );
};