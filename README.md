# Estoque Vivo

**Nunca mais perca produtos por falta de controle.**

Controle de estoque simples para pequenos mercados, mercearias, padarias e lojas.

## O problema que resolve
- Esquecer produtos próximos do vencimento.
- Comprar mercadorias que já existem em estoque.
- Perder vendas por falta de produtos.
- Controlar tudo em cadernos ou planilhas.

## Funcionalidades
| Funcionalidade | Status |
|---|---|
| Controle de produtos (cadastrar, editar, excluir, ajustar quantidade) | Implementado |
| Alertas de validade (vencido / vence em breve, prazo configurável) | Implementado |
| Avisos de estoque baixo | Implementado |
| Exportação para CSV (abre no Excel em português) | Implementado |
| Pesquisa e filtros | Implementado |

## Tecnologias
HTML, CSS e JavaScript puro · Node.js (`node:test`) para testes · LocalStorage para persistência · GitHub para versionamento.

## Como usar
Abra o `index.html` no navegador. Os dados ficam salvos no próprio navegador.

## Testes
```bash
npm test
```
(Requer Node.js 18 ou superior. Não há dependências para instalar.)

## Estrutura
```
index.html        página principal
styles.css        estilos
src/estoque.js    regras de negócio (validade, estoque baixo, filtros, CSV)
src/app.js        interface e LocalStorage
test/             testes automatizados
```

## Publicar no GitHub
```bash
git init && git add . && git commit -m "Estoque Vivo: primeira versão"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/estoque-vivo.git
git push -u origin main
```
Para colocar online grátis: Settings → Pages → branch `main`.
