import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as Blob;
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = file.type;
    const base64 = buffer.toString("base64");
    const dataUri = `data:${mime};base64,${base64}`;

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload(dataUri, {
          resource_type: "auto",
          folder: "uploads",
        })
        .then(resolve)
        .catch(reject);
    });

    return NextResponse.json({
      success: true,
      secure_url: result.secure_url,
      id: result.public_id,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
