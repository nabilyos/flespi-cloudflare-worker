export default {
  async fetch(request) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405, headers });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400, headers });
    }

    const latitude = data.lat || data.latitude;
    const longitude = data.lon || data.longitude;
    const imei = data.imei;

    if (!latitude || !longitude || !imei) {
      return new Response("Missing coordinates or IMEI", { status: 400, headers });
    }

    const imeiToDeviceId = {
      "864893039945509": 1
    };

    const deviceId = imeiToDeviceId[imei];
    if (!deviceId) {
      return new Response(`IMEI ${imei} not registered`, { status: 400, headers });
    }

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
      });
    } catch (err) {
      return new Response("Failed to forward to Traccar", { status: 500, headers });
    }

    return new Response("Forwarded to Traccar", { status: 200, headers });
  }
};
