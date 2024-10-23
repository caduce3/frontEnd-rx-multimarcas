export function mascaraCEP(cep: string) {
    return cep
        .replace(/\D/g, "") // Remove caracteres não numéricos
        .replace(/^(\d{5})(\d)/, "$1-$2") // Adiciona o hífen após os cinco primeiros dígitos
        .replace(/(-\d{3})\d+$/, "$1"); // Garante que apenas os dois últimos dígitos sejam mantidos após o hífen
}
