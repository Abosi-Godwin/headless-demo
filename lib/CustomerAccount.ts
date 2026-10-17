import { getGraphqlUrl, requireAccessToken } from "./CustomerAuth";

export type FormState = {
    error?: string;
    ok?: boolean;
};

export type CustomerAddress = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    zoneCode: string | null;
    territoryCode: string | null;
    zip: string | null;
    phoneNumber: string | null;
    formatted: string[];
};

export type CustomerOrder = {
    id: string;
    number: number;
    processedAt: string;
    financialStatus: string | null;
    fulfillments: { nodes: { status: string }[] };
    lineItems: { nodes: { quantity: number }[] };
    totalPrice: { amount: string; currencyCode: string };
};

export type Customer = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    creationDate: string;
    emailAddress: { emailAddress: string } | null;
    phoneNumber: { phoneNumber: string } | null;
    defaultAddress: { id: string } | null;
    addresses: { nodes: CustomerAddress[] };
    orders: { nodes: CustomerOrder[] };
};

type UserError = { message: string };

const PROFILE_PATH = "/profile";

const CUSTOMER_QUERY = `
query ProfileCustomer {
  customer {
    id
    firstName
    lastName
    creationDate
    emailAddress { emailAddress }
    phoneNumber { phoneNumber }
    defaultAddress { id }
    addresses(first: 10) {
      nodes {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        zoneCode
        territoryCode
        zip
        phoneNumber
        formatted
      }
    }
    orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
      nodes {
        id
        number
        processedAt
        financialStatus
        fulfillments(first: 1) { nodes { status } }
        lineItems(first: 50) { nodes { quantity } }
        totalPrice { amount currencyCode }
      }
    }
  }
}`;

const UPDATE_NAME_MUTATION = `
mutation CustomerUpdate($customer: CustomerUpdateInput!) {
  customerUpdate(input: $customer) {
    customer { id firstName lastName }
    userErrors { code field message }
  }
}`;

const CREATE_ADDRESS_MUTATION = `
mutation CustomerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
  customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
    customerAddress { id }
    userErrors { code field message }
  }
}`;

const DELETE_ADDRESS_MUTATION = `
mutation CustomerAddressDelete($addressId: ID!) {
  customerAddressDelete(addressId: $addressId) {
    deletedAddressId
    userErrors { code field message }
  }
}`;

const customerFetch = async <T>(
    query: string,
    variables: Record<string, unknown> = {}
): Promise<T> => {
    const token = await requireAccessToken(PROFILE_PATH);
    const url = await getGraphqlUrl();

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({ query, variables }),
        cache: "no-store"
    });

    const text = await res.text();

    if (!res.ok) {
        throw new Error(
            `Customer Account API ${res.status}: ${text.slice(0, 300)}`
        );
    }

    let json: { data?: T; errors?: unknown };

    try {
        json = JSON.parse(text);
    } catch {
        throw new Error(
            "Customer Account API did not return JSON. If the dev store has a storefront password, remove it."
        );
    }

    if (json.errors) {
        throw new Error(
            `Customer Account API errors: ${JSON.stringify(json.errors)}`
        );
    }

    return json.data as T;
};

const messages = (errors?: UserError[] | null) =>
    (errors ?? []).map(error => error.message);

export const getCustomer = async () => {
    const data = await customerFetch<{ customer: Customer }>(CUSTOMER_QUERY);
    return data.customer;
};

export const updateName = async (input: {
    firstName: string;
    lastName: string;
}) => {
    const data = await customerFetch<{
        customerUpdate: { userErrors: UserError[] | null };
    }>(UPDATE_NAME_MUTATION, { customer: input });

    return messages(data.customerUpdate.userErrors);
};

export const createAddress = async (
    address: Record<string, string>,
    defaultAddress: boolean
) => {
    const data = await customerFetch<{
        customerAddressCreate: { userErrors: UserError[] | null };
    }>(CREATE_ADDRESS_MUTATION, { address, defaultAddress });

    return messages(data.customerAddressCreate.userErrors);
};

export const deleteAddress = async (addressId: string) => {
    const data = await customerFetch<{
        customerAddressDelete: { userErrors: UserError[] | null };
    }>(DELETE_ADDRESS_MUTATION, { addressId });

    return messages(data.customerAddressDelete.userErrors);
};
