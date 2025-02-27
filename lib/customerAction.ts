export async function getCustomers() {
  const res = await fetch(`/api/customer`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}
