export async function onRequestGet(context) {
  try {
    const { env, request } = context;
    const url = new URL(request.url);
    const productId = url.searchParams.get('product_id');

    let result = { results: [] };
    
    if (env.DB) {
      if (productId) {
        result = await env.DB.prepare("SELECT * FROM Inventory WHERE product_id = ?").bind(parseInt(productId, 10)).all();
      } else {
        result = await env.DB.prepare("SELECT * FROM Inventory").all();
      }
    } else {
      // Fallback inventory if D1 is not configured
      const fallbackInventory = [
        { id: 1, product_id: 1, base_size: '8x10', length: '6"', color: '#1', quantity: 5 },
        { id: 2, product_id: 1, base_size: '8x10', length: '6"', color: '#1B', quantity: 8 },
        { id: 3, product_id: 2, base_size: '7x9', length: '6"', color: '#2', quantity: 3 },
        { id: 4, product_id: 3, base_size: '8x10', length: '6"', color: '#1B', quantity: 12 },
        { id: 5, product_id: 4, base_size: '8x10', length: '6"', color: '#1', quantity: 4 },
        { id: 6, product_id: 5, base_size: '8x10', length: '6"', color: '#3', quantity: 6 },
        { id: 7, product_id: 6, base_size: '8x10', length: '6"', color: '#1B', quantity: 7 },
      ];
      
      if (productId) {
        result.results = fallbackInventory.filter(item => item.product_id === parseInt(productId));
      } else {
        result.results = fallbackInventory;
      }
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
