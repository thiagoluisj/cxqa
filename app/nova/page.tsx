'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { createOcorrencia } from '@/app/actions';

const today = new Date().toISOString().split('T')[0];

export default function NovaOcorrenciaPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evidencia, setEvidencia] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no upload');
      setEvidencia(data.filename);
    } catch (err) {
      setError((err as Error).message);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      await createOcorrencia({
        tela: data.tela as string,
        dispositivo: data.dispositivo as string,
        sistema: data.sistema as string,
        versao: data.versao as string,
        ocorrencia: data.ocorrencia as string,
        severidade: data.severidade as string,
        data_submissao: data.data_submissao as string,
        quem_testou: data.quem_testou as string,
        evidencia,
        status: data.status as string,
      });
    } catch {
      // redirect throws, which is fine
    }

    router.push('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showNewButton={false} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button onClick={() => router.back()} className="btn-secondary text-sm py-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nova Ocorrência</h1>
          <p className="text-gray-500 mt-1">Registre um problema encontrado durante os testes de UX/QA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Localização</h2>

            <div>
              <label className="form-label">Tela <span className="text-red-400">*</span></label>
              <input name="tela" required className="form-input" placeholder="Ex: Home, Checkout, Login..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Dispositivo <span className="text-red-400">*</span></label>
                <div className="relative">
                  <select name="dispositivo" required className="form-select">
                    <option value="">Selecionar...</option>
                    <option>Mobile</option>
                    <option>Tablet</option>
                    <option>Desktop</option>
                    <option>TV</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">Sistema <span className="text-red-400">*</span></label>
                <div className="relative">
                  <select name="sistema" required className="form-select">
                    <option value="">Selecionar...</option>
                    <option>iOS</option>
                    <option>Android</option>
                    <option>Windows</option>
                    <option>macOS</option>
                    <option>Web</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Versão</label>
              <input name="versao" className="form-input" placeholder="Ex: 17.2, 14.0, 3.4.1..." />
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Ocorrência</h2>

            <div>
              <label className="form-label">Descrição <span className="text-red-400">*</span></label>
              <textarea name="ocorrencia" required rows={4} className="form-textarea" placeholder="Descreva detalhadamente o problema encontrado..." />
            </div>

            <div>
              <label className="form-label">Severidade <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'Crítico', color: 'border-red-300 bg-red-50 text-red-700 peer-checked:bg-red-100 peer-checked:border-red-500' },
                  { value: 'Alto', color: 'border-orange-300 bg-orange-50 text-orange-700 peer-checked:bg-orange-100 peer-checked:border-orange-500' },
                  { value: 'Médio', color: 'border-yellow-300 bg-yellow-50 text-yellow-700 peer-checked:bg-yellow-100 peer-checked:border-yellow-500' },
                  { value: 'Baixo', color: 'border-green-300 bg-green-50 text-green-700 peer-checked:bg-green-100 peer-checked:border-green-500' },
                ].map(({ value, color }) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" name="severidade" value={value} required className="sr-only peer" />
                    <div className={`border-2 rounded-lg px-3 py-2 text-center text-sm font-medium transition-all ${color}`}>
                      {value}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Evidência</h2>

            <div>
              <label className="form-label">Imagem / Screenshot</label>
              <div className="mt-1">
                {previewUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain bg-gray-50" />
                    <button
                      type="button"
                      onClick={() => { setPreviewUrl(null); setEvidencia(null); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p className="text-sm text-gray-500">Clique para enviar uma imagem</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP — máx 10MB</p>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Submissão</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Quem testou <span className="text-red-400">*</span></label>
                <input name="quem_testou" required className="form-input" placeholder="Nome do testador" />
              </div>

              <div>
                <label className="form-label">Data de Submissão <span className="text-red-400">*</span></label>
                <input name="data_submissao" type="date" required defaultValue={today} className="form-input" />
              </div>
            </div>

            <div>
              <label className="form-label">Status inicial</label>
              <div className="relative">
                <select name="status" className="form-select" defaultValue="Aberto">
                  <option>Aberto</option>
                  <option>Em Análise</option>
                  <option>Resolvido</option>
                  <option>Descartado</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pb-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn-primary flex-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Salvar Ocorrência
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
