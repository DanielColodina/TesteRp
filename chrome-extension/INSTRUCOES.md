# Extensão do Chrome - RP Empreendimentos

## Como instalar

### Passo 1: Gerar os ícones
1. Abra o arquivo `generate-icons.html` no seu navegador
2. Clique nos botões para baixar os ícones: icon16.png, icon48.png e icon128.png
3. Salve esses arquivos na pasta `chrome-extension/`

### Passo 2: Instalar a extensão no Chrome

**Opção A - Modo Desenvolvedor (Recomendado):**
1. Abra o Chrome e acesse `chrome://extensions/`
2. Ative o "Modo de desenvolvedor" no canto superior direito
3. Clique em "Carregar sem compactação"
4. Selecione a pasta `chrome-extension/`
5. A extensão está instalada! Agora você tem um ícone na barra de ferramentas

**Opção B - Compactar e instalar:**
1. Compacte a pasta `chrome-extension/` em um arquivo .zip
2. Vá em `chrome://extensions/`
3. Ative o "Modo de desenvolvedor"
4. Clique em "Carregar расширение" (Carregar extensão)
5. Selecione o arquivo .zip

## Como usar

- Clique no ícone da extensão na barra de ferramentas do Chrome
- O sistema RP Empreendimentos será aberto automaticamente

## Observações

- A extensão está configurada para abrir: https://testerp-5z5v.onrender.com/login
- Se precisar mudar a URL, edite o arquivo `background.js`
