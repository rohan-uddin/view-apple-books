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

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

interface BookTitle {
  bookID: string;
  title: string;
  author: string;
  checked: boolean;
}

interface BookTitlesResponse {
  book_titles: BookTitle[];
}

// FORM LOGIC BEGINS
const formSchemaOLD = z.object({
  title: z.string(),
  author: z.string(),
  bookID: z.string(),
  checked: z.boolean(),
})

const formSchema = z.object({
  bookInfo: z.array(z.string()).refine((value) => value.some((book) => book), {
    message: "You have to select at least one book!",
  }),
})

export function CardDetailsTwo() {
  const [data, setData] = useState<BookTitle[]>([])
  const [isLoading, setLoading] = useState(true)
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookInfo: [],
    },
  })

  useEffect(() => {
    fetch('/api/titles')
      .then((res) => res.json())
      .then((data) => {
        setData(data["book_titles"]) // this returns an array of objects!
        // console.log("data", data["book_titles"].slice(0,10))
        setLoading(false)
      })
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data found</p>
  
  
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(JSON.stringify(values, null, 2))
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Apple Books — Highlights Manager</h3>
          <div className="space-y-4">
            {data && !isLoading && data.map((dataItem) => (
            <FormField
              key={dataItem.bookID}
              control={form.control}
              name="bookInfo"
              // value={dataItem.bookID}
              render={({ field }) => (
                <FormItem key={dataItem.bookID} className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{dataItem.title}</FormLabel>
                    <FormDescription>
                      {dataItem.author}
                    </FormDescription>
                  </div>
                  <FormControl>
                    {/* NOTE THE LOGIC IN THE SWITCH! */}
                    <Switch
                      checked={field.value?.includes(dataItem.bookID)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, dataItem.bookID])
                          : field.onChange(
                              field.value?.filter(
                                (value) => value !== dataItem.bookID
                              )
                            )
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            ))}
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}


/**
 * STUFF
 * 
 * <Card>
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
 */