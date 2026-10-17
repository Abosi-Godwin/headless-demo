"use client";

import { useActionState, useEffect, useState } from "react";
import type {
    Customer,
    CustomerAddress,
    FormState
} from "../../../lib/CustomerAccount";

import {
    createAddressAction,
    deleteAddressAction,
    updateNameAction
} from "../actions";

type Tab = "orders" | "addresses" | "details";

type Props = {
    customer: Customer;
};

type AddressField = {
    name: string;
    label: string;
    half?: boolean;
    required?: boolean;
    placeholder?: string;
    maxLength?: number;
};

const tabs: { key: Tab; label: string }[] = [
    { key: "orders", label: "Orders" },
    { key: "addresses", label: "Addresses" },
    { key: "details", label: "Details" }
];

const addressFields: AddressField[] = [
    { name: "firstName", label: "First name", half: true, required: true },
    { name: "lastName", label: "Last name", half: true, required: true },
    { name: "address1", label: "Address", required: true },
    { name: "address2", label: "Apartment, suite" },
    { name: "city", label: "City", required: true },
    { name: "zoneCode", label: "State code", half: true, placeholder: "NY" },
    { name: "zip", label: "Postal code", half: true },
    {
        name: "territoryCode",
        label: "Country code",
        half: true,
        required: true,
        placeholder: "US",
        maxLength: 2
    },
    { name: "phoneNumber", label: "Phone", half: true }
];

const initialState: FormState = {};

const inputClass =
    "w-full border border-white/15 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white read-only:text-white/40";

const labelClass =
    "mb-2 block text-[11px] uppercase tracking-[0.2em] text-white/50";

const primaryButton =
    "w-full bg-white px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-90 disabled:opacity-50";

const formatPrice = (amount: string, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
        Number(amount)
    );

const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC"
    }).format(new Date(iso));

const formatMonth = (iso: string) =>
    new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    }).format(new Date(iso));

const statusLabel = (value?: string | null) =>
    value ? value.replace(/_/g, " ").toLowerCase() : "pending";

const NameForm = ({ customer }: { customer: Customer }) => {
    const [state, action, pending] = useActionState(
        updateNameAction,
        initialState
    );

    return (
        <form action={action} className="flex flex-col gap-6">
            <h2 className="text-sm font-bold uppercase tracking-widest">
                Your details
            </h2>
            <div>
                <label htmlFor="firstName" className={labelClass}>
                    First name
                </label>
                <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    defaultValue={customer.firstName ?? ""}
                    className={inputClass}
                />
            </div>
            <div>
                <label htmlFor="lastName" className={labelClass}>
                    Last name
                </label>
                <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    defaultValue={customer.lastName ?? ""}
                    className={inputClass}
                />
            </div>
            <div>
                <label htmlFor="email" className={labelClass}>
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    readOnly
                    value={customer.emailAddress?.emailAddress ?? ""}
                    className={inputClass}
                />
            </div>
            {customer.phoneNumber && (
                <div>
                    <label htmlFor="phone" className={labelClass}>
                        Phone
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        readOnly
                        value={customer.phoneNumber.phoneNumber}
                        className={inputClass}
                    />
                </div>
            )}
            <p className="text-xs text-white/40">
                Email and phone can't be changed here.
            </p>
            {state.error && (
                <p role="alert" className="text-sm text-red-300">
                    {state.error}
                </p>
            )}
            {state.ok && <p className="text-sm text-white/60">Saved.</p>}
            <button type="submit" disabled={pending} className={primaryButton}>
                {pending ? "Saving" : "Save changes"}
            </button>
        </form>
    );
};

const AddressForm = ({ onDone }: { onDone: () => void }) => {
    const [state, action, pending] = useActionState(
        createAddressAction,
        initialState
    );

    useEffect(() => {
        if (state.ok) {
            onDone();
        }
    }, [state, onDone]);

    return (
        <form
            action={action}
            className="mt-4 grid grid-cols-2 gap-4 border border-white/15 p-5"
        >
            {addressFields.map(field => (
                <div
                    key={field.name}
                    className={field.half ? "col-span-1" : "col-span-2"}
                >
                    <label htmlFor={`new-${field.name}`} className={labelClass}>
                        {field.label}
                    </label>
                    <input
                        id={`new-${field.name}`}
                        name={field.name}
                        type="text"
                        required={field.required}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        className={inputClass}
                    />
                </div>
            ))}
            <label className="col-span-2 flex items-center gap-3 text-xs uppercase tracking-widest text-white/60">
                <input
                    type="checkbox"
                    name="defaultAddress"
                    className="h-4 w-4 accent-white"
                />
                Make default
            </label>
            {state.error && (
                <p role="alert" className="col-span-2 text-sm text-red-300">
                    {state.error}
                </p>
            )}
            <div className="col-span-2 flex flex-col gap-3">
                <button
                    type="submit"
                    disabled={pending}
                    className={primaryButton}
                >
                    {pending ? "Saving" : "Save address"}
                </button>
                <button
                    type="button"
                    onClick={onDone}
                    className="border border-white/15 px-5 py-4 text-xs uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white hover:text-white"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

const AddressCard = ({
    address,
    isDefault
}: {
    address: CustomerAddress;
    isDefault: boolean;
}) => {
    const name = [address.firstName, address.lastName]
        .filter(Boolean)
        .join(" ");

    return (
        <article className="flex flex-col gap-4 border border-white/15 p-5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    {name || "Address"}
                </span>
                {isDefault && (
                    <span className="border border-white/25 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/70">
                        Default
                    </span>
                )}
            </div>
            <p className="flex flex-col gap-1 text-sm text-white/60">
                {address.formatted.map(line => (
                    <span key={line}>{line}</span>
                ))}
            </p>
            <form action={deleteAddressAction}>
                <input type="hidden" name="addressId" value={address.id} />
                <button
                    type="submit"
                    className="text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
                >
                    Remove
                </button>
            </form>
        </article>
    );
};

const ProfileClient = ({ customer }: Props) => {
    const [tab, setTab] = useState<Tab>("orders");
    const [adding, setAdding] = useState(false);

    const email = customer.emailAddress?.emailAddress ?? "";
    const name =
        [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
        email ||
        "Account";

    return (
        <section className="mx-auto w-full max-w-4xl px-8 py-12 font-mono text-white">
            <header className="flex flex-col gap-6 border-b border-white/15 pb-8">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                    Account
                </p>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black uppercase tracking-tight">
                        {name}
                    </h1>
                    {email && <p className="text-sm text-white/60">{email}</p>}
                    <p className="text-xs uppercase tracking-widest text-white/40">
                        Member since {formatMonth(customer.creationDate)}
                    </p>
                </div>
                <form action="/auth/logout" method="post">
                    <button
                        type="submit"
                        className="w-fit border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white hover:text-white"
                    >
                        Sign out
                    </button>
                </form>
            </header>

            <div
                role="tablist"
                className="mt-8 grid grid-cols-3 border border-white/15"
            >
                {tabs.map(item => {
                    const active = tab === item.key;

                    return (
                        <button
                            key={item.key}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setTab(item.key)}
                            className={`px-2 py-3 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                                active
                                    ? "bg-white text-black"
                                    : "text-white/60 hover:text-white"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8">
                {tab === "orders" && (
                    <div>
                        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest">
                            Order history
                        </h2>
                        {customer.orders.nodes.length === 0 ? (
                            <p className="border border-white/15 p-6 text-sm text-white/60">
                                No orders yet.
                            </p>
                        ) : (
                            <ul className="divide-y divide-white/15 border border-white/15">
                                {customer.orders.nodes.map(order => {
                                    const items = order.lineItems.nodes.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0
                                    );

                                    return (
                                        <li
                                            key={order.id}
                                            className="flex items-start justify-between gap-4 p-5"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold tracking-wide">
                                                    #{order.number}
                                                </span>
                                                <span className="text-xs text-white/50">
                                                    {formatDate(
                                                        order.processedAt
                                                    )}
                                                </span>
                                                <span className="text-xs text-white/50">
                                                    {items}{" "}
                                                    {items === 1
                                                        ? "item"
                                                        : "items"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-sm">
                                                    {formatPrice(
                                                        order.totalPrice.amount,
                                                        order.totalPrice
                                                            .currencyCode
                                                    )}
                                                </span>
                                                <span className="border border-white/25 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/70">
                                                    {statusLabel(
                                                        order.fulfillments
                                                            .nodes[0]?.status ??
                                                            order.financialStatus
                                                    )}
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}

                {tab === "addresses" && (
                    <div>
                        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest">
                            Saved addresses
                        </h2>
                        {customer.addresses.nodes.length === 0 ? (
                            <p className="border border-white/15 p-6 text-sm text-white/60">
                                No saved addresses.
                            </p>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {customer.addresses.nodes.map(address => (
                                    <AddressCard
                                        key={address.id}
                                        address={address}
                                        isDefault={
                                            customer.defaultAddress?.id ===
                                            address.id
                                        }
                                    />
                                ))}
                            </div>
                        )}
                        {adding ? (
                            <AddressForm onDone={() => setAdding(false)} />
                        ) : (
                            <button
                                type="button"
                                onClick={() => setAdding(true)}
                                className="mt-4 w-full border border-dashed border-white/25 px-5 py-4 text-xs uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white hover:text-white"
                            >
                                Add address
                            </button>
                        )}
                    </div>
                )}

                {tab === "details" && <NameForm customer={customer} />}
            </div>
        </section>
    );
};

export default ProfileClient;
