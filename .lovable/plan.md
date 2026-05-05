# Controle de permissão no convite (viewer / contributor)

## 1. Migration (banco)

```sql
ALTER TABLE timelines
  ADD COLUMN IF NOT EXISTS invite_role text NOT NULL DEFAULT 'contributor';

-- Atualizar get_invite_info para retornar invite_role
CREATE OR REPLACE FUNCTION public.get_invite_info(_token text)
RETURNS TABLE(
  timeline_id uuid, timeline_title text, timeline_subtitle text,
  cover_url text, owner_id uuid, owner_name text, invite_role text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT t.id, t.title, t.subtitle, t.cover_url, t.user_id,
         COALESCE(p.display_name, p.username, 'Alguém'),
         COALESCE(t.invite_role, 'contributor')
  FROM public.timelines t
  LEFT JOIN public.profiles p ON p.id = t.user_id
  WHERE t.invite_token = _token
  LIMIT 1
$$;
```

Policy de INSERT em `memory_media` / `memories` hoje exige `auth.uid() = user_id` — já permite que qualquer membro insira mídias próprias. Mas o SELECT só permite ver via `is_timeline_member`, então precisamos garantir que contributors também sejam membros (já são, via `timeline_members`). Sem mudanças adicionais de RLS.

## 2. `src/components/InviteSheet.tsx` (quem convida)

- Aceitar nova prop `currentRole: 'viewer' | 'contributor'` (lido do `timelineRow.invite_role`).
- Adicionar bloco antes do link, somente quando `token` já existe:
  - Label: "Quem aceitar poderá:"
  - Duas opções estilo lista (radio cards, 44×44 mínimo, vibrate(10)):
    - 👁 Apenas visualizar (`viewer`)
    - 📸 Visualizar e adicionar fotos (`contributor`, padrão)
  - Ao trocar: `supabase.from('timelines').update({ invite_role: novo }).eq('id', timelineId)`, otimista local + invalidar `["timelines"]`. Toast em erro.

## 3. `src/pages/TimelineDetail.tsx`

- Passar `currentRole={timelineRow.invite_role ?? 'contributor'}` ao `InviteSheet`.
- Calcular permissão do usuário atual:
  - `isOwner` (já existe).
  - Buscar `userRole` em `timeline_members` para o `user.id` atual (via `useQuery` simples, ou já incluir no fetch existente). 
  - `canContribute = isOwner || userRole === 'contributor'`.
- Esconder o FAB de adicionar (`<button … aria-label="Adicionar memória">`) quando `!canContribute`. Igual para o `AddContentSheet`.

## 4. `src/pages/InviteAccept.tsx`

- `InviteInfo` ganha `invite_role: string`.
- Ao popular `setInvite`, incluir `invite_role: tl.invite_role ?? 'contributor'`.
- No `upsert` de `timeline_members`, usar `role: invite.invite_role ?? 'contributor'` em vez do hardcoded `"viewer"`.

## Arquivos tocados

- `supabase/migrations/<novo>.sql` — coluna + função `get_invite_info`
- `src/components/InviteSheet.tsx` — seletor de papel + update
- `src/pages/InviteAccept.tsx` — usar invite_role no upsert
- `src/pages/TimelineDetail.tsx` — esconder FAB para viewers, passar role ao InviteSheet

Nenhuma outra funcionalidade é alterada.
