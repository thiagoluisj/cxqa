'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { createOcorrencia } from '@/app/actions';

const today = new Date().toISOString().split('T')[0];

type UploadedFile = {
  filename: string;
  tipo: 'imagem' | 'video';
  previewUrl: string;
  name: string;
};

export default function NovaOcorrenciaPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evidencias, setEvidencias] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError(null);

    for (const file of files) {
      const previewUrl = URL.createObjectURL(file);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro no upload');
        setEvidencias(prev => [...prev, {
          filename: data.filename,
          tipo: data.tipo,
          previewUrl,
          name: file.name,
        }]);
      } catch (err) {
        setError(`Erro ao enviar "${file.name}": ${(err as Error).message}`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeEvidencia(filename: string) {
    setEvidencias(prev => prev.filter(e => e.filename !== filename));
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
        evidencias: evidencias.map(e => ({ filename: e.filename, tipo: e.tipo })),
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
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"/></svg>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"/></svg>
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
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    value: 'Bug',
                    color: 'border-red-300 bg-red-50 text-red-700 peer-checked:bg-red-100 peer-checked:border-red-500',
                    desc: 'Comportamento inesperado com impacto direto na utilização do produto, impossibilitando a conclusão de tarefa ou dificultando de forma disruptiva',
                    example: 'Crashes inexperados, loops de tela, exibições em desacordo com regras de negócio',
                  },
                  {
                    value: 'Alta',
                    color: 'border-orange-300 bg-orange-50 text-orange-700 peer-checked:bg-orange-100 peer-checked:border-orange-500',
                    desc: 'Inconsistência de implementação que gera um alto impacto na percepção de produto ou gera uma impossibilitação de navegação',
                    example: 'Botões fora do lugar, textos em desacordo, comportamento de tela em desacordo com cenários mapeados no Figma',
                  },
                  {
                    value: 'Média',
                    color: 'border-yellow-300 bg-yellow-50 text-yellow-700 peer-checked:bg-yellow-100 peer-checked:border-yellow-500',
                    desc: 'Inconsistência de implementação que gera um impacto na percepção do produto, porém sem impossibilitar a navegação e utilização na experiência prevista',
                    example: 'Botões malformatados, espaçamentos não-respeitados, textos em tamanho ou cor em desacordo',
                  },
                  {
                    value: 'Baixa',
                    color: 'border-green-300 bg-green-50 text-green-700 peer-checked:bg-green-100 peer-checked:border-green-500',
                    desc: 'Inconsistência de implementação que gera impacto na percepção do produto ou está inconsistente com o que foi desenhado por experiência, sem impactar diretamente na navegação',
                    example: 'Cores inconsistentes, padding',
                  },
                ].map(({ value, color, desc, example }) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" name="severidade" value={value} required className="sr-only peer" />
                    <div className={`border-2 rounded-lg p-3 transition-all ${color}`}>
                      <div className="font-semibold text-sm mb-1">{value}</div>
                      <div className="text-xs opacity-80 leading-relaxed">{desc}</div>
                      <div className="text-xs opacity-60 mt-1 italic">Ex: {example}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Evidências</h2>

            <div>
              <label className="form-label">Imagens e Vídeos</label>
              <p className="text-xs text-gray-400 mb-3">Imagens: JPG, PNG, GIF, WebP (máx 10MB) · Vídeos: MP4, WebM, MOV (máx 200MB)</p>

              {/* Uploaded files grid */}
              {evidencias.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {evidencias.map((ev) => (
                    <div key={ev.filename} className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                      {ev.tipo === 'video' ? (
                        <div className="w-full h-28 flex flex-col items-center justify-center gap-1">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                          <span className="text-xs text-gray-400 text-center px-2 truncate w-full text-center">{ev.name}</span>
                        </div>
                      ) : (
                        <img src={ev.previewUrl} alt="" className="w-full h-28 object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeEvidencia(ev.filename)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full shadow border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                      <div className="absolute bottom-1.5 left-1.5">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${ev.tipo === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {ev.tipo === 'video' ? 'Vídeo' : 'Imagem'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload area */}
              <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'border-brand-300 bg-brand-50' : 'border-gray-300 hover:border-brand-400 hover:bg-brand-50'}`}>
                {uploading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-sm text-brand-600">Enviando...</p>
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p className="text-sm text-gray-500">Clique para adicionar arquivos</p>
                    <p className="text-xs text-gray-400 mt-1">Imagens e vídeos · múltiplos arquivos permitidos</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pb-8">
            <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">Cancelar</button>
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
