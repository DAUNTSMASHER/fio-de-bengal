// Mock data for development when D1 is not bound
let mockInquiries = [];
let mockIdCounter = 1;

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    let results = [];

    if (env.DB) {
      if (email) {
        const res = await env.DB.prepare("SELECT * FROM Inquiries WHERE buyer_email = ? ORDER BY id DESC").bind(email).all();
        results = res.results;
      } else {
        const res = await env.DB.prepare("SELECT * FROM Inquiries ORDER BY id DESC").all();
        results = res.results;
      }
    } else {
      results = email ? mockInquiries.filter(i => i.buyer_email === email) : mockInquiries;
    }

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json(); 

    if (env.DB) {
      const { success, meta } = await env.DB.prepare(
        "INSERT INTO Inquiries (buyer_email, product_id, product_name, model_variant, base, color, length, density, quantity, offered_price, cart_items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        body.buyer_email, body.product_id, body.product_name, body.model_variant, body.base, body.color, body.length, body.density, body.quantity, body.offered_price, body.cart_items || null
      ).run();
      
      return new Response(JSON.stringify({ success, meta }), { headers: { "Content-Type": "application/json" } });
    } else {
      const newInq = { ...body, id: mockIdCounter++, status: 'Negotiating', created_at: new Date().toISOString() };
      mockInquiries.push(newInq);
      return new Response(JSON.stringify({ success: true, meta: { last_row_id: newInq.id } }), { headers: { "Content-Type": "application/json" } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPut(context) {
  try {
    const { request, env } = context;
    const body = await request.json(); 
    // Expects { id, status, final_price }

    if (env.DB) {
      let query = "UPDATE Inquiries SET status = ?";
      let binds = [body.status];

      if (body.final_price !== undefined) {
        query += ", final_price = ?";
        binds.push(body.final_price);
      }
      if (body.shipping_address !== undefined) {
        query += ", shipping_address = ?";
        binds.push(body.shipping_address);
      }
      query += " WHERE id = ?";
      binds.push(body.id);

      const { success } = await env.DB.prepare(query).bind(...binds).run();
      return new Response(JSON.stringify({ success }), { headers: { "Content-Type": "application/json" } });
    } else {
      const inq = mockInquiries.find(i => i.id === body.id);
      if (inq) {
        inq.status = body.status;
        if (body.final_price !== undefined) inq.final_price = body.final_price;
      }
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
