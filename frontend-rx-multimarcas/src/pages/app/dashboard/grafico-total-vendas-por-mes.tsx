import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { GraficoTotalVendasPorMesBody } from "@/api/charts/dashboard/grafico-total-vendas-mes";
import { DatePickerWithRange } from "@/components/date-ranger-picker";
import { Loader2 } from "lucide-react";

// Configuração do gráfico
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

// Mapeamento para os nomes dos meses
const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const GraficoVendaTotalPorMes = () => {
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });

  const date_init = format(dateRange.from, "yyyy-MM-dd");
  const date_finish = format(dateRange.to, "yyyy-MM-dd");

  const { data, isLoading } = useQuery({
    queryKey: ["grafico_venda_total_por_mes", date_init, date_finish],
    queryFn: async () => {
      const response = await GraficoTotalVendasPorMesBody({ date_init, date_finish });
      return response?.dados?.result || [];
    },
    enabled: !!date_init && !!date_finish,
  });

  // Transformando os dados da API para o formato do gráfico
  const chartData = data?.map((item: { mes: string; valorTotal: number }) => ({
    month: monthNames[parseInt(item.mes, 10) - 1],
    valorTotal: item.valorTotal,
  })) || [];

  return (
    <Card className="shadow-lg m-1">
      <CardHeader>
        <CardTitle>Valor total de vendas por mês</CardTitle>
        <CardDescription>
          Selecione o intervalo de datas para visualizar as vendas
          <DatePickerWithRange
              className="col-span-4 mt-3 flex items-center"
              value={{ from: dateRange.from, to: dateRange.to }}
              onChange={(range) => {
                  if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                  }
              }}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        { isLoading ? 
            <div className="flex h-[240px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
            </div> : 
            <ResponsiveContainer height={200}>
                <ChartContainer config={chartConfig}>
                <BarChart width={500} height={250} data={chartData}> {/* Ajuste a altura do gráfico aqui */}
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="valorTotal" fill="var(--color-desktop)" radius={8} />
                </BarChart>
                </ChartContainer>
            </ResponsiveContainer>
        }
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mostrando o total de vendas por mês no período selecionado
        </div>
      </CardFooter>
    </Card>
  );
};

export default GraficoVendaTotalPorMes;
