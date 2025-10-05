import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { type Invoice } from '../api';

const ClientDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const { data: client, isLoading: isLoadingClient } = useQuery({
        queryKey: ['client', id],
        queryFn: () => api.getClientById(id!),
        enabled: !!id,
    });

    const { data: plans, isLoading: isLoadingPlans } = useQuery({
        queryKey: ['plans'],
        queryFn: api.getPlans,
    });

    const { data: subscriptions, isLoading: isLoadingSubscriptions } = useQuery({
        queryKey: ['subscriptions', id],
        queryFn: async () => {
            const allSubs = await api.getSubscriptions();
            return allSubs.filter(sub => sub.clientId === id);
        },
        enabled: !!id,
    });

    const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
        queryKey: ['invoices', id],
        queryFn: async () => {
            if (!subscriptions) return [];
            const clientSubIds = subscriptions.map(s => s.id);
            const allInvoices = await api.getInvoices();
            return allInvoices.filter(inv => clientSubIds.includes(inv.subscriptionId));
        },
        enabled: !!subscriptions,
    });

    const payInvoiceMutation = useMutation({
        mutationFn: (invoiceId: string) => api.payInvoice(invoiceId),
        onSuccess: () => {
            // Invalidate and refetch invoices for this client
            queryClient.invalidateQueries({ queryKey: ['invoices', id] });
        },
        onError: (error) => {
            console.error("Error paying invoice:", error);
            alert('Error al pagar la factura.');
        }
    });

    if (isLoadingClient || isLoadingPlans || isLoadingSubscriptions || isLoadingInvoices) {
        return <div className="text-center text-gray-400">Cargando...</div>;
    }

    if (!client) {
        return <div className="text-center text-red-500">No se pudo encontrar el cliente.</div>;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-indigo-400">{client.name}</h2>
                <p className="text-gray-400">{client.email}</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Suscripciones</h3>
                {subscriptions && subscriptions.length > 0 ? (
                    <ul className="space-y-2">
                        {subscriptions.map(sub => {
                            const plan = plans?.find(p => p.id === sub.planId);
                            return <li key={sub.id} className="p-2 bg-gray-700 rounded-md">{plan?.name || 'Plan desconocido'} - Estado: <span className={`px-2 py-1 rounded-full text-xs ${sub.status === 'ACTIVE' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{sub.status}</span></li>;
                        })}
                    </ul>
                ) : <p className="text-gray-500">No tiene suscripciones.</p>}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Facturas</h3>
                {invoices && invoices.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left table-auto">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2">ID</th>
                                    <th className="px-4 py-2">Monto</th>
                                    <th className="px-4 py-2">Fecha</th>
                                    <th className="px-4 py-2">Estado</th>
                                    <th className="px-4 py-2">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {invoices.map((inv: Invoice) => (
                                    <tr key={inv.id} className="hover:bg-gray-700/50">
                                        <td className="px-4 py-2 font-mono text-sm">{inv.id.substring(0, 8)}...</td><td className="px-4 py-2">${inv.amount.toFixed(2)}</td><td className="px-4 py-2">{new Date(inv.dueDate).toLocaleDateString()}</td><td className="px-4 py-2"><span className={`px-2 py-1 rounded-full text-xs ${inv.status === 'PAID' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{inv.status}</span></td>
                                        <td className="px-4 py-2">{inv.status === 'PENDING' && <button onClick={() => payInvoiceMutation.mutate(inv.id)} disabled={payInvoiceMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-1 px-3 rounded-md transition duration-300 disabled:opacity-50">Pagar</button>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="text-gray-500">No tiene facturas.</p>}
            </div>
        </div>
    );
};

export default ClientDetail;