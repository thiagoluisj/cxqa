import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'imagem',
  'image/png': 'imagem',
  'image/gif': 'imagem',
  'image/webp': 'imagem',
  'video/mp4': 'video',
  'video/webm': 'video',
  'video/quicktime': 'video',
  'video/x-msvideo': 'video',
};

const MAX_SIZE_IMAGE = 10 * 1024 * 1024;  // 10MB
const MAX_SIZE_VIDEO = 200 * 1024 * 1024; // 200MB

export async function POST(request: NextRequest) {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const tipo = ALLOWED_TYPES[file.type];
    if (!tipo) {
      return NextResponse.json({ error: 'Tipo de arquivo não suportado. Use imagens (JPG, PNG, GIF, WebP) ou vídeos (MP4, WebM, MOV).' }, { status: 400 });
    }

    const maxSize = tipo === 'video' ? MAX_SIZE_VIDEO : MAX_SIZE_IMAGE;
    if (file.size > maxSize) {
      const limit = tipo === 'video' ? '200MB' : '10MB';
      return NextResponse.json({ error: `Arquivo muito grande. Tamanho máximo: ${limit}` }, { status: 400 });
    }

    const ext = path.extname(file.name) || (tipo === 'video' ? '.mp4' : '.jpg');
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `evidence_${timestamp}_${randomSuffix}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(arrayBuffer));

    return NextResponse.json({ filename, url: `/uploads/${filename}`, tipo });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 });
  }
}
