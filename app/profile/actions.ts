"use server";

import { revalidatePath } from "next/cache";
import {
    createAddress,
    deleteAddress,
    updateName,
    type FormState
} from "../../lib/CustomerAccount";

const ADDRESS_KEYS = [
    "firstName",
    "lastName",
    "address1",
    "address2",
    "city",
    "zoneCode",
    "zip",
    "territoryCode",
    "phoneNumber"
] as const;

const read = (data: FormData, key: string) =>
    String(data.get(key) ?? "").trim();

export const updateNameAction = async (
    _state: FormState,
    data: FormData
): Promise<FormState> => {
    const errors = await updateName({
        firstName: read(data, "firstName"),
        lastName: read(data, "lastName")
    });

    if (errors.length > 0) {
        return { error: errors[0] };
    }

    revalidatePath("/profile");
    return { ok: true };
};

export const createAddressAction = async (
    _state: FormState,
    data: FormData
): Promise<FormState> => {
    const address: Record<string, string> = {};

    ADDRESS_KEYS.forEach(key => {
        const value = read(data, key);

        if (value) {
            address[key] = key === "territoryCode" ? value.toUpperCase() : value;
        }
    });

    const errors = await createAddress(
        address,
        data.get("defaultAddress") === "on"
    );

    if (errors.length > 0) {
        return { error: errors[0] };
    }

    revalidatePath("/profile");
    return { ok: true };
};

export const deleteAddressAction = async (data: FormData) => {
    const addressId = read(data, "addressId");

    if (!addressId) {
        return;
    }

    const errors = await deleteAddress(addressId);

    if (errors.length > 0) {
        throw new Error(errors[0]);
    }

    revalidatePath("/profile");
};
