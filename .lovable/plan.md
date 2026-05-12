# Substituir wordmark "lyny" pelo SVG customizado

## Pré-requisito
Preciso que o arquivo `lyn-2.svg` seja reanexado — atualmente o sandbox não consegue acessá-lo (apenas 3 dos 24 paths aparecem no preview).

## Passos

1. **Copiar o SVG para o projeto**
   - `code--copy user-uploads://lyn-2.svg src/assets/lyny-logo.svg`
   - Também salvar uma versão PNG/SVG em `public/lyny-logo.svg` para uso em `<img>` direto (Auth, manifest).

2. **Criar `src/components/LynyLogo.tsx`**
   - Componente que renderiza o SVG inline (paths convertidos), aceitando props:
     - `height` (default 28)
     - `className` (para herdar `text-foreground` etc.)
     - `aria-label="lyny"`
   - SVG com `fill="currentColor"` para herdar a cor do tema (substitui os gradientes por cor sólida do tema, mantendo o traço original).
   - Ratio preservado via `viewBox="0 0 185 109"`, `width="auto"`.

3. **Substituir usos atuais do texto "lyny"**
   - `src/components/AppHeader.tsx` linha 73-78 → `<LynyLogo height={28} />` (cobre Home, Notifications, Profile, Relationships).
   - `src/pages/Splash.tsx` linhas 39-58 → trocar o ícone `Heart` + texto "Lyny" por `<LynyLogo height={64} />`.
   - `src/pages/Onboarding.tsx` — adicionar `<LynyLogo height={48} />` no topo (acima dos slides).
   - `src/pages/Auth.tsx` linha 179 → `<LynyLogo height={48} className="mx-auto mb-3" />` (substitui o `<img src="/lyny-logo.png">`).
   - `src/pages/EventInvite.tsx` linha 54 → `<LynyLogo height={28} />`.

4. **PWA / favicon**
   - Atualizar `public/manifest.webmanifest` para apontar ícones para o novo SVG (mantém PNGs existentes se houver, apenas adiciona o SVG como ícone primário).
   - Atualizar `<link rel="icon">` em `index.html` para `/lyny-logo.svg`.

## Detalhes técnicos

- O SVG usa gradientes (`paint0_linear_3307_312` etc.). No componente vou:
  - Manter os `<defs>` originais com gradientes para preservar o visual fiel.
  - Como alternativa para casos monocromáticos (ex: header escuro), oferecer prop `monochrome?: boolean` que substitui os gradientes por `fill="currentColor"`.
- Não há mudança de comportamento, apenas apresentação.

## Arquivos a alterar
- `src/components/LynyLogo.tsx` (novo)
- `src/assets/lyny-logo.svg` (novo)
- `public/lyny-logo.svg` (novo)
- `src/components/AppHeader.tsx`
- `src/pages/Splash.tsx`
- `src/pages/Onboarding.tsx`
- `src/pages/Auth.tsx`
- `src/pages/EventInvite.tsx`
- `index.html`
- `public/manifest.webmanifest`
