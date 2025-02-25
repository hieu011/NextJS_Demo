"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  import { useQuery } from "@tanstack/react-query";
  
  export default function TableDemo() {
    const { data: products, error, isLoading } = useQuery({
      queryKey: ["products"],
      queryFn: async () => {
        const res = await fetch("/api/product");
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      },
    });
  
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">ID</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-center">{item.id}</TableCell>
              <TableCell className="text-center">{item.name}</TableCell>
              <TableCell className="text-center">{item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        </TableFooter>
      </Table>
    )
  }
  