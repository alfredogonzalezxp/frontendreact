import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { type Client } from '../api';

const Clients: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const queryClient = useQueryClient();

    const { data: clients = [], isLoading } = useQuery({
        queryKey: ['clients'],
        queryFn: api.getClients,
    });

    const createClientMutation = useMutation({
        mutationFn: api.createClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            setName('');
            setEmail('');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;
        createClientMutation.mutate({ name, email });
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Crear Cliente</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre del cliente"
                        className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email del cliente"
                        className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <button type="submit" disabled={createClientMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50">
                        Crear Cliente
                    </button>
                </form>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Lista de Clientes</h2>
                {isLoading ? (
                    <p>Cargando clientes...</p>
                ) : (
                    <ul className="divide-y divide-gray-700">
                        {clients.map((client: Client) => (
                            <li key={client.id} className="py-3">
                                <Link to={`/clients/${client.id}`} className="text-indigo-400 hover:text-indigo-300 transition">{client.name} <span className="text-gray-400">({client.email})</span></Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Clients;