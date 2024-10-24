import { api } from "@/lib/axios";

export interface AdicionarEnderecoClienteBody {
    id_cliente: string;
    endereco?: {
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
    }
}

export async function adicionarEnderecoCliente({ id_cliente, endereco }: AdicionarEnderecoClienteBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post('/criar_endereco_cliente', 
            { id_cliente, endereco },
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
