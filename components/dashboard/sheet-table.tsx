'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddColumnDialog } from '@/components/dashboard/add-column-dialog'
import { toast } from 'sonner'

interface DynamicColumn {
  id: string
  name: string
  type: 'text' | 'date'
}

export function SheetTable() {
  const [sheetData, setSheetData] = useState<string[][]>([])
  const [dynamicColumns, setDynamicColumns] = useState<DynamicColumn[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/sheets/data',{
          method : "GET"
        })
        console.log("response of sheet data",response);
        // setSheetData(response.data)
      } catch (error) {
        toast.error('Failed to fetch sheet data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const eventSource = new EventSource('/api/sheets/sse')

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data)
      setSheetData(newData)
    }

    return () => eventSource.close()
  }, [])

  const handleAddColumn = (column: Omit<DynamicColumn, 'id'>) => {
    const newColumn = { ...column, id: crypto.randomUUID() }
    setDynamicColumns(prev => [...prev, newColumn])
    // Persist to backend
    api.post('/columns', newColumn).catch(() => {
      toast.error('Failed to save column')
      setDynamicColumns(prev => prev.filter(c => c.id !== newColumn.id))
    })
  }

  if (isLoading) return <div>Loading...</div>

  function handleCellUpdate(rowIndex: number, id: string, value: string): void {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {sheetData[0]?.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
            {dynamicColumns.map(col => (
              <TableHead key={col.id}>{col.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sheetData.slice(1).map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
              {dynamicColumns.map(col => (
                <TableCell key={col.id}>
                  {col.type === 'date' ? (
                    <input
                      type="date"
                      className="border rounded p-1 w-full"
                      onChange={(e) => handleCellUpdate(rowIndex, col.id, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      className="border rounded p-1 w-full"
                      onChange={(e) => handleCellUpdate(rowIndex, col.id, e.target.value)}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddColumnDialog onAddColumn={handleAddColumn} />
    </div>
  )
}