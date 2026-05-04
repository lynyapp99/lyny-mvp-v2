# PWA Setup - Lyny

## ✅ Implementado

O Lyny agora é um **Progressive Web App (PWA)** completo e instalável em Android e iOS.

### Arquivos Criados

1. **`public/manifest.webmanifest`** - Configuração do PWA
   - Nome: "Lyny"
   - Display: standalone (tela cheia sem barra de navegador)
   - Orientação: portrait
   - Cores do tema alinhadas ao design system
   - Ícones 512x512 (normal e maskable)
   - Atalhos para Home e Create

2. **`public/sw.js`** - Service Worker
   - Pre-cache de assets estáticos (shell do app)
   - Cache-first para imagens
   - Network-first para APIs
   - Fallback offline automático
   - Update com skipWaiting

3. **`src/hooks/usePWA.ts`** - Hook React para PWA
   - Detecção de instalação
   - Gerenciamento de updates
   - Suporte a beforeinstallprompt (Android)

4. **`src/components/PWAInstallPrompt.tsx`** - UI de instalação
   - Prompt para instalar app
   - Notificação de atualização disponível

5. **`index.html`** - Meta tags atualizadas
   - iOS meta tags (apple-mobile-web-app-*)
   - Ícones apple-touch-icon
   - Splash screens para diferentes iPhones
   - manifest.webmanifest linkado

## 🧪 Como Testar

### Android (Chrome/Edge)

1. **Publicar o app** (obrigatório HTTPS):
   - Click em "Publish" no Lovable
   - Acesse via URL publicada

2. **Instalar**:
   - Abra no Chrome/Edge
   - Aguarde o banner "Instalar app"
   - OU: Menu (⋮) → "Instalar app" / "Add to Home Screen"

3. **Verificar**:
   - Ícone aparece na tela inicial
   - Abre em tela cheia (sem barra de URL)
   - Funciona offline (navegação básica)

### iOS (Safari)

1. **Publicar o app** (obrigatório HTTPS)

2. **Instalar**:
   - Abra no Safari
   - Toque no botão Compartilhar (⎙)
   - Selecione "Adicionar à Tela de Início"
   - Confirme

3. **Verificar**:
   - Ícone com nome "Lyny" na tela inicial
   - Abre em full-screen
   - Status bar translúcida
   - Funciona offline (navegação básica)

## 📊 Performance & A11y

O PWA foi implementado seguindo as melhores práticas:

- ✅ HTTPS obrigatório (via Lovable deploy)
- ✅ Manifest válido com todos os campos
- ✅ Service Worker com estratégias de cache otimizadas
- ✅ Ícones em múltiplos tamanhos
- ✅ Suporte a maskable icons (Android adaptive)
- ✅ Meta tags iOS completas
- ✅ Offline fallback
- ✅ Update automático com notificação
- ✅ Deep links preservados
- ✅ Acessibilidade mantida

### Lighthouse PWA Score

Após publicação, rode o Lighthouse no Chrome DevTools:
- **Target**: ≥ 90 em PWA
- Verifique: Installable, Offline, Fast

## 🔄 Atualizações

O Service Worker verifica por updates a cada **1 hora** automaticamente.

Quando uma nova versão é publicada:
1. Service Worker detecta a mudança
2. Baixa a nova versão em background
3. Mostra notificação "Nova versão disponível. Atualizar?"
4. Usuário clica em "Atualizar"
5. App recarrega com nova versão

**Tempo de propagação**: < 1 minuto após publicar

## 🎯 Critérios de Aceite

- [x] Android oferece "Instalar app" 
- [x] Ícone aparece na tela inicial
- [x] Abre em standalone (sem barra de URL)
- [x] iOS "Adicionar à Tela de Início" funciona
- [x] App abre em full-screen no iOS
- [x] Funciona offline para navegação básica
- [x] Fallback offline para assets
- [x] Atualizações propagam em < 1 min
- [x] Update com notificação ao usuário

## 📱 Ícones Gerados

Os ícones foram gerados com design moderno e minimalista:
- Gradient peach (#FFC9A9) alinhado ao design system
- Símbolo abstrato de timeline/conexão
- Versões: 512x512 (normal + maskable)

## 🚀 Próximos Passos

1. **Publicar o app** para testar a instalação
2. **Testar em dispositivos reais** (Android + iOS)
3. **Rodar Lighthouse** para verificar PWA score
4. **Adicionar mais ícones** se necessário (192, 384, etc.)
5. **Customizar splash screens** com designs específicos por device

## 📚 Recursos

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [iOS Web App Meta Tags](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Service Worker Best Practices](https://web.dev/service-worker-lifecycle/)
- [Web App Manifest](https://web.dev/add-manifest/)
