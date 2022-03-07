
import { BigInt } from "@graphprotocol/graph-ts";
import { Factory } from "../generated/schema"
import {
  Burn as BurnEvent,
  Flash as FlashEvent,
  Initialize,
  Mint as MintEvent,
  Swap as SwapEvent
} from '../generated/templates/Pool/Pool'

export function handleInit(event: Initialize ): void {
  let factory = new Factory.load(event.address.toHexString())
  factory.uniqueUserList = [];
  factory.uniqueUserCount = 0;
  factory.save();
}

export function handleCheckUniqueAddr(event: BurnEvent | FlashEvent | MintEvent | SwapEvent): void {
  //Would possibly need to add these events as an entity to the schema to see which params for each event?
  let factory = Factory.load(event.address.toHexString());
  let startingCount = factory.uniqueUserCount;
  if (!factory.uniqueUserList.includes(event.params?.owner?.toHex())) {
    factory.uniqueUserList.push(event.params?.owner?.toHex());
    factory.uniqueUserCount = new BigInt(factory.uniqueUserList.length);
  }
  if (!factory.uniqueUserList.includes(event.params?.sender?.toHex())) {
    factory.uniqueUserList.push(event.params?.sender?.toHex());
    factory.uniqueUserCount = new BigInt(factory.uniqueUserList.length);
  }
  if (!factory.uniqueUserList.includes(event.params?.recipient?.toHex())) {
    factory.uniqueUserList.push(event.params?.recipient?.toHex());
    factory.uniqueUserCount = new BigInt(factory.uniqueUserList.length);
  }

  if (factory.uniqueUserCount !== startingCount) factory.save()
}

