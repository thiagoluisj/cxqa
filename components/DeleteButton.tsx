'use client';

import { useState } from 'react';

type Props = {
  deleteAction: () => Promise<void>;
};

export function DeleteButton({ deleteAction }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    await deleteAction();
  }

  if (confirming) {
    return (
      <div className="card p-5 border border-red-200 bg-red-50">
        <p className="text-sm text-red-700 font-medium mb-3">Tem certeza que deseja excluir esta ocorrência? Essa ação não pode ser desfeita.</p>
        <div className="flex gap-2">
          <button
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="btn-secondary flex-1 justify-center text-sm py-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 justify-center text-sm py-2 px-4 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {deleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Excluindo...
              </>
            ) : 'Confirmar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full flex items-center justify-center gap-2 text-sm py-2 px-4 rounded-lg font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
      </svg>
      Excluir Ocorrência
    </button>
  );
}
