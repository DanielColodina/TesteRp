# 🔧 Guia de Troubleshooting - CSS Improvements

## ✅ Verificação Rápida

### Problema: CSS não está sendo aplicado

**Solução:**
1. Verifique se os arquivos estão linkados no HTML:
   ```html
   <link rel="stylesheet" href="/css/style.css">
   <link rel="stylesheet" href="/css/premium-effects.css">
   ```

2. Limpe o cache do navegador:
   ```
   Chrome: Ctrl+Shift+Delete (Cmd+Shift+Delete no Mac)
   ```

3. Verificar console (F12) para erros de CORS ou 404

---

## 🎨 Problemas Visuais

### Issue: Glassmorphism não aparece

**Causa:** Navegador não suporta `backdrop-filter`

**Solução:**
```css
/* Fallback para navegadores antigos */
.card {
  background: rgba(30, 30, 46, 0.95); /* Sem blur */
  background: linear-gradient(135deg, rgba(31, 31, 46, 0.8), rgba(26, 26, 38, 0.6));
  backdrop-filter: blur(20px); /* Apenas navegadores suportados */
}
```

**Navegadores Suportados:**
- ✅ Chrome 76+
- ✅ Safari 9+
- ✅ Firefox 103+
- ✅ Edge 17+

---

### Issue: Animações ficam travadas

**Solução 1 - Verificar Performance:**
```javascript
// DevTools > Performance tab
// 1. Abra DevTools (F12)
// 2. Vá para Performance
// 3. Clique em Record
// 4. Interaja com o elemento
// 5. Clique Stop
// Procure por "Long task" em vermelho
```

**Solução 2 - Ativar GPU Acceleration:**
```css
.dashboard-card {
  transform: translateZ(0);
  will-change: transform;
}
```

**Solução 3 - Reduzir Complexidade:**
```css
/* ❌ Ruim - muitos efeitos */
.card:hover {
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  border-color: rgba(255,195,0,0.3);
  background: gradient complexo;
  transform: translateY(-12px);
}

/* ✅ Bom - efeitos simples */
.card:hover {
  transform: translateY(-8px);
  opacity: 0.95;
}
```

---

### Issue: Responsividade quebrada em mobile

**Debug Mobile:**
```javascript
// Abra DevTools
// Pressione Ctrl+Shift+M (Cmd+Shift+M no Mac)
// Teste em diferentes resoluções

// Verificar viewport
console.log(window.innerWidth, window.innerHeight);
```

**Problemas Comuns:**
1. **Padding/Margin grande demais em mobile**
   ```css
   @media (max-width: 768px) {
     .app-container {
       padding: 16px 20px; /* Reduzir de 36px 40px */
     }
   }
   ```

2. **Texto com font-size muito grande**
   ```css
   h1 {
     font-size: 2rem; /* Desktop */
   }
   
   @media (max-width: 768px) {
     h1 {
       font-size: 1.3rem; /* Mobile */
     }
   }
   ```

3. **Grid com colunas rígidas**
   ```css
   /* ❌ Ruim */
   .grid {
     grid-template-columns: repeat(3, 1fr);
   }
   
   /* ✅ Bom */
   .grid {
     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
   }
   ```

---

## 🎯 Problemas de Cores & Contraste

### Issue: Contraste baixo (não acessível)

**WCAG Compliance Check:**
```javascript
// Use Lighthouse no Chrome DevTools
// Audit > Accessibility
```

**Requisitos Mínimos:**
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

**Solução - Aumentar Contraste:**
```css
/* ❌ Ruim - texto cinzento em fundo escuro */
.text {
  color: #808080; /* Contraste insuficiente */
}

/* ✅ Bom - texto mais claro */
.text {
  color: #C0C0C0; /* Melhor contraste */
}
```

---

## ⚡ Problemas de Performance

### Issue: Página carrega lenta

**Checklist:**
1. Verificar Network em DevTools
2. Procurar por recursos grandes (>100KB)
3. CSS deve estar otimizado

**Minificar CSS:**
```bash
# Usar ferramentas como cssnano, PostCSS
npm install -g cssnano
cssnano style.css -o style.min.css
```

---

### Issue: Hover effects atrasado

**Solução - Usar GPU Acceleration:**
```css
.card {
  /* Ativar aceleração de hardware */
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.card:hover {
  transform: translate3d(0, -8px, 0); /* Usar 3D */
}
```

---

## 🌐 Problemas de Compatibilidade

### Issue: Funciona em Chrome mas não em Safari

**Verificar Prefixos:**
```css
/* Safari requer -webkit */
.card {
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  
  -webkit-background-clip: text;
  background-clip: text;
  
  -webkit-text-fill-color: transparent;
  color: transparent; /* Fallback */
}
```

---

### Issue: Funciona em Desktop mas não em Mobile

**Mobile-Specific Issues:**
1. **Touch vs Hover** - Mobile não tem hover
   ```css
   /* Use :active em vez de :hover */
   .btn:active {
     transform: scale(0.95);
   }
   ```

2. **Viewport Meta Tag**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

3. **Touch Targets** - Mínimo 44-48px
   ```css
   button {
     min-height: 48px; /* Móvel */
     min-width: 48px;
   }
   ```

---

## 🔍 Debugging Tools

### Browser DevTools

**1. Inspecionar Elementos:**
```
Clique direito > Inspect Element
Ou: F12 > Elements tab
```

**2. Verificar Computed Styles:**
- DevTools > Elements > Styles
- Procure por propriedade específica
- Veja qual CSS está aplicado

**3. Performance Monitor:**
```javascript
// Chrome DevTools > Rendering > Paint flashing
// Mostra o que está sendo repintado

// Ou use:
// DevTools > Performance > Record
```

---

### Lighthouse Audit

```
DevTools > Lighthouse > Generate report

Analisa:
- Performance (LCP, CLS, FID)
- Accessibility
- Best Practices
- SEO
```

---

### CSS Validators

```
https://jigsaw.w3.org/css-validator/
https://www.screenfly.io/
https://responsively.app/
```

---

## 📱 Testar em Dispositivos Reais

### Android Chrome
1. Conecte dispositivo via USB
2. DevTools > Devices > Add device
3. Abra localhost no telefone

### iOS Safari
1. iPhone conectado ao Mac
2. Safari > Develop > [Device]
3. Inspecione página

---

## 🚀 Otimizações Finais

### Critical CSS
Extraia CSS crítico (acima da dobra):
```html
<!-- Inline CSS crítico -->
<style>
  /* Apenas CSS visível na primeira tela */
  .top-bar { ... }
  .card { ... }
</style>

<!-- Defer outras folhas -->
<link rel="stylesheet" href="/css/premium-effects.css">
```

### Minificação
```bash
# Minificar todos os CSS
for file in public/css/*.css; do
  npx cssnano "$file" -o "${file%.css}.min.css"
done
```

### Compression
```bash
# Habilitar GZIP no servidor (nginx, Apache)
# Reduz tamanho de ~50KB para ~8KB
```

---

## 📊 Monitorar com Ferramentas

### Google Analytics
```javascript
// Monitorar Web Vitals
web-vital.js
```

### Sentry
```javascript
// Capturar erros de CSS
Sentry.init({
  dsn: "seu-dsn"
});
```

---

## ❓ FAQ

**P: Por que os cards ficam branco em alguns navegadores?**
R: Seu navegador não suporta `backdrop-filter`. Use fallback com background simples.

**P: As animações estão lentas no meu celular?**
R: Reduza o número de elementos animados ou desative em mobile:
```css
@media (max-width: 768px) {
  .dashboard-card {
    animation: none; /* Desativar em mobile */
  }
}
```

**P: Como faço para usar cores customizadas?**
R: Modifique as CSS variables:
```css
:root {
  --yellow-primary: #FFD700;
  --text-primary: #FFFFFF;
}
```

---

## 📞 Suporte

Se o problema persistir:
1. Verifique console para erros (F12 > Console)
2. Veja os estilos computados (F12 > Elements > Styles)
3. Teste em incógnito para descartar extensões
4. Tente em outro navegador
5. Limpe cache e cookies

---

**Última Atualização**: 26 de janeiro de 2026
**Versão**: 1.0
