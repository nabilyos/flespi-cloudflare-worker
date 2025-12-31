
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 })
    }

    let data
    try {
      data = await request.json()
    } catch {
      return new Response("Invalid JSON", { status: 400 })
    }

    await fetch(env.FORWARD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    return new Response("OK", { status: 200 })
  }
}
