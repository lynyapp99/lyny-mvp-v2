# Migração Lyny → iOS 27 Design System

Refatoração sistêmica visual: tokens iOS 27, tipografia SF Pro, suporte light + dark com toggle, accent iOS System Red (#FF4245), e Liquid Glass em headers/navigation + sheets/modais.

## 1. Tokens & Tema (base)

**`src/index.css`** — substituir todos os tokens HSL atuais:
- Importar tokens iOS (labels, backgrounds base/elevated, fills, separators, system colors) como variáveis `--ios-*`.
- Remapear tokens semânticos shadcn (`--background`, `--foreground`, `--card`, `--border`, `--muted`, `--primary`, etc.) para apontar para os tokens iOS — assim todos componentes shadcn herdam sem reescrita.
- **Dark (padrão):** `--background: #000`, `--card: #1C1C1E`, `--border: #38383A`, `--foreground: #FFF`, `--muted-foreground: rgba(235,235,245,0.6)`.
- **Light:** `--background: #FFF`, `--card: #FFF` em grouped-secondary, `--border: rgba(0,0,0,0.12)`.
- `--primary: 359 100% 65%` (iOS System Red `#FF4245`); destructive idem.
- Remover paleta legada `--lyny-*` e gradientes terracota/peach. Manter aliases `lyny-blush`/`timeline-pink` apontando para system red para não quebrar usos.
- Reescrever classes `.lyny-button-*`, `.lyny-card`, `.glass` com novos tokens e raios iOS (12/16/20/28).

**`tailwind.config.ts`**:
- Adicionar `fontFamily.sans = ['-apple-system','BlinkMacSystemFont','SF Pro Text','system-ui','sans-serif']` e `fontFamily.display = ['SF Pro Display', ...]`.
- Raios `app-sm: 12`, `app: 16`, `app-lg: 20`, `app-xl: 28` (iOS continuous corners).
- Adicionar utilitários para system colors (`ios-blue`, `ios-green`, etc.) via plugin de cores.

## 2. Tipografia SF Pro

- Instalar `@fontsource/inter` como fallback web (SF Pro não tem distribuição livre; `-apple-system` cobre iOS/macOS nativos, Inter cobre Android/Windows aproximando métricas).
- `src/main.tsx`: importar `@fontsource/inter/400/500/600/700`.
- Remover `Playfair Display` e `DM Sans` de `index.css` (e do `<h1>` default). Headings passam a usar `font-display` (SF Pro Display).
- Escala tipográfica iOS (Large Title 34/700, Title1 28/700, Title2 22/700, Title3 20/600, Headline 17/600, Body 17/400, Callout 16, Subhead 15, Footnote 13, Caption 12) como classes utilitárias `.ios-large-title` etc. em `@layer components`.

## 3. Theme toggle (Light + Dark)

- `src/components/ThemeProvider.tsx` já existe — auditar e garantir que aplica classe `.dark` no `<html>` e persiste em localStorage; default = dark.
- Adicionar toggle Sol/Lua em `SettingsScreen.tsx` (Switch shadcn) chamando `setTheme()`.
- Atualizar `index.html` `<meta name="theme-color">` com `media="(prefers-color-scheme)"` para preto/branco.

## 4. Liquid Glass

Nova classe utilitária em `index.css`:
```
.ios-glass-sm { backdrop-filter: blur(6px) saturate(1.8); background: rgba(153,153,153,0.17); border: 0.5px solid rgba(191,191,191,0.4); border-radius: 14px; }
.ios-glass-md { backdrop-filter: blur(20px) saturate(1.8); background: rgba(28,28,30,0.72); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 20px; }
.ios-glass-lg { backdrop-filter: blur(30px) saturate(1.8); background: rgba(28,28,30,0.6); border-radius: 28px; }
```
Variantes light com fundos `rgba(255,255,255,0.72)`.

Aplicar em:
- `AppHeader.tsx` → `.ios-glass-md`, sticky top, divisor inferior 0.5px.
- `Navigation.tsx` (bottom tab bar) → `.ios-glass-lg`, ícones SF-like, accent red ativo.
- `ContextHeader.tsx` → mesmo padrão.
- **Sheets/Modais:** `AddContentSheet`, `InviteSheet`, `ShareSheet`, `SectorModal`, `TimelineModal`, `MemoryDetailModal`, `EditTimelineFlow`, `DeepenTimelineFlow`, `AddMemoryFlow`, `MediaViewer`, `ImageLightbox` → `.ios-glass-lg` no content, corner radius 28 no top, drag handle iOS no topo.
- Sobrescrever `ui/sheet.tsx` e `ui/dialog.tsx` para usar tokens iOS por padrão.

## 5. Componentes shadcn (refresh)

Reestilizar variantes preservando API:
- `button.tsx`: primary = `bg-primary text-white rounded-pill`, secondary = `ios-fill-primary`, ghost = transparente com pressed `ios-fill-tertiary`. Tamanhos iOS (44pt min).
- `input.tsx`, `textarea.tsx`: `bg-[hsl(var(--card))] border-[0.5px] border-[hsl(var(--border))] rounded-app`.
- `card.tsx`: grouped inset list style (radius 10, divisor 0.5px entre rows).
- `switch.tsx`: cor on = system green `#30D158`.
- `select.tsx`, `dropdown-menu.tsx`, `popover.tsx`, `tooltip.tsx`, `alert-dialog.tsx`, `drawer.tsx`, `tabs.tsx`, `badge.tsx`, `toggle.tsx`, `progress.tsx`, `slider.tsx`, `checkbox.tsx`, `radio-group.tsx`: ajustar bg/border/raios via tokens (mudança mínima, herda do CSS).

## 6. Telas

Auditar e ajustar:
- `Splash.tsx`, `Onboarding.tsx`, `Auth.tsx`: bg primary, tipografia Large Title, botões iOS.
- `Home.tsx`: header glass, listas grouped, sector cards com novo radius + bg elevated.
- `TimelineDetail.tsx`, `TimelinePublic.tsx`, `EventDetail.tsx`, `EventInvite.tsx`, `EventCreate.tsx`, `EventAlbum.tsx`: ContextHeader glass, conteúdo `bg-grouped-primary`.
- `Profile.tsx`, `Notifications.tsx`, `Relationships.tsx`, `Create.tsx`, `HiddenTimelineDemo.tsx`, `NotFound.tsx`: aplicar grouped-list, separadores 0.5px, ícones SF accent.
- Componentes específicos (`TimelineCard`, `SectorRail`, `RelationshipCard`, `FlagshipTimelineShowcase`, `RecentAndFavorites`, etc.): trocar gradientes terracota antigos por system colors iOS, manter layout.

## 7. PWA / meta

- `index.html`: `theme-color` dinâmico (preto dark, branco light); `apple-mobile-web-app-status-bar-style="black-translucent"`.
- `public/manifest.webmanifest`: `background_color: "#000000"`, `theme_color: "#000000"`.

## 8. Memória do projeto

Atualizar `mem://style/theme-shadow` → renomear para `mem://style/ios27` documentando: dark+light, accent #FF4245, SF Pro, tokens iOS, Liquid Glass em headers/nav/sheets.

## Arquivos

**Editar (alto impacto):** `src/index.css`, `tailwind.config.ts`, `src/main.tsx`, `src/components/ThemeProvider.tsx`, `index.html`, `public/manifest.webmanifest`.

**Editar (componentes UI):** `button`, `input`, `textarea`, `card`, `sheet`, `dialog`, `drawer`, `switch`, `select`, `dropdown-menu`, `popover`, `tooltip`, `tabs`, `badge`, `alert-dialog`, `ios-button`, `glass-card`.

**Editar (app):** `AppHeader`, `Navigation`, `ContextHeader`, `SettingsScreen`, todas as sheets/modais listadas, todas as telas em `src/pages/*`, cards principais em `src/components/*`.

## Fora do escopo

- Lógica de negócio, queries Supabase, rotas, RLS — apenas visual.
- Refazer SVGs/ícones customizados (mantém `LynyLogo`).
- Animações novas além de pressed-state iOS já existentes.
