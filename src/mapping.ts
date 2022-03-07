
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Factory, UserObj } from "../generated/schema"
import {
  Burn as BurnEvent,
  Flash as FlashEvent,
  Mint as MintEvent,
  Swap as SwapEvent
} from '../generated/templates/Pool/Pool'

function newFactory(): Factory {
  let factory = new Factory("SingleFactory");
  factory.uniqueUserCount = new BigInt(0);
  return factory;
}

export function handleSetOwner(owner: Address): void {
  let factory = Factory.load("SingleFactory");
  if (!factory) {
    factory = newFactory();
  }

  let user = UserObj.load(owner.toHex());
  if (!user) {
    user = new UserObj(owner.toHex())
    let num = +(1) + +(factory.uniqueUserCount.toI32())
    factory.uniqueUserCount = new BigInt(num);
    factory.save()
  }
}

export function handleBurnCheckUniqueAddr(event: BurnEvent ): void {
  let factory = Factory.load("SingleFactory");
  if (!factory) {
    factory = newFactory()
  }
    
  let user = UserObj.load(event.params.owner.toHex());
  if (!user) {
    user = new UserObj(event.params.owner.toHex());
    let num = +(1) + +(factory.uniqueUserCount.toI32())
    factory.uniqueUserCount = new BigInt(num);
    factory.save();
  }
}

export function handleFlashCheckUniqueAddr(event: FlashEvent ): void {
  let factory = Factory.load("SingleFactory");
  if (!factory) {
    factory = newFactory()
  }
  
  let startingCount = factory.uniqueUserCount;

  let user = UserObj.load(event.params.sender.toHex());
  if (!user) {
    user = new UserObj(event.params.sender.toHex());
    let num = +(1) + +(factory.uniqueUserCount.toI32())
    factory.uniqueUserCount = new BigInt(num);
    factory.save();
  }
  user = UserObj.load(event.params.recipient.toHex());
  if (!user) {
    user = new UserObj(event.params.recipient.toHex());
    let num = +(1) + +(factory.uniqueUserCount.toI32());
    factory.uniqueUserCount = new BigInt(num);
    factory.save();
  }

  if (factory.uniqueUserCount !== startingCount) factory.save()
}

export function handleMintCheckUniqueAddr(event: MintEvent ): void {
  let factory = Factory.load("SingleFactory");
  if (!factory) {
    factory = newFactory()
  }
  
  let startingCount = factory.uniqueUserCount;
  let user = UserObj.load(event.params.owner.toHex());
  if (!user) {
    user = new UserObj(event.params.owner.toHex());
    let num = +(1) + +(factory.uniqueUserCount.toI32())
    factory.uniqueUserCount = new BigInt(num);
    factory.save();
  }
  user = UserObj.load(event.params.sender.toHex());
  if (!user) {
    user = new UserObj(event.params.sender.toHex());
    let num = +(1) + +(factory.uniqueUserCount.toI32())
    factory.uniqueUserCount = new BigInt(num);
    factory.save();
  }

  if (factory.uniqueUserCount !== startingCount) factory.save()
}

export function handleSwapCheckUniqueAddr(event: SwapEvent ): void {
  let factory = Factory.load("SingleFactory");
  if (!factory) {
    factory = newFactory()
  }
  
  let startingCount = factory.uniqueUserCount;

  let user = UserObj.load(event.params.sender.toHex());
  if (!user) {
    user = new UserObj(event.params.sender.toHex());
    let num = +(1) + +(factory.uniqueUserCount.toI32())
    factory.uniqueUserCount = new BigInt(num);
    factory.save();
  }
  user = UserObj.load(event.params.recipient.toHex());
  if (!user) {
    user = new UserObj(event.params.recipient.toHex());
    let num = +(1) + +(factory.uniqueUserCount.toI32())
    factory.uniqueUserCount = new BigInt(num);
    factory.save();
  }

  if (factory.uniqueUserCount !== startingCount) factory.save()
}