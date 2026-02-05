# 🧪 Guia de Testes - Otimização Responsiva

## ⚡ Teste Rápido (5 minutos)

### 1. **Verificar Scrollbars Visíveis**

#### Adicionar Obras:
```
1. Acesse: http://localhost:3000/dashboard/controle-geral
2. Clique em "Gestão de Obras"
3. Clique em "+ Nova Obra" (ou acesse o formulário)
4. Role para baixo
5. ✅ Deve ver scrollbar amarela no lado direito
```

#### Adicionar Usuários:
```
1. Acesse: http://localhost:3000/dashboard/tablesUsers
2. Clique em um usuário na tabela
3. Modal abre com detalhes
4. Role para baixo
5. ✅ Deve ver scrollbar amarela no modal
```

### 2. **Verificar Responsividade Rápida**

**Chrome DevTools:**
```
1. Abrir página qualquer
2. Pressionar F12 (ou Ctrl+Shift+I)
3. Clicar em device toggle (📱 icon) ou Ctrl+Shift+M
4. Testar esses tamanhos:
   - iPhone SE (375x667)
   - Pixel 4 (412x915)
   - iPad (768x1024)
   - Desktop (1920x1080)
5. ✅ Nenhum layout deve quebrar
```

### 3. **Verificar Sidebar Mobile**

```
1. No DevTools, selecionar iPhone mode
2. Página carrega → Sidebar deve estar FECHADO
3. Clicar no ☰ (hambúrguer)
4. ✅ Sidebar abre com overlay
5. Clicar fora ou no X
6. ✅ Sidebar fecha
```

## 🔍 Teste Detalhado (30 minutos)

### Testes por Breakpoint

#### 📱 Small Phones (max-width: 480px)
```
Simulado com: iPhone SE, iPhone 6/7/8

Checklist:
☐ Font size base é legível (13px)
☐ Botões têm min-height 44px (tocáveis)
☐ Sidebar começa fechado
☐ Grid layouts em 1 coluna
☐ Modal max-height 80vh
☐ Scrollbar visível e funcional
☐ Input font-size 16px (sem zoom iOS)
☐ Padding/margin apropriados

Command para testar:
  DevTools > Device > iPhone SE > Reload
```

#### 📱 Tablets (481px - 768px)
```
Simulado com: iPad Mini, Android Tablet

Checklist:
☐ Font size 14px
☐ Sidebar 240px width
☐ Modal max-height 70vh
☐ Grid em 2 colunas quando possível
☐ Tabelas legíveis
☐ Scrollbar width 8px

Command para testar:
  DevTools > Device > iPad > Reload
```

#### 🖥️ Desktop (1024px+)
```
Simulado com: Chrome normal (sem device mode)

Checklist:
☐ Layout original mantido
☐ Sidebar aberto por padrão
☐ Todas as animações funcionando
☐ Scrollbar width 10px
☐ Font sizes normais
☐ Sem quebras de layout

Command para testar:
  Fechar DevTools (F12)
  Verificar em resolução máxima
```

#### 🎮 Landscape Mode
```
Simulado com: DevTools > Rotate (ou flip device)

Checklist:
☐ Conteúdo visível (max-height 70vh)
☐ Sidebar com overflow-y:auto se preciso
☐ Headers sticky ao top
☐ Modais ainda acessíveis
```

### Performance Testing

#### Em Aparelho Antigo/Fraco:
```
Opção 1 - Simular com DevTools:
1. F12 > Device > Chrome > Device Throttling > Slow 4G
2. F12 > Performance > Reload
3. Verificar FPS durante scroll

Opção 2 - Dispositivo Real:
1. Abrir em Android antigo (Kit Kat/Lollipop)
2. Rolar listas longas
3. Abrir modais
4. ✅ Não deve travar

Métricas esperadas:
- Scroll FPS: 30+ (suportável em aparelhos fracos)
- Animation FPS: 24+ (reduzido mas suave)
- Blur load: imperceptível
```

## 🎨 Teste Visual

### Scrollbar Visual Check

```css
/* Esperado ver em todos os containers grandes: */

Color:  Amarelo (#FFC300) → Gradiente
Track:  Transparente com toque de amarelo
Hover:  Amarelo mais vibrante (#FFD700)
Width:  10px (desktop), 8px (tablet), 6px (mobile)
Radius: 5px (arredondado)
```

**Verificar em:**
- ✅ Main page scroll
- ✅ Modal scroll
- ✅ Form scroll
- ✅ Table scroll

### Responsive Grid Check

```
Esperado:
- 320px width:   1 coluna
- 480px width:   1 coluna
- 768px width:   1-2 colunas
- 1024px width:  2+ colunas
```

## 🐛 Debugging

### Se Scrollbar Não Aparecer:

```bash
# 1. Abrir DevTools (F12)
# 2. Elements > Selecionar o container
# 3. Verificar no Styles:

CSS esperado:
- overflow-y: auto ou scroll
- max-height: algum valor (não 100%)
- scrollbar-width: thin (Firefox)
- scrollbar-color: [...] (Firefox)

# 4. Se não ver, adicionar manualmente:
Elementos.style {
  overflow-y: auto;
  max-height: 80vh;
}
```

### Se Layout Quebrar:

```bash
# 1. DevTools > Console (tab)
# 2. Procurar por erros (texto vermelho)
# 3. Se não ver erros:

# Verificar media queries:
# F12 > Ctrl+Shift+P > "Toggle device toolbar"
# Redimensionar de 320px até 1920px
# Procurar por jumps/breaks

# Se encontrar:
# Procurar classe no CSS:
grep -r ".classe-quebrada" public/css/
# Ajustar media query para aquele breakpoint
```

### Se Sidebar Não Fechar em Mobile:

```javascript
// DevTools > Console
// Executar:

const sidebar = document.querySelector('.sidebar');
console.log('Has open class?', sidebar.classList.contains('open'));
console.log('Classes:', sidebar.className);

// Esperado:
// Has open class? false (ou não ter 'open')
// Classes: sidebar sidebar-closed (em mobile)
```

## 📊 Test Reports

### Teste Automatizado (Lighthouse)

```bash
# Chrome DevTools:
1. F12 > Lighthouse tab
2. Device: Mobile
3. Click "Analyze"
4. Verificar scores:
   - Performance: 70+ (alvo para mobile)
   - Accessibility: 80+
   - Best Practices: 80+

# Esperar melhorias em:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
```

### Manual Test Checklist

```markdown
## Test Session: [DATE]
Tester: [NAME]
Device: [DEVICE MODEL]
Browser: [CHROME/FIREFOX/SAFARI]
Screen Size: [WIDTHxHEIGHT]

### Visual
☐ Scrollbars visíveis em modais
☐ Cores corretas (amarelo)
☐ Sem layout shifts
☐ Fonte legível

### Interaction
☐ Sidebar abre/fecha
☐ Scroll suave
☐ Botões tocáveis
☐ Inputs aceitam input

### Performance
☐ Sem lag ao scroll
☐ Animações suaves
☐ Modais abrem rápido
☐ Transições fluidas

### Responsiveness
☐ Sem overflow horizontal
☐ Grid adapta corretamente
☐ Texto reflow apropriado
☐ Imagens escaláveis

### Bugs Found
1. [BUG DESCRIPTION]
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Severity: [Critical/High/Medium/Low]

### Overall Result
☐ PASS - Sem issues críticos
☐ PASS with notes - Issues menores encontrados
☐ FAIL - Issues críticos bloqueiam
```

## 🚀 Teste em Produção

Depois de fazer deploy:

```bash
# 1. Verificar CSS foi enviado:
curl -I https://seu-site.com/css/style.css?v=2.1
# Esperado: 200 OK com Cache-Control headers

# 2. Verificar em diferentes devices:
- iPhone real
- Android real
- Tablet real
- Desktop vários navegadores

# 3. Monitor de performance:
- Google Analytics
- Core Web Vitals
- User feedback
```

## 📝 Notas

**Cache busting:** Se mudanças CSS não aparecer:
```
Forçar refresh: Ctrl+Shift+R (ou Cmd+Shift+R no Mac)
Ou limpar cache: DevTools > Application > Clear Storage
```

**Versão CSS:** Atualmente em `?v=2.1`
- Incrementar para `?v=2.2` se fizer novas mudanças
- Atualizar em: `src/views/layouts/main.handlebars`

---
**Versão do Guia:** 1.0  
**Status:** Ready for testing  
**Last Updated:** 2025-01-XX
