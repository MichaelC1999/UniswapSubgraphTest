
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Factory, UserObj } from "../generated/schema";
import {
  Burn as BurnEvent,
  Flash as FlashEvent,
  Mint as MintEvent,
  Swap as SwapEvent
} from "../generated/templates/Pool/Pool";

import { SetOwnerCall } from "../generated/templates/Pool/Factory";

// UNIQUE USER ADDRESS CHECK FUNCTION
// This function checks the given address as the ID of a UserObj instance
// If the address is not used, create a new UserObj instance

function checkAddr(addrToCheck: Address): void {
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
    user.save();
    //Increment the uniqueUserCount on the factory instance
    const newCount = factory.uniqueUserCount.toI32() + 1;
    factory.uniqueUserCount = new BigInt(newCount);
    factory.save();
  }
}

// EVENT/CALL HANDLER FUNCTIONS
// All functions call checkAddr check the defined address parameters/inputs for an existing UserObj instance

export function handleSetOwnerCall(call: SetOwnerCall): void {
  // Factory.ts template defines the _owner input in setOwner calls
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
  // Pool.ts template defines the owner parameter and the sender parameter for Mint Events
  checkAddr(event.params.owner);
  checkAddr(event.params.sender);
}

export function handleCheckUniqueAddrSwap(event: SwapEvent ): void {
  // Pool.ts template defines the sender parameter and the recipient parameter for Swap Events
  checkAddr(event.params.sender);
  checkAddr(event.params.recipient);
}