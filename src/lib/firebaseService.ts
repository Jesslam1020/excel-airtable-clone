import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface FileSession {
  id: string;
  fileName: string;
  sheets: { [key: string]: string }; // Store as JSON strings to avoid nested array issues
  uploadedAt: Timestamp;
  userId?: string; // For future user authentication
}

export interface Relationship {
  id: string;
  source: { 
    fileId: string; 
    sheetName: string; 
    columnName: string; 
  };
  target: { 
    fileId: string; 
    sheetName: string; 
    columnName: string; 
  };
  createdAt: Timestamp;
  userId?: string; // For future user authentication
}

// File Sessions Collection
const FILE_SESSIONS_COLLECTION = 'fileSessions';
const RELATIONSHIPS_COLLECTION = 'relationships';

// Helper function to convert sheets data for Firebase storage
const prepareSheetsForFirebase = (sheets: { [key: string]: any[][] }) => {
  const result: { [key: string]: string } = {};
  Object.keys(sheets).forEach(sheetName => {
    result[sheetName] = JSON.stringify(sheets[sheetName]);
  });
  return result;
};

// Helper function to convert sheets data from Firebase storage
const parseSheetsFromFirebase = (sheets: { [key: string]: string }): { [key: string]: any[][] } => {
  const result: { [key: string]: any[][] } = {};
  Object.keys(sheets).forEach(sheetName => {
    try {
      result[sheetName] = JSON.parse(sheets[sheetName]);
    } catch (error) {
      console.error(`Error parsing sheet ${sheetName}:`, error);
      result[sheetName] = [];
    }
  });
  return result;
};

// File Session Operations
export const saveFileSession = async (sessionData: { fileName: string; sheets: { [key: string]: any[][] } }): Promise<string> => {
  try {
    console.log('Attempting to save file session to Firebase...');
    console.log('Session data:', { fileName: sessionData.fileName, sheetsCount: Object.keys(sessionData.sheets).length });
    
    // Convert nested arrays to JSON strings
    const preparedData = {
      fileName: sessionData.fileName,
      sheets: prepareSheetsForFirebase(sessionData.sheets),
      uploadedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, FILE_SESSIONS_COLLECTION), preparedData);
    
    console.log('File session saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Detailed error saving file session:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
};

export const getFileSessions = async (): Promise<Array<{ id: string; fileName: string; sheets: { [key: string]: any[][] }; uploadedAt: Timestamp }>> => {
  try {
    console.log('Fetching file sessions from Firebase...');
    const querySnapshot = await getDocs(
      query(collection(db, FILE_SESSIONS_COLLECTION), orderBy('uploadedAt', 'desc'))
    );
    
    const sessions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        fileName: data.fileName,
        sheets: parseSheetsFromFirebase(data.sheets),
        uploadedAt: data.uploadedAt
      };
    });
    
    console.log(`Found ${sessions.length} file sessions`);
    return sessions;
  } catch (error) {
    console.error('Error getting file sessions:', error);
    throw error;
  }
};

export const getFileSession = async (sessionId: string): Promise<{ id: string; fileName: string; sheets: { [key: string]: any[][] }; uploadedAt: Timestamp } | null> => {
  try {
    const docRef = doc(db, FILE_SESSIONS_COLLECTION, sessionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        fileName: data.fileName,
        sheets: parseSheetsFromFirebase(data.sheets),
        uploadedAt: data.uploadedAt
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting file session:', error);
    throw error;
  }
};

export const deleteFileSession = async (sessionId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, FILE_SESSIONS_COLLECTION, sessionId));
  } catch (error) {
    console.error('Error deleting file session:', error);
    throw error;
  }
};

// Relationship Operations
export const saveRelationship = async (relationshipData: Omit<Relationship, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, RELATIONSHIPS_COLLECTION), {
      ...relationshipData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving relationship:', error);
    throw error;
  }
};

export const getRelationships = async (): Promise<Relationship[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, RELATIONSHIPS_COLLECTION), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Relationship));
  } catch (error) {
    console.error('Error getting relationships:', error);
    throw error;
  }
};

export const deleteRelationship = async (relationshipId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, RELATIONSHIPS_COLLECTION, relationshipId));
  } catch (error) {
    console.error('Error deleting relationship:', error);
    throw error;
  }
};

// Search Operations
export const searchAcrossFileSessions = async (searchTerm: string) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // For now, we'll get all sessions and filter on the client side
    // For production, consider using Algolia or Elasticsearch
    const sessions = await getFileSessions();
    
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return sessions.filter(session => {
      // Search in filename
      if (session.fileName.toLowerCase().includes(lowercasedSearchTerm)) {
        return true;
      }
      
      // Search in sheet data
      return Object.values(session.sheets).some(sheetData => 
        sheetData.some(row => 
          row.some(cell => 
            cell?.toString().toLowerCase().includes(lowercasedSearchTerm)
          )
        )
      );
    });
  } catch (error) {
    console.error('Error searching file sessions:', error);
    throw error;
  }
};