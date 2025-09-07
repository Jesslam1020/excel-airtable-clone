// filepath: src/app/page.tsx
'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

// --- Type Definitions ---
type SheetData = any[][];
type Sheets = { [key: string]: SheetData };
type FileSession = {
  id: string;
  fileName: string;
  sheets: Sheets;
};

type Relationship = {
  id: string;
  source: { fileId: string; sheetName: string; columnName: string; };
  target: { fileId: string; sheetName: string; columnName: string; };
};

type GlobalSearchResult = {
  fileId: string;
  fileName: string;
  sheetName: string;
  headerRow: any[];
  matchingRows: any[][];
};

// --- Helper Components ---
const DataTable = ({ headers, rows }: { headers: any[], rows: any[][] }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="py-2 px-4 border-b text-left font-semibold text-gray-700 sticky top-0 bg-gray-100">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="py-2 px-4 border-b border-gray-200">
                {String(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RelationshipManagerModal = ({
  isOpen,
  onClose,
  fileSessions,
  relationships,
  onAddRelationship,
  onDeleteRelationship,
}: {
  isOpen: boolean;
  onClose: () => void;
  fileSessions: FileSession[];
  relationships: Relationship[];
  onAddRelationship: (relationship: Omit<Relationship, 'id'>) => void;
  onDeleteRelationship: (id: string) => void;
}) => {
  const [sourceFileId, setSourceFileId] = useState('');
  const [sourceSheetName, setSourceSheetName] = useState('');
  const [sourceColumnName, setSourceColumnName] = useState('');
  const [targetFileId, setTargetFileId] = useState('');
  const [targetSheetName, setTargetSheetName] = useState('');
  const [targetColumnName, setTargetColumnName] = useState('');

  const sourceSheets = useMemo(() => fileSessions.find(f => f.id === sourceFileId)?.sheets || {}, [fileSessions, sourceFileId]);
  const sourceColumns = useMemo(() => sourceSheets[sourceSheetName]?.[0] || [], [sourceSheets, sourceSheetName]);
  const targetSheets = useMemo(() => fileSessions.find(f => f.id === targetFileId)?.sheets || {}, [fileSessions, targetFileId]);
  const targetColumns = useMemo(() => targetSheets[targetSheetName]?.[0] || [], [targetSheets, targetSheetName]);

  useEffect(() => { setSourceSheetName(''); setSourceColumnName(''); }, [sourceFileId]);
  useEffect(() => { setSourceColumnName(''); }, [sourceSheetName]);
  useEffect(() => { setTargetSheetName(''); setTargetColumnName(''); }, [targetFileId]);
  useEffect(() => { setTargetColumnName(''); }, [targetSheetName]);

  const handleSubmit = () => {
    if (!sourceFileId || !sourceSheetName || !sourceColumnName || !targetFileId || !targetSheetName || !targetColumnName) {
      alert('Please fill out all fields.');
      return;
    }
    onAddRelationship({
      source: { fileId: sourceFileId, sheetName: sourceSheetName, columnName: sourceColumnName },
      target: { fileId: targetFileId, sheetName: targetSheetName, columnName: targetColumnName },
    });
    setSourceFileId(''); setTargetFileId('');
  };

  if (!isOpen) return null;

  const getFileName = (id: string) => fileSessions.find(f => f.id === id)?.fileName || 'N/A';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Manage Relationships</h2>
        <div className="grid grid-cols-2 gap-8 border-b pb-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Source (e.g., "Foreign Key" Table)</h3>
            <select value={sourceFileId} onChange={e => setSourceFileId(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Select Source File</option>
              {fileSessions.map(f => <option key={f.id} value={f.id}>{f.fileName}</option>)}
            </select>
            <select value={sourceSheetName} onChange={e => setSourceSheetName(e.target.value)} className="w-full p-2 border rounded" disabled={!sourceFileId}>
              <option value="">Select Source Sheet</option>
              {Object.keys(sourceSheets).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <select value={sourceColumnName} onChange={e => setSourceColumnName(e.target.value)} className="w-full p-2 border rounded" disabled={!sourceSheetName}>
              <option value="">Select Source Column</option>
              {sourceColumns.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Target (e.g., "Primary Key" Table)</h3>
            <select value={targetFileId} onChange={e => setTargetFileId(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Select Target File</option>
              {fileSessions.map(f => <option key={f.id} value={f.id}>{f.fileName}</option>)}
            </select>
            <select value={targetSheetName} onChange={e => setTargetSheetName(e.target.value)} className="w-full p-2 border rounded" disabled={!targetFileId}>
              <option value="">Select Target Sheet</option>
              {Object.keys(targetSheets).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <select value={targetColumnName} onChange={e => setTargetColumnName(e.target.value)} className="w-full p-2 border rounded" disabled={!targetSheetName}>
              <option value="">Select Target Column</option>
              {targetColumns.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end mb-6">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Add Relationship</button>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Existing Relationships</h3>
          {relationships.length === 0 ? <p className="text-gray-500">No relationships defined yet.</p> : (
            relationships.map(rel => (
              <div key={rel.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <p className="text-sm">
                  <span className="font-bold">{getFileName(rel.source.fileId)}</span>::{rel.source.sheetName}::{rel.source.columnName}
                  <span className="mx-2">&rarr;</span>
                  <span className="font-bold">{getFileName(rel.target.fileId)}</span>::{rel.target.sheetName}::{rel.target.columnName}
                </p>
                <button onClick={() => onDeleteRelationship(rel.id)} className="text-red-500 hover:text-red-700">Delete</button>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end mt-8">
          <button onClick={onClose} className="px-6 py-2 border rounded hover:bg-gray-100">Close</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function Home() {
  // --- State Management ---
  const [fileSessions, setFileSessions] = useState<FileSession[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeSheetName, setActiveSheetName] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Memoized Values ---
  const activeFile = useMemo(() => {
    return fileSessions.find(session => session.id === activeFileId) || null;
  }, [fileSessions, activeFileId]);

  const filteredLocalData = useMemo(() => {
    if (!activeFile || !activeSheetName || !activeFile.sheets[activeSheetName]) {
      return { headers: [], rows: [] };
    }
    const data = activeFile.sheets[activeSheetName];
    if (data.length < 1) return { headers: [], rows: [] };
    const headers = data[0];
    let rows = data.slice(1);
    if (localSearchTerm) {
      const lowercasedSearchTerm = localSearchTerm.toLowerCase();
      rows = rows.filter(row =>
        row.some(cell =>
          cell?.toString().toLowerCase().includes(lowercasedSearchTerm)
        )
      );
    }
    return { headers, rows };
  }, [activeFile, activeSheetName, localSearchTerm]);

  const globalSearchResults = useMemo(() => {
    if (!globalSearchTerm) return [];
    const results: GlobalSearchResult[] = [];
    const lowercasedSearchTerm = globalSearchTerm.toLowerCase();
    fileSessions.forEach(session => {
      Object.keys(session.sheets).forEach(sheetName => {
        const sheetData = session.sheets[sheetName];
        if (sheetData.length < 1) return;
        const headerRow = sheetData[0];
        const rows = sheetData.slice(1);
        const matchingRows = rows.filter(row => 
          row.some(cell => cell?.toString().toLowerCase().includes(lowercasedSearchTerm))
        );
        if (matchingRows.length > 0) {
          results.push({
            fileId: session.id,
            fileName: session.fileName,
            sheetName: sheetName,
            headerRow: headerRow,
            matchingRows: matchingRows,
          });
        }
      });
    });
    return results;
  }, [fileSessions, globalSearchTerm]);

  // --- Callbacks ---
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        const newSession: FileSession = {
          id: `${file.name}-${new Date().getTime()}`,
          fileName: file.name,
          sheets: data.sheets,
        };
        setFileSessions(prev => [...prev, newSession]);
        setActiveFileId(newSession.id);
        const firstSheetName = Object.keys(data.sheets)[0];
        setActiveSheetName(firstSheetName);
        setLocalSearchTerm('');
        setGlobalSearchTerm('');
      } else {
        setError(data.error || 'Failed to process the file.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId);
    const file = fileSessions.find(s => s.id === fileId);
    if (file) {
      const firstSheetName = Object.keys(file.sheets)[0];
      setActiveSheetName(firstSheetName);
    }
    setLocalSearchTerm('');
  };

  const handleAddRelationship = (relationship: Omit<Relationship, 'id'>) => {
    const newRelationship = { ...relationship, id: `rel-${new Date().getTime()}` };
    setRelationships(prev => [...prev, newRelationship]);
  };

  const handleDeleteRelationship = (id: string) => {
    setRelationships(prev => prev.filter(rel => rel.id !== id));
  };

  // --- Render Logic ---
  return (
    <>
      <RelationshipManagerModal 
        isOpen={isRelationshipModalOpen}
        onClose={() => setIsRelationshipModalOpen(false)}
        fileSessions={fileSessions}
        relationships={relationships}
        onAddRelationship={handleAddRelationship}
        onDeleteRelationship={handleDeleteRelationship}
      />
      <main className="flex h-screen flex-col bg-gray-100">
        <header className="p-4 border-b bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Excel Database Manager</h1>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 bg-gray-50 border-r p-4 overflow-y-auto flex-shrink-0">
            <div
              {...getRootProps()}
              className={`p-6 mb-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              {isLoading ? (
                <p className="text-sm text-gray-600">Processing...</p>
              ) : (
                <p className="text-sm text-gray-600">Drop a new file or click here</p>
              )}
            </div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Loaded Files</h2>
            {fileSessions.length === 0 ? (
              <p className="text-sm text-gray-500">No files uploaded yet.</p>
            ) : (
              <ul>
                {fileSessions.map(session => (
                  <li key={session.id}>
                    <button
                      onClick={() => handleFileSelect(session.id)}
                      className={`w-full text-left p-2 rounded text-sm ${
                        activeFileId === session.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                      }`}
                    >
                      {session.fileName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 border-t pt-4">
               <button 
                onClick={() => setIsRelationshipModalOpen(true)}
                className="w-full bg-gray-600 text-white p-2 rounded text-sm hover:bg-gray-700"
               >
                 Manage Relationships
               </button>
            </div>
          </aside>
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search across all files and sheets..."
                value={globalSearchTerm}
                onChange={e => setGlobalSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex-1 bg-white p-4 rounded-lg shadow-inner overflow-auto">
              {globalSearchTerm ? (
                <div>
                  <h2 className="text-xl font-bold mb-4">Global Search Results for "{globalSearchTerm}"</h2>
                  {globalSearchResults.length > 0 ? (
                    <div className="space-y-6">
                      {globalSearchResults.map(result => (
                        <div key={`${result.fileId}-${result.sheetName}`}>
                          <h3 className="font-semibold text-md mb-2">
                            <span className="font-bold text-blue-600">{result.fileName}</span> / {result.sheetName}
                          </h3>
                          <DataTable headers={result.headerRow} rows={result.matchingRows} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No results found across all files.</p>
                  )}
                </div>
              ) : activeFile ? (
                <div>
                  <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      {Object.keys(activeFile.sheets).map(sheetName => (
                        <button
                          key={sheetName}
                          onClick={() => setActiveSheetName(sheetName)}
                          className={`${
                            activeSheetName === sheetName
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm`}
                        >
                          {sheetName}
                        </button>
                      ))}
                    </nav>
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder={`Search in ${activeSheetName}...`}
                      value={localSearchTerm}
                      onChange={e => setLocalSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  {filteredLocalData && filteredLocalData.rows.length > 0 ? (
                    <DataTable headers={filteredLocalData.headers} rows={filteredLocalData.rows} />
                  ) : (
                    <p>
                      {localSearchTerm 
                        ? `No results found for "${localSearchTerm}" in this sheet.`
                        : `This sheet is empty or has no data rows.`}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 pt-10">
                  <p>Welcome to your Excel Database Manager.</p>
                  <p>Upload a file on the left to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
