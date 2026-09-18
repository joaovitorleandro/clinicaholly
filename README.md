# Clínica Holly

Landing page editorial em Vue 3, TypeScript, Vite e Tailwind CSS. GSAP/ScrollTrigger conduzem as transições; Lenis sincroniza a rolagem e Three.js constrói a assinatura Holly com curvas, órbita e estrela programáticas.

## Executar

Use Node.js 22.12 ou superior e npm. As dependências estão fixadas em `package-lock.json`.

```bash
npm ci
npm run dev
```

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento Vite. |
| `npm run build` | Validação TypeScript, build otimizado e HTML pré-renderizado em `dist/`. |
| `npm run preview` | Servir o build localmente. |
| `npm run typecheck` | Verificar os tipos com vue-tsc. |
| `npm run lint` | ESLint sem avisos permitidos. |
| `npm run test:e2e` | Testes de navegador com Playwright. |
| `npm run assets` | Preparar as versões WebP responsivas dos PNGs aprovados. |

Os testes de navegador precisam do Chromium do Playwright instalado: `npx playwright install chromium`.

## Organização

- `src/sections/`: narrativa da página, hero, tratamentos, resultados, processo, fundador, clínica e contato.
- `src/components/motion/`: reveals, imagens com parallax, tilt e botão magnético reutilizáveis.
- `src/components/ui/`: marca e elementos gráficos Holly.
- `src/composables/` e `src/lib/`: integração de scroll, preferência por movimento reduzido e configuração GSAP.
- `src/three/`: geometria da assinatura, materiais, iluminação, câmera, ciclo de renderização e descarte de recursos.
- `src/data/clinic.ts`: links e informações institucionais confirmadas.
- `src/styles/main.css`: identidade visual, tipografia e regras globais de acessibilidade.
- `src/entry-server.ts` e `scripts/prerender.mjs`: pré-renderização durante o build, sem servidor de aplicação em produção.

Instrument Serif e Inter são distribuídas localmente pelos pacotes `@fontsource`; não há solicitação a Google Fonts. As imagens da interface também são locais. Links de WhatsApp, Instagram e Google Maps são os destinos institucionais aprovados.

## Fotografia e conteúdo

Os originais recebidos permanecem preservados em `assets/imagens/`. O script `scripts/prepare-assets.mjs` documenta a correspondência entre os nomes originais e os arquivos de produção em `public/images/`, com versões de 640 px, 960 px e tamanho integral. O processamento faz redimensionamento e compressão WebP, sem gerar ou substituir fotografias. A referência visual fornecida está em `assets/referencia-site/`.

A origem dos textos, estatísticas, biografia, endereço, links e conteúdo de tratamentos está registrada em [docs/content-audit.md](docs/content-audit.md). O registro distingue informações publicadas e dados ausentes na referência.

O movimento respeita `prefers-reduced-motion`. A camada Three.js é decorativa, preservando os conteúdos em HTML e o fallback visual do hero.

## Publicação

Publique o conteúdo de `dist/` em uma hospedagem estática após executar o build. `npm run preview` destina-se à revisão local. O HTML de produção já inclui os textos, títulos, links e dados estruturados `Dentist`; o Vue hidrata esse conteúdo no navegador. Não há backend necessário para renderizar a página.

O domínio definitivo não foi fornecido no briefing. A variável opcional `VITE_SITE_URL`, descrita em `.env.example`, aceita uma origem absoluta com `https://`, sem caminho. Configure-a no ambiente de build ou em `.env.production` quando o domínio estiver definido. O build então inclui canonical, `og:url` e URLs absolutas para as imagens sociais. Sem essa configuração, o canonical é omitido e nenhum domínio institucional é presumido.
# clinicaholly
