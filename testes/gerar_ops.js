const fs = require('fs');

// Função para gerar operações aleatórias
function gerarOperacoes(num) {
    const operacoes = [];
    const tipos = ['inserir', 'buscar', 'atualizar', 'deletar'];
    const numOperacoes = num;

    // Adiciona operações de inserção
    for (let i = 0; i < numOperacoes; i++) {
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        const chave = Math.floor(Math.random() * 5000) + 1; // Gera uma chave aleatória entre 1 e 5000
        const valor = tipo === 'inserir' ? `Item ${String.fromCharCode(65 + (i % 26))}` : undefined;
        if (tipo === 'inserir') {
            operacoes.push({ tipo, chave, valor });
        } else if (tipo === 'buscar') {
            operacoes.push({ tipo, chave });
        } else if (tipo === 'atualizar') {
            operacoes.push({ tipo, chave, valor: `Item ${String.fromCharCode(65 + (i % 26))} - Atualizado` });
        } else if (tipo === 'deletar') {
            operacoes.push({ tipo, chave });
        }
    }

    return operacoes;
}

const numOperacoes = 1000;
const operacoes = gerarOperacoes(numOperacoes);
const jsonData = JSON.stringify(operacoes, null, 2);

fs.writeFileSync('db_tamanho.json', jsonData, 'utf8');

console.log('Arquivo db_tamanho.json gerado com sucesso!');
