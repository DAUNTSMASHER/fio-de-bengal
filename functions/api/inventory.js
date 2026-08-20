export async function onRequestGet(context) {
  try {
    const { env } = context;

    // Default mock data if D1 is not bound
    let inventory = [
      { id: 1, category: 'base', label: '9x7', quantity: '100-120' },
      { id: 2, category: 'base', label: '6x8', quantity: '100-120' },
      { id: 3, category: 'base', label: '6x9', quantity: '200-230' },
      { id: 4, category: 'base', label: '8x10', quantity: '200-230' },
      { id: 5, category: 'color', label: '#1', quantity: '100-120' },
      { id: 6, category: 'color', label: '#2', quantity: '100-120' },
      { id: 7, category: 'color', label: '#1B', quantity: '200-230' },
      { id: 8, category: 'density', label: '60-90', quantity: '100-120' },
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
    const { product_id, category, label, quantity } = await request.json();
    const result = await env.DB.prepare(
      "INSERT INTO Inventory (product_id, category, label, quantity) VALUES (?, ?, ?, ?) RETURNING *"
    ).bind(product_id, category, label, quantity).first();

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
