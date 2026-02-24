import { cloudinary } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.formData();
  const file = data.get("file");

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const upload = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({}, function (error, result) {
      if (error) reject(error);
      resolve(result);
    }).end(buffer);
  });

  return NextResponse.json({ url: upload.secure_url });
}
export const runtime = "nodejs";
