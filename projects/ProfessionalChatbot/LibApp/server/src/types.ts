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

export interface LibraryData {
  books: Book[];
}

export interface ReadingGoal {
  target: number;
  year: number;
}

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publishedDate?: string;
    categories?: string[];
    pageCount?: number;
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
  };
}
