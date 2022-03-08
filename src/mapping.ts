
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Factory, UserObj } from "../generated/schema";
import {
  Burn as BurnEvent,
  Flash as FlashEvent,
  Mint as MintEvent,
  Swap as SwapEvent
} from "../generated/templates/Pool/Pool";

import { SetOwnerCall } from "../generated/templates/Pool/Factory";

// FACTORY FUNCTIONS
// These functions initiate/create the one Factory identity to hold the unique user count

function initFactory(): Factory {
  //This function loads the factory for all event handlers, and calls the newFactory() function if there is no Factory instance yet
  let factory = Factory.load("SingleFactory");
  if (!factory) {
    factory = newFactory();
  }
  return factory;
}

function newFactory(): Factory {
  // This function creates the Factory instance if it has not been initiated yet
  const factory = new Factory("SingleFactory");
  factory.uniqueUserCount = new BigInt(0);
  return factory;
}

// UNIQUE USER ADDRESS CHECK FUNCTIONS
// These functions check the given address parameter as the ID of a UserObj instance
// If the address is not used, create a new UserObj instance

function checkAddr(addrToCheck: Address): void {
  //This function checks for an instance of the UserObj entity matching the sender address parameter
  const factory = initFactory();
  let user = UserObj.load(addrToCheck.toHex());
  if (user === null) {
    // If the sender param address has not been used to instantiate a UserObj, create a new UserObj instance
    user = new UserObj(addrToCheck.toHex());
    user.save();
    //Increment the uniqueUserCount on the factory instance
    const newCount = factory.uniqueUserCount.toI32() + 1;
    factory.uniqueUserCount = new BigInt(newCount);
    factory.save();
  }
}


// EVENT/CALL HANDLER FUNCTIONS
// All functions initiate the factory entity, then check the address parameters for an existing UserObj instance
// The parameters checked in each function are defined in the Pool.ts template for each given event

export function handleSetOwnerCall(call: SetOwnerCall): void {
  checkAddr(call.inputs._owner);
}

export function handleCheckUniqueAddrBurn(event: BurnEvent ): void {
  // Pool.ts template defines the owner parameter in Burn Events
  checkAddr(event.params.owner);
}

export function handleCheckUniqueAddrFlash(event: FlashEvent ): void {
  // Pool.ts template defines the sender parameter and the recipient parameter for Flash Events
  checkAddr(event.params.sender);
  checkAddr(event.params.recipient);
}

export function handleCheckUniqueAddrMint(event: MintEvent ): void {
  const factory = initFactory();
  // Pool.ts template defines the owner parameter and the sender parameter for Mint Events
  checkAddr(event.params.owner);
  checkAddr(event.params.sender);
}

export function handleCheckUniqueAddrSwap(event: SwapEvent ): void {
  // Pool.ts template defines the sender parameter and the recipient parameter for Swap Events
  checkAddr(event.params.sender);
  checkAddr(event.params.recipient);
}