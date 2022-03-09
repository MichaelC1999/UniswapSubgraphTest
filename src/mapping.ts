
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Factory, UserObj, Pool } from "../generated/schema";
import { Pool as PoolTemplate } from "../generated/templates";
import { PoolCreated } from "../generated/templates/Pool/Factory";
import {
  Burn as BurnEvent,
  Collect as CollectEvent,
  Mint as MintEvent,
  Swap as SwapEvent
} from "../generated/templates/Pool/Pool";

// UNIQUE USER ADDRESS CHECK FUNCTION
// This function checks the given address as the ID of a UserObj instance
// If the address is not used, create a new UserObj instance

function checkAddr(addrToCheck: Address, poolAddr: string): void {
  // Load the factory entity. If it has not been initialized yet, create the instance
  let factory = Factory.load("SingleFactory");
  if (!factory) {
    factory = new Factory("SingleFactory");
    factory.uniqueUserCount = new BigInt(0);
  }
  // Attempt to load the UserObj associated with the given address
  let user = UserObj.load(addrToCheck.toHex());
  if (user === null) {
    // If the address has not been used to instantiate a UserObj, create a new UserObj instance
    user = new UserObj(addrToCheck.toHex());
    const pool = Pool.load(poolAddr) as Pool;
    // Save the block number of creation of the pool where the first instance of an action by this address occurred (see schema) 
    user.blockOfFirstRecordPool = pool.createdAtBlockNumber;
    user.save();
    //Increment the uniqueUserCount on the factory instance
    factory.uniqueUserCount = factory.uniqueUserCount.plus(BigInt.fromI32(1));
    factory.save();
  }
}

// EVENT/CALL HANDLER FUNCTIONS

export function handlePoolCreated(event: PoolCreated): void {
  // For each token pair pool created, instantiate a Pool template to handle all Swap/Mint/Burn events for the Pool
  const pool = new Pool(event.params.pool.toHexString()) as Pool;
  pool.createdAtBlockNumber = event.block.number;
  pool.save();
  PoolTemplate.create(event.params.pool);
}

// All functions below call checkAddr to check for an existing UserObj instance or create a new instance if not
// checkAddr is called for each parameter/input holding a user address that is defined in the generated schema
// The pool address is passed in to get save the block number of the address to be saved with the UserObj

export function handleCheckUniqueAddrBurn(event: BurnEvent ): void {
  // Pool.ts template defines the owner parameter in Burn Events
  checkAddr(event.params.owner, event.address.toHexString());
}

export function handleCheckUniqueAddrCollect(event: CollectEvent ): void {
  // Pool.ts template defines the owner parameter for Collect Events
  checkAddr(event.params.owner, event.address.toHexString());
}

export function handleCheckUniqueAddrMint(event: MintEvent ): void {
  // Pool.ts template defines the owner parameter and the sender parameter for Mint Events
  checkAddr(event.params.owner, event.address.toHexString());
  checkAddr(event.params.sender, event.address.toHexString());
}

export function handleCheckUniqueAddrSwap(event: SwapEvent ): void {
  // Pool.ts template defines the sender parameter and the recipient parameter for Swap Events
  checkAddr(event.params.sender, event.address.toHexString());
  checkAddr(event.params.recipient, event.address.toHexString());
}