import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface CardTotalGeralProps {
  cardTitle: string;
  totalValue: number;
  Icon: LucideIcon;
  format?: boolean; // Option to format the value
  isLoading?: boolean; // Optional prop to handle loading state
  description: string;
}

export function CardTotalGeral({
  cardTitle,
  totalValue,
  Icon,
  format = false,
  isLoading = false,
  description,
}: CardTotalGeralProps) {
  
  const formatToBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  const displayValue = format ? formatToBRL(totalValue) : totalValue.toString();

  return (
    <Card className="w-full max-w-sm mx-auto p-1 sm:max-w-md md:max-w-lg lg:max-w-xl rounded-xl m-1 shadow-md">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          {isLoading ? <Skeleton className="h-4 w-40"/> : cardTitle}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground mt-2 sm:mt-0"/>
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight block">{isLoading ? <Skeleton className="h-4 w-40"/> : displayValue}</span>
        <p className="text-xs text-muted-foreground">
          {isLoading ? <Skeleton className="h-4 w-40"/> :
            description
          }
        </p>
      </CardContent>
    </Card>
  );
}
