"use client"
import { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from './data-table-pagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}



export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const { toast } = useToast();

  /* FROM THE TANSTACK DOCS: https://tanstack.com/table/latest/docs/guide/row-selection
  // This helps in getting the data! 
  // .rows returns an array of objects. 
  // From each object we need the 'original' key to get the data (which is also an object) */
  // console.log(table.getSelectedRowModel().rows)
  // attach this to a button
  function getSelectedRowData<TData>(table: any): TData[] {
    // const selectedRowData: TData[] = []; - dummy
    const selectedRowData: TData[] = [];
    const selectedRows = table.getSelectedRowModel().rows;
    
    for (const row of selectedRows) {
      selectedRowData.push(row.original);
    }
    console.log("selectedRowData", selectedRowData);

    // Send the data to the server
    const handlePostData = async () => {
      try {
        const response = await fetch('/api/highlights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedRowData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result);
        } else {
          console.error('Failed to post data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    handlePostData();

    toast({
      title: "Export complete.",
      description: `${selectedRowData.length} choice(s) have been submitted.`
    });
    return selectedRowData;
  }

  return (
    <div className='space-y-4'>
      <Button onClick={() => {getSelectedRowData(table)}}>Submit</Button>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div> */}
    </div>
  )
}
