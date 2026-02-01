# Script para corrigir as rotas
import re

with open('src/views/rotascompletas.handlebars', 'rb') as f:
    content = f.read()

print('Tamanho do arquivo:', len(content))

# Usar regex para encontrar e substituir
# Padrao: /dashboard/controle-[qualquer-coisa]/...
pattern = rb'/dashboard/controle-[^/]+/'
replacement = rb'/dashboard/controle-grade/'

new_content = re.sub(pattern, replacement, content)

print('Tamanho novo:', len(new_content))

with open('src/views/rotascompletas.handlebars', 'wb') as f:
    f.write(new_content)

print('Feito!')

# Verificar
with open('src/views/rotascompletas.handlebars', 'rb') as f:
    content = f.read()
    matches = re.findall(pattern, content)
    print('Matches encontrados:', len(matches))
    for m in matches[:5]:
        print(m)
