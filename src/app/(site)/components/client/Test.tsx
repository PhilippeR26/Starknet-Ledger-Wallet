"use client";
import { Button, Center, Field, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
    targetAddress: string,
    amount: string
}

export default function Test() {
    const [addr, setAddr] = useState<string>("AAA");
    const [Qty, setQty] = useState<string>("BBB");
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting, isValid }
    } = useForm<FormValues>();

    async function onSubmitResponse(values: FormValues) {
        console.log("values=", values);
        setAddr(values.targetAddress);
        setQty(values.amount);
    }
    return (<>
        <br></br>
        <br></br>
        <form onSubmit={handleSubmit(onSubmitResponse)}>
            <Center>
                <Field.Root>
                    <Field.Label>address0</Field.Label>
                    <Input
                        placeholder="Test address"
                        {...register("targetAddress")}
                    />
                    <Field.Label>Test Label1</Field.Label>
                    <Input
                        placeholder="Test address"
                        {...register("amount", { required: true })}
                    />
                    <Field.ErrorText>This field is required</Field.ErrorText>
                </Field.Root>
            </Center>
            <Center>
                <Button loading={isSubmitting} type="submit">sfdg</Button>
                {`Address: ${addr} - Amount: ${Qty}`}
            </Center>
        </form>
    </>);
}