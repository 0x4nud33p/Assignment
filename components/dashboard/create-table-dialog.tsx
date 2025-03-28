'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { api } from '@/lib/api'

const formSchema = z.object({
  sheetTitle: z.string().min(1, 'Sheet title is required'),
  columns: z.array(z.object({
    name: z.string().min(1, 'Column name is required'),
    type: z.enum(['text', 'date'])
  })).min(1, 'At least one column is required')
})

export function CreateTableDialog() {
  const [open, setOpen] = useState(false)
  const [columnCount, setColumnCount] = useState(1)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheetTitle: '',
      columns: Array.from({ length: 1 }, () => ({ name: '', type: 'text' }))
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await api.post('/sheets/create', {
        title: values.sheetTitle,
        columns: values.columns
      })
      toast.success('Table created successfully!')
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error('Failed to create table')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create New Table</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="sheetTitle"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="sheetTitle">Sheet Title</Label>
                  <FormControl>
                    <Input {...field} id="sheetTitle" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Columns</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={columnCount}
                  onChange={(e) => {
                    const count = Math.min(Math.max(parseInt(e.target.value), 1), 10)
                    setColumnCount(count)
                    form.setValue('columns', Array.from({ length: count }, (_, i) => 
                      form.getValues(`columns.${i}`) || { name: '', type: 'text' }
                    ))
                  }}
                  className="w-20"
                />
              </div>

              {Array.from({ length: columnCount }).map((_, index) => (
                <div key={index} className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`columns.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder={`Column ${index + 1} name`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`columns.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="w-[150px]">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Table</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}