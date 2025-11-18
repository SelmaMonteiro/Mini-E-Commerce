# Mini E-commerce

Catálogo de produtos com carrinho simulado, construído em **HTML, CSS e JavaScript**. Ideal para portfólio (GitHub/LinkedIn) mostrando organização de layout e lógica de UI.

## Funcionalidades
- Catálogo com cards, preço, avaliação, badges de destaque (frete grátis, Pix OFF, mais vendidos)
- Busca (com debounce), filtro por categoria e ordenação (popularidade, preço, avaliação)
- Carrinho com adicionar/remover/quantidade, cálculo de subtotal, frete e total
- Persistência de carrinho em `localStorage`
- Layout moderno, responsivo e acessível (ARIA, `aria-live`, contraste)

## Executar localmente
1. Baixe/clique em "Code" → "Download ZIP" ou clone este repositório.
2. Abra a pasta do projeto e inicie um servidor estático:
   - Com Node.js: `npx --yes serve -l 5173`
   - Com Python: `python -m http.server 5173`
3. Acesse `http://localhost:5173`.

> Dica: Você pode abrir direto o `index.html` no navegador, mas algumas APIs funcionam melhor com servidor local.

## Publicar no GitHub Pages
Opção A — automático (recomendado)

Este repositório já inclui um workflow de **GitHub Actions** em `.github/workflows/deploy-pages.yml` que publica seu site no Pages a cada push na `main`.

Passos:
- Garanta que a branch seja `main` e faça o push.
- Aguarde ~1–2 minutos: o job “Deploy to GitHub Pages” vai rodar.
- O site ficará disponível em: `https://SelmaMonteiro.github.io/Mini-E-Commerce/`.

Opção B — manual
1. Crie um repositório e envie os arquivos (`index.html`, `styles.css`, `app.js`, `README.md`).
2. Em `Settings` → `Pages`, selecione a branch `main` e a origem `/(root)`.
3. Salve; a página ficará disponível em `https://seuusuario.github.io/seu-repo/`.

## Próximos incrementos (opcional)
- Wishlist/favoritos, comparador de produtos, avaliações com comentários
- Dark mode automático (prefers-color-scheme) e animações de microinteração
- Integração de gateway de pagamento (Mercado Pago/Pagar.me/Pix), backend FaaS
- Testes de acessibilidade (Lighthouse) e métricas de performance (Core Web Vitals)

## Créditos
Imagens de exemplo via `picsum.photos`. Preços, nomes e dados são fictícios.