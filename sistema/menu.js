const { BTree } = require('./arvore_b');
const { inserir, buscar, atualizar, deletar } = require('../avaliacao/performance');  // Adicione esta linha
const readline = require('readline');
const fs = require('fs');

const caminhoArquivo = 'arvoreB.json';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let arvore;
if (fs.existsSync(caminhoArquivo)) {
    const dados = fs.readFileSync(caminhoArquivo, 'utf8');
    const json = JSON.parse(dados);
    arvore = new BTree(json.t);
    arvore.root = json.root;
    console.log("Árvore carregada do arquivo com sucesso.");
} else {
    arvore = new BTree(2);
}

function salvarArvoreNoArquivo() {
    const json = JSON.stringify(arvore);
    fs.writeFileSync(caminhoArquivo, json);
    console.log("Árvore salva no arquivo com sucesso.");
}

function menu() {
    console.log("\n--- Menu de Operações ---");
    console.log("1. Inserir");
    console.log("2. Buscar");
    console.log("3. Atualizar");
    console.log("4. Deletar");
    console.log("5. Sair");
    rl.question("Escolha uma opção: ", (opcao) => {
        switch (opcao) {
            case '1':
                rl.question("Digite a chave a ser inserida: ", (chave) => {
                    rl.question("Digite o valor associado: ", (valor) => {
                        inserir(arvore, parseInt(chave), valor);  // Modifique aqui
                        salvarArvoreNoArquivo();
                        menu();
                    });
                });
                break;
            case '2':
                rl.question("Digite a chave a ser buscada: ", (chave) => {
                    buscar(arvore, parseInt(chave));  // Modifique aqui
                    menu();
                });
                break;
            case '3':
                rl.question("Digite a chave a ser atualizada: ", (chave) => {
                    rl.question("Digite o novo valor: ", (novoValor) => {
                        atualizar(arvore, parseInt(chave), novoValor);  // Modifique aqui
                        salvarArvoreNoArquivo();
                        menu();
                    });
                });
                break;
            case '4':
                rl.question("Digite a chave a ser deletada: ", (chave) => {
                    deletar(arvore, parseInt(chave));  // Modifique aqui
                    salvarArvoreNoArquivo();
                    menu();
                });
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log("Opção inválida! Tente novamente.");
                menu();
        }
    });
}

// Iniciar o menu
menu();
