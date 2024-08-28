const fs = require('fs');
const { BTree } = require('../sistema/arvore_b');

// Função para medir o tempo de execução
function medirTempoExecucao(func, ...args) {
    console.time('Tempo de execução');
    func(...args);
    console.timeEnd('Tempo de execução');
}

// Função para medir o consumo de memória
function medirConsumoMemoria() {
    const usoMemoria = process.memoryUsage();
    console.log('Consumo de Memória:');
    console.log(`Heap Total: ${(usoMemoria.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Heap Usado: ${(usoMemoria.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}

// Funções CRUD decoradas com avaliação de desempenho
function inserir(arvore, chave, valor) {
    medirTempoExecucao(() => arvore.insert(chave, valor));
    medirConsumoMemoria();
}

function buscar(arvore, chave) {
    medirTempoExecucao(() => {
        const resultado = arvore.search(chave);
        console.log(`Resultado da busca: ${resultado}`);
    });
    medirConsumoMemoria();
}

function atualizar(arvore, chave, novoValor) {
    medirTempoExecucao(() => arvore.update(chave, novoValor));
    medirConsumoMemoria();
}

function deletar(arvore, chave) {
    medirTempoExecucao(() => arvore.delete(chave));
    medirConsumoMemoria();
}

// Exporte as funções para uso no menu.js
module.exports = { inserir, buscar, atualizar, deletar };
