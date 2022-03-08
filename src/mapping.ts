
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

function checkSenderAddr(sender: Address, factory: Factory): void {
  //This function checks for an instance of the UserObj entity matching the sender address parameter
  let user = UserObj.load(sender.toHex());
  if (user === null) {
    // If the sender param address has not been used to instantiate a UserObj, create a new UserObj instance
    user = new UserObj(sender.toHex());
    user.save();
    //Increment the uniqueUserCount on the factory instance
    const newCount = factory.uniqueUserCount.toI32() + 1;
    factory.uniqueUserCount = new BigInt(newCount);
    factory.save();
  }
}

function checkRecipientAddr(recipient: Address, factory: Factory): void {
  //This function checks for an instance of the UserObj entity matching the recipient address parameter
  let user = UserObj.load(recipient.toHex());
  if (user === null) {
    // If the recipient param address has not been used to instantiate a UserObj, create a new UserObj instance
    user = new UserObj(recipient.toHex());
    user.save();
    //Increment the uniqueUserCount on the factory instance
    const newCount = factory.uniqueUserCount.toI32() + 1;
    factory.uniqueUserCount = new BigInt(newCount);
    factory.save();
  }
}

function checkOwnerAddr(owner: Address, factory: Factory): void {
  //This function checks for an instance of the UserObj entity matching the owner address parameter
  let user = UserObj.load(owner.toHex());
  if (user === null) {
    // If the owner param address has not been used to instantiate a UserObj, create a new UserObj instance
    user = new UserObj(owner.toHex());
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
  const factory = initFactory();
  checkOwnerAddr(call.inputs._owner, factory);
}

export function handleCheckUniqueAddrBurn(event: BurnEvent ): void {
  const factory = initFactory();
  // Pool.ts template defines the owner parameter in Burn Events
  checkOwnerAddr(event.params.owner, factory);
}

export function handleCheckUniqueAddrFlash(event: FlashEvent ): void {
  const factory = initFactory();
  // Pool.ts template defines the sender parameter and the recipient parameter for Flash Events
  checkSenderAddr(event.params.sender, factory);
  checkRecipientAddr(event.params.recipient, factory);
}

export function handleCheckUniqueAddrMint(event: MintEvent ): void {
  const factory = initFactory();
  // Pool.ts template defines the owner parameter and the sender parameter for Mint Events
  checkOwnerAddr(event.params.owner, factory);
  checkSenderAddr(event.params.sender, factory);
}

export function handleCheckUniqueAddrSwap(event: SwapEvent ): void {
  const factory = initFactory();
  // Pool.ts template defines the sender parameter and the recipient parameter for Swap Events
  checkSenderAddr(event.params.sender, factory);
  checkRecipientAddr(event.params.recipient, factory);
}