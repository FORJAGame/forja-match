# Como adicionar um novo jogo ao FORJA Match

Este guia tem duas partes:

1. **Ficha do jogo:** o que pedir para o time do jogo. Pode ser enviada como está.
2. **Passo a passo técnico:** o que fazer no repositório com essas informações.

Os limites abaixo foram definidos a partir do layout real da tela de resultado no totem (Android, vertical, 1080 × 1920).

---

## 1. Ficha do jogo (para o time do jogo preencher)

> Copie o bloco abaixo e envie para o time responsável pelo jogo.

```txt
FICHA DO JOGO — FORJA MATCH

1. Nome do jogo (até 24 caracteres):

2. Frase de match (até 120 caracteres).
   Completa a ideia "Você deu match com este jogo porque...".
   Modelo: "Um jogo para quem curte ___, ___ e ___."

3. Onde jogar no evento (até 60 caracteres).
   Ex.: "Jogue no espaço da FORJA na sala 101 do prédio Brum"

4. Link para acompanhar o jogo (vira QR code).
   Instagram, Steam, itch.io ou site. Prefira um link curto.

5. Imagem de divulgação:
   - Horizontal, 1600 × 1000 px (proporção 16:10).
   - JPG ou PNG em boa qualidade (a equipe da FORJA otimiza).
   - Sem texto importante perto das bordas: a imagem pode ser cortada nas laterais.
   - Preferência por key art ou screenshot marcante, sem muito texto.

6. Marque de 3 a 6 características que MAIS representam o jogo
   e dê uma nota de 1 a 3 para cada (3 = muito forte):

   [ ] humor            [ ] narrativa         [ ] estrategia
   [ ] ritmo_rapido     [ ] atmosfera         [ ] desafio
   [ ] ritmo_calmo      [ ] puzzle            [ ] tensao
   [ ] jogo_curto       [ ] arte              [ ] terror
   [ ] acessivel        [ ] exploracao        [ ] social
   [ ] nostalgico       [ ] surpresa          [ ] competicao
   [ ] metalinguagem    [ ] experimental      [ ] singleplayer

7. Em uma frase: que tipo de pessoa vai amar esse jogo?
   (ajuda a calibrar as características e a frase de match)
```

### Por que esses limites

| Campo | Limite | Motivo |
| --- | --- | --- |
| Nome | 24 caracteres | O título usa fonte de até 7,5 rem; acima disso passa de 2 linhas e empurra o QR code para fora da tela. |
| Frase de match | 120 caracteres | Cabem ~40 caracteres por linha no card; 3 linhas no máximo. |
| Onde jogar | 60 caracteres | Fica numa caixa abaixo da frase; 2 linhas no máximo. |
| Link | Curto | Quanto mais longo, mais denso o QR code e mais difícil de ler de longe. |
| Imagem | 1600 × 1000 px | Ela aparece em ~725 × 460 px no totem, com recorte automático (`object-fit: cover`). O dobro da resolução garante nitidez. |

---

## 2. Passo a passo técnico

### 2.1 Preparar a imagem

1. Redimensione para **1600 × 1000 px** (recorte centralizado se a proporção for diferente).
2. Exporte em **WebP** (ou JPEG) com **até 400 KB**. Ferramenta sugerida: [Squoosh](https://squoosh.app).
3. Salve em `public/assets/games/` com nome em kebab-case, sem acentos. Ex.: `ecos-da-mata.webp`.

### 2.2 Cadastrar o jogo em `src/data/games.js`

Adicione um objeto ao array `games`:

```js
{
  id: "ecos_da_mata",              // snake_case, sem acentos, único
  name: "Ecos da Mata",
  description: "Um jogo para quem curte explorar, descobrir segredos e se perder na natureza.",
  tags: {
    exploracao: 3,
    atmosfera: 2,
    arte: 2,
    ritmo_calmo: 1,
  },
  whereToPlay: "Jogue no espaço da FORJA na sala 101 do prédio Brum",
  standLocation: "Encontre a FORJA no estande principal",
  socialUrl: "https://www.instagram.com/ecosdamata/",
  image: "/assets/games/ecos-da-mata.webp",  // sempre começando com "/"
},
```

Regras:
- **`id` não muda depois de publicado.** Ele é a chave usada nos dados do Firestore e no painel Streamlit.
- **`tags`** só podem usar os nomes da lista da ficha. Uma tag que não aparece em nenhum card de `src/data/cards.js` não tem efeito no match.
- **Use de 3 a 6 tags, com notas de 1 a 3.** A pontuação é normalizada (similaridade de cosseno), então o número de tags não dá vantagem; o que importa é a *proporção* entre elas. Evite copiar o perfil de outro jogo: dois jogos com tags quase iguais disputam os mesmos jogadores.
- **O balanceamento é automático.** Ao abrir, o app calcula um pequeno ajuste por jogo para que todos sejam indicados com frequência parecida. Isso só muda o resultado em perfis divididos entre dois jogos (~15% dos casos hoje).
- `socialUrl` vazio esconde o QR code.
- `standLocation` ainda não aparece na tela (ver issue E4), mas mantenha o campo.

### 2.3 Remover um jogo que não está sendo exposto

- Comente ou apague o objeto em `src/data/games.js`. Prefira comentar se o jogo deve voltar em outro evento.
- A imagem pode ficar em `public/assets/games/`; ela não é carregada se o jogo não estiver no array.
- **Não reutilize o `id`** de um jogo removido para outro jogo.

### 2.4 Atualizar o cache offline

Em `public/sw.js`, atualize a lista `STATIC_ASSET_URLS` com os caminhos das imagens dos jogos ativos e **incremente `CACHE_VERSION`** (ex.: `"v1"` → `"v2"`). Sem isso, um totem que já abriu o app pode continuar com o cache antigo.

### 2.5 Verificar o balanceamento

```bash
npm run simulate
```

O script testa todas as combinações de respostas e mostra em quantas cada jogo vence, **sem** e **com** a calibração automática. Referência: com N jogos, o ideal é cada um ficar perto de 100/N %.

- A coluna calibrada deve ficar próxima do ideal.
- Se a coluna **sem calibração** de um jogo ficar muito baixa (o script avisa), as tags dele provavelmente se sobrepõem às de outro jogo. A calibração compensa, mas vale revisar as tags.

### 2.6 Testar e publicar

1. `npm run dev` e jogue até o fim pelo menos uma vez, respondendo para cair no novo jogo.
2. Confira na tela de resultado, na vertical (1080 × 1920): o nome em até 2 linhas, a imagem sem cortes ruins, o QR code inteiro na tela e funcionando no celular.
3. `npm run lint` e `npm run build` sem erros.
4. Commit e push na `main`. A Netlify publica automaticamente.
5. Em cada totem, recarregue a página com internet para receber a versão nova.

### Checklist

- [ ] Ficha completa recebida do time do jogo
- [ ] Imagem 1600 × 1000, até 400 KB, em `public/assets/games/`
- [ ] Objeto adicionado em `games.js` com `id` único e caminho da imagem com `/`
- [ ] De 3 a 6 tags, com notas de 1 a 3
- [ ] `sw.js` atualizado e `CACHE_VERSION` incrementado
- [ ] `npm run simulate` com distribuição equilibrada
- [ ] Teste visual na vertical e QR code lido no celular
- [ ] Lint e build sem erros
- [ ] Totens recarregados após o deploy
