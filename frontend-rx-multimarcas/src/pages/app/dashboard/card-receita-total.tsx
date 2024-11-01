import { CardReceitaTotalBody } from "@/api/charts/dashboard/card-receita-total";
import { CardTotalGeral } from "@/components/card-total";
import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { format } from "date-fns";

interface CardReceitaTotalProps {
    dateRange: { from: Date; to: Date };
}

const CardReceitaTotal = ({dateRange}: CardReceitaTotalProps) => {

    const date_init = format(dateRange.from, "yyyy-MM-dd");
    const date_finish = format(dateRange.to, "yyyy-MM-dd");

    const { data, isLoading } = useQuery({
        queryKey: ["card_receita_total", date_init, date_finish],
        queryFn: async () => {
          return await CardReceitaTotalBody({ date_init, date_finish });
        },
        enabled: !!date_init && !!date_finish,
    });

    return ( 
        <>
            <CardTotalGeral 
                cardTitle="Receita Total" 
                totalValue={data?.qtd.receitaTotal || 0} 
                Icon={DollarSign} 
                format={true} 
                isLoading={isLoading} 
                description="Receita total do período selecionado"
            />
        </>
     );
}
 
export default CardReceitaTotal;
