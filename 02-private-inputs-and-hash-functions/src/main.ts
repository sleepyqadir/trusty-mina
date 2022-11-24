import { AccountUpdate, Field, isReady, Mina, PrivateKey, shutdown } from 'snarkyjs';
import { IncrementSecret } from './IncrementSecret.js';

(async function main() {

    await isReady

    console.log("Snarkjs is ready");

    const Local = Mina.LocalBlockchain();

    Mina.setActiveInstance(Local);

    const deployerAccount = Local.testAccounts[0].privateKey

    const salt = Field.random();

    const zkAppPrivateKey = PrivateKey.random();

    const zkAppAddress = zkAppPrivateKey.toPublicKey()

    const zkAppInstance = new IncrementSecret(zkAppAddress);


    const deployTxn = await Mina.transaction(deployerAccount, () => {
        AccountUpdate.fundNewAccount(deployerAccount);
        zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
        zkAppInstance.initState(salt, Field(750));
        zkAppInstance.sign(zkAppPrivateKey);
    });

    await deployTxn.send();

    // get the initial state of IncrementSecret after deployment
    const num0 = zkAppInstance.x.get();
    console.log('state after init:', num0.toString());



    const txn1 = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.incrementSecret(salt, Field(750));
        zkAppInstance.sign(zkAppPrivateKey)
    })
    await txn1.send();

    const num1 = zkAppInstance.x.get();
    console.log('state after txn1:', num1.toString());

    // ----------------------------------------------------

    console.log('Shutting down');

    await shutdown();


})()