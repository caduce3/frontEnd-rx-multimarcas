import { CardTotalGeral } from "@/components/card-total";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";
import { CardQtdVendasBody } from "@/api/charts/dashboard/card-qtd-vendas";

interface CardQtdVendasProps {
    dateRange: { from: Date; to: Date };
}

const CardQtdVendas = ({ dateRange }: CardQtdVendasProps ) => {

    const date_init = format(dateRange.from, "yyyy-MM-dd");
    const date_finish = format(dateRange.to, "yyyy-MM-dd");

    const { data, isLoading } = useQuery({
        queryKey: ["card_qtd_vendas", date_init, date_finish],
        queryFn: async () => {
          return await CardQtdVendasBody({ date_init, date_finish });
        },
        enabled: !!date_init && !!date_finish,
    });

    return ( 
        <>
            <CardTotalGeral 
                cardTitle="Vendas" 
                totalValue={data?.qtd.quantidadeTotalCarrinho || 0} 
                Icon={CreditCard} 
                format={false} 
                isLoading={isLoading} 
                description="Quantidade total de vendas realizadas"
            />
        </>
     );
}
 
export default CardQtdVendas;
