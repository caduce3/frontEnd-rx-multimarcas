import { api } from "@/lib/axios";

export interface AdicionarClienteBody {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    endereco?: {
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
    }
}

export async function adicionarCliente({ nome, email, cpf, telefone, endereco }: AdicionarClienteBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post('/registrar_cliente', 
            { nome, email, cpf, telefone, endereco },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro ao cadastrar cliente.');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}
