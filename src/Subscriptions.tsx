import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

const Subscriptions: React.FC = () => {
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('');
    const queryClient = useQueryClient();

    const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: api.getClients });
    const { data: plans = [] } = useQuery({ queryKey: ['plans'], queryFn: api.getPlans });
    const { data: subscriptions = [] } = useQuery({
        queryKey: ['subscriptions'],
        queryFn: api.getSubscriptions,
    });

    const createSubscriptionMutation = useMutation({
        mutationFn: api.createSubscription,
        onSuccess: () => {
            // Invalidate subscriptions and invoices queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['invoices'] }); // Invalidate invoices too
            setSelectedClient('');
            setSelectedPlan('');
            alert('Suscripción creada y primera factura generada!');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient || !selectedPlan) return;
        createSubscriptionMutation.mutate({ clientId: selectedClient, planId: selectedPlan });
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Crear Suscripción</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} required className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Selecciona un cliente</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                    <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)} required className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Selecciona un plan</option>
                        {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>{plan.name}</option>
                        ))}
                    </select>
                    <button type="submit" disabled={createSubscriptionMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50">
                        Crear Suscripción
                    </button>
                </form>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Suscripciones Activas</h2>
                <ul className="divide-y divide-gray-700">
                    {subscriptions.map(sub => {
                        const client = clients.find(c => c.id === sub.clientId);
                        const plan = plans.find(p => p.id === sub.planId);
                        return (
                            <li key={sub.id} className="py-3">
                                <span className="font-medium">{client?.name || 'Cliente desconocido'}</span> suscrito a <span className="font-medium">{plan?.name || 'Plan desconocido'}</span>
                                <div className="text-sm text-gray-400 mt-1">Desde: {new Date(sub.startDate).toLocaleDateString()} - Estado: <span className={`px-2 py-1 rounded-full text-xs ${sub.status === 'ACTIVE' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{sub.status}</span></div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Subscriptions;