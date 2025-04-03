"use client"

import { useState } from "react"; // Add this import
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { Input } from "../components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Edit, Loader2 } from "lucide-react"
import { User } from "../type/User"
import { useUpdateUser } from "../hook/useUserHook"
import { notify } from "../lib/notify"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function EditUserForm({ user }: { user: User }) {
  const [open, setOpen] = useState(false); // Add state for dialog control
  const updateUser = useUpdateUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateUser.mutate({ _id: user._id ?? "", userData: { ...values, _id: user._id ?? "", createdAt: user.createdAt, updatedAt: user.updatedAt } }, {
      onError: () => {
        notify({
          message: "Error updating user",
          type: 'error',
          position: 'top-right',
          duration: 4000
        })
      },
      onSuccess: () => {
        notify({
          message: "User has been updated successfully",
          type: 'success',
          position: 'top-right',
          duration: 4000
        })
        setOpen(false); // Close the dialog on success
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}> {/* Add open and onOpenChange props */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit {user.name}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setOpen(false)} // Update to use setOpen
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}