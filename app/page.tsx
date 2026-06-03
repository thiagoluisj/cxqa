import Link from 'next/link';
import { getAllOcorrencias, getStats } from './actions';
import { Header } from '@/components/Header';
import { SeveridadeBadge } from '@/components/SeveridadeBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { StatsCard } from '@/components/StatsCard';

type SearchParams = {
  severidade?: string;
  status?: string;
  dispositivo?: string;
};

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const [ocorrencias, stats] = await Promise.all([
    getAllOcorrencias(searchParams),
    getStats(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Status cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <StatsCard title="Total" value={stats.total} color="blue" subtitle="ocorrências"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
          />
          <StatsCard title="Abertas" value={stats.aberto} color="purple" subtitle="aguardando"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>}
          />
          <StatsCard title="Resolvidas" value={stats.resolvido} color="green" subtitle="concluídas"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          />
        </div>

        {/* Severidade cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/?severidade=Bug" className="block">
            <div className="card p-4 bg-red-50 border-0 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Bug</p>
                  <p className="text-3xl font-bold text-red-700 mt-1">{stats.bug}</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-red-500 mt-1" />
              </div>
            </div>
          </Link>
          <Link href="/?severidade=Alta" className="block">
            <div className="card p-4 bg-orange-50 border-0 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Alta</p>
                  <p className="text-3xl font-bold text-orange-700 mt-1">{stats.alta}</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-orange-500 mt-1" />
              </div>
            </div>
          </Link>
          <Link href="/?severidade=Média" className="block">
            <div className="card p-4 bg-yellow-50 border-0 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">Média</p>
                  <p className="text-3xl font-bold text-yellow-700 mt-1">{stats.media}</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-yellow-500 mt-1" />
              </div>
            </div>
          </Link>
          <Link href="/?severidade=Baixa" className="block">
            <div className="card p-4 bg-green-50 border-0 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Baixa</p>
                  <p className="text-3xl font-bold text-green-700 mt-1">{stats.baixa}</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-green-500 mt-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <form className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-gray-500">Filtrar por:</span>

            <select name="severidade" defaultValue={searchParams.severidade || ''} className="form-select w-auto text-sm py-2">
              <option value="">Todas severidades</option>
              <option>Bug</option>
              <option>Alta</option>
              <option>Média</option>
              <option>Baixa</option>
            </select>

            <select name="status" defaultValue={searchParams.status || ''} className="form-select w-auto text-sm py-2">
              <option value="">Todos status</option>
              <option>Aberto</option>
              <option>Em Análise</option>
              <option>Resolvido</option>
              <option>Descartado</option>
            </select>

            <select name="dispositivo" defaultValue={searchParams.dispositivo || ''} className="form-select w-auto text-sm py-2">
              <option value="">Todos dispositivos</option>
              <option>Mobile</option>
              <option>Tablet</option>
              <option>Desktop</option>
              <option>TV</option>
            </select>

            <button type="submit" className="btn-primary text-sm py-2">Aplicar</button>

            {(searchParams.severidade || searchParams.status || searchParams.dispositivo) && (
              <Link href="/" className="btn-secondary text-sm py-2">Limpar</Link>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Ocorrências
              <span className="ml-2 text-sm font-normal text-gray-400">({ocorrencias.length})</span>
            </h2>
          </div>

          {ocorrencias.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Nenhuma ocorrência encontrada</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchParams.severidade || searchParams.status || searchParams.dispositivo
                  ? 'Tente remover os filtros'
                  : 'Cadastre a primeira ocorrência'}
              </p>
              {!searchParams.severidade && !searchParams.status && !searchParams.dispositivo && (
                <Link href="/nova" className="btn-primary mt-4 inline-flex">+ Nova Ocorrência</Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tela</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dispositivo</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sistema</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Severidade</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Testador</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Evidências</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ocorrencias.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <Link href={`/ocorrencia/${o.id}`} className="block">
                          <span className="font-medium text-gray-900 group-hover:text-brand-600">{o.tela}</span>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">{o.ocorrencia}</p>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600"><Link href={`/ocorrencia/${o.id}`} className="block">{o.dispositivo}</Link></td>
                      <td className="px-6 py-4 text-sm text-gray-600"><Link href={`/ocorrencia/${o.id}`} className="block">{o.sistema}{o.versao ? ` ${o.versao}` : ''}</Link></td>
                      <td className="px-6 py-4"><Link href={`/ocorrencia/${o.id}`} className="block"><SeveridadeBadge severidade={o.severidade} size="sm" /></Link></td>
                      <td className="px-6 py-4"><Link href={`/ocorrencia/${o.id}`} className="block"><StatusBadge status={o.status} size="sm" /></Link></td>
                      <td className="px-6 py-4 text-sm text-gray-500"><Link href={`/ocorrencia/${o.id}`} className="block">{new Date(o.data_submissao).toLocaleDateString('pt-BR')}</Link></td>
                      <td className="px-6 py-4 text-sm text-gray-600"><Link href={`/ocorrencia/${o.id}`} className="block">{o.quem_testou}</Link></td>
                      <td className="px-6 py-4">
                        <Link href={`/ocorrencia/${o.id}`} className="block">
                          {o.evidencia ? (
                            <span className="inline-flex items-center gap-1 text-brand-600 text-xs font-medium">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                              Ver
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
