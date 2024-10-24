"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useAccount} from "wagmi";
import {useGroupsStore} from "@/stores/useGroupsStore";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useAddressesStore} from "@/stores/useAddressesStore";
import {useCallback, useEffect} from "react";
import {isAddress} from "viem";

const FormSchema = z.object({
    walletAddress: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    groupId: z.any(),
})

type AddressFormProps = {
    submitForm: any,
    isEdit?: boolean
}

const initialFormData = {
    walletAddress: "",
    name: "",
    email: "",
    groupId: ""
}

export function AddressForm({submitForm, isEdit = false}: AddressFormProps) {
    const {groups} = useGroupsStore()
    const {isLoadingAddAddresses, selectedAddress} = useAddressesStore()
    const {address} = useAccount()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialFormData
    })

    const resetForm = () => {
        form.resetField('name')
        form.resetField('walletAddress')
        form.resetField('email')
        form.resetField('groupId')
    }

    useEffect(() => {
        if (selectedAddress && isEdit) {
            form.setValue('name', selectedAddress.name)
            form.setValue('email', selectedAddress.email)
            form.setValue('walletAddress', selectedAddress.walletAddress)
            form.setValue('groupId', selectedAddress.groupId)
        }
    }, [selectedAddress, isEdit]);

    const onSubmit = useCallback(async (data: z.infer<typeof FormSchema>) => {
        if (!isAddress(data.walletAddress)) {
            form.setError('walletAddress', {message: 'Invalid address!'})
            return
        }
        const newAddress = await submitForm({ownerAddress: address!, data: data, id: selectedAddress?._id})
        if (newAddress) resetForm()
    }, [address, selectedAddress])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
                <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Wallet Address</FormLabel>
                            <FormControl>
                                <Input disabled={isEdit} placeholder="Wallet Address" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
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
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="groupId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Select
                                {...field}
                                onValueChange={field.onChange}
                                defaultValue={field.value === "" ? field.value : selectedAddress?._id}
                                value={field.value !== "" ? field.value : selectedAddress?.groupId}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Group"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {groups && groups?.map((group) => (
                                        <SelectItem
                                            key={`group-${group._id}`}
                                            value={group._id}
                                        >
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                    {groups && groups.length === 0 &&
                                        <SelectItem value={'no-groups'} key={`no-groups`} disabled={true}>
                                            No saved groups
                                        </SelectItem>
                                    }
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className={'flex justify-end items-center align-middle'}>
                    <Button
                        className={'mt-4'}
                        disabled={isLoadingAddAddresses}
                        isLoading={isLoadingAddAddresses}
                        type="submit"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}
