import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not set in environment variables");
      return NextResponse.json({ ok: false, error: "Webhook not configured" }, { status: 500 });
    }

    const data = await request.json();
    const { formData, cart, cartSubtotal, shippingCost, totalCost, isFreeShipping } = data;

    const itemsList =
      Array.isArray(cart) && cart.length > 0
        ? cart
            .map(
              (item: any) =>
                `• ${item.product?.name || "Unknown item"}${
                  item.selectedShade ? ` (${item.selectedShade.name})` : ""
                } x${item.quantity} — Rs. ${(item.product?.price * item.quantity).toFixed(2)}`
            )
            .join("\n")
        : "No items";

    const embed = {
      title: "🛍️ New Order Received",
      color: 0xff385c,
      fields: [
        { name: "Customer", value: `${formData.firstName} ${formData.lastName}`, inline: true },
        { name: "Phone", value: formData.phone || "N/A", inline: true },
        { name: "Email", value: formData.email || "Not provided", inline: true },
        {
          name: "Address",
          value: `${formData.address}, ${formData.city}${formData.zipCode ? `, ${formData.zipCode}` : ""}`,
        },
        { name: "Items", value: itemsList },
        { name: "Subtotal", value: `Rs. ${Number(cartSubtotal).toFixed(2)}`, inline: true },
        {
          name: "Shipping",
          value: isFreeShipping ? "FREE" : `Rs. ${Number(shippingCost).toFixed(2)}`,
          inline: true,
        },
        { name: "Total", value: `Rs. ${Number(totalCost).toFixed(2)}`, inline: true },
        { name: "Payment Method", value: "Cash on Delivery" },
      ],
      timestamp: new Date().toISOString(),
    };

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!discordRes.ok) {
      const text = await discordRes.text();
      console.error("Discord webhook responded with an error:", text);
      return NextResponse.json({ ok: false, error: "Discord webhook failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Discord notify route error:", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}