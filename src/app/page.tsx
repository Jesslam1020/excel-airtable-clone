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
  uploadedAt?: any;
};

type Relationship = {
  id: string;
  source: { fileId: string; sheetName: string; columnName: string; };
  target: { fileId: string; sheetName: string; columnName: string; };
  createdAt?: any;
};

type GlobalSearchResult = {
  fileId: string;
  fileName: string;
  sheetName: string;
  headerRow: any[];
  matchingRows: any[][];
};

type FontSize = 'small' | 'medium' | 'large';
type Theme = 'light' | 'dark';

// --- Helper Components ---
const DataTable = ({ 
  headers, 
  rows, 
  fontSize, 
  searchTerm 
}: { 
  headers: any[], 
  rows: any[][],
  fontSize: FontSize,
  searchTerm?: string
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: number; direction: 'asc' | 'desc' } | null>(null);

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;
    
    return [...rows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  const handleSort = (columnIndex: number) => {
    setSortConfig(current => ({
      key: columnIndex,
      direction: current?.key === columnIndex && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const highlightText = (text: string, search?: string) => {
    if (!search || !text) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.toString().split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : part
    );
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-xs';
      case 'large': return 'text-base';
      default: return 'text-sm';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index}
                onClick={() => handleSort(index)}
                className={`py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700 sticky top-0 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors ${getFontSizeClass()}`}
              >
                <div className="flex items-center gap-2">
                  <span>{header}</span>
                  {sortConfig?.key === index && (
                    <span className="text-blue-500">
                      {sortConfig.direction === 'asc' ? '?' : '?'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`hover:bg-blue-50 transition-colors border-b border-dotted border-gray-200 ${
                rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              {row.map((cell, cellIndex) => (
                <td 
                  key={cellIndex} 
                  className={`py-2 px-4 border-r border-dotted border-gray-200 last:border-r-0 ${getFontSizeClass()}`}
                  title={String(cell)} // Tooltip for long content
                >
                  <div className="max-w-xs truncate">
                    {highlightText(String(cell), searchTerm)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedRows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data to display
        </div>
      )}
    </div>
  );
};

const FileCard = ({ 
  session, 
  isActive, 
  onSelect, 
  onDelete,
  onRename 
}: {
  session: FileSession;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(session.fileName);
  const [showMenu, setShowMenu] = useState(false);

  const handleRename = () => {
    if (newName.trim() !== session.fileName) {
      onRename(newName.trim());
    }
    setIsRenaming(false);
  };

  const getFileStats = () => {
    const totalRows = Object.values(session.sheets).reduce((sum, sheet) => sum + sheet.length - 1, 0);
    const totalSheets = Object.keys(session.sheets).length;
    return { totalRows, totalSheets };
  };

  const { totalRows, totalSheets } = getFileStats();

  return (
    <div className={`relative group ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'} rounded-lg transition-all duration-200`}>
      <button
        onClick={onSelect}
        className="w-full text-left p-3 rounded-lg"
      >
        {isRenaming ? (
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="w-full text-sm bg-white text-black rounded px-2 py-1"
            autoFocus
          />
        ) : (
          <>
            <div className="font-medium text-sm truncate" title={session.fileName}>
              {session.fileName}
            </div>
            <div className={`text-xs mt-1 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
              {totalSheets} sheet{totalSheets !== 1 ? 's' : ''} • {totalRows} row{totalRows !== 1 ? 's' : ''}
            </div>
            {session.uploadedAt && (
              <div className={`text-xs mt-1 ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                {new Date(session.uploadedAt.seconds * 1000).toLocaleDateString()}
              </div>
            )}
          </>
        )}
      </button>
      
      {/* Menu Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-opacity ${
          isActive ? 'text-white hover:bg-blue-400' : 'text-gray-400 hover:bg-gray-300'
        } ${showMenu || 'opacity-0 group-hover:opacity-100'}`}
      >
        ?
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-8 right-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
          <button
            onClick={() => {
              setIsRenaming(true);
              setShowMenu(false);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-t-lg"
          >
            ?? Rename
          </button>
          <button
            onClick={() => {
              onDelete();
              setShowMenu(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
          >
            ??? Delete
          </button>
        </div>
      )}
    </div>
  );
};

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
  onAddRelationship: (relationship: Omit<Relationship, 'id' | 'createdAt'>) => void;
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

  const handleSubmit = async () => {
    if (!sourceFileId || !sourceSheetName || !sourceColumnName || !targetFileId || !targetSheetName || !targetColumnName) {
      alert('Please fill out all fields.');
      return;
    }
    await onAddRelationship({
      source: { fileId: sourceFileId, sheetName: sourceSheetName, columnName: sourceColumnName },
      target: { fileId: targetFileId, sheetName: targetSheetName, columnName: targetColumnName },
    });
    setSourceFileId(''); setTargetFileId('');
  };
  
  if (!isOpen) return null;

  const getFileName = (id: string) => fileSessions.find(f => f.id === id)?.fileName || 'N/A';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">?? Manage Relationships</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        
        {/* Create Relationship Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b pb-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              ?? Source (Foreign Key)
            </h3>
            <select value={sourceFileId} onChange={e => setSourceFileId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Source File</option>
              {fileSessions.map(f => <option key={f.id} value={f.id}>{f.fileName}</option>)}
            </select>
            <select value={sourceSheetName} onChange={e => setSourceSheetName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!sourceFileId}>
              <option value="">Select Source Sheet</option>
              {Object.keys(sourceSheets).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <select value={sourceColumnName} onChange={e => setSourceColumnName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!sourceSheetName}>
              <option value="">Select Source Column</option>
              {sourceColumns.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              ?? Target (Primary Key)
            </h3>
            <select value={targetFileId} onChange={e => setTargetFileId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Target File</option>
              {fileSessions.map(f => <option key={f.id} value={f.id}>{f.fileName}</option>)}
            </select>
            <select value={targetSheetName} onChange={e => setTargetSheetName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!targetFileId}>
              <option value="">Select Target Sheet</option>
              {Object.keys(targetSheets).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <select value={targetColumnName} onChange={e => setTargetColumnName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!targetSheetName}>
              <option value="">Select Target Column</option>
              {targetColumns.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mb-6">
          <button 
            onClick={handleSubmit} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            ? Add Relationship
          </button>
        </div>

        {/* Existing Relationships List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            ?? Existing Relationships
          </h3>
          {relationships.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">??</div>
              <p>No relationships defined yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {relationships.map(rel => (
                <div key={rel.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      <span className="font-bold text-blue-600">{getFileName(rel.source.fileId)}</span>
                      <span className="text-gray-400 mx-2">?</span>
                      <span className="text-gray-600">{rel.source.sheetName}</span>
                      <span className="text-gray-400 mx-1">•</span>
                      <span className="text-gray-700">{rel.source.columnName}</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-400">connects to</span>
                      <span className="mx-2">??</span>
                      <span className="font-bold text-green-600">{getFileName(rel.target.fileId)}</span>
                      <span className="text-gray-400 mx-2">?</span>
                      <span className="text-gray-600">{rel.target.sheetName}</span>
                      <span className="text-gray-400 mx-1">•</span>
                      <span className="text-gray-700">{rel.target.columnName}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteRelationship(rel.id)} 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    ???
                  </button>
                </div>
              ))}
            </div>
          )}
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
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // New UI state
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [theme, setTheme] = useState<Theme>('light');

  // --- Load data from Firebase on mount ---
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('?? Loading data from Firebase...');
        
        const sessionsResponse = await fetch('/api/sessions');
        const sessionsData = await sessionsResponse.json();
        if (sessionsData.success) {
          setFileSessions(sessionsData.sessions);
          console.log('? File sessions loaded:', sessionsData.sessions.length);
        }

        const relationshipsResponse = await fetch('/api/relationships');
        const relationshipsData = await relationshipsResponse.json();
        if (relationshipsData.success) {
          setRelationships(relationshipsData.relationships);
          console.log('? Relationships loaded:', relationshipsData.relationships.length);
        }
      } catch (error) {
        console.error('? Error loading data:', error);
        setError('Error loading saved data. Please refresh the page.');
      }
    };

    loadData();
  }, []);

  // --- Memoized Values ---
  const activeFile = useMemo(() => {
    return fileSessions.find(session => session.id === activeFileId) || null;
  }, [fileSessions, activeFileId]);

  const filteredLocalData = useMemo(() => {
    if (!activeFile || !activeSheetName || !activeFile.sheets[activeSheetName]) {
      return null;
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

    console.log('?? File dropped:', file.name, 'Size:', file.size);

    setIsLoading(true);
    setError(null);
    setUploadProgress('Preparing file...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress('Uploading file...');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress('Processing response...');
      const data = await response.json();

      if (data.success) {
        const newSession: FileSession = {
          id: data.sessionId,
          fileName: file.name,
          sheets: data.sheets,
        };
        
        setFileSessions(prev => [newSession, ...prev]);
        setActiveFileId(newSession.id);
        const firstSheetName = Object.keys(data.sheets)[0];
        setActiveSheetName(firstSheetName);
        setLocalSearchTerm('');
        setGlobalSearchTerm('');
        setUploadProgress('');
        
        console.log('? File uploaded successfully!');
      } else {
        setError(data.error || 'Failed to process the file.');
      }
    } catch (err) {
      setError('Network error occurred. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress('');
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
    maxSize: 10 * 1024 * 1024,
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

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions?id=${fileId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setFileSessions(prev => prev.filter(session => session.id !== fileId));
        if (activeFileId === fileId) {
          setActiveFileId(null);
          setActiveSheetName(null);
        }
      } else {
        setError('Failed to delete file');
      }
    } catch (error) {
      setError('Error deleting file');
    }
  };

  const handleRenameFile = async (fileId: string, newName: string) => {
    try {
      const response = await fetch(`/api/sessions/${fileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: newName }),
      });
      const data = await response.json();

      if (data.success) {
        setFileSessions(prev => 
          prev.map(session => 
            session.id === fileId ? { ...session, fileName: newName } : session
          )
        );
      } else {
        setError('Failed to rename file');
      }
    } catch (error) {
      setError('Error renaming file');
    }
  };

  const handleAddRelationship = async (relationship: Omit<Relationship, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(relationship),
      });
      const data = await response.json();

      if (data.success) {
        const newRelationship = { ...relationship, id: data.relationshipId };
        setRelationships(prev => [newRelationship, ...prev]);
      } else {
        setError('Failed to save relationship');
      }
    } catch (error) {
      setError('Error adding relationship');
    }
  };

  const handleDeleteRelationship = async (id: string) => {
    try {
      const response = await fetch(`/api/relationships?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setRelationships(prev => prev.filter(rel => rel.id !== id));
      } else {
        setError('Failed to delete relationship');
      }
    } catch (error) {
      setError('Error deleting relationship');
    }
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
      <main className={`flex h-screen flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'} transition-colors duration-200`}>
        <header className={`p-4 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm transition-colors duration-200`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ?? Excel Database Manager
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and analyze your Excel files with ease
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Font Size Control */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Font:</span>
                <select 
                  value={fontSize} 
                  onChange={(e) => setFontSize(e.target.value as FontSize)}
                  className={`px-3 py-1 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} text-sm`}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {theme === 'light' ? '??' : '??'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="font-bold hover:bg-red-200 w-6 h-6 rounded-full flex items-center justify-center">
                ×
              </button>
            </div>
          )}
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <aside className={`w-80 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-4 overflow-y-auto flex-shrink-0 transition-colors duration-200`}>
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`p-6 mb-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 scale-105' 
                  : `border-gray-300 hover:border-blue-400 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
              }`}
            >
              <input {...getInputProps()} />
              {isLoading ? (
                <div className="text-blue-600">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full mb-3"></div>
                  <p className="text-sm font-medium">{uploadProgress || 'Processing...'}</p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-3">??</div>
                  <p className="text-sm font-medium text-gray-700">
                    {isDragActive 
                      ? 'Drop your file here!' 
                      : 'Drop Excel/CSV files or click to browse'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports .xlsx, .xls, .csv files up to 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Files List */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">?? Your Files</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {fileSessions.length}
                </span>
              </div>
              
              {fileSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">??</div>
                  <p className="text-sm">No files uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {fileSessions.map(session => (
                    <FileCard
                      key={session.id}
                      session={session}
                      isActive={activeFileId === session.id}
                      onSelect={() => handleFileSelect(session.id)}
                      onDelete={() => handleDeleteFile(session.id)}
                      onRename={(newName) => handleRenameFile(session.id, newName)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Relationships Button */}
            <button 
              onClick={() => setIsRelationshipModalOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              ?? Manage Relationships
              {relationships.length > 0 && (
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                  {relationships.length}
                </span>
              )}
            </button>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Global Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="?? Search across all files and sheets..."
                  value={globalSearchTerm}
                  onChange={e => setGlobalSearchTerm(e.target.value)}
                  className={`w-full p-4 pl-12 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ??
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm overflow-auto transition-colors duration-200`}>
              {globalSearchTerm ? (
                // Global Search Results
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    ?? Search Results for "{globalSearchTerm}"
                  </h2>
                  {globalSearchResults.length > 0 ? (
                    <div className="space-y-8">
                      {globalSearchResults.map(result => (
                        <div key={`${result.fileId}-${result.sheetName}`} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            ?? <span className="text-blue-600">{result.fileName}</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-600">{result.sheetName}</span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {result.matchingRows.length} result{result.matchingRows.length !== 1 ? 's' : ''}
                            </span>
                          </h3>
                          <DataTable 
                            headers={result.headerRow} 
                            rows={result.matchingRows} 
                            fontSize={fontSize}
                            searchTerm={globalSearchTerm}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <div className="text-6xl mb-4">??</div>
                      <p className="text-xl font-medium">No results found</p>
                      <p className="text-sm mt-2">Try a different search term</p>
                    </div>
                  )}
                </div>
              ) : activeFile ? (
                // Active File View
                <div>
                  {/* Sheet Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                        ?? {activeFile.fileName}
                      </h2>
                      <div className="text-sm text-gray-500">
                        {Object.keys(activeFile.sheets).length} sheet{Object.keys(activeFile.sheets).length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <nav className="-mb-px flex space-x-2 overflow-x-auto">
                      {Object.keys(activeFile.sheets).map(sheetName => (
                        <button
                          key={sheetName}
                          onClick={() => setActiveSheetName(sheetName)}
                          className={`whitespace-nowrap pb-3 px-4 border-b-2 font-medium text-sm transition-colors rounded-t-lg ${
                            activeSheetName === sheetName
                              ? 'border-blue-500 text-blue-600 bg-blue-50'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          ?? {sheetName}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Local Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={`?? Search in ${activeSheetName}...`}
                        value={localSearchTerm}
                        onChange={e => setLocalSearchTerm(e.target.value)}
                        className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        ??
                      </span>
                    </div>
                  </div>

                  {/* Data Table */}
                  {filteredLocalData && filteredLocalData.rows.length > 0 ? (
                    <div>
                      <div className="mb-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Showing {filteredLocalData.rows.length} row{filteredLocalData.rows.length !== 1 ? 's' : ''}
                          {localSearchTerm && ` matching "${localSearchTerm}"`}
                        </p>
                      </div>
                      <DataTable 
                        headers={filteredLocalData.headers} 
                        rows={filteredLocalData.rows} 
                        fontSize={fontSize}
                        searchTerm={localSearchTerm}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <div className="text-6xl mb-4">??</div>
                      <p className="text-xl font-medium">
                        {localSearchTerm 
                          ? `No results found for "${localSearchTerm}"`
                          : 'This sheet appears to be empty'}
                      </p>
                      {localSearchTerm && (
                        <p className="text-sm mt-2">Try a different search term</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Welcome View
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">??</div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome to Excel Database Manager
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">
                    Transform your Excel files into a powerful database experience
                  </p>
                  <p className="text-gray-500 mb-8">
                    Upload files, create relationships, and search across all your data
                  </p>
                  
                  {fileSessions.length > 0 && (
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                      ?? Select a file from the sidebar to get started
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
