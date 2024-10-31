import React, { useState } from "react";
import { getClientes } from "@/api/clientes/get-clientes";
import { Control, UseFormSetValue } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { debounce } from "lodash";
import { CadastrarVendaFormValues } from "../vendas-cadastrar2";

interface Cliente {
    id: string;
    nome: string;
    email: string;
}

interface ClienteFieldProps {
    control: Control<CadastrarVendaFormValues>;
    setValue: UseFormSetValue<CadastrarVendaFormValues>;
}

const ClienteField: React.FC<ClienteFieldProps> = ({ setValue }) => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [showClienteSuggestions, setShowClienteSuggestions] = useState(false);
    const [selectedClienteNome, setSelectedClienteNome] = useState("");

    const fetchClientes = async (nome: string) => {
        try {
            const response = await getClientes({ page: 1, nome });
            setClientes(response.clientesList);
            setShowClienteSuggestions(true);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    const debouncedFetchClientes = debounce(fetchClientes, 150);

    const handleSelectCliente = (cliente: Cliente) => {
        setValue("clienteId", cliente.id);
        setSelectedClienteNome(cliente.nome);
        setShowClienteSuggestions(false);
    };

    return (
        <FormItem className="flex flex-col gap-1 w-full mb-3">
            <FormLabel>Cliente</FormLabel>
            <FormControl>
                <Input
                    className="h-9 w-full"
                    placeholder="Nome do Cliente"
                    value={selectedClienteNome}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedClienteNome(value);
                        if (value) {
                            debouncedFetchClientes(value);
                        } else {
                            setShowClienteSuggestions(false);
                        }
                    }}
                />
            </FormControl>
            {showClienteSuggestions && (
                <ul className="w-full bg-white border border-gray-300 shadow-md mt-1 max-h-48 overflow-y-auto z-10 rounded-sm">
                    {clientes.slice(0, 5).map((cliente) => (
                        <li
                            key={cliente.id}
                            className="px-4 py-2 flex cursor-pointer hover:bg-gray-100 rounded-sm"
                            onMouseDown={() => handleSelectCliente(cliente)}
                        >
                            <div className="flex">
                                <Avatar className="mr-2 bg-black text-white">
                                    <AvatarFallback className="bg-black text-white">
                                        {cliente.nome ? cliente.nome.split(' ').map(n => n.charAt(0).toUpperCase()).join('') : '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <p className="text-sm">{cliente.nome}</p>
                                    <p className="text-xs text-gray-400">{cliente.email}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <FormMessage className="text-sm" />
        </FormItem>
    );
};

export default ClienteField;
