let mockMessages = [];

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const inquiry_id = url.searchParams.get('inquiry_id');

    if (!inquiry_id) throw new Error("Missing inquiry_id");

    let results = [];

    if (env.DB) {
      const res = await env.DB.prepare("SELECT * FROM Messages WHERE inquiry_id = ? ORDER BY id ASC").bind(parseInt(inquiry_id)).all();
      results = res.results;
    } else {
      results = mockMessages.filter(m => m.inquiry_id === parseInt(inquiry_id));
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
      const { success } = await env.DB.prepare(
        "INSERT INTO Messages (inquiry_id, sender_role, sender_name, message) VALUES (?, ?, ?, ?)"
      ).bind(
        body.inquiry_id, body.sender_role, body.sender_name, body.message
      ).run();
      
      return new Response(JSON.stringify({ success }), { headers: { "Content-Type": "application/json" } });
    } else {
      mockMessages.push({
        id: Math.floor(Math.random() * 100000),
        inquiry_id: parseInt(body.inquiry_id),
        sender_role: body.sender_role,
        sender_name: body.sender_name,
        message: body.message,
        created_at: new Date().toISOString()
      });
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
