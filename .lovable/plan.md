# Adicionar conteúdo dentro da timeline (foto, vídeo, nota)

Hoje a tela `TimelineDetail` lê de mocks (`@/data/timelineMemories`) e o `AddMemoryFlow` é um wizard antigo de várias etapas que não persiste nada. Vou substituir por um fluxo direto, ligado ao Supabase, dentro da própria timeline.

## Mudanças no banco

A tabela `memories` ainda não tem campo de tipo. Adiciono um enum `memory_kind` para distinguir nota de mídia:

```sql
CREATE TYPE public.memory_kind AS ENUM ('note', 'media');
ALTER TABLE public.memories
  ADD COLUMN kind public.memory_kind NOT NULL DEFAULT 'media';
```

`memory_media.kind` (`image` | `video`) já existe e basta para diferenciar foto de vídeo no feed.

Bucket `memories` já está criado e público. Adiciono policies de Storage para escrita/leitura restritas ao dono (path = `timeline_id/photos/...` ou `timeline_id/videos/...`, primeiro segmento = timeline cujo `user_id = auth.uid()`):

```sql
CREATE POLICY "Users upload to own timeline folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'memories'
  AND EXISTS (
    SELECT 1 FROM public.timelines t
    WHERE t.id::text = (storage.foldername(name))[1]
      AND t.user_id = auth.uid()
  )
);
-- + policies análogas para SELECT/DELETE no mesmo bucket
```

## Camada de dados

Novo arquivo `src/lib/api/memories.ts` com hooks React Query:

- `useTimelineMemories(timelineId)` — `SELECT memories + memory_media` ordenado por `created_at DESC` (mais recente primeiro). Retorna itens normalizados: `{ id, kind: 'note'|'photo'|'video', text, mediaUrl, createdAt }`.
- `useCreateNote(timelineId)` — insere em `memories` com `kind='note'` e `description=texto`.
- `useUploadMedia(timelineId)` — para cada arquivo:
  1. Cria registro em `memories` com `kind='media'`.
  2. Faz `supabase.storage.from('memories').upload('{timelineId}/photos|videos/{uuid}.{ext}', file)` com callback de progresso.
  3. Insere em `memory_media` com `kind`, `storage_path`, `public_url`, `user_id`, `memory_id`.
  4. Em caso de erro, faz rollback (apaga memory criado).
- Invalida queries `['memories', timelineId]` ao final.

## UI dentro de `TimelineDetail`

1. **Remover dependências de mock**: tirar imports de `@/data/timelineMemories`, `EmbedCard`, `TimelineMapView`, filtros de comida etc. Manter só o feed real.
2. **Botão "+" flutuante**: FAB fixo `bottom-6 right-6`, 56×56, cor primária, abre o bottom sheet.
3. **Bottom sheet** (`AddContentSheet.tsx`, novo): usa `Sheet`/`Drawer` do shadcn, lista 3 opções com ícones grandes (44×44 mínimo, haptic on tap):
   - Foto → abre `<input type="file" accept="image/*" multiple>`
   - Vídeo → abre `<input type="file" accept="video/*" multiple>`
   - Nota → abre tela/modal com `<textarea>` e botão "Salvar"
4. **Progresso de upload**: lista local de uploads em andamento renderizada no topo do feed; cada item mostra nome do arquivo + barra (`Progress` do shadcn) + % calculado a partir do callback de `XMLHttpRequest` que envolvo no `upload`. Ao finalizar, item somente desaparece quando o `useTimelineMemories` revalida.
5. **Feed cronológico** (`MemoryFeedItem.tsx`, novo):
   - **Nota**: card com `description` em texto.
   - **Foto**: imagem `object-cover`, aspect 4/3, toque abre lightbox.
   - **Vídeo**: `<video>` com `preload="metadata"` mostrando o primeiro frame + overlay de ícone Play centralizado; toque abre player fullscreen.
   - Cada card mostra data relativa formatada.
6. **Fullscreen viewer** (`MediaViewer.tsx`, novo): overlay `fixed inset-0 bg-black z-50`, suporta swipe para fechar e navegação ←/→ entre mídias da timeline. Reusa `ImageLightbox` para fotos quando possível e adiciona `<video controls autoPlay playsInline>` para vídeos.

## Limpeza

- `AddMemoryFlow.tsx` antigo deixa de ser usado dentro de `TimelineDetail`. Verifico outros consumidores e removo se ficar órfão.
- Removo do `TimelineDetail` os blocos de "Categorias/Filtros", "Marcos" e "Mapa" que dependiam só de mock; podem voltar depois quando houver dados reais.

## Layout do bottom sheet

```text
┌─────────────────────────────┐
│  Adicionar à timeline       │
│                             │
│  📷  Foto                   │
│  🎬  Vídeo                  │
│  📝  Nota                   │
│                             │
│        [ Cancelar ]         │
└─────────────────────────────┘
```

## Notas

- Mantenho dark theme e alvos de toque ≥44px conforme regras do projeto.
- Sem autoplay de vídeos no feed; só inicia ao abrir fullscreen.
- Ordenação puramente por `created_at DESC`, sem agrupamentos.
