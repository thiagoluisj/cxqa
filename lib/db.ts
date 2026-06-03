import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'cxqa.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDb(db);
  }
  return db;
}

function initializeDb(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS ocorrencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tela TEXT NOT NULL,
      dispositivo TEXT NOT NULL,
      sistema TEXT NOT NULL,
      versao TEXT,
      ocorrencia TEXT NOT NULL,
      severidade TEXT NOT NULL,
      data_submissao TEXT NOT NULL,
      quem_testou TEXT NOT NULL,
      evidencia TEXT,
      status TEXT NOT NULL DEFAULT 'Aberto',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

export default getDb;

export type Ocorrencia = {
  id: number;
  tela: string;
  dispositivo: string;
  sistema: string;
  versao: string | null;
  ocorrencia: string;
  severidade: string;
  data_submissao: string;
  quem_testou: string;
  evidencia: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};
