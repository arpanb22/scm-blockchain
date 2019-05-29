const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
  /**
   * @param {string} fromAddress
   * @param {string} participantId
   * @param {number} productWeight
   * @param {string} transactionLocation
   * @param {bool} status
   */
  constructor(fromAddress, participantId, productId, productWeight, transactionLocation, status) {
    this.fromAddress = fromAddress;
    this.participantId = participantId;
    this.productId = productId;
    this.productWeight = productWeight;
    this.transactionLocation = transactionLocation;
    this.timestamp = Date.now();
    if (status !== undefined){
      this.status = status;
    }
  }

  /**
   * Creates a SHA256 hash of the transaction
   *
   * @returns {string}
   */
  calculateHash() {
    return SHA256(this.fromAddress + this.participantId + this.productId + this.productWeight + this.transactionLocation + this.timestamp)
      .toString();
  }

  /**
   * Signs a transaction with the given signingKey (which is an Elliptic keypair
   * object that contains a private key). The signature is then stored inside the
   * transaction object and later stored on the blockchain.
   *
   * @param {string} signingKey
   */
  signTransaction(signingKey) {
    // You can only send a transaction from the wallet that is linked to your
    // key. So here we check if the fromAddress matches your publicKey
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      alert('You cannot sign transactions for other wallets!');
      return false;
    }

    // Calculate the hash of this transaction, sign it with the key
    // and store it inside the transaction obect
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');

    this.signature = sig.toDER('hex');
  }
  signStatus(signingKey) {
    // You can only send a status of a pending transaction that is linked to your
    // account. So here we check if the participantId matches your publicKey
    if (signingKey.getPublic('hex') !== this.participantId) {
      alert('You cannot sign transactions for other wallets!');
      return false;
    }

    // Calculate the hash of this transaction, sign it with the key
    // and store it inside the transaction obect
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }
  /**
   * Checks if the signature is valid (transaction has not been tampered with).
   * It uses the fromAddress as the public key.
   *
   * @returns {boolean}
   */
  isValid() {
    // If the transaction doesn't have a from address we assume it's a
    // producer and that it's valid. You could verify this in a
    // different way (special field for instance)
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      alert('No signature in this transaction');
      return false;
    }
/*  if ( Blockchain.getBalanceOfAddress(this.fromAddress) < this.productWeight ){
      console.log('You do not have sufficient product to transfer');
      return false;
    }
*/
    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  /**
   * @param {number} timestamp
   * @param {Transaction[]} transactions
   * @param {string} previousHash
   */
  constructor(timestamp, transactions, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Returns the SHA256 of this block (by processing all the data stored
   * inside this block)
   *
   * @returns {string}
   */
  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  /**
   * Starts the mining process on the block. It changes the 'nonce' until the hash
   * of the block starts with enough zeros (= difficulty)
   *
   * @param {number} difficulty
   */
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`Block mined: ${this.hash}`);
  }

  /**
   * Validates all the transactions inside this block (signature + hash) and
   * returns true if everything checks out. False if the block is invalid.
   *
   * @returns {boolean}
   */
  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }
}

class Blockchain {
  
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.confirmTransactions = [];
    this.suspendedTransactions = [];
    //this.confirmedSpendAmount = [];
    this.producers = [];
    this.flow = [];
    //this.producers.push("04729aaee497f99ff7ed4da9b7a5c23912da6533783b5cee16839b1e2628bc3413672b407a68c7a15a6fe3ea238b16f26e7a35755e258a0b9fb3d007da7a2e9c94");
    //this.miningReward = 100;
  }

  /**
   * @returns {Block}
   */
  createGenesisBlock() {
    return new Block(Date.parse('2017-01-01'), [], '0');
  }

  /**
   * Returns the latest block on our chain. Useful when you want to create a
   * new Block and you need the hash of the previous Block.
   *
   * @returns {Block[]}
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Takes all the confirmed transactions, puts them in a Block and starts the
   * mining process. It also adds a transaction to send the mining reward to
   * the given address.
   * @param {string} participantId
   * @param {string} productId
   * @param {string} location
   * @param  productWeight 
   * @param {string} fromAddress
   */
  mineConfirmTransactions() {
    /*const produceTx = new Transaction(transaction.fromAddress, transaction.participantId, transaction.productId, transaction.productWeight, transaction.location);
    this.pendingTransactions.push(produceTx);
    */
    
    const doubleSpenders = [];
    const addresses = [];
    const confirmTransactionsLength = this.confirmTransactions.length;
    for (var id = 0; id < confirmTransactionsLength; id++) {
      if(this.confirmTransactions[id].fromAddress !== null){
        addresses.push(this.confirmTransactions[id].fromAddress);
      }
    }
    //console.log(addresses)
    var uniqueaddresses = addresses.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    //console.log(uniqueaddresses)
    for(var i = 0; i < uniqueaddresses.length; i++){
      //console.log(this.confirmTransactions)
      var spendamount = 0;
      for (var id = 0; id < confirmTransactionsLength; id++) {
        if(this.confirmTransactions[id].fromAddress === uniqueaddresses[i]){
          //console.log(spendamount);
          spendamount = spendamount + this.confirmTransactions[id].productWeight;
        }
        //console.log(this.confirmTransactions[id].fromAddress)

      }
      if(spendamount > this.getBalanceOfAddress(uniqueaddresses[i])){
        //console.log(spendamount);
        doubleSpenders.push(uniqueaddresses[i]);
        //console.log(spendamount)
      }
    }
    //if the source is a double spender

    if(doubleSpenders.length > 0){
      //while should run until no double spenders
      var i = 0;
      var j = 0;
      //console.log(confirmTransactionsLength)
      while (i < confirmTransactionsLength){

        if(doubleSpenders.includes(this.confirmTransactions[j].fromAddress)){
          //console.log('yes')
         this.suspendedTransactions.push(this.confirmTransactions[j]);
          //console.log(JSON.stringify(this.confirmTransactions[this.confirmTransactions.length], null, 4));
          this.confirmTransactions.splice(j,1);
        }
        else{
          j++;
        }
      i++;
      }
    }   
    let block = new Block(Date.now(), this.confirmTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);
    this.confirmTransactions = [];
    console.log('Block successfully mined!');
    this.chain.push(block);  
  }

  /**
   * Add a new transaction to the list of pending transactions (to be added
   * next time the mining process starts). This verifies that the given
   * transaction is properly signed.
   *
   * @param {Transaction} transaction
   */
  addTransaction(transaction) {

    if (!transaction.participantId) {
      alert('Transaction must include to address');
      return false;
    }
    else if ((transaction.fromAddress === null) &&  !(this.producers.includes(transaction.participantId))){
      alert('Participant is not a producer!');
      return false;
    } 

    // Verify the transactiion
    if (!transaction.isValid()) {
      alert('Cannot add invalid transaction to chain');
      return false;
    }

    if(transaction.fromAddress !== null && (this.getBalanceOfAddress(transaction.fromAddress) < transaction.productWeight)){
      alert(transaction.fromAddress+' donot have sufficient product to transfer');
      return false;
    }
    if(!transaction.participantId.startsWith('cust'))
      this.pendingTransactions.push(transaction);
    else
      this.confirmTransactions.push(transaction);
  }

  /**
   * Returns the balance of a given wallet address.
   *
   * @param {string} address
   * @returns {number} The balance of the wallet
   */
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.productWeight;
        }

        if (trans.participantId === address) {
          balance += trans.productWeight;
        }
      }
    }

    return balance;
  }

  /**
   * Returns a list of all transactions that happened
   * to and from the given wallet address.
   *
   * @param  {string} address
   * @return {Transaction[]}
   */
  getAllTransactionsForAddress(address) {
    const txs = [];

    for (const block in this.chain) {
      for (const tx in block.transactions) {
        if (tx.fromAddress === address || tx.participantId === address) {
          txs.push(tx);
        }
      }
    }

    return txs;
  }

  /** 
   *  To filter the transactions to that are to be added in the blockchain
   */
  transactionStatus(transaction){
    if (!transaction.participantId) {
      alert('Transaction must include to address');
      return false;
    }
    else if ((transaction.fromAddress === null)  &&  !(this.producers.includes(transaction.participantId))){
      alert('Transaction is not of producing an element');
      return false;
    }
    // Verify the transactiion
    if(!transaction.signature || transaction.signature.length === 0){
      alert('No signature in this transaction');
      return false;
    }
    
    const publicKey = ec.keyFromPublic(transaction.participantId, 'hex');
    let verify = publicKey.verify(transaction.calculateHash(), transaction.signature);
    if(verify){
      var found = false;
      for (const transid in this.pendingTransactions) {
        //console.log('transid'+transid)
        if (this.pendingTransactions[transid].fromAddress === transaction.fromAddress && this.pendingTransactions[transid].participantId === transaction.participantId && 
            this.pendingTransactions[transid].productId === transaction.productId && this.pendingTransactions[transid].productWeight === transaction.productWeight &&
            this.pendingTransactions[transid].transactionLocation === transaction.transactionLocation) {
           //console.log("found"+ transid);
           found = true;
           if(transaction.status === "true"){
              this.confirmTransactions.push(this.pendingTransactions[transid]);
           } 
           this.pendingTransactions.splice(transid,1);
        }
      }
      if(!found){
        alert('Cannot verify the status of a transacation that is not in the pending list');
        return false;
      }
      
    }
  }

  isSupplyChainValid() {
    const addresses = [];
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        addresses.push(tx.fromAddress);
        addresses.push(tx.participantId);
      }
    }
    var uniqueaddresses = addresses.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    //console.log(JSON.stringify(uniqueaddresses, null, 4));
    
    for (const unique of uniqueaddresses) {
      if(unique !== null && this.getBalanceOfAddress(unique) < 0){
        console.log(`Balance of ` + unique +` is ${this.getBalanceOfAddress(unique)}`);
        return false;
      }
    }
    if(!this.isChainValid()){
      return false;
    }
    return true;
  }
  /**
   * Loops over all the blocks in the chain and verify if they are properly
   * linked together and nobody has tampered with the hashes. By checking
   * the blocks it also verifies the (signed) transactions inside of them.
   *
   * @returns {boolean}
   */
  isChainValid() {
    // Check if the Genesis block hasn't been tampered with by comparing
    // the output of createGenesisBlock with the first block on our chain
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) {
        console.log(currentBlock);
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }
  showProductFlow(productId){
    this.flow = [];
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.productId === productId) {
          //console.log(JSON.stringify(trans, null, 4));
          this.flow.push(trans);
        }
      }
    }
    return this.flow;
  }
  tracebackProduct(productId,userId){
    var flag = false;
    for (const block of this.chain) {
       for (const trans of block.transactions) {
        if (trans.productId === productId && trans.participantId === userId) {
          flag = true;
          console.log(JSON.stringify(trans, null, 4));
          if(trans.fromAddress != null){
            this.tracebackProduct(productId, trans.fromAddress);
          }
        }
      }
    }
    if(!flag){
      alert(userId + ' is not a member of the supply chain');
    }
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;
