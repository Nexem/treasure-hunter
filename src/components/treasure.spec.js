import { Treasure } from "./Treasure";

describe("getIndexOrientation", () => {
 test("returns right indice from direction", () => {
  expect(Treasure.getIndexOrientation("S").toBe(2));
 });
});
