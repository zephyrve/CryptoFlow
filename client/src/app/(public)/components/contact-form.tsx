'use client'

import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {Card, CardContent} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {toast} from "sonner";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const FormSchema = z.object({
    name: z.string().min(1, {message: 'Name must contain at least 1 character(s)'}),
    email: z.string().email(),
    message: z.string().min(1, {message: 'Message must contain at least 5 character(s)'}),
})

const initialFormData = {
    name: '',
    email: '',
    message: '',
}

export default function ContactForm() {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialFormData
    })

    async function submitContact(data: z.infer<typeof FormSchema>): Promise<any> {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/contacts/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || "Failed to submit contact form");
            }

            const submission = await response.json();
            toast.success('Contact form submitted successfully.')
            setIsLoading(false)

            form.reset({
                name: '',
                email: '',
                message: ''
            })
        } catch (e: any) {
            console.log(e);
            if (e?.shortMessage) toast.error(e?.shortMessage);
            else toast.error(e?.message);
            setIsLoading(false)
        }
    }

    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-purple-800 dark:text-purple-300">Contact
                            Us</h2>
                    </div>
                </div>
                <div className="mx-auto max-w-5xl items-center gap-6 py-0 lg:grid-cols-2 lg:gap-12">
                    <Card>
                        <CardContent className={'p-6'}>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(submitContact)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Your email" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Your message" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <Button isLoading={isLoading} disabled={isLoading} type="submit" className="w-full">Send
                                        Message</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}