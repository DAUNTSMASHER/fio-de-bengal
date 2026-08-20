export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    if (!env.CLOUDINARY_CLOUD_NAME) {
      throw new Error("CLOUDINARY_CLOUD_NAME environment variable is not set.");
    }

    // Cloudflare Pages Environment Variables for Cloudinary
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`;
    
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

    let imageUrl = result.secure_url;
    // Inject Cloudinary auto-optimization parameters only if it's an image
    if (result.resource_type === 'image' && imageUrl.includes('/upload/')) {
      imageUrl = imageUrl.replace('/upload/', '/upload/q_auto,f_auto,w_800/');
    }

    return new Response(JSON.stringify({ url: imageUrl }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
