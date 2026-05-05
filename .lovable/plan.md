## Mudança

Em `src/pages/Home.tsx`, remover o bloco de "Timelines sem setor" (linhas 641-672) — o `<h2>Timelines</h2>` com a lista de timelines sem `sectorId` e o botão "Nova".

## Resultado

A home passa a exibir, nesta ordem:
1. Atalhos (`TimelineShortcuts`)
2. Seus Setores (carrossel)
3. Compartilhadas comigo
4. `RecentAndFavorites` (Todas / recentes / favoritas / protegidas)

## Notas

- O empty state ("Comece sua jornada") permanece intacto.
- Nenhum import precisa ser removido (todos continuam em uso).
- O botão "Criar Setor para organizar" (quando há timelines mas nenhum setor) permanece — útil quando o usuário ainda só tem timelines sem setor, podendo criar um para movê-las.
