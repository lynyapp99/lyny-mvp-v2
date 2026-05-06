# Participantes na Timeline Detail

Adicionar uma seção de "Participantes" na tela `TimelineDetail`, mostrando avatares empilhados (dono + membros), com modal para lista completa.

## 1. Camada de dados

Criar hook `useTimelineMembers(timelineId)` em `src/lib/api/timelines.ts`:

- Busca em paralelo:
  1. A timeline (para obter `user_id` do dono).
  2. Os `timeline_members` daquela timeline.
  3. Os `profiles` correspondentes (dono + membros) numa única query `in("id", [...])`.
- Retorna lista unificada `{ userId, role: "owner" | "contributor" | "viewer", displayName, username, avatarUrl }`, com o dono sempre primeiro e sem duplicatas (caso o dono também esteja em `timeline_members`).
- React Query key: `["timeline-members", timelineId]`.

Observação RLS: as policies já permitem ao dono ver todos os membros, e cada membro vê a si próprio. Para a lista completa funcionar para membros não-donos, vamos relaxar via consulta — se o usuário não é dono, ainda assim verá pelo menos a si mesmo + dono (via profiles). Para o escopo atual (avatares visuais), isso é suficiente; só o dono terá a lista 100% completa, o que se alinha com o requisito "Só o dono vê o role de cada participante".

## 2. Componente `TimelineParticipants`

Novo arquivo `src/components/TimelineParticipants.tsx`:

- Props: `timelineId: string`, `isOwner: boolean`.
- Usa `useTimelineMembers`.
- Renderiza stack horizontal com até 5 avatares sobrepostos (`-ml-2`, `ring-2 ring-background`), usando `Avatar`/`AvatarImage`/`AvatarFallback` (iniciais do `displayName` ou `username`).
- Se houver mais de 5, mostra um círculo extra `+N`.
- Toda a área é clicável (touch target ≥44px) e abre um `Sheet` com a lista completa:
  - Cada linha: avatar, nome (`@username` abaixo), e — apenas se `isOwner` — uma badge com role traduzido: `Dono`, `Contribuidor`, `Visualizador`.
- Haptic `navigator.vibrate(10)` no toque (segue padrão do projeto).

## 3. Integração em `TimelineDetail.tsx`

- Importar `TimelineParticipants`.
- Renderizar logo abaixo do bloco de capa (antes do `uploads`/feed), dentro de `max-w-md mx-auto px-4`, com um pequeno título "Participantes" em `text-xs uppercase text-muted-foreground` e o stack abaixo.
- Passar `timelineId={timeline.id}` e `isOwner={isOwner}`.

## Detalhes técnicos

- Iniciais: pegar primeira letra de cada palavra do `displayName` (até 2), fallback para `username[0]`.
- Sem alterações de schema, sem migrations.
- Sem autoplay/scroll programático (respeita regra do projeto).
- Tema escuro: `ring-background` nos avatares para criar separação visual no stack.
