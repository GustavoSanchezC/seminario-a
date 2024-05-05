/**
 * Clase para simular una blockchain.
 * Todos los nodos los guardamos en una lista []
 * pero con las reglas que tiene el blockchain.
 */
class Blockchain {
    /**
     * Crea una nueva blockchain donde se guardarán
     * los bloques minados.
     */
    constructor() {
        this.chain = [];
    }

    /**
     * Añade un bloque a la blockchain.
     * El bloque a añadir debe cumplir con:
     * 1. Que esté minado (que esté firmado por el poder computacional)
     * 2. Que su previous_hash sea exactamente el mismo que el hash del
     *    nodo anterior, o si es el primer bloque no importa.
     * @param {block} block el bloque "minado" que se agregará
     */
    add(block) {
        if (block.signed() && (this.chain.length === 0 || block.previous_hash === this.getLastNode().hash)) {
            this.chain.push(block);
        } else {
            console.error("El bloque no está firmado o el hash anterior no coincide.");
        }
    }

    /**
     * Obtiene el último nodo minado.
     * @returns El último nodo minado, o null si es vacia.
     */
    getLastNode() {
        return this.chain.length > 0 ? this.chain[this.chain.length - 1] : null;
    }

    /**
     * Regresa el bloque que ocupa la posición i en la blockchain.
     * Debe estar acotada la i.
     * @param {i} i el índice del bloque en la blockchain
     * @returns el nodo en la posición i de la blockchain
     */
    get(i) {
        if (i >= 0 && i < this.chain.length) {
            return this.chain[i];
        } else {
            console.error("Índice fuera de rango.");
            return null;
        }
    }

    /**
     * Copia esta blockchain en una nueva blockchain.
     * @returns una copia de la blockchain
     */
    copy() {
        const newBlockchain = new Blockchain();
        newBlockchain.chain = [...this.chain];
        return newBlockchain;
    }

    /**
     * Nos dice si la blockchain es válida o no.
     * Para que una blockchain sea válida, debe ocurrir que
     * 1. Todos sus nodos estén minados (firmados).
     * 2. Para cualquier bloque i, el hash del bloque i-1 coincide
     *    exactamente con el hash anterior del bloque i, excepto
     *    el primer bloque o si es vacía la blockchain.
     * @returns si la blockchain es válida o no.
     */
    valid() {
        let isValid = true;
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!currentBlock.signed() || currentBlock.previous_hash !== previousBlock.hash) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }
}