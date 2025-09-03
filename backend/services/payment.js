export const charge = async ({ amount, userId, eventId }) => {
  await new Promise((r) => setTimeout(r, 200));
  return { id: `pay_${Date.now()}`, status: 'succeeded', amount, userId, eventId };
};
