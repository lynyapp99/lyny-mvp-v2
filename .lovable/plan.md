## Refinamento do Design System

Mantém o dark mode + paleta vermelha existentes. Não altera tokens HSL base, apenas refina aplicação, tipografia, ícones e espaçamento.

### 1. Tipografia (Playfair Display + DM Sans)

**`index.html`**
- Substituir o `<link>` do Inter por:
  - Playfair Display (peso 600)
  - DM Sans (300, 400, 500, 600, 700)

**`tailwind.config.ts`**
- Adicionar famílias:
  - `sans: ['DM Sans', 'system-ui', 'sans-serif']` (substitui Inter)
  - `display: ['Playfair Display', 'serif']` (nova família para títulos)

**`src/index.css`**
- `body { font-family: 'DM Sans', ... }` (remove Inter)
- Adicionar utilitário `.font-display` já vem do Tailwind via config

**Aplicação**
- Trocar títulos principais de tela para `font-display font-semibold`:
  - `src/pages/Home.tsx` (header/saudação)
  - `src/pages/Notifications.tsx` (h1 "Notificações")
  - `src/pages/Relationships.tsx` (h1)
  - `src/pages/Profile.tsx` (h1)
  - `src/pages/Create.tsx` (h1)
  - `src/pages/Auth.tsx` ("Bem-vindo de volta" / "Criar conta")
  - `src/pages/TimelineDetail.tsx` (título da timeline)
- `CardTitle` em `src/components/ui/card.tsx`: mantém DM Sans (é título de componente, não de tela).

### 2. Ícones (Lucide only, tamanhos consistentes)

- Auditar e substituir qualquer emoji remanescente por Lucide (rg em `src/` por padrão emoji + revisão manual em arquivos com strings de UI).
- **Tamanho padrão de ícones de UI: 22px** — aplicar em botões de ação, headers, listas, cards.
- **Navegação inferior: 24px** (já está em `Navigation.tsx`).
- Cores:
  - Nav ativa: `text-primary` (#E0162B já mapeado).
  - Nav inativa: `text-muted-foreground/60` (já está).
  - Ícones de ação (back, share, add em headers): `text-foreground` (branco) ou `text-muted-foreground` conforme contexto.
  - Remover usos de `text-primary` em ícones puramente decorativos dentro de cards e listas.

Arquivos a auditar/ajustar tamanho de ícone para 22:
- `TimelineFeedCard.tsx`, `TimelineCard.tsx`, `RelationshipCard.tsx`
- `pages/Notifications.tsx`, `pages/Relationships.tsx`, `pages/Profile.tsx`, `pages/Home.tsx`, `pages/Create.tsx`, `pages/TimelineDetail.tsx`
- `EmptyState.tsx`
- `AddContentSheet.tsx`, `AddMemoryFlow.tsx`, `ShareSheet.tsx`

### 3. Cores — disciplina de aplicação

Manter tokens HSL atuais. Refinar onde o vermelho aparece:

**Vermelho (`primary` / `accent`) APENAS em:**
- Ícone ativo da bottom nav
- Botões primários de ação (`lyny-button-primary`, `Button` default)
- Badges de notificação não-lida e contadores importantes
- Indicadores pontuais (dot de status)

**Remover vermelho de:**
- `--card-glow` em `src/index.css`: trocar `rgba(224, 22, 43, 0.18)` por borda neutra `rgba(255,255,255,0.04)` para `lyny-card` e `sector-card-*` — cards deixam de ter glow vermelho.
- Bordas decorativas e ícones internos de cards que hoje usam `text-primary` sem ser CTA.

**Refinar superfícies (sem quebrar tokens):**
- Ajustar `--card` de `240 8% 8%` → `0 0% 10%` (≈ #1A1A1A) para neutralizar matiz e bater com #1A1A1A pedido.
- Ajustar `--surface-2` para `0 0% 12%` (≈ #1E1E1E).
- `--foreground` permanece `0 0% 100%`; `--muted-foreground` ajusta para `0 0% 62%` (≈ #9E9E9E).

### 4. Espaçamento

- `src/components/ui/card.tsx`:
  - `CardHeader`: `p-4` → mantém (16px), `space-y-2` → `space-y-3` (12px).
  - `CardContent`: `p-4 pt-0` mantém.
  - `CardFooter`: `p-4 pt-0` mantém.
- Garantir nas páginas de listagem (`Notifications`, `Relationships`, `Home` shortcuts): `gap-3` (12px) mínimo entre itens, `space-y-3` em listas verticais.
- Margens laterais de tela: padronizar `px-4` (16px) nos containers principais das páginas.
- Headers de seção: `mb-5` (20px) — auditar `Home.tsx`, `Profile.tsx`, `Notifications.tsx`, `Relationships.tsx`.

### 5. Cache busting

- Bump `CACHE_VERSION` em `public/sw.js` (v2.2.0 → v2.3.0) para garantir que a refonte tipográfica chegue ao usuário.

### Arquivos a editar

```
index.html
tailwind.config.ts
src/index.css
src/components/ui/card.tsx
src/components/Navigation.tsx (ajuste fino se necessário)
src/components/EmptyState.tsx
src/components/TimelineFeedCard.tsx
src/components/TimelineCard.tsx
src/components/RelationshipCard.tsx
src/pages/Home.tsx
src/pages/Notifications.tsx
src/pages/Relationships.tsx
src/pages/Profile.tsx
src/pages/Create.tsx
src/pages/Auth.tsx
src/pages/TimelineDetail.tsx
public/sw.js
```

### Validação após implementação

- Verificar cada tela mencionada no preview (390x844): título em Playfair, body em DM Sans, ícones 22/24px, sem glow vermelho em cards genéricos, espaçamentos consistentes.
- Checar que não restou nenhum emoji em strings de UI (`rg` por ranges Unicode emoji).
- Confirmar contraste de texto secundário (#9E9E9E sobre #1A1A1A).
