"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
// import { DataTableRowActions } from "./data-table-row-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Book = {
  bookID: string
  title: string
  author: string
  // checked: boolean
  // status: "pending" | "processing" | "success" | "failed"
}

export const columns: ColumnDef<Book>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex flex-row">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      </div>
    ),
    cell: ({row}) => {
      return (
        <div className="normal-case">
          <Checkbox 
            id={row.original.bookID} 
            checked = {row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        </div>
      )
    }
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({row}) => {
      return (
        <div className="max-w-[500px] truncate font-medium">
          {row.original.title}
        </div>
      )
    }
  },
  {
    accessorKey: "author",
    header: "Author(s)",
    cell: ({row}) => {
      return (
        <div className="w-[200px] truncate items-center">
          {row.original.author}
        </div>
      )
    }
  },
]
