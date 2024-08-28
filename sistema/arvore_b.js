// btree.js

const fs = require('fs');

class BTreeNode {
    constructor(isLeaf = true) {
        this.isLeaf = isLeaf;
        this.keys = [];
        this.children = [];
        this.values = [];
    }
}

class BTree {
    constructor(t) {
        this.root = new BTreeNode(true);
        this.t = t;
    }

    insert(key, value) {
        if (!this.root) { // Verificação para garantir que a raiz exista
            this.root = new BTreeNode(true);
        }
    
        const root = this.root;
    
        if (root.keys.length === (2 * this.t - 1)) {
            const newRoot = new BTreeNode(false);
            newRoot.children.push(root);
            this._splitChild(newRoot, 0, root);
            this.root = newRoot;
            this._insertNonFull(newRoot, key, value);
        } else {
            this._insertNonFull(root, key, value);
        }
    }    

    _splitChild(parent, i, fullChild) {
        const t = this.t;
        const newChild = new BTreeNode(fullChild.isLeaf);
        parent.children.splice(i + 1, 0, newChild);
        parent.keys.splice(i, 0, fullChild.keys[t - 1]);
        parent.values.splice(i, 0, fullChild.values[t - 1]);

        newChild.keys = fullChild.keys.splice(t, t - 1);
        newChild.values = fullChild.values.splice(t, t - 1);

        if (!fullChild.isLeaf) {
            newChild.children = fullChild.children.splice(t, t);
        }

        fullChild.keys.length = t - 1;
        fullChild.values.length = t - 1;
    }

    _insertNonFull(node, key, value) {
        let i = node.keys.length - 1;

        if (node.isLeaf) {
            // Localizar a posição onde a nova chave e valor devem ser inseridos
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }
            node.keys.splice(i + 1, 0, key);  // Inserir a chave
            node.values.splice(i + 1, 0, value);  // Inserir o valor
        } else {
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }
            i++;
            if (node.children[i].keys.length === (2 * this.t - 1)) {
                this._splitChild(node, i, node.children[i]);
                if (key > node.keys[i]) {
                    i++;
                }
            }
            this._insertNonFull(node.children[i], key, value);
        }
    }

    search(key, node = this.root) {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
            i++;
        }
        if (i < node.keys.length && key === node.keys[i]) {
            return node.values[i];
        }
        if (node.isLeaf) {
            return null;
        } else {
            return this.search(key, node.children[i]);
        }
    }

    update(key, newValue) {
        const node = this._searchNodeForUpdate(key, this.root);
        if (node) {
            const index = node.keys.indexOf(key);
            node.values[index] = newValue;
        }
    }

    _searchNodeForUpdate(key, node) {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
            i++;
        }
        if (i < node.keys.length && key === node.keys[i]) {
            return node;
        }
        if (node.isLeaf) {
            return null;
        } else {
            return this._searchNodeForUpdate(key, node.children[i]);
        }
    }

    // Função para salvar a árvore B em um arquivo JSON
    saveToFile(filename) {
        const data = JSON.stringify(this.root);
        fs.writeFileSync(filename, data, 'utf8');
    }

    // Função para carregar a árvore B de um arquivo JSON
    loadFromFile(filename) {
        if (fs.existsSync(filename)) {
            const data = fs.readFileSync(filename, 'utf8');
            this.root = JSON.parse(data);
        } else {
            console.log("Arquivo não encontrado.");
        }
    }

    delete(key) {
        if (!this.root) {
            console.log("A árvore está vazia");
            return;
        }
    
        this._deleteFromNode(this.root, key);
    
        if (this.root.keys.length === 0) {
            if (this.root.isLeaf) {
                this.root = null; // Árvore torna-se vazia
            } else {
                this.root = this.root.children[0];
            }
        }
    }    

    _deleteFromNode(node, key) {
        const idx = node.keys.indexOf(key);

        if (idx !== -1) { // Chave encontrada neste nó
            if (node.isLeaf) { // Caso 1: Nó é folha
                node.keys.splice(idx, 1);
                node.values.splice(idx, 1);
            } else { // Caso 2: Nó não é folha
                const predecessor = this._getPredecessor(node, idx);
                node.keys[idx] = predecessor.key;
                node.values[idx] = predecessor.value;
                this._deleteFromNode(node.children[idx], predecessor.key);
            }
        } else { // Chave não encontrada neste nó
            if (node.isLeaf) {
                console.log("Chave não encontrada");
                return;
            }

            let i = 0;
            while (i < node.keys.length && key > node.keys[i]) {
                i++;
            }

            const childNode = node.children[i];
            if (childNode.keys.length >= this.t) {
                this._deleteFromNode(childNode, key);
            } else {
                console.log("Casos adicionais necessários para a exclusão em nós menores");
            }
        }
    }

    _getPredecessor(node, idx) {
        let current = node.children[idx];
        while (!current.isLeaf) {
            current = current.children[current.children.length - 1];
        }
        return {
            key: current.keys[current.keys.length - 1],
            value: current.values[current.values.length - 1]
        };
    }

}

module.exports = { BTree, BTreeNode };
