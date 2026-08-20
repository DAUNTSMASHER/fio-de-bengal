export async function onRequestGet(context) {
  // const { results } = await context.env.DB.prepare("SELECT * FROM Products").all();
  return new Response(JSON.stringify([
    { id: 1, name: "Raw Bengal Hair Bundle - 18\"", price: 120 }
  ]), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    
    // Authenticate Admin (Check JWT in Authorization header)
    // const authHeader = request.headers.get("Authorization");
    // if (!authHeader || !isValid(authHeader)) return new Response("Unauthorized", { status: 401 });

    // Insert into D1
    // await env.DB.prepare("INSERT INTO Products (name, price, image_url) VALUES (?, ?, ?)")
    //   .bind(body.name, body.price, body.imageUrl).run();

    return new Response(JSON.stringify({ success: true, product: body }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
