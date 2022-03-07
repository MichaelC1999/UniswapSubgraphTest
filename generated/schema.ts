// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Factory extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("uniqueUserCount", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Factory entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Factory entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Factory", id.toString(), this);
    }
  }

  static load(id: string): Factory | null {
    return changetype<Factory | null>(store.get("Factory", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get uniqueUserList(): Array<string> | null {
    let value = this.get("uniqueUserList");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set uniqueUserList(value: Array<string> | null) {
    if (!value) {
      this.unset("uniqueUserList");
    } else {
      this.set("uniqueUserList", Value.fromStringArray(<Array<string>>value));
    }
  }

  get uniqueUserCount(): BigInt {
    let value = this.get("uniqueUserCount");
    return value!.toBigInt();
  }

  set uniqueUserCount(value: BigInt) {
    this.set("uniqueUserCount", Value.fromBigInt(value));
  }
}