
/**
 * Actualiza el bloque "borrador" con la última informacion del timestamp, transacción y 
 * último nodo de la blockchain (previous hash), y el hash temporal del header sin firmar
 * @param {lastNode} lastNode el último bloque de la blockchain.
 * @returns un bloque actualizado con la última información para ser añadido a la blockchain
 */
async function createBlock(lastNode){
  let trans = document.getElementById('transactions').value
  let n, ts, ph, mr; 
  if (lastNode === null){
    lastNode = new BlockchainNode(null, null, 0, trans);
  } else {
    lastNode = new BlockchainNode(null, null, lastNode.hash, trans)
  }
  h = await lastNode.create_hash(null);
  lastNode.updateHash(h)

  n = lastNode.block_number;
  ts = lastNode.timestamp;
  ph = lastNode.previous_hash;
  mr = lastNode.merkle;

  let blockNumber = document.getElementById('block');
  blockNumber.setAttribute('value', n);
  
  let timestamp = document.getElementById('timestamp');
  timestamp.setAttribute('value', ts)

  let merkle = document.getElementById('merkle');
  merkle.setAttribute('value', mr);

  let previousHash = document.getElementById('phash');
  previousHash.setAttribute('value', ph);

  let hash = document.getElementById('hash');
  hash.setAttribute('value', String(h).padStart(64, '0'));
  return lastNode
}

/**
 * Mina el bloque borrador para ser añadido permanentemente a la blockchain
 * El minado dependerá del nivel de dificultad que se tenga para firmar
 * un bloque.
 * @returns el bloque minado para ser añadido a la blockchain
 */
async function mine() {

  // El id lo determina la variable estática id.
  //let id = document.getElementById('block').value
  let ts = document.getElementById('timestamp').value;
  let mr = document.getElementById('merkle').value;
  let ph = document.getElementById('phash').value;
  let trans = document.getElementById('transactions').value;
  let block = new BlockchainNode(ts, mr, ph, trans);

  // Estos valores son los que serán calculados a partir del bloque borrador 
  // let non = document.getElementById('nonce').value;
  // let h = document.getElementById('hash').value;
  
  
  // TO DO: firmar el bloque block con el nonce tal que cumpla la regla del signed
  await block.mining();
  BlockchainNode.id++;
  
  return block;
}

/**
 * Crea un elemento html para ser añadido al cuerpo de la página a partir de
 * un bloque ya minado, extrayendo la información importante y desactivando
 * cualquier tipo de modificacion que se le pueda hacer al bloque.
 * @param {block} block el bloque del cual se creará el nuevo bloque minado
 * @returns un elemento html para ser añadido al cuerpo de la pagina.
 */
function minedBlock(block){

  let id = block.block_number;
  console.log(block.toString())

  let blockDiv = document.createElement('div');
  blockDiv.className = 'node';

  let form = document.createElement('form');

  let columnLeft = document.createElement('div');
  columnLeft.className = 'column';

  let columnRight = document.createElement('div');
  columnRight.className = 'column'

  var div = document.createElement('div');
  let blockNumberTag = document.createElement('label');
  blockNumberTag.setAttribute('for', `block${id}`);
  blockNumberTag.textContent = 'Bloque';
  div.appendChild(blockNumberTag);

  let idBlock = document.createElement('input');
  idBlock.setAttribute('type', 'text');
  idBlock.setAttribute('size', '5');
  idBlock.setAttribute('name', `block${id}`);
  idBlock.setAttribute('id', `block${id}`);
  idBlock.setAttribute('disabled', '');
  idBlock.value = block.block_number;
  div.appendChild(idBlock);
  columnLeft.appendChild(div);
  
  div = document.createElement('div');
  let timestampLabel = document.createElement('label');
  timestampLabel.setAttribute('for', `timestamp${id}`);
  timestampLabel.textContent = 'Timestamp';
  div.appendChild(timestampLabel);

  let timestamp = document.createElement('input');
  timestamp.setAttribute('type', 'text');
  timestamp.className = 'large-text';
  timestamp.setAttribute('name', `timestamp${id}`);
  timestamp.setAttribute('id', `timestamp${id}`);
  timestamp.setAttribute('disabled', '');
  timestamp.value = block.timestamp;
  div.appendChild(timestamp);
  columnLeft.appendChild(div);

  div = document.createElement('div');
  let merkleRootLabel = document.createElement('label');
  merkleRootLabel.setAttribute('for', `merkleroot${id}`);
  merkleRootLabel.textContent = 'Merkle Root';
  div.appendChild(merkleRootLabel);
  
  let merkleroot = document.createElement('input');
  merkleroot.setAttribute('type', 'text');
  merkleroot.className = 'large-text';
  merkleroot.setAttribute('name', `merkleroot${id}`);
  merkleroot.setAttribute('id', `merkleroot${id}`);
  merkleroot.setAttribute('disabled', '');
  merkleroot.value = block.merkle;
  div.appendChild(merkleroot);
  columnLeft.appendChild(div);

  div = document.createElement('div');
  let previousHashLabel = document.createElement('label');
  previousHashLabel.setAttribute('for', `previousHash${id}`);
  previousHashLabel.textContent = 'Previous Hash';
  div.appendChild(previousHashLabel);
  
  let previousHash = document.createElement('input');
  previousHash.setAttribute('type', 'text');
  previousHash.className = 'large-text';
  previousHash.setAttribute('name', `previousHash${id}`);
  previousHash.setAttribute('id', `previousHash${id}`);
  previousHash.setAttribute('disabled', '');
  previousHash.value = block.previous_hash;
  div.appendChild(previousHash);
  columnLeft.appendChild(div);

  columnLeft.appendChild(document.createElement('br'));

  div = document.createElement('div');
  let nonceLabel = document.createElement('label');
  nonceLabel.setAttribute('for', `nonce${id}`);
  nonceLabel.textContent = 'Nonce';
  div.appendChild(nonceLabel);
  
  let nonce = document.createElement('input');
  nonce.setAttribute('type', 'text');
  nonce.setAttribute('size', '5');
  nonce.setAttribute('name', `nonce${id}`);
  nonce.setAttribute('id', `nonce${id}`);
  nonce.setAttribute('disabled', '');

  nonce.value = block.nonce;
  div.appendChild(nonce);
  columnLeft.appendChild(div);

  div = document.createElement('div');
  let hashLabel = document.createElement('label');
  hashLabel.setAttribute('for', `hash${id}`);
  hashLabel.textContent = 'Header Hash';
  div.appendChild(hashLabel);
  
  let hash = document.createElement('input');
  hash.setAttribute('type', 'text');
  hash.className = 'large-text';
  hash.setAttribute('name', `hash${id}`);
  hash.setAttribute('id', `hash${id}`);
  hash.setAttribute('disabled', '');
  hash.value = block.hash;
  div.appendChild(hash);
  columnLeft.appendChild(div);

  div = document.createElement('div');
  let transactionLabel = document.createElement('label');
  transactionLabel.setAttribute('for', `transaction${id}`);
  transactionLabel.textContent = 'Transactions';
  div.appendChild(transactionLabel);

  let transaction = document.createElement('textarea');
  transaction.setAttribute('name', 'Tx');
  transaction.setAttribute('id', `transaction${0}`);
  transaction.setAttribute('cols', '50');
  transaction.setAttribute('rows', '10');
  transaction.textContent = block.transactions;
  transaction.setAttribute('disabled', '');
  div.appendChild(transaction);
  columnRight.appendChild(div);

  columnRight.appendChild(document.createElement('br'));

  let generateTransaction = document.createElement('input');
  generateTransaction.setAttribute('type', 'button');
  generateTransaction.setAttribute('value', 'Generate Transaction');
  generateTransaction.disabled = true;
  columnRight.appendChild(generateTransaction);
  
  form.appendChild(columnLeft);
  form.appendChild(columnRight);

  blockDiv.appendChild(form);

  return blockDiv;
}

/**
 * Función "main" entre comillas, ya que este método se ejecuta al 
 * terminar de cargar todos los elementos de la página.
 */
window.onload = function () {
  // en donde se agregarán los bloques minados
  let container = document.getElementById('blockchain');

  let newBlock = document.getElementById('create-new-block');   //button
  let mining = document.getElementById('block-mining');         //button
  let generateTransaction = document.getElementById('gt')       //button

  let blockchain = new Blockchain();
  let transactions = document.getElementById('transactions');   //textarea

  // Crear el primer bloque borrador
  createBlock(blockchain.getLastNode())

  /**
   * Evento para escuchar cualquier cambio en el <textarea>
   * Al cambiar, se actualiza la información del bloque borrador
   * con la última informacion de transacción
   */
  transactions.addEventListener('input', function(){
    createBlock(blockchain.getLastNode())
  })

  /**
   * Botón para "reiniciar" o actualizar los valores del bloque borrador.
   */
  newBlock.addEventListener('click', function(){
    createBlock(blockchain.getLastNode());
  });

  /**
   * Mina el borrador a un nuevo bloque para la blockchain. El bloque pasa a ser historia
   * sin poder manipular ninguna información. Añade al documento el bloque minado, si es 
   * que pudo ser minado, de lo contrario no se mina el bloque.
   * Se crea una nueva fila en el html.
   */
  mining.addEventListener('click', async function() {
    if (!blockchain.valid()){
      alert("La blockchain actual no es válida y no se pueden crear nuevos bloques!")
      return;
    }
    try {
      // Aquí es cuando puede ser que no se mine el bloque correctamente y lanza error.
      let node = await mine();

      // Añadir a la blockchain en memoria y del html
      blockchain.add(node)
      let block = minedBlock(node)
      container.prepend(block);

      // Reiniciar borrador
      await createBlock(node)
      
    } catch (error) {
      alert("No se pudo minar el bloque por información corrupta o error de programación");
  }
  });

  /**
   * Extra: Genera una transacción aleatoriamente siguiendo el formato
   * $money&from&to\n
   * Añade la nueva transacción al texto del <textarea>
   */
  generateTransaction.addEventListener('click', async function(){
    await createBlock(blockchain.getLastNode())
    // TO DO: Añadir una transacción a la caja de transacciones
    
  });

};