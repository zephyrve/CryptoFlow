"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useCallback, useEffect} from "react";
import {Textarea} from "@/components/ui/textarea";
import {useAccount} from "wagmi";
import {useGroupsStore} from "@/stores/useGroupsStore";

const FormSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(3),
    status: z.boolean()
})

const initialFormData = {
    name: "",
    description: "",
    status: true
}

export function GroupForm({submitForm, isEditForm = false}: { submitForm: any, isEditForm?: boolean }) {
    const {isLoadingAddGroup, setSelectedGroup, selectedGroup, setIsOpenEditModal, setIsOpenDeleteModal} = useGroupsStore()
    const {address} = useAccount()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialFormData
    })

    useEffect(() => {
        if (selectedGroup && isEditForm) {
            form.setValue('name', selectedGroup.name)
            form.setValue('description', selectedGroup.description)
        }
    }, [selectedGroup, isEditForm]);

    const onSubmit = useCallback(async (data: z.infer<typeof FormSchema>) => {
        const newGroup = await submitForm({ownerAddress: address!, data, id: selectedGroup?._id})
        if (newGroup) {
            form.resetField('name')
            form.resetField('description')
        }
        form.reset(initialFormData)
        setSelectedGroup(null)
        setIsOpenDeleteModal(false)
        setIsOpenEditModal(false)
    }, [selectedGroup, address])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Description" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button
                    disabled={isLoadingAddGroup}
                    isLoading={isLoadingAddGroup}
                    type="submit"
                >
                    Save
                </Button>
            </form>
        </Form>
    )
}
