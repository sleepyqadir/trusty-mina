import {
    Field,
    SmartContract,
    state,
    State,
    method,
    DeployArgs,
    Permissions,
} from 'snarkyjs';


// Field is the native number type in snarkyjs . you can think of these as unsigned integers. Field is the most basic
// tyoe in snarkyjs and all the other compatible types are build on the top of fields type

// smart contract, is the class that implements the interface of the smart contact

// state , decorator to store the state of the contract on chain in a zkApp account

// State , a class used in zkApp to store all the state of the contract

// method , decorator to store the method function on the contract

// DeployArgs , The type of arguments submitted to a newly deployed contract

// Permissions, A collection of methods to manipulate the zkApp smart contact permissions

export class Square extends SmartContract {
    @state(Field) num = State<Field>();

    deploy(args: DeployArgs) {
        super.deploy(args);
        this.setPermissions({
            ...Permissions.default(),
            editState: Permissions.proofOrSignature(), // allow every one to update the state only if the transaction is generared from this zkApp
        })
        this.num.set(Field(3)); // set the initial state of num to 3
    }

    @method update(square: Field) {
        const currentState = this.num.get()
        this.num.assertEquals(currentState)
        square.assertEquals(currentState.mul(currentState))
        this.num.set(square)
    }
}

// zkApp can only store 8 fields worth of on-chain state , each of 32 bytes , remaining data is stored off-chain which will be covered later
