export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;
  
  if (method === 'GET') {
    const orderNo = url.searchParams.get('order_no');
    if (orderNo) {
      // Public query by order_no
      try {
        const { results } = await env.DB.prepare('SELECT * FROM Tracking WHERE order_no = ?').bind(orderNo).all();
        if (results && results.length > 0) {
          const record = results[0];
          // Parse JSON if needed
          if (typeof record.tracking_history === 'string') {
            try {
              record.tracking_history = JSON.parse(record.tracking_history);
            } catch (e) {
              record.tracking_history = [];
            }
          }
          return new Response(JSON.stringify(record), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    } else {
      // Admin query all tracking
      try {
        const { results } = await env.DB.prepare('SELECT * FROM Tracking ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(results), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }
  }
  
  if (method === 'POST') {
    // Admin creates new shipment
    try {
      const data = await request.json();
      const { order_no, quantity, value, delivery_country } = data;
      
      const history = JSON.stringify([
        { date: new Date().toISOString(), location: 'System', message: 'Shipment created' }
      ]);
      
      await env.DB.prepare(
        'INSERT INTO Tracking (order_no, quantity, value, delivery_country, current_status, tracking_history) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(order_no, quantity, value, delivery_country, 'Processing', history).run();
      
      return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
  
  if (method === 'PUT') {
    // Admin updates status
    try {
      const data = await request.json();
      const { order_no, new_status, location, message } = data;
      
      // Fetch existing
      const { results } = await env.DB.prepare('SELECT tracking_history FROM Tracking WHERE order_no = ?').bind(order_no).all();
      if (!results || results.length === 0) {
        return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
      }
      
      let history = [];
      try {
        history = JSON.parse(results[0].tracking_history);
      } catch(e) {}
      
      history.unshift({
        date: new Date().toISOString(),
        location: location || 'Transit',
        message: message || new_status
      });
      
      await env.DB.prepare(
        'UPDATE Tracking SET current_status = ?, tracking_history = ? WHERE order_no = ?'
      ).bind(new_status, JSON.stringify(history), order_no).run();
      
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
  
  return new Response('Method Not Allowed', { status: 405 });
}
