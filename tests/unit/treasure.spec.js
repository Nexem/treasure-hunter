import { shallowMount } from "@vue/test-utils";
import Treasure from "@/components/Treasure.vue";

describe("Treasure.vue", () => {
 let localVue;
 let vuetify;
 let wrapper;

 wrapper = shallowMount(Treasure, {
  localVue,
  vuetify,
  data() {
   return {
    output: "",
    content: "",
    map: [],
    mapDisplay: [],
    height: "",
    width: "",

    startPositionAdventurer: [],

    listOrientation: ["N", "E", "S", "O"],

    listAdventurers: [],

    positionX: 0,
    positionY: 0,

    strOut: "",
   };
  },
 });

 it("returns right index of direction from orientation", () => {
  expect(wrapper.vm.getIndexOrientation("S")).toBe(2);
 });
 it("renders the map", () => {
  wrapper.vm.renderMap(wrapper.vm.output);
 });
 it("has no button to download before loading map", () => {
  expect(wrapper.find("button").exists()).toBe(false);
 });

 it("renders correctly map size according to C - 3 - 4", () => {
  const output = `
C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 0 - 3 - 2
T - 1 - 3 - 3
A - Lara - 1 - 1 - S - AADADAGGA`;
  wrapper.vm.renderMap(output);
  expect(wrapper.vm.map.length).toEqual(4);
  expect(wrapper.vm.map[0].length).toEqual(3);
 });
});

describe("Treasure.vue", () => {
 let localVue;
 let vuetify;
 let wrapper;

 wrapper = shallowMount(Treasure, {
  localVue,
  vuetify,
  data() {
   return {
    output: "",
    content: "",
    map: [],
    mapDisplay: [],
    height: "",
    width: "",

    startPositionAdventurer: [],

    listOrientation: ["N", "E", "S", "O"],

    listAdventurers: [],

    positionX: 0,
    positionY: 0,

    strOut: "",
   };
  },
 });

 it("Compute and return expected result", () => {
  const output = `
C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 0 - 3 - 2
T - 1 - 3 - 3
A - Lara - 1 - 1 - S - AADADAGGA`;
  const expectedResult = `C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 1 - 3 - 2
A - Lara - 0 - 3 - S - 3`;
  wrapper.vm.renderMap(output);
  expect(wrapper.vm.strOut).toMatch(expectedResult);
 });
});
