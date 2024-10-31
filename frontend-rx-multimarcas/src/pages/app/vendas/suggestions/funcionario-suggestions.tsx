import React, { useState } from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { debounce } from "lodash";
import { CadastrarVendaFormValues } from "../vendas-cadastrar2";
import { getFuncionarios } from "@/api/get-funcionarios";

interface Funcionario {
    id: string;
    nome: string;
    email: string;
}

interface FuncionarioFieldProps {
    control: Control<CadastrarVendaFormValues>;
    setValue: UseFormSetValue<CadastrarVendaFormValues>;
}

const FuncionarioField: React.FC<FuncionarioFieldProps> = ({ setValue }) => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [showFuncionarioSuggestions, setShowFuncionarioSuggestions] = useState(false);
    const [selectedFuncionarioNome, setSelectedFuncionarioNome] = useState("");

    const fetchFuncionarios = async (nome: string) => {
        try {
            const response = await getFuncionarios({ page: 1, nome });
            setFuncionarios(response.funcionariosList);
            setShowFuncionarioSuggestions(true);
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
        }
    };

    const debouncedFetchFuncionarios = debounce(fetchFuncionarios, 150);

    const handleSelectFuncionario = (funcionario: Funcionario) => {
        setValue("funcionarioId", funcionario.id);
        setSelectedFuncionarioNome(funcionario.nome);
        setShowFuncionarioSuggestions(false);
    };

    return (
        <FormItem className="flex flex-col gap-1 w-full mb-3">
            <FormLabel>Funcionário</FormLabel>
            <FormControl>
                <Input
                    className="h-9 w-full"
                    placeholder="Nome do Funcionário"
                    value={selectedFuncionarioNome}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedFuncionarioNome(value);
                        if (value) {
                            debouncedFetchFuncionarios(value);
                        } else {
                            setShowFuncionarioSuggestions(false);
                        }
                    }}
                />
            </FormControl>
            {showFuncionarioSuggestions && (
                <ul className="w-full bg-white border border-gray-300 shadow-md mt-1 max-h-48 overflow-y-auto z-10 rounded-sm">
                    {funcionarios.slice(0, 5).map((funcionario) => (
                        <li
                            key={funcionario.id}
                            className="px-4 py-2 flex cursor-pointer hover:bg-gray-100 rounded-sm"
                            onMouseDown={() => handleSelectFuncionario(funcionario)}
                        >
                            <div className="flex">
                                <Avatar className="mr-2 bg-black text-white">
                                    <AvatarFallback className="bg-black text-white">
                                        {funcionario.nome ? funcionario.nome.split(' ').map(n => n.charAt(0).toUpperCase()).join('') : '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <p className="text-sm">{funcionario.nome}</p>
                                    <p className="text-xs text-gray-400">{funcionario.email}</p>
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

export default FuncionarioField;
