export async function getCustomers() {
    const res = await fetch("http://localhost:3000/api/customer", {
      cache: "no-store",
    });
  
    if (!res.ok) throw new Error("Failed to fetch customers");
  
    return res.json();
}
  