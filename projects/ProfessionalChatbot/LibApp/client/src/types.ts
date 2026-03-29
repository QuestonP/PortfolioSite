export type ReadStatus = 'unread' | 'reading' | 'read';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  publishedDate?: string;
  genres: string[];
  pageCount?: number;
  readStatus: ReadStatus;
  userRating?: number;
  dateAdded: string;
  dateRead?: string;
  notes?: string;
  googleBooksId?: string;
  source: 'user' | 'agent';
}

export interface ReadingGoal {
  target: number;
  year: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolActivity?: ToolActivity[];
}

export interface ToolActivity {
  name: string;
  status: 'running' | 'done';
  result?: unknown;
}

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    publishedDate?: string;
    categories?: string[];
    pageCount?: number;
  };
}
