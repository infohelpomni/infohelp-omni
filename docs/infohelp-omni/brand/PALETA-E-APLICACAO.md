# Identidade visual — InfoHelp Omni 2.0

Fonte: arquivos SVG originais enviados pelo proprietário em 29/10/2026. As cores da marca abaixo foram extraídas diretamente dos SVGs; as cores de interface marcadas como **derivadas** são ajustes para legibilidade e contraste.

## Marca e arquivos

| Contexto | Arquivo no fork |
|---|---|
| Fundo escuro | `logo-para-fundo-escuro.svg` (original `infohelp-omni-logo-claro.svg`, texto branco) |
| Fundo claro | `logo-para-fundo-claro.svg` (original `infohelp-omni-logo-escuro.svg`, texto azul-marinho) |
| Ícone/forma compacta | `simbolo.svg` |
| Apresentações verticais | `logo-vertical.svg` |

**Atenção:** os nomes originais “claro” e “escuro” se referem à versão do desenho; os SVGs demonstram que o arquivo “claro” usa texto muito claro e deve ser usado em **fundo escuro**. Não inverter no login.

Para upload no painel de marca do produto, preferir as versões PNG/JPG originais (a interface não aceita SVG por questões de segurança). Os SVGs permanecem como matrizes de referência; não ativar `APP_LOGO_URL` até existir hospedagem pública estável desses ativos.

## Paleta da marca (exata)

| Token | HEX | Uso |
|---|---|---|
| `brand.cyan` | `#50E6ED` | Detalhe luminoso, ícone e destaque no tema escuro |
| `brand.blue` | `#1588E8` | Azul principal do gradiente da logo |
| `brand.violet` | `#A497FF` | Destaque secundário, indicadores |
| `brand.navy` | `#0B2439` | Texto forte no tema claro |
| `brand.deep` | `#06101D` | Fundo escuro |
| `brand.navySoft` | `#122B48` | Superfície elevada no tema escuro |
| `brand.light` | `#F6FBFF` | Texto de alto contraste no tema escuro / fundo de marca |
| `brand.mutedLight` | `#9EB9CF` | Texto secundário sobre fundo escuro |
| `brand.mutedDark` | `#47647D` | Texto secundário sobre fundo claro |

Gradiente oficial da logo: `linear-gradient(135deg, #50E6ED 0%, #1588E8 55%, #A497FF 100%)`.

## Paleta funcional de interface (derivada)

O azul exato `#1588E8` com texto branco tem contraste aproximado de **3,67:1**, insuficiente para texto pequeno sob WCAG AA. Portanto:

| Token | Claro | Escuro |
|---|---|---|
| Fundo principal | `#F6FBFF` | `#06101D` |
| Superfície / card | `#FFFFFF` | `#122B48` |
| Texto principal | `#0B2439` | `#F6FBFF` |
| Texto secundário | `#47647D` | `#9EB9CF` |
| Ação primária | `#086AB7` **(derivada)** | `#50E6ED` |
| Texto na ação | `#FFFFFF` | `#0B2439` |
| Destaque secundário | `#A497FF` | `#A497FF` |
| Realce decorativo | `#1588E8` | `#1588E8` |

Contrastes calculados: `#086AB7` sobre branco ≈ **5,59:1**; branco sobre `#086AB7` ≈ **5,59:1**; `#0B2439` sobre ciano ≈ **10,47:1**; `#F6FBFF` sobre `#06101D` ≈ **18,34:1**.

O gradiente pode ser usado em bordas, ícones, ilustrações e fundos decorativos, **não** como substituto de um fundo sólido validado para botões e textos críticos.

## Aplicação no DeskComm / Omni

1. O kit single-server do fork agora **semeia** `APP_ACCENT_HEX=#086AB7` apenas quando ainda não houver outra cor definida. Reinstalações preservam a cor existente.
2. A configuração de marca da plataforma vive no **banco** depois da primeira inicialização; alterar o `.env` posteriormente não garante mudar a aparência já salva.
3. A paleta **Omni** agora existe em `app/design/lib/tokens.ts` (`PALETTES.omni`) como opção adicional, preservando `sage`, `clay`, `mist`, `plum` e `olive`. Inclui rampas, superfícies e cores semânticas para claro/escuro. **Ainda não é a aparência padrão do aplicativo em produção**: o CSS global segue com a paleta-base original e o branding de instalação injeta a cor de destaque em runtime. A integração visual completa continua pendente de testes de regressão.
4. Antes de mudar os tokens globais, mapear a nomenclatura do design system e seus testes de governança; preservar estados de erro/alerta/sucesso, acessibilidade e responsividade.
5. Validar login, painel, conversas, formulários, tabelas, modais, gráficos e e-mails com screenshots nos dois temas.

## Tipografia

A logo usa **Space Grotesk**. A interface atual possui fonte própria em build. Reaproveitar Space Grotesk em títulos e materiais de marca é possível, mas trocar a fonte da aplicação inteira exige revisão de layout e testes de acessibilidade; não fazer substituição cega.

## Pendências

- [ ] Integrar PNGs otimizados dos logos à configuração runtime de marca, evitando o upload de SVG.
- [x] Definir a paleta Omni como opção adicional de design tokens e adicionar teste unitário de identidade/contraste.
- [ ] Aplicar o tema Omni em runtime sem substituir o mecanismo de white-label nem quebrar testes de contraste.
- [ ] Validar contraste de todos os estados interativos.
- [ ] Gerar screenshots reais antes da aprovação da interface.
