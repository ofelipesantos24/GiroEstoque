# Estoque Vivo

**Controle simples de validade e estoque para pequenos comércios.**

Pequenos mercados, mercearias, cafeterias e lojas frequentemente perdem dinheiro porque esquecem produtos próximos do vencimento ou só percebem a falta de itens quando o cliente pede. O Estoque Vivo oferece um painel leve para registrar produtos, acompanhar quantidades e destacar vencimentos próximos.

## Funcionalidades do MVP

- Cadastro, edição e exclusão de produtos.
- Quantidade atual e estoque mínimo.
- Alertas para produtos vencidos ou próximos do vencimento.
- Filtro por situação e busca por nome/categoria.
- Exportação do inventário em CSV.
- Armazenamento local no navegador, sem conta ou servidor.

## Executar

Não precisa instalar dependências: abra `index.html` em um navegador moderno.

Para rodar os testes:

```bash
npm test
```

## Privacidade e limitações

Os dados ficam no `localStorage` do navegador e não são enviados a nenhum servidor. Isso torna o MVP simples, mas significa que os dados não sincronizam entre dispositivos e podem ser perdidos se os dados do navegador forem apagados. Faça exportações CSV regulares.

## Próximos passos

- Sincronização em nuvem e múltiplos usuários.
- Leitura de código de barras.
- Histórico de entradas e saídas.
- Sugestões de compra com base no consumo.
- Alertas por WhatsApp ou e-mail.

## Licença

MIT
