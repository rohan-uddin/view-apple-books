"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {Book, columns } from "./columns";

// moved the getData code from CardDetails to here
import { DataTable } from "@/components/data-table";
interface BookTitle {
  bookID: string;
  title: string;
  author: string;
  checked: boolean;
}

export default function DataTableCard() {
  
  const [bookData, setData] = useState<BookTitle[]>([])
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    fetch('/api/titles')
      .then((res) => res.json())
      .then((data) => {
        setData(data["book_titles"])
        // console.log("data", data["book_titles"].slice(0,10))
        setLoading(false)
      })
  }, [])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Apple Books — Highlights Manager</CardTitle>
        <CardDescription>Use this to select books</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <DataTable columns={columns} data={bookData} />
      </CardContent>
      {/* <CardDetails /> */}
      {/* <CardDetailsTwo /> */}
    </Card>
  );
}