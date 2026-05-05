## Problemas a resolver

### 1. Travamento dos inputs nos modais de criação

**Causa identificada:** Em `Home.tsx`, `buildSectorsWithTimelines(sectorRows, timelineRows)` é executado em todo render e devolve **novos arrays/objetos** a cada vez. Esses arrays são passados como props para `<TimelineModal sectors={sectors} />`. Combinado com o `useEffect([isOpen, defaultSectorId])` do modal e o React Query revalidando, cada keystroke dispara cascata de re-renders no parent, fazendo o input "travar" durante a digitação.

Além disso, `TimelineModal` e `SectorModal` recriam handlers a cada render e o `useEffect` que reseta o form depende de props instáveis.

**Correções:**

- **`src/pages/Home.tsx`**
  - Memoizar `dbSectors` e `allTimelines` com `useMemo` baseado em `sectorRows`/`timelineRows`.
  - Memoizar `sectors` final (`sectorOverride ?? dbSectors`) com `useMemo`.
  - Memoizar `handleSaveTimeline`, `handleSaveSector`, `handleAddTimelinesToShortcuts` com `useCallback`.
  - Memoizar `getAvailableTimelinesForShortcuts()` (passar valor, não função).
  - Estabilizar `defaultSectorId` (`selectedSectorForTimeline || null`) — já é string estável, mas garantir que não muda enquanto modal está aberto.

- **`src/components/TimelineModal.tsx`**
  - Trocar o `useEffect([isOpen, defaultSectorId])` que reseta os campos por reset condicionado **apenas à transição fechado→aberto** (usar `useRef` do estado anterior de `isOpen`), evitando reset acidental por mudanças nas props enquanto o modal está aberto.
  - Garantir que cada `<Input>` / `<Textarea>` é controlado por `useState` local independente (já está) e que `onChange` não dispara nada no parent durante a digitação.
  - Não desestruturar `sectors` em arrays novos dentro do JSX; iterar direto.

- **`src/components/SectorModal.tsx`**
  - Mesma correção: reset de `name`, `selectedColor`, `selectedIcon` somente na transição fechado→aberto, e somente repopular com `editingSector` nesse momento.
  - Atualmente o estado inicial usa `editingSector?.name` no `useState` — só é avaliado no mount; se o modal é montado uma vez e reusado, o nome não atualiza ao editar. Corrigir via `useEffect` no abrir.

- **`src/components/NoteComposer.tsx`**
  - Aplicar mesmo padrão: resetar `text` apenas no abrir (transição), não em todo render.

### 2. Ícone do setor → inicial em círculo

**Local:** Header do card de setor na home, em `src/components/SectorCarouselPage.tsx` (linha ~120-124).

Substituir o `<SectorIcon />` por um avatar circular com a inicial:

```tsx
<div className="w-10 h-10 rounded-full flex items-center justify-center
                bg-[hsl(var(--accent))]/15 border border-[hsl(var(--accent))]">
  <span className="font-dmsans font-semibold text-[18px]
                   text-[hsl(var(--accent))] leading-none">
    {sector.name.trim().charAt(0).toUpperCase()}
  </span>
</div>
```

Especificações aplicadas:
- Círculo 40×40px
- Background: cor de acento com 15% de opacidade
- Borda: 1px da cor de acento
- Letra: primeira letra do nome, maiúscula, DM Sans 600, 18px, cor de acento
- Adapta automaticamente a dark (vermelho) e light (terracota) via token `--accent`

**Não alterar:**
- O fallback de thumbnail dentro de cada card de timeline (linha ~184) — continua usando o ícone do setor, pois é contexto diferente (preview de capa).
- O ícone no estado vazio (linha ~222) — pode permanecer como está, pois não é "card de setor" e sim ilustração de estado.

Se preferir uniformizar (também trocar nesses dois pontos pela inicial), posso aplicar — me avise.

## Arquivos editados

- `src/pages/Home.tsx`
- `src/components/TimelineModal.tsx`
- `src/components/SectorModal.tsx`
- `src/components/NoteComposer.tsx`
- `src/components/SectorCarouselPage.tsx`
