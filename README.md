# SGBD CRUD com Árvores B
Implementação de um sgbd simples com arvores B em javascript

Para rodar o código, copie e cole no seu terminal:

```
cd sistema
node menu.js
```

Para criar um novo conjunto de dados, abra o arquivo ***gerar_ops.js*** e, nessa seção, altere os parâmetros do conjunto como desejar:

```
const numOperacoes = 100; //tamanho do conjunto
const operacoes = gerarOperacoes(numOperacoes);
const jsonData = JSON.stringify(operacoes, null, 2);

fs.writeFileSync('db_tamanho.json', jsonData, 'utf8'); //nome do arquivo json
```
