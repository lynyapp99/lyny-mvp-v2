O problema não é o banco nem o salvamento: é a árvore React. O caso mais grave está em `src/pages/Create.tsx`: o componente `CreateTimeline` foi declarado dentro do componente `Create`. Quando qualquer campo chama `setTimelineData` no primeiro caractere, o `Create` re-renderiza, uma nova função `CreateTimeline` é criada, o React entende como outro componente, desmonta/remonta o formulário e o input perde o foco. Isso explica exatamente o comportamento: digita 1 caractere, trava/perde foco, precisa clicar de novo.

Plano de correção:

1. Corrigir a criação de timeline em definitivo
- Extrair o formulário de criação de timeline para um componente estável fora do `Create`.
- Preferencialmente criar `src/components/CreateTimelineFlow.tsx` ou mover a função para fora do componente pai.
- Trocar os campos de texto por formulário não-controlado com `useRef`/`defaultValue`, para digitação não causar re-render.
- Manter em state somente escolhas que realmente mudam a UI: relacionamento, cor, privacidade, timeline oculta, método de autenticação.
- Garantir que o usuário consiga digitar “Viagem para Trancoso” letra por letra sem desmontagem, sem perda de foco e sem re-render por caractere.

2. Corrigir o modal principal de timeline (`TimelineModal.tsx`)
- Remover qualquer state disparado durante digitação, especialmente `hasTitle` atualizado no `onInput`.
- Usar validação apenas no clique em “Criar”.
- Se necessário, deixar o botão sempre clicável e mostrar erro inline/toast quando o nome estiver vazio, ou atualizar disponibilidade apenas em `onBlur`, nunca por caractere.
- Remover `autoFocus` se ele estiver competindo com o gerenciamento de foco do Dialog em mobile.

3. Corrigir todos os formulários com o mesmo padrão de perda de foco/re-render excessivo
- Revisar e ajustar campos controlados nos fluxos com inputs/textarea:
  - `Create.tsx`
  - `AddMemoryFlow.tsx`
  - `EditTimelineFlow.tsx`
  - `DeepenTimelineFlow.tsx`
  - `SectorModal.tsx`
  - `NoteComposer.tsx`
  - `PublicProfileSettings.tsx`
  - e demais modais encontrados com `value + onChange + setState` em campos de texto.
- Converter campos de digitação livre para `useRef`/`defaultValue` quando o valor não precisa renderizar em tempo real.
- Para campos que precisam validar, validar no submit/blur ou manter state mínimo que não remonte o componente.

4. Garantir salvamento e navegação da timeline
- No fluxo de criação usado pela Home, manter a chamada de criação no backend.
- Após criar:
  - fechar modal/tela de criação;
  - invalidar/atualizar a lista para a timeline aparecer imediatamente na home;
  - redirecionar para `/timeline/{id}`.
- Preservar criação com setor existente e criação de novo setor quando aplicável.

5. Higiene técnica para evitar regressão
- Remover componentes declarados dentro de outros componentes quando eles contêm inputs.
- Usar `useCallback`/props estáveis onde necessário, mas a correção principal será impedir desmontagem/remontagem e parar updates por caractere em formulários pesados.
- Fazer uma revisão mental campo a campo: ao digitar em qualquer input, nada deve fechar, remontar, trocar `key`, refocar outro elemento ou recriar o componente do formulário.