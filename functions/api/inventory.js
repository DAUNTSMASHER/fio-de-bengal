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
      { id: 9, category: 'density', label: '95-110', quantity: '100-120' },
      { id: 10, category: 'density', label: '115-130', quantity: '200-230' }
    ];

    if (env.DB) {
      const { results } = await env.DB.prepare("SELECT * FROM Inventory ORDER BY id ASC").all();
      if (results && results.length > 0) {
        inventory = results;
      }
    }

    return new Response(JSON.stringify(inventory), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPut(context) {
  try {
    const { request, env } = context;
    const body = await request.json(); // Expected: { id, quantity }

    if (!env.DB) {
      // Fake success for development if DB isn't bound yet
      return new Response(JSON.stringify({ success: true, updated: body }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const { success } = await env.DB.prepare(
      "UPDATE Inventory SET quantity = ? WHERE id = ?"
    )
    .bind(body.quantity, body.id).run();

    return new Response(JSON.stringify({ success }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
