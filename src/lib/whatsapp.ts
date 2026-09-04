const WHATSAPP_NUMBER = "919519688760";

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getProductWhatsAppUrl(product: {
  name: string;
  price: number;
  slug: string;
}, size: string, quantity: number) {
  return getWhatsAppUrl(
    `Hello Radha Rani Bangles, I'd like to order:\n\nItem: ${product.name}\nSize: ${size} inches\nQuantity: ${quantity}\nPrice: ₹${product.price.toLocaleString("en-IN")}\nProduct: /product/${product.slug}\n\nPlease help me complete my order.`
  );
}

export function getCartWhatsAppUrl(
  items: { product: { name: string; price: number }; size: string; quantity: number }[],
  total: number
) {
  const itemsSummary = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (Size: ${item.size}", Qty: ${item.quantity}) - ₹${(
          item.product.price * item.quantity
        ).toLocaleString("en-IN")}`
    )
    .join("\n");

  return getWhatsAppUrl(
    `Hello Radha Rani Bangles! I'd like to place an order for the following items in my bag:\n\n${itemsSummary}\n\n*Total Amount: ₹${total.toLocaleString(
      "en-IN"
    )}*\n\nPlease confirm availability and share the payment details.`
  );
}
