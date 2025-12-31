export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 })
    }

    let data
    try {
      data = await request.json()
    } catch {
      return new Response("Invalid JSON", { status: 400 })
    }

    // Extract coordinates and IMEI from Flespi payload
    const latitude = data.lat || data.latitude
    const longitude = data.lon || data.longitude
    const imei = data.imei

    if (!latitude || !longitude || !imei) {
      return new Response("Missing coordinates or IMEI", { status: 400 })
    }

    // Map IMEI to Traccar deviceId (replace with your mapping)
    // You can add multiple devices here
    const imeiToDeviceId = {
      "864893039945509": 1  // Your device IMEI → Traccar deviceId
    }

    const deviceId = imeiToDeviceId[imei]
    if (!deviceId) {
      return new Response(`IMEI ${imei} not registered`, { status: 400 })
    }

    // Forward to Traccar demo
    try {
      await fetch("https://demo.traccar.org/api/positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa("demo:demo")
        },
        body: JSON.stringify({
          deviceId: deviceId,
          latitude: latitude,
          longitude: longitude
        })
      })
    } catch (err) {
      return new Response("Failed to forward to Traccar", { status: 500 })
    }

    return new Response("Forwarded to Traccar", { status: 200 })
  }
}
