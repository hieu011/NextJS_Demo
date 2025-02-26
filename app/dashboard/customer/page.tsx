"use client"
import { columns } from "./colums";
import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/lib/customerAction";

export default function ListCustomer() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
