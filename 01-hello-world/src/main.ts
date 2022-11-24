import { Square } from './Square.js';
import {
    isReady,
    shutdown,
    Field,
    Mina,
    PrivateKey,
    AccountUpdate,
} from 'snarkyjs';

// an async promise that tells the snarkyjs server is loaded and ready

// shutdown a function that closes our program

//field snarkyjs unsigned integer type

// Mina: A local mina blockchain, we will deploy our smart contract to this

// PrivateKey: A class with function to manipulate the priavte key

// AccountUpdate: A class that generates a data structure to as an AccountUpdate that can update the zkApp accounts.

(async function main() {
    console.log("starting...");
    await isReady

    console.log('Snarkyjs server started')

    const local = Mina.LocalBlockchain();

    Mina.setActiveInstance(local)

    const deployerAccount = local.testAccounts[0].privateKey


    const zkAppPrivateKey = PrivateKey.random()

    const zkAppAddress = zkAppPrivateKey.toPublicKey()

    const contract = new Square(zkAppAddress)

    const deployTxn = await Mina.transaction(deployerAccount, () => {
        AccountUpdate.fundNewAccount(deployerAccount)
        contract.deploy({ zkappKey: zkAppPrivateKey })
        contract.sign(zkAppPrivateKey)
    })

    await deployTxn.send()

    const num0 = contract.num.get();

    console.log("num0", num0.toString())

    const trx1 = await Mina.transaction(deployerAccount, () => {
        contract.update(Field(9));
        contract.sign(zkAppPrivateKey)
    });

    await trx1.send()

    const num1 = contract.num.get();

    console.log("num1", num1.toString())

    try {


        const trx2 = await Mina.transaction(deployerAccount, () => {
            contract.update(Field(80));
            contract.sign(zkAppPrivateKey)

        })

        await trx2.send()

    } catch (error: any) {
        console.log(error.message)
    }

    const num2 = contract.num.get();

    console.log("num2", num2.toString())


    console.log("shutting down")

    await shutdown()

})()

// With a zkApp, a user's local device generates one or more zero knowledge proofs, which are then verified by the Mina network. Each method in a SnarkyJS smart contract corresponds to constructing a proof.