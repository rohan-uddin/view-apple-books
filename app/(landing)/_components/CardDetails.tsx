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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface BookTitle {
  bookID: string;
  title: string;
  author: string;
  checked: boolean;
}

interface BookTitlesResponse {
  book_titles: BookTitle[];
}


export function CardDetails() {
  const [data, setData] = useState<BookTitle[]>([])
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
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data found</p>
  

  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Apple Books — Highlights Manager</CardTitle>
        <CardDescription>Use this to select books</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
      {data && !isLoading && data.map((dataItem) => (
          <div key={dataItem.bookID} className="flex items-center justify-between space-x-2">
            <Label htmlFor={dataItem.bookID} className="flex flex-col space-y-1">
              <span>{dataItem.title}</span>
              <span className="font-normal leading-snug text-muted-foreground">
                {dataItem.author}
              </span>
            </Label>
            <Switch id={dataItem.bookID}/>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Export Highlights
        </Button>
      </CardFooter>
    </Card>
  )
}