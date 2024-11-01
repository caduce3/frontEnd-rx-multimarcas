import { CardTotalGeral } from "@/components/card-total";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { CardQtdClientesBody } from "@/api/charts/dashboard/card-qtd-clientes";

interface CardQtdClientesProps {
    dateRange: { from: Date; to: Date };
}

const CardQtdClientes = ({dateRange}: CardQtdClientesProps) => {

    const date_init = format(dateRange.from, "yyyy-MM-dd");
    const date_finish = format(dateRange.to, "yyyy-MM-dd");

    const { data, isLoading } = useQuery({
        queryKey: ["card_qtd_clientes", date_init, date_finish],
        queryFn: async () => {
          return await CardQtdClientesBody({ date_init, date_finish });
        },
        enabled: !!date_init && !!date_finish,
    });

    return ( 
        <>
            <CardTotalGeral 
                cardTitle="Clientes" 
                totalValue={data?.qtdTotalCliente.quantidadeTotalClientes || 0} 
                Icon={Users} 
                format={false} 
                isLoading={isLoading} 
                description="Quantidade total de clientes cadastrados"
            />
        </>
     );
}
 
export default CardQtdClientes;
