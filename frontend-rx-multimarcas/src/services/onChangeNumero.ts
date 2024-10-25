export function mascaraNumero(input: string) {
    // Remove caracteres não numéricos e não-vírgula, mantendo uma vírgula
    const apenasNumeros = input.replace(/[^0-9,]/g, "");

    // Permite apenas uma vírgula decimal
    const partes = apenasNumeros.split(",");

    // Se houver mais de uma vírgula, mantenha apenas a primeira
    if (partes.length > 2) {
        return partes[0] + "," + partes.slice(1).join("");
    }

    // Verifica se a parte decimal é válida
    if (partes.length === 2) {
        partes[1] = partes[1].slice(0, 2); // Limita a duas casas decimais
    }

    // Retorna a string formatada, permitindo inteiros e floats
    return partes.join(",");
}