'use client';

import { useEffect, useState } from 'react';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { AddColumnDialog } from './dashboard/add-column-dialog';

type DynamicColumn = {
  id: string;
  name: string;
  type: 'text' | 'date';
};

export default function SheetTable({ spreadsheetId }: { spreadsheetId: string }) {
  const [data, setData] = useState<string[][]>([]);
  const [dynamicColumns, setDynamicColumns] = useState<DynamicColumn[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/sheets/sse?id=${spreadsheetId}`);
    
    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };

    return () => eventSource.close();
  }, [spreadsheetId]);

  const handleAddColumn = (column: { name: string; type: 'text' | 'date' }) => {
    const newColumn: DynamicColumn = { id: crypto.randomUUID(), ...column };
    setDynamicColumns([...dynamicColumns, newColumn]);
    // Save to backend
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render base columns */}
            {data[0]?.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
            {/* Render dynamic columns */}
            {dynamicColumns.map((col) => (
              <TableHead key={col.id}>{col.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(1).map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
              {dynamicColumns.map((col) => (
                <TableCell key={col.id}>
                  {col.type === 'date' ? (
                    <input type="date" className="border rounded p-1" />
                  ) : (
                    <input type="text" className="border rounded p-1" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddColumnDialog onAddColumn={handleAddColumn} />
    </div>
  );
}
