import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { type Plan } from '../api';

const Plans: React.FC = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
    const queryClient = useQueryClient();

    const { data: plans = [], isLoading } = useQuery({
        queryKey: ['plans'],
        queryFn: api.getPlans,
    });

    const createPlanMutation = useMutation({
        mutationFn: api.createPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
            setName('');
            setPrice('');
            setBillingCycle('MONTHLY');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price) return;
        createPlanMutation.mutate({ name, price: parseFloat(price), billingCycle });
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Crear Plan</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre del plan"
                        className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Precio"
                        className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value as 'MONTHLY' | 'YEARLY')} className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="MONTHLY">Mensual</option>
                        <option value="YEARLY">Anual</option>
                    </select>
                    <button type="submit" disabled={createPlanMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50">
                        Crear Plan
                    </button>
                </form>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Lista de Planes</h2>
                {isLoading ? (
                    <p>Cargando planes...</p>
                ) : (
                    <ul className="divide-y divide-gray-700">
                        {plans.map((plan: Plan) => (
                            <li key={plan.id} className="py-3 flex justify-between items-center">
                                <span>{plan.name}</span>
                                <span className="text-gray-400">${plan.price.toFixed(2)} / {plan.billingCycle === 'MONTHLY' ? 'mes' : 'año'}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Plans;