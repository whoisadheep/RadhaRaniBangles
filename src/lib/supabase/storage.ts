import { getSupabase } from "./client";

const BUCKET_NAME = "product-images";

/**
 * Uploads an image file (File or Blob or Base64 data URL) to Supabase Storage.
 * Returns the public URL of the uploaded image.
 * If Supabase is not configured, returns the provided base64 data URL as fallback.
 */
export async function uploadProductImage(
  fileOrBase64: File | string,
  fileName?: string
): Promise<string> {
  const supabase = getSupabase();

  // Fallback if Supabase is not configured yet
  if (!supabase) {
    if (typeof fileOrBase64 === "string") {
      return fileOrBase64;
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.readAsDataURL(fileOrBase64);
    });
  }

  let fileBody: File | Blob;
  let cleanName = fileName || `bangle-${Date.now()}.png`;

  if (typeof fileOrBase64 === "string") {
    // If it's already an existing HTTP URL, no need to re-upload
    if (fileOrBase64.startsWith("http://") || fileOrBase64.startsWith("https://") || fileOrBase64.startsWith("/images/")) {
      return fileOrBase64;
    }

    // Convert dataURL to Blob
    const res = await fetch(fileOrBase64);
    fileBody = await res.blob();
  } else {
    fileBody = fileOrBase64;
    cleanName = `${Date.now()}-${fileOrBase64.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  }

  const filePath = `products/${cleanName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileBody, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    // If upload fails, fallback to original data so user doesn't lose work
    return typeof fileOrBase64 === "string" ? fileOrBase64 : "";
  }

  const { data: publicData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicData.publicUrl;
}
