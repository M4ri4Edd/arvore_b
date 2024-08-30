const fs = require('fs');

// Função para analisar o arquivo de log
function analyzeLog(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }

        // Exibir o conteúdo do arquivo para depuração
        console.log('Conteúdo do arquivo:', data);

        // Divida o conteúdo em blocos separados por linhas em branco
        const blocks = data.split(/\n(?=\s*%s:)/).map(block => block.trim()).filter(block => block.length > 0);

        // Variáveis para armazenar os dados coletados
        const stats = {
            busca: { tempos: [], memoria: [] },
            insercao: { tempos: [], memoria: [] },
            atualizacao: { tempos: [], memoria: [] },
            exclusao: { tempos: [], memoria: [] }
        };

        // Função para extrair números de uma string
        function extractNumbers(str) {
            const match = str.match(/Tempo de execução (\d+\.\d+)ms/);
            return match ? parseFloat(match[1]) : null;
        }

        function extractMemory(str) {
            const match = str.match(/Heap Usado: (\d+\.\d+) MB/);
            return match ? parseFloat(match[1]) : null;
        }

        // Analisar cada bloco
        blocks.forEach(block => {
            const tempo = extractNumbers(block);
            const memoria = extractMemory(block);

            if (tempo !== null && memoria !== null) {
                if (block.includes('Buscado:')) {
                    stats.busca.tempos.push(tempo);
                    stats.busca.memoria.push(memoria);
                } else if (block.includes('Inserido:')) {
                    stats.insercao.tempos.push(tempo);
                    stats.insercao.memoria.push(memoria);
                } else if (block.includes('Atualizado:')) {
                    stats.atualizacao.tempos.push(tempo);
                    stats.atualizacao.memoria.push(memoria);
                } else if (block.includes('Deletado:')) {
                    stats.exclusao.tempos.push(tempo);
                    stats.exclusao.memoria.push(memoria);
                }
            }
        });

        // Função para calcular estatísticas
        function calculateStats(arr) {
            if (arr.length === 0) return { media: 0, min: 0, max: 0, soma: 0 };
            const sum = arr.reduce((a, b) => a + b, 0);
            const media = sum / arr.length;
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            return { media, min, max, soma: sum };
        }

        // Calcular e exibir estatísticas
        for (const [tipo, { tempos, memoria }] of Object.entries(stats)) {
            const tempoStats = calculateStats(tempos);
            const memoriaStats = calculateStats(memoria);
            console.log(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)}:`);
            console.log(`  Tempo de execução - Média: ${tempoStats.media.toFixed(3)} ms, Menor: ${tempoStats.min.toFixed(3)} ms, Maior: ${tempoStats.max.toFixed(3)} ms, Soma: ${tempoStats.soma.toFixed(3)} ms`);
            console.log(`  Uso de Memória - Média: ${memoriaStats.media.toFixed(2)} MB, Menor: ${memoriaStats.min.toFixed(2)} MB, Maior: ${memoriaStats.max.toFixed(2)} MB`);
        }
    });
}

// Chame a função com o caminho para o seu arquivo de log
analyzeLog('output.txt');
