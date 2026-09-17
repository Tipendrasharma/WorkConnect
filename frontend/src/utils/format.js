export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);

export const formatDistance = (km) => {
  if (km == null) return "";
  return km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`;
};

export const buildWhatsAppLink = (mobile, workerName) => {
  const cleaned = mobile.replace(/\D/g, "");
  const message = encodeURIComponent(`Hi ${workerName}, I found your profile on WorkerConnect and would like to hire you.`);
  return `https://wa.me/${cleaned}?text=${message}`;
};

export const buildCallLink = (mobile) => `tel:${mobile}`;
