'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import getDb, { type Ocorrencia } from '@/lib/db';

export type CreateOcorrenciaInput = {
  tela: string;
  dispositivo: string;
  sistema: string;
  versao: string;
  ocorrencia: string;
  severidade: string;
  data_submissao: string;
  quem_testou: string;
  evidencia: string | null;
  status: string;
};

export async function createOcorrencia(data: CreateOcorrenciaInput): Promise<void> {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO ocorrencias (tela, dispositivo, sistema, versao, ocorrencia, severidade, data_submissao, quem_testou, evidencia, status)
    VALUES (@tela, @dispositivo, @sistema, @versao, @ocorrencia, @severidade, @data_submissao, @quem_testou, @evidencia, @status)
  `);

  stmt.run(data);
  revalidatePath('/');
  redirect('/');
}

export async function updateStatus(id: number, status: string): Promise<void> {
  const db = getDb();
  db.prepare(`
    UPDATE ocorrencias SET status = ?, updated_at = datetime('now') WHERE id = ?
  `).run(status, id);
  revalidatePath('/');
  revalidatePath(`/ocorrencia/${id}`);
}

export async function getAllOcorrencias(filters?: {
  severidade?: string;
  status?: string;
  dispositivo?: string;
}): Promise<Ocorrencia[]> {
  const db = getDb();
  let query = 'SELECT * FROM ocorrencias';
  const conditions: string[] = [];
  const params: string[] = [];

  if (filters?.severidade) {
    conditions.push('severidade = ?');
    params.push(filters.severidade);
  }
  if (filters?.status) {
    conditions.push('status = ?');
    params.push(filters.status);
  }
  if (filters?.dispositivo) {
    conditions.push('dispositivo = ?');
    params.push(filters.dispositivo);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  return db.prepare(query).all(...params) as Ocorrencia[];
}

export async function getOcorrenciaById(id: number): Promise<Ocorrencia | null> {
  const db = getDb();
  const result = db.prepare('SELECT * FROM ocorrencias WHERE id = ?').get(id);
  return (result as Ocorrencia) || null;
}

export async function getStats(): Promise<{
  total: number;
  aberto: number;
  critico: number;
  resolvido: number;
}> {
  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as count FROM ocorrencias').get() as { count: number }).count;
  const aberto = (db.prepare("SELECT COUNT(*) as count FROM ocorrencias WHERE status = 'Aberto'").get() as { count: number }).count;
  const critico = (db.prepare("SELECT COUNT(*) as count FROM ocorrencias WHERE severidade = 'Bug'").get() as { count: number }).count;
  const resolvido = (db.prepare("SELECT COUNT(*) as count FROM ocorrencias WHERE status = 'Resolvido'").get() as { count: number }).count;

  return { total, aberto, critico, resolvido };
}
