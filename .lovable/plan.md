## Objetivo

Permitir que o dono delete uma timeline inteira e que o dono ou o autor de uma mídia a apague (com arquivo do Storage).

---

## 1. Banco — RLS e CASCADE

Hoje as tabelas não têm foreign keys declaradas (verifiquei no schema), então deletar uma timeline **não** apaga `memories`, `memory_media` nem `timeline_members` automaticamente. Além disso, a policy de DELETE em `memory_media` só permite o autor (`auth.uid() = user_id`), bloqueando o dono da timeline.

**Migration nova:**

- Adicionar foreign keys com `ON DELETE CASCADE`:
  - `timeline_members.timeline_id` → `timelines.id`
  - `memories.timeline_id` → `timelines.id`
  - `memory_media.memory_id` → `memories.id`
- Atualizar a policy DELETE de `memory_media` para permitir também o dono da timeline (via `is_timeline_owner` na timeline da memory).
- Atualizar a policy DELETE de `memories` (hoje só `auth.uid() = user_id`) para permitir também o dono da timeline.

Observação: o Storage **não** é apagado por CASCADE do banco — os arquivos são removidos no client antes do delete da memory/timeline.

---

## 2. Deletar timeline (dono)

**`src/components/ContextHeader.tsx`**
- Nova prop opcional `menuItems?: { label: string; onClick: () => void; destructive?: boolean }[]`.
- Quando houver itens, renderiza um botão de 3 pontinhos (ícone `MoreVertical`) ao lado do convidar, abrindo um `DropdownMenu` (já existe em `components/ui/dropdown-menu.tsx`).

**`src/pages/TimelineDetail.tsx`**
- Se `isOwner`, passar item "Deletar timeline" (destrutivo) para o header.
- Ao clicar: abrir `AlertDialog` ("Tem certeza? Isso vai apagar a timeline e todas as memórias permanentemente.").
- Ao confirmar:
  1. Buscar todas as `storage_path` das mídias da timeline (`memory_media` via join com `memories` por `timeline_id`).
  2. `supabase.storage.from("memories").remove(paths)` em lote.
  3. `delete from timelines where id = …` (CASCADE remove members/memories/memory_media).
  4. Invalidar `["timelines"]` e `["shared-timelines"]`.
  5. Toast de sucesso e `navigate("/", { replace: true })`.

---

## 3. Deletar mídia (dono ou autor)

**`src/lib/api/memories.ts`**
- Estender `FeedItem` com `memoryId: string` e `uploaderId: string | null`.
- Atualizar o select para trazer `memory_media(user_id, ...)` e popular os novos campos.
- Adicionar hook `useDeleteMedia(timelineId)`:
  - Recebe `{ memoryId, storagePath }`.
  - `supabase.storage.from("memories").remove([storagePath])`.
  - `delete from memory_media where memory_id = … and storage_path = …`.
  - Se a memory ficou sem mídias e é `kind = 'media'`, deleta a memory também (mantém o feed limpo).
  - Invalida `["memories", timelineId]`.

**`src/pages/TimelineDetail.tsx` — `TimelineMemoryCard`**
- Receber props `canDelete: boolean` e `onDelete: () => void`.
- Para itens com mídia, sobrepor um botão de lixeira (ícone `Trash2`) no canto superior direito da imagem/vídeo (44×44 touch target, fundo `bg-black/60`, vibração leve no toque).
- Mostrar somente se `canDelete = isOwner || item.uploaderId === user.id`.
- Ao clicar: abrir `AlertDialog` "Apagar esta memória?". Se confirmar, chamar `useDeleteMedia`.

Notas de UX/design (memória do projeto):
- Sem autoplay/scroll programático; apenas reações ao toque do usuário.
- Toques mínimos 44×44, vibração `navigator.vibrate(10)` no clique.
- Cores via tokens semânticos (`destructive`, `background`, etc.), nada de cores hardcoded.

---

## Arquivos tocados

- `supabase/migrations/<novo>.sql` (FKs CASCADE + policies DELETE atualizadas)
- `src/components/ContextHeader.tsx` (menu de 3 pontinhos)
- `src/pages/TimelineDetail.tsx` (item de menu, dialogs, botão lixeira por mídia)
- `src/lib/api/memories.ts` (campos extras no FeedItem + hook `useDeleteMedia`)

Nenhuma outra funcionalidade é alterada.
