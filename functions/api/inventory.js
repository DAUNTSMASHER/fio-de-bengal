export async function onRequestGet(context) {
  try {
    const { env, request } = context;
    const url = new URL(request.url);
    const productId = url.searchParams.get('product_id');

    let result;
    if (productId) {
      result = await env.DB.prepare("SELECT * FROM Inventory WHERE product_id = ?").bind(productId).all();
    } else {
      result = await env.DB.prepare("SELECT * FROM Inventory").all();
    }

    return new Response(JSON.stringify(result.results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { product_id, base_size, length, color, quantity } = await request.json();
    const result = await env.DB.prepare(
      "INSERT INTO Inventory (product_id, base_size, length, color, quantity) VALUES (?, ?, ?, ?, ?) RETURNING *"
    ).bind(product_id, base_size, length, color, quantity).first();

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPut(context) {
  try {
    const { request, env } = context;
    const { id, quantity } = await request.json();
    const result = await env.DB.prepare(
      "UPDATE Inventory SET quantity = ? WHERE id = ? RETURNING *"
    ).bind(quantity, id).first();

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
