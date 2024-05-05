/**
 * Clase para representar la información que guarda un bloque de
 * una blockchain, como las transacciones, hashes entre otros.
 */
class BlockchainNode {

    // Contador de bloques
    static id = 0;

    /**
     * Crea un nuevo bloque para blockchain.
     * @param {timestamp} timestamp el tiempo que fue creado el nodo.
     * @param {merkle} merkle_root la verificación con un arbol de merkle
     * @param {previous_hash} previous_hash el hash del nodo anterior
     * @param {transactions} transactions las transacciones a guardar en este bloque
     */
    constructor(timestamp, merkle_root, previous_hash, transactions) {
        this.block_number = BlockchainNode.id;
        this.transactions = transactions.valueOf();
        // Rellenar con 0's a la izquierda
        this.previous_hash = String(previous_hash).padStart(64, '0');
        this.timestamp = timestamp === null ? Date.now().valueOf() : timestamp;
        this.merkle = merkle_root === null ? this.merkle_root() : merkle_root;

        // Estos valores serán calculados a la hora de minar.
        this.nonce = 0;
        this.hash = null;
    }

    /**
     * Regresa el encabezado del nodo.
     * El encabezado consiste en la información que no es null antes
     * de minar el bloque, es decir, el número del bloque, el tiempo,
     * el valor del árbol de merkle, y el hash del nodo anterior.
     * @returns el encabezado del nodo.
     */
    getHeader() {
        return `${this.block_number}${this.timestamp}${this.merkle}${this.previous_hash}`;
    }

    /**
     * Actualiza el valor de this.hash a hh.
     * @param {*} hh el nuevo hash
     */
    updateHash(hh) {
        this.hash = hh;
    }

    /**
     * Extra: Separa la información del monto, de quién y a quién
     * para mostrar en la interfaz de manera más bonita que solo texto
     * plano.
     * @param {transaction} transaction las transacciones a separar
     * @return una lista de transacciones sepraradas por índice.
     */
    list_transactions(transaction) {
        return transaction.split('\n').map((tx, index) => {
            const [amount, from, to] = tx.split('&');
            return `${index + 1}. ${amount} from ${from} to ${to}`;
        });
    }

    /**
     * Dado que el árbol de merkle es una estructura de datos más compleja,
     * este valor solo será calculado como la suma del valor numérico de
     * cada cáracter de la transacción.
     * @returns el valor del arbol de merkle
     */
    merkle_root() {
        return this.transactions.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    }

    /**
     * Crea el valor hash de un texto. Si el texto es null, se toma como texto
     * el encabezado del nodo, de lo contrario, se hashea el texto.
     * @param {text} text el texto que será "hasheado".
     * @returns el hash del texto como una promesa.
     */
    async create_hash(text) {
        //Credits to geeks for geeks
        let header = text === null ? this.getHeader() : text;
        const msgUint8 = new TextEncoder().encode(header); // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""); // convert bytes to hex string
        return hashHex;
    }

    /**
     * Mina el bloque actual.
     * Para minar el bloque actual, se debe hashear el encabezado concatenado con el nonce.
     * e ir cambiando el nonce en 1 hasta que exista el nonce, tal que el resultado de
     * await hash(encabezado + nonce) sea aprobado por el método signed(), es decir que
     * el hash esté firmado de acuerdo a como se definió el bloque firmado.
     */
    async mining() {
		let nonce = 0;
		let hash;
		let maxAttempts = 1000000; // Número máximo de intentos
		let attempts = 0;
	
		do {
			hash = await this.create_hash(this.getHeader() + nonce);
			nonce++;
			attempts++;
		} while (!this.signed(hash) && attempts < maxAttempts);
	
		if (attempts === maxAttempts) {
			console.error("No se pudo minar el bloque después de", maxAttempts, "intentos.");
			throw new Error("No se pudo minar el bloque");
		}
	
		this.nonce = nonce - 1;
		this.hash = hash;
	}

    /**
     * Nos dice si el bloque está firmado con el poder computacional
     * es decir, le costó trabajo encontrar un hash del encabezado
     * más el nonce que cumpla con la condición descrita.
     *
     * Si tarda mucho encontrando el valor, puedes cambiar la condición
     * para que mine más rápido.
     *
     * @returns si el hash cumple con la condición de firmado.
     */
    signed(hash) {
        return hash.startsWith("1111");
    }

    /**
     * Nos da una representación en cadena del bloque actual.
     * @returns una representacion en cadena del bloque actual.
     */
    toString() {
        return `Block #${this.block_number}\nTimestamp: ${this.timestamp}\nMerkle Root: ${this.merkle}\nPrevious Hash: ${this.previous_hash}\nNonce: ${this.nonce}\nHash: ${this.hash}\nTransactions:\n${this.transactions}`;
    }

    /**
     * Extra: Guarda este objeto en formato JSON para poder ser transmitido
     * a través de un flujo de datos.
     */
    toJson() {
        return JSON.stringify(this);
    }
}