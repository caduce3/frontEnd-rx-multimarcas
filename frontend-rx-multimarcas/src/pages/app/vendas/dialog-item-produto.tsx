import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { debounce } from "lodash";
import { pegarProdutos } from "@/api/produtos/pegar-produtos";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mascaraNumero } from "@/services/onChangeNumero";
import { PackagePlus } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";

// Definindo o tipo de Produto
type Produto = {
    produtoId: string;
    unidadesProduto: number;
    nomeProduto: string;
    precoProduto: number;
};

// Definindo o tipo das props do componente
interface AdicionarProdutoDialogProps {
    produtosSelecionados: Produto[];
    setProdutosSelecionados: React.Dispatch<React.SetStateAction<Produto[]>>;
}

const AdicionarProdutoDialog = ({
    produtosSelecionados,
    setProdutosSelecionados,
}: AdicionarProdutoDialogProps) => {
    const { register, getValues, setValue } = useFormContext();
    const [produtoId, setProdutoId] = useState(""); // Para armazenar o ID do produto
    const [produtoNome, setProdutoNome] = useState(""); // Para armazenar o nome do produto
    const [quantidade, setQuantidade] = useState(1);

    // Estados para sugestões de produtos
    const [produtos, setProdutos] = useState< 
        Array<{ id: string; nome: string; preco: number; quantidadeDisponivel: number }> 
    >([]);
    const [showProdutoSuggestions, setShowProdutoSuggestions] = useState(false);
    const [selectedProdutoNomes, setSelectedProdutoNomes] = useState<string[]>([]);

    const fetchProdutos = async (nome: string) => {
        try {
            const response = await pegarProdutos({ page: 1, nome });
            setProdutos(response.produtosList);
            setShowProdutoSuggestions(true);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };

    const debouncedFetchProdutos = debounce(fetchProdutos, 150);

    const handleSelectProduto = (produto: { id: string; nome: string }, index: number) => {
        setProdutoId(produto.id); // Atualiza o ID do produto
        setProdutoNome(produto.nome); // Atualiza o nome do produto
        setValue(`itens.${index}.produtoId`, produto.id); // Atualiza o valor no formulário
        const updatedSelectedProdutoNomes = [...selectedProdutoNomes];
        updatedSelectedProdutoNomes[index] = produto.nome;
        setSelectedProdutoNomes(updatedSelectedProdutoNomes);
        setShowProdutoSuggestions(false);
    };

    const handleAddProduto = () => {
        if (!produtoId || quantidade <= 0) {
            toast.error("Por favor, preencha o ID do produto e a quantidade.");
            return;
        }

        const selectedProduto = produtos.find(p => p.id === produtoId);
        if (!selectedProduto) {
            toast.error("Produto não encontrado.");
            return;
        }

        if (selectedProduto.quantidadeDisponivel < quantidade) {
            toast.error("Quantidade indisponível no estoque.");
            return;
        }

        const novoProduto: Produto = {
            produtoId: produtoId,
            unidadesProduto: quantidade,
            nomeProduto: selectedProduto.nome,
            precoProduto: selectedProduto.preco,
        };

        setProdutosSelecionados([...produtosSelecionados, novoProduto]);
        setValue("itens", [...getValues("itens"), novoProduto]);

        // Resetar os campos
        setProdutoId("");
        setProdutoNome(""); // Resetar também o nome
        setQuantidade(1);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {/* <Button variant="outline">Adicionar Produto</Button> */}
                <Button type="button" size="sm" variant="outline" className=" mb-3 flex justify-items-end w-full">
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Produto</DialogTitle>
                    <DialogDescription className="text-sm">Selecione o produto e sua quantidade.</DialogDescription>
                </DialogHeader>
                <div className="flex gap-4">
                    <div className="w-full">
                        <Label>Produto</Label>
                        <Input
                            {...register("produtoId")}
                            placeholder="Nome do Produto"
                            value={produtoNome} // Exibir o nome do produto
                            onChange={(e) => {
                                const value = e.target.value;
                                setProdutoNome(value); // Atualiza o nome do produto
                                setProdutoId(""); // Limpa o ID do produto
                                debouncedFetchProdutos(value); // Chama a busca de produtos
                            }}
                            onFocus={() => setShowProdutoSuggestions(false)} // Ocultar sugestões ao focar no input
                        />
                        {showProdutoSuggestions && produtos.length > 0 && (
                            <div>
                                <ul className="w-full bg-white border border-gray-300 shadow-md mt-1 max-h-48 overflow-y-auto z-10 rounded-sm">
                                    {produtos.slice(0, 5).map((produto) => (
                                        <li
                                            key={produto.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-sm"
                                        >
                                            <div className="flex items-center" onClick={() => handleSelectProduto(produto, produtos.indexOf(produto))}>
                                                <Avatar className="mr-2 bg-black text-white">
                                                    <AvatarFallback className="bg-black text-white">
                                                        {produto.nome ? produto.nome.split(' ').map(n => n.charAt(0).toUpperCase()).join('') : '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="text-sm">{produto.nome}</p>
                                                    <p className="text-xs text-gray-400">R$ {produto.preco}</p>
                                                    <p className="text-xs text-gray-400">{produto.quantidadeDisponivel} unid. restantes</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="w-1/4">
                        <Label>Quantidade</Label>
                        <Input
                            type="text"
                            {...register("unidadesProduto")}
                            placeholder="Quantidade"
                            value={quantidade}
                            onChange={(e) => {
                                const maskedValue = mascaraNumero(e.target.value);
                                const numericValue = parseFloat(maskedValue.replace(',', '.'));
                                setQuantidade(isNaN(numericValue) ? 0 : numericValue);
                            }}
                        />
                    </div>
                </div>
                {/* Aqui será uma div que irá calcular e mostrar o valor total, será o preço do produto x quantidade */}
        
                <div className="flex flex-col">
                    <p className="text-sm">{produtoNome}</p>
                    <p className="text-sm text-gray-400">Estoque: {produtos.find(p => p.id === produtoId)?.quantidadeDisponivel} disponíveis</p>
                    <p className="text-sm text-gray-400">R$ {produtoId ? quantidade : ""} x {(produtos.find(p => p.id === produtoId)?.preco ?? 0)} unid.</p>
                    <p className="text-sm text-gray-400">Subtotal: <span className="text-green-500">R$ {(produtoId ? quantidade * (produtos.find(p => p.id === produtoId)?.preco ?? 0) : 0).toFixed(2)}</span></p>
                </div>
                
                <Button onClick={handleAddProduto} variant="default" size="sm">
                    <PackagePlus className="h-5 w-5 mr-2" />
                    Adicionar produto
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AdicionarProdutoDialog;
