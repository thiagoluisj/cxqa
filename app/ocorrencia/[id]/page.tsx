import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOcorrenciaById, updateStatus, updateSeveridade, updateCampos, getEvidenciasByOcorrencia, deleteOcorrencia } from '@/app/actions';
import { Header } from '@/components/Header';
import { SeveridadeBadge } from '@/components/SeveridadeBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { DeleteButton } from '@/components/DeleteButton';

type Props = {
  params: { id: string };
};

export default async function OcorrenciaPage({ params }: Props) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const [ocorrencia, evidencias] = await Promise.all([
    getOcorrenciaById(id),
    getEvidenciasByOcorrencia(id),
  ]);
  if (!ocorrencia) notFound();

  async function handleStatusChange(formData: FormData) {
    'use server';
    const status = formData.get('status') as string;
    await updateStatus(id, status);
  }

  async function handleSeveridadeChange(formData: FormData) {
    'use server';
    const severidade = formData.get('severidade') as string;
    await updateSeveridade(id, severidade);
  }

  async function handleDelete() {
    'use server';
    await deleteOcorrencia(id);
  }

  async function handleCamposChange(formData: FormData) {
    'use server';
    await updateCampos(id, {
      tela: formData.get('tela') as string,
      dispositivo: formData.get('dispositivo') as string,
      sistema: formData.get('sistema') as string,
      versao: formData.get('versao') as string,
      quem_testou: formData.get('quem_testou') as string,
      data_submissao: formData.get('data_submissao') as string,
    });
  }

  const fields = [
    { label: 'Tela', value: ocorrencia.tela },
    { label: 'Dispositivo', value: ocorrencia.dispositivo },
    { label: 'Sistema', value: ocorrencia.sistema },
    { label: 'Versão', value: ocorrencia.versao || '—' },
    { label: 'Quem testou', value: ocorrencia.quem_testou },
    {
      label: 'Data de Submissão',
      value: new Date(ocorrencia.data_submissao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="btn-secondary text-sm py-2 inline-flex mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Voltar para lista
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-sm text-gray-400 font-medium">#OC-{String(ocorrencia.id).padStart(4, '0')}</span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{ocorrencia.tela}</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <SeveridadeBadge severidade={ocorrencia.severidade} />
              <StatusBadge status={ocorrencia.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Descrição da Ocorrência</h2>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{ocorrencia.ocorrencia}</p>
            </div>

            {evidencias.length > 0 && (
              <div className="card p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Evidências
                  <span className="ml-2 text-xs font-normal text-gray-400 normal-case">({evidencias.length} arquivo{evidencias.length > 1 ? 's' : ''})</span>
                </h2>
                <div className="space-y-4">
                  {evidencias.map((ev) => (
                    <div key={ev.id} className="rounded-xl overflow-hidden border border-gray-200">
                      {ev.tipo === 'video' ? (
                        <video
                          src={`/api/uploads/${ev.filename}`}
                          controls
                          className="w-full max-h-[500px] bg-black"
                        />
                      ) : (
                        <img
                          src={`/api/uploads/${ev.filename}`}
                          alt="Evidência"
                          className="w-full object-contain max-h-[500px] bg-gray-50"
                        />
                      )}
                      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ev.tipo === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {ev.tipo === 'video' ? 'Vídeo' : 'Imagem'}
                        </span>
                        <a
                          href={`/api/uploads/${ev.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          Abrir em nova aba
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Atualizar Status</h2>
              <form action={handleStatusChange}>
                <div className="relative mb-3">
                  <select name="status" defaultValue={ocorrencia.status} className="form-select">
                    <option>Aberto</option>
                    <option>Em Análise</option>
                    <option>Resolvido</option>
                    <option>Descartado</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full justify-center text-sm">Salvar Status</button>
              </form>
            </div>

            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Atualizar Severidade</h2>
              <form action={handleSeveridadeChange}>
                <div className="relative mb-3">
                  <select name="severidade" defaultValue={ocorrencia.severidade} className="form-select">
                    <option>Bug</option>
                    <option>Alta</option>
                    <option>Média</option>
                    <option>Baixa</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                <button type="submit" className="btn-secondary w-full justify-center text-sm">Salvar Severidade</button>
              </form>
            </div>

            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Editar Detalhes</h2>
              <form action={handleCamposChange} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">Tela</label>
                  <input name="tela" defaultValue={ocorrencia.tela} className="form-input text-sm py-1.5" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">Dispositivo</label>
                  <div className="relative">
                    <select name="dispositivo" defaultValue={ocorrencia.dispositivo} className="form-select text-sm py-1.5">
                      <option>Mobile</option>
                      <option>Tablet</option>
                      <option>Desktop</option>
                      <option>TV</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">Sistema</label>
                  <div className="relative">
                    <select name="sistema" defaultValue={ocorrencia.sistema} className="form-select text-sm py-1.5">
                      <option>iOS</option>
                      <option>Android</option>
                      <option>Windows</option>
                      <option>macOS</option>
                      <option>Web</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">Versão</label>
                  <input name="versao" defaultValue={ocorrencia.versao || ''} className="form-input text-sm py-1.5" placeholder="Ex: 17.2" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">Quem testou</label>
                  <input name="quem_testou" defaultValue={ocorrencia.quem_testou} className="form-input text-sm py-1.5" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">Data de Submissão</label>
                  <input name="data_submissao" type="date" defaultValue={ocorrencia.data_submissao} className="form-input text-sm py-1.5" />
                </div>
                <button type="submit" className="btn-secondary w-full justify-center text-sm">Salvar Detalhes</button>
              </form>
            </div>

            <div className="card p-5">
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-gray-400">Criado em</dt>
                  <dd className="text-xs text-gray-600 font-medium">{new Date(ocorrencia.created_at).toLocaleString('pt-BR')}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Atualizado em</dt>
                  <dd className="text-xs text-gray-600 font-medium">{new Date(ocorrencia.updated_at).toLocaleString('pt-BR')}</dd>
                </div>
              </dl>
            </div>

            <DeleteButton deleteAction={handleDelete} />
          </div>
        </div>
      </main>
    </div>
  );
}
