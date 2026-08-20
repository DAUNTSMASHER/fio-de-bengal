export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    // Cloudflare Pages Environment Variables for Cloudinary
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`;
    
    // Prepare data for Cloudinary
    const cloudinaryData = new FormData();
    cloudinaryData.append('file', file);
    cloudinaryData.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');

    // Secure REST call from Edge to Cloudinary
    const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: cloudinaryData
    });

    const result = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      throw new Error(result.error?.message || "Cloudinary upload failed");
    }

    return new Response(JSON.stringify({ url: result.secure_url }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
