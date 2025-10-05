const API_BASE_URL = 'http://localhost:8080';

export interface Plan {
    id: string;
    name: string;
    price: number;
    billingCycle: 'MONTHLY' | 'YEARLY';
}

export interface Client {
    id: string;
    name: string;
    email: string;
}

export interface Subscription {
    id: string;
    clientId: string;
    planId: string;
    startDate: string;
    status: 'ACTIVE' | 'CANCELED';
}

export interface Invoice {
    id: string;
    subscriptionId: string;
    amount: number;
    dueDate: string;
    status: 'PENDING' | 'PAID';
}

const api = {
    // Plans
    getPlans: (): Promise<Plan[]> => fetch(`${API_BASE_URL}/plans`).then(res => res.json()),
    createPlan: (plan: Omit<Plan, 'id'>): Promise<Plan> => fetch(`${API_BASE_URL}/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
    }).then(res => res.json()),

    // Clients
    getClients: (): Promise<Client[]> => fetch(`${API_BASE_URL}/clients`).then(res => res.json()),
    getClientById: (id: string): Promise<Client> => fetch(`${API_BASE_URL}/clients/${id}`).then(res => res.json()),
    createClient: (client: Omit<Client, 'id'>): Promise<Client> => fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
    }).then(res => res.json()),

    // Subscriptions
    getSubscriptions: (): Promise<Subscription[]> => fetch(`${API_BASE_URL}/subscriptions`).then(res => res.json()),
    createSubscription: (data: { clientId: string, planId: string }): Promise<Subscription> => fetch(`${API_BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(res => res.json()),

    // Invoices
    getInvoices: (): Promise<Invoice[]> => fetch(`${API_BASE_URL}/invoices`).then(res => res.json()),
    payInvoice: (invoiceId: string): Promise<Invoice> => fetch(`${API_BASE_URL}/invoices/${invoiceId}/pay`, {
        method: 'POST',
    }).then(res => {
        if (!res.ok) {
            throw new Error('Failed to pay invoice');
        }
        // Handle cases where the response might be empty on success
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return res.json();
        } else {
            return { id: invoiceId, status: 'PAID' } as Invoice; // Simulate a successful response
        }
    }),
};

export default api;