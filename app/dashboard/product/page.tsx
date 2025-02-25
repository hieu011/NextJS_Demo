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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react"

export default function TableDemo() {

  const { data: customers = [], error, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch("/api/customer");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const [index, setIndex] = useState(50);
  const [listCustomer, setListCustomer] = useState(customers.slice(0, 50));

  useEffect(() => {
    if (customers.length > 0 && customers.length >= index) {
      setListCustomer(customers.slice(0, index));
    }
  }, [index, customers]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">ID</TableHead>
            <TableHead className="text-center">CustomerName</TableHead>
            <TableHead className="text-center">ProductName</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-center">UnitPrice</TableHead>
            <TableHead className="text-center">TotalPrice</TableHead>
            <TableHead className="text-center">SaleDate</TableHead>
            <TableHead className="text-center">Payment</TableHead>
          </TableRow>
        </TableHeader>
        {listCustomer.length > 0 ? (
          <TableBody>
            {listCustomer.map((item: any) => (
              <TableRow key={item.sale_id}>
                <TableCell className="font-medium text-center">{item.sale_id}</TableCell>
                <TableCell className="text-center">{item.customer_name}</TableCell>
                <TableCell className="text-center">{item.product_name}</TableCell>
                <TableCell className="text-center">{item.quantity_sold}</TableCell>
                <TableCell className="text-center">{item.unit_price}</TableCell>
                <TableCell className="text-center">{item.total_price}</TableCell>
                <TableCell className="text-center">{item.sale_date}</TableCell>
                <TableCell className="text-center">{item.payment_method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell className="text-center" colSpan={8}>Không có dữ liệu</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <>
        <div className="flex justify-center w-full p-4">
          <Button size="icon" onClick={() => setIndex(prevIndex => prevIndex + 50)}>
            <ChevronDown />
          </Button>
        </div>
      </>
    </>
  )
}
