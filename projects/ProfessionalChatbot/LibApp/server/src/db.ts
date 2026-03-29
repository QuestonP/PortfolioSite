import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Book, LibraryData, ReadingGoal } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, 'data', 'books.json');
const GOALS_PATH = join(__dirname, 'data', 'goals.json');

export function readLibrary(): LibraryData {
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as LibraryData;
  } catch {
    return { books: [] };
  }
}

export function writeLibrary(data: LibraryData): void {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function getBooks(): Book[] {
  return readLibrary().books;
}

export function getBook(id: string): Book | undefined {
  return readLibrary().books.find((b) => b.id === id);
}

export function saveBook(book: Book): Book {
  const data = readLibrary();
  const existing = data.books.findIndex((b) => b.id === book.id);
  if (existing >= 0) {
    data.books[existing] = book;
  } else {
    data.books.push(book);
  }
  writeLibrary(data);
  return book;
}

export function deleteBook(id: string): boolean {
  const data = readLibrary();
  const before = data.books.length;
  data.books = data.books.filter((b) => b.id !== id);
  writeLibrary(data);
  return data.books.length < before;
}

export function getGoal(): ReadingGoal {
  try {
    const raw = readFileSync(GOALS_PATH, 'utf-8');
    return JSON.parse(raw) as ReadingGoal;
  } catch {
    return { target: 0, year: new Date().getFullYear() };
  }
}

export function saveGoal(goal: ReadingGoal): ReadingGoal {
  writeFileSync(GOALS_PATH, JSON.stringify(goal, null, 2), 'utf-8');
  return goal;
}
