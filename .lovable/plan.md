# Refinamento Geral de UI

## 1. Bottom Navigation — só ícones

`src/components/Navigation.tsx`:
- Remover labels de texto
- Ícones `size={24}` (ativo `strokeWidth={2.5}`, inativo `strokeWidth={2}`)
- Padding: `pt-4` (16px) + `pb-5` (20px) somado a `env(safe-area-inset-bottom)`
- Botões: `min-h-[48px] min-w-[48px]`, ícone centralizado
- Ativo: `text-primary` + fundo `bg-primary/15` arredondado
- Inativo: `text-muted-foreground/60`
- Manter `aria-label` e haptic

## 2. Componente EmptyState reutilizável

Criar `src/components/EmptyState.tsx`:

```text
[ Ícone Lucide em círculo 64x64, bg muted/40 ]
        Título (font-semibold)
        Subtítulo (text-muted-foreground, text-sm)
   [ Botão de ação opcional ]
```

Props: `icon`, `title`, `description`, `actionLabel?`, `onAction?`.
Layout: flex-col, `gap-3`, `py-12`, centralizado.

## 3. Aplicar EmptyState

- **Notificações**: `Bell`, "Nenhuma notificação por enquanto", "Quando alguém interagir com suas timelines, você verá aqui."
- **Relacionamentos**: `Users`, "Nenhum relacionamento ainda", "Conecte-se com pessoas para ver seus relacionamentos aqui.", botão "Adicionar pessoa"
- **TimelineDetail (feed vazio)**: `Image`, "Nenhuma memória ainda", botão "Adicionar memória"
- **Profile** (seções vazias): mesmo padrão

## 4. Remoção de dados mockados em Notificações e Relacionamentos

- Garantir que `Notifications.tsx` e `Relationships.tsx` não importem nem renderizem nada de `src/data/*` ou arrays hardcoded
- Conectar `Relationships.tsx` à tabela `connections` do Supabase via `useQuery` para o usuário logado — se vazio, mostrar EmptyState
- `Notifications.tsx`: não há tabela de notificações; manter apenas o EmptyState (sem array mock)
- Remover/limpar `src/data/relationshipData.ts` se não for mais usado em nenhum outro lugar (verificar com `rg`)

## 5. Padronização de espaçamento

- Cards: padding interno mínimo `p-4` (16px) — shadcn `Card` já cumpre
- Gaps entre elementos: mínimo `gap-3` / `space-y-3` (12px)
- `TimelineFeedCard.tsx`: subir padding do rodapé `p-3` → `p-4`, gaps internos `gap-3`
- Sheets (`AddContentSheet`, `NoteComposer`, `ShareSheet`): garantir `p-4` e `gap-3`
- Headers de página: `mb-6`

## Arquivos

- criar: `src/components/EmptyState.tsx`
- editar: `src/components/Navigation.tsx`
- editar: `src/pages/Notifications.tsx`
- editar: `src/pages/Relationships.tsx` (+ query Supabase)
- editar: `src/pages/TimelineDetail.tsx`
- editar: `src/components/TimelineFeedCard.tsx`
- editar: `src/pages/Profile.tsx` (estados vazios)
- possivelmente remover: `src/data/relationshipData.ts`