export async function onRequestGet(context) {
  try {
    const { env } = context;

    // Check if D1 Database is bound
    if (env.DB) {
      const { results } = await env.DB.prepare("SELECT * FROM Products ORDER BY id DESC").all();
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Fallback if D1 is not configured yet
    const fallbackProducts = [
      { id: 1, name: 'Hollywood', sku: 'FIO-HL-001', price: 150.00, image: '/Products/Hollywood.jpg', moq: '1 piece', isGuaranteed: true, description: 'Premium Hollywood style system with flawless undetectable lace.' },
      { id: 2, name: 'BMW', sku: 'FIO-BM-002', price: 180.00, image: '/Products/Bmw.jpg', moq: '1 piece', isGuaranteed: true, description: 'The BMW line offers superior durability and a completely natural scalp appearance.' },
      { id: 3, name: 'Mono', sku: 'FIO-MN-003', price: 130.00, image: '/Products/Mono.png', moq: '1 piece', isGuaranteed: true, description: 'Classic Monofilament top providing incredible breathability and multi-directional styling versatility.' },
      { id: 4, name: 'Mono Front Lace', sku: 'FIO-MFL-004', price: 160.00, image: '/Products/Mono Front Lace.png', moq: '1 piece', isGuaranteed: true, description: 'The perfect hybrid: a breathable Mono top combined with an undetectable Front Lace hairline.' },
      { id: 5, name: 'Australia', sku: 'FIO-AU-005', price: 145.00, image: '/Products/Australia.png', moq: '1 piece', isGuaranteed: true, description: 'The Australia base offers a unique blend of comfort, durability, and natural hair movement.' },
      { id: 6, name: 'Full Lace', sku: 'FIO-FL-006', price: 220.00, image: '/Products/Full Lace.png', moq: '1 piece', isGuaranteed: true, description: '100% Full Lace construction for maximum breathability and the ultimate freedom to part your hair anywhere.' }
    ];

    return new Response(JSON.stringify(fallbackProducts), {
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

    if (!env.DB) {
      throw new Error("Database not connected. Please bind Cloudflare D1.");
    }

    // Insert into D1
    const { success } = await env.DB.prepare(
      "INSERT INTO Products (name, price, image, description, sku, moq, isGuaranteed) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(
      body.name, 
      body.price, 
      body.image || '/Products/Hollywood.png', 
      body.description || '', 
      body.sku || `FIO-${Math.floor(Math.random() * 1000)}`, 
      '1 piece', 
      1
    ).run();

    return new Response(JSON.stringify({ success, product: body }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
