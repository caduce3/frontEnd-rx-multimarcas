import React, { useEffect, useState } from 'react';
import { pegarUnicoProduto } from "@/api/produtos/pegar-unico-produto"; 
import { Card, CardContent} from "@/components/ui/card";
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback } from '@/components/ui/avatar';

interface ProdutoCardProps {
    idProduto: string;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({ idProduto }) => {
    const [produto, setProduto] = useState<any>(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const data = await pegarUnicoProduto({ id_produto: idProduto });
                setProduto(data.produto);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduto();
    }, [idProduto]);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;
    if (!produto) return <div>Produto não encontrado.</div>;

    return (
        <Card className="m-1 w-full mb-3">
            <CardContent className="flex items-center p-2">
                <div className="flex items-center ">
                    <Avatar className="mr-2 w-10 h-10 rounded-full bg-black text-white">
                        <AvatarFallback className="bg-black text-white">
                            {produto.nome ? produto.nome.split(' ').map((n: string) => n.charAt(0).toUpperCase()).join('') : '?'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center">
                        <p className="text-sm font-semibold">{produto.nome}</p>
                        <p className="text-sm text-gray-400">{produto.descricao}</p>
                        <p className="text-xs font-bold">R$ {produto.preco.toFixed(2)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>



    );
};

export default ProdutoCard;
