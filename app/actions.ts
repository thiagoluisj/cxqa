'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import path from 'path';
import fs from 'fs';
import getDb, { type Ocorrencia, type Evidencia } from '@/lib/db';

export type CreateOcorrenciaInput = {
  tela: string;
  dispositivo: string;
  sistema: string;
  versao: string;
  ocorrencia: string;
  severidade: string;
  data_submissao: string;
  quem_testou: string;
  evidencias: { filename: string; tipo: string }[];
  status: string;
};

export async function createOcorrencia(data: CreateOcorrenciaInput): Promise<void> {
  const db = getDb();

  const result = db.prepare(`
    INSERT INTO ocorrencias (tela, dispositivo, sistema, versao, ocorrencia, severidade, data_submissao, quem_testou, status)
    VALUES (@tela, @dispositivo, @sistema, @versao, @ocorrencia, @severidade, @data_submissao, @quem_testou, @status)
  `).run({
    tela: data.tela,
    dispositivo: data.dispositivo,
    sistema: data.sistema,
    versao: data.versao,
    ocorrencia: data.ocorrencia,
    severidade: data.severidade,
    data_submissao: data.data_submissao,
    quem_testou: data.quem_testou,
    status: data.status,
  });

  const ocorrenciaId = result.lastInsertRowid;

  for (const ev of data.evidencias) {
    db.prepare(`
      INSERT INTO evidencias (ocorrencia_id, filename, tipo) VALUES (?, ?, ?)
    `).run(ocorrenciaId, ev.filename, ev.tipo);
  }

  revalidatePath('/');
  redirect('/');
}

export async function updateStatus(id: number, status: string): Promise<void> {
  const db = getDb();
  db.prepare(`UPDATE ocorrencias SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, id);
  revalidatePath('/');
  revalidatePath(`/ocorrencia/${id}`);
}

export type OcorrenciaComEvidencias = Ocorrencia & { total_evidencias: number };

export async function getAllOcorrencias(filters?: {
  severidade?: string;
  status?: string;
  dispositivo?: string;
}): Promise<OcorrenciaComEvidencias[]> {
  const db = getDb();
  let query = `
    SELECT o.*, COUNT(e.id) as total_evidencias
    FROM ocorrencias o
    LEFT JOIN evidencias e ON e.ocorrencia_id = o.id
  `;
  const conditions: string[] = [];
  const params: string[] = [];

  if (filters?.severidade) { conditions.push('o.severidade = ?'); params.push(filters.severidade); }
  if (filters?.status) { conditions.push('o.status = ?'); params.push(filters.status); }
  if (filters?.dispositivo) { conditions.push('o.dispositivo = ?'); params.push(filters.dispositivo); }

  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' GROUP BY o.id ORDER BY o.created_at DESC';

  return db.prepare(query).all(...params) as OcorrenciaComEvidencias[];
}

export async function getOcorrenciaById(id: number): Promise<Ocorrencia | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM ocorrencias WHERE id = ?').get(id) as Ocorrencia) || null;
}

export async function getEvidenciasByOcorrencia(ocorrenciaId: number): Promise<Evidencia[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM evidencias WHERE ocorrencia_id = ? ORDER BY created_at ASC').all(ocorrenciaId) as Evidencia[];
}

export async function deleteOcorrencia(id: number): Promise<void> {
  const db = getDb();
  // Remove evidencias físicas do disco
  const evidencias = db.prepare('SELECT filename FROM evidencias WHERE ocorrencia_id = ?').all(id) as { filename: string }[];
  for (const ev of evidencias) {
    const filepath = path.join(process.cwd(), 'public', 'uploads', ev.filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  }
  db.prepare('DELETE FROM ocorrencias WHERE id = ?').run(id);
  revalidatePath('/');
  redirect('/');
}

export async function updateSeveridade(id: number, severidade: string): Promise<void> {
  const db = getDb();
  db.prepare(`UPDATE ocorrencias SET severidade = ?, updated_at = datetime('now') WHERE id = ?`).run(severidade, id);
  revalidatePath('/');
  revalidatePath(`/ocorrencia/${id}`);
}

export async function getStats(): Promise<{
  total: number;
  aberto: number;
  resolvido: number;
  bug: number;
  alta: number;
  media: number;
  baixa: number;
}> {
  const db = getDb();
  const count = (sql: string) => (db.prepare(sql).get() as { count: number }).count;
  return {
    total:    count('SELECT COUNT(*) as count FROM ocorrencias'),
    aberto:   count("SELECT COUNT(*) as count FROM ocorrencias WHERE status = 'Aberto'"),
    resolvido: count("SELECT COUNT(*) as count FROM ocorrencias WHERE status = 'Resolvido'"),
    bug:      count("SELECT COUNT(*) as count FROM ocorrencias WHERE severidade = 'Bug'"),
    alta:     count("SELECT COUNT(*) as count FROM ocorrencias WHERE severidade = 'Alta'"),
    media:    count("SELECT COUNT(*) as count FROM ocorrencias WHERE severidade = 'Média'"),
    baixa:    count("SELECT COUNT(*) as count FROM ocorrencias WHERE severidade = 'Baixa'"),
  };
}
