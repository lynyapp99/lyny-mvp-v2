# Correções: Criação de Timeline, Loop de Onboarding e Enquadramento

## 1. Criação de Timeline (PRIORIDADE MÁXIMA)

**Diagnóstico:** Em `src/pages/Create.tsx`, o formulário `CreateTimelineForm` tem um botão "Criar timeline" que **não tem `onClick` algum** — por isso nada acontece ao clicar. Além disso, o formulário expõe vários campos não-suportados pelo schema atual (cor, privacidade, oculta, autenticação, senha, capa) e força a etapa de Relacionamento, que ainda não existe como tabela no banco.

**Mudanças:**

- **Reescrever `CreateTimelineForm`** para conter apenas:
  - Nome (obrigatório, `useRef` — uncontrolled, sem re-render por tecla)
  - Descrição (opcional, `useRef`)
  - Setor (opcional, `<Select>` com lista de setores do usuário + opção "Sem setor" + "+ Criar novo setor")
  - Relacionamento (campo visualmente desabilitado/opaco com label "Em breve" — não bloqueia submit)
- **Remover** os blocos de cor, privacidade, ocultar, método de autenticação, senha, favoritar e upload de capa desse fluxo (mantemos a edição posterior pelo `EditTimelineFlow`).
- **Estado persistente do modal:** manter o `useState` no componente `Create` (pai) para que dados não se percam entre sub-telas (ex. abrir seletor de setor novo). Inputs uncontrolled mantêm o valor digitado no DOM enquanto o componente não desmontar — não desmontar o form ao abrir sub-modais (renderizar overlay por cima em vez de troca condicional).
- **Submit funcional** usando o hook existente `useCreateTimeline` de `src/lib/api/timelines.ts`:
  - Lê valores via refs, valida `title` não-vazio.
  - Se "novo setor" escolhido: chama `useCreateSector` antes, pega `id`, usa como `sector_id`.
  - Insere com `{ title, subtitle, sector_id, privacy: 'private' }`.
  - Em sucesso: invalida cache de timelines, fecha o modal/flow, `navigate(`/timeline/${id}`)`.
  - Em erro: toast com a mensagem do Supabase.
- **Remover obrigatoriedade de relacionamento** em qualquer ponto do fluxo (limpa estado `relationshipId` e seletor obrigatório).

## 2. Onboarding — Loop Após Cadastro

**Diagnóstico:** Em `src/pages/Auth.tsx` (linha 64–68), após signup bem-sucedido o código **sempre** navega para `/onboarding`, ignorando se o usuário já completou. Em `Splash.tsx`, o gate usa apenas `localStorage.getItem("onboarding_seen")`, que é por-dispositivo e some em outro browser/limpeza de cache.

**Mudanças:**

- **Migração SQL** na tabela `profiles`:
  - Adicionar coluna `onboarding_completed boolean not null default false`.
- **`Onboarding.tsx`** ao terminar (botão "Criar minha conta" e "Já tenho conta", ou ao chegar no último slide e prosseguir): além de navegar, executar `update profiles set onboarding_completed = true where id = auth.uid()` (se houver sessão). Se ainda não houver sessão (caso do signup), salvar localStorage temporário "onboarding_pending_complete" e, no `useAuth` ao detectar nova sessão, fazer o update e limpar a flag.
- **`Auth.tsx`:** após signup, em vez de ir direto para `/onboarding`, verificar `profiles.onboarding_completed`:
  - Se `true` → `/home`.
  - Se `false` → `/onboarding`.
  - Para login normal: mesma checagem antes do redirect default `from`.
- **`Splash.tsx`:** quando há sessão, buscar `profiles.onboarding_completed`. Se `true` → `/home`; se `false` → `/onboarding`. Remover dependência de `localStorage("onboarding_seen")` para usuários autenticados (manter só como dica para visitantes não-logados, opcional).
- Resultado: usuário recém-criado que completou onboarding nunca mais o vê, em qualquer dispositivo.

## 3. Enquadramento (Padding Lateral)

- Auditar telas principais: `Home`, `Relationships`, `Notifications`, `Profile`, `Create`, `TimelineDetail`, `EventDetail`, `Auth`, `Onboarding`.
- Garantir wrapper com `px-4` (16 px) em todos os containers raiz; corrigir os que tenham `px-0` ou estejam usando apenas `max-w-md mx-auto` sem padding.
- Conferir `AppHeader` e `ContextHeader` para que o conteúdo respeite `px-4` e elementos absolutos (avatar, ícones) não ultrapassem a borda.
- Conferir cards horizontais (carrosséis de setor, shortcuts) para que itens recortados respeitem padding inicial e final.

## Arquivos afetados

- `src/pages/Create.tsx` — reescreve `CreateTimelineForm`, wire submit, remove campos extras, remove obrigatoriedade de relacionamento.
- `src/pages/Auth.tsx` — checa `onboarding_completed` no redirect pós-auth.
- `src/pages/Splash.tsx` — checa flag no banco quando autenticado.
- `src/pages/Onboarding.tsx` — grava flag ao concluir.
- `src/hooks/useAuth.tsx` — ao detectar sessão nova, se `localStorage.onboarding_pending_complete`, atualiza profile e limpa.
- `supabase/migrations/*` — `alter table profiles add column onboarding_completed boolean not null default false`.
- Telas listadas em §3 — ajuste de `px-4` onde faltar.

## Detalhes técnicos

- Mantemos `defaultValue=""` + `useRef` para campos texto (sem re-render por tecla, conforme correção anterior).
- O seletor de setor usa `useState` (re-render é necessário e barato).
- `useCreateTimeline` já existe; só adicionar `navigate` no `onSuccess` do componente.
- RLS de `profiles` já permite `update` próprio; nenhuma policy nova necessária.
