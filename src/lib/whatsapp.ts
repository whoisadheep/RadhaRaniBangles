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
