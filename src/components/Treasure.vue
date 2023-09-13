<template>
 <v-container>
  <v-row class="text-center justify-center align-center">
   <v-col cols="12">
    <!-- <v-row class="justify-center">
          <div class="display-2 font-weight-bold mb-3">Welcome to</div>
        </v-row>
        <v-row class="justify-center">
          <div class="display-2 font-weight-bold mb-3">Treasure Hunter</div>
        </v-row> -->
   </v-col>

   <v-col class="justify-center align-center">
    <input type="file" ref="doc" @change="readFile()" />
   </v-col>
  </v-row>

  <!-- <v-row class="ma-5 justify-center">
   <v-btn @click="renderResults"> Render </v-btn>
  </v-row> -->

  <v-row>
   <v-textarea v-model="output" outlined></v-textarea>
  </v-row>
  <v-row>
   <v-textarea v-model="mapDisplay" outlined></v-textarea>
  </v-row>
 </v-container>
</template>

<script>
export default {
 name: "HelloWorld",

 data: () => ({
  output: "",
  content: "",
  map: [],
  mapDisplay: [],
  height: "",
  width: "",

  startPositionAdventurer: [],

  listOrientation: ["N", "E", "S", "O"],
  indexOrientation: 0,

  positionX: 0,
  positionY: 0,
 }),

 methods: {
  renderMap(output) {
   var lines = output.split(/\r?\n/);
   for (var i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\s+/g, "").split("-").join("");
    // Ajouter une vérif pour éviter un doublon de map qui donnerai une map x2 si deux entrées C
    if (line[0] === "C") {
     for (var row = 0; row < line[2]; row++) {
      this.map.push([]);
      for (var col = 0; col < line[1]; col++) {
       this.map[row].push(".");
      }
     }
     this.addMapDatas(output);
    }
   }
  },

  addMapDatas(output) {
   var lines = output.split(/\r?\n/);
   for (var i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\s+/g, "").split("-").join("");
    switch (line[0]) {
     case "#":
      break;
     case "M":
      this.map[line[2]][line[1]] = "M";
      break;
     case "T":
      this.map[line[2]][line[1]] = { entity: "T", value: line[3] };
      break;
     case "A":
      var adventurer = lines[i].split(" ");
      this.map[parseInt(adventurer[6])][parseInt(adventurer[4])] = {
       entity: "A",
       value: adventurer[2],
       orientation: adventurer[8],
       move: adventurer[10],
       tresor: 0,
      };
      this.startPositionAdventurer.push([
       parseInt(adventurer[6]),
       parseInt(adventurer[4]),
      ]);
      break;
    }
   }
   this.mapDisplay = this.map;
   console.log(this.map);

   this.moveAdventurer();
  },

  getIndexOrientation(orientation) {
   switch (orientation) {
    case "N":
     return 0;
    case "E":
     return 1;
    case "S":
     return 2;
    case "O":
     return 3;
   }
  },

  moveAdventurer() {
   const nbAdventurer = this.startPositionAdventurer.length;
   for (var adventurer = 0; adventurer < nbAdventurer; adventurer++) {
    // Get starting position of the adventurer
    var positionX = this.startPositionAdventurer[adventurer][1];
    var positionY = this.startPositionAdventurer[adventurer][0];

    // Get adventurer saved informations
    var caracteristics = this.map[positionX][positionY];

    this.indexOrientation = this.getIndexOrientation(
     caracteristics.orientation
    );

    this.positionX = positionX;
    this.positionY = positionY;

    // Nombre d'occurence d'actions à effectuer
    const nbactions = caracteristics.move.length;

    for (var action = 0; action < nbactions; action++) {
     console.log(this.indexOrientation, " ", caracteristics.orientation);
     if (caracteristics.move[0] == "A") {
      this.checkMove(
       this.positionX,
       this.positionY,
       caracteristics.orientation,
       adventurer
      );
     } else if (caracteristics.move[0] === "G") {
      if (this.indexOrientation - 1 > -1) {
       this.indexOrientation = this.indexOrientation - 1;
      } else {
       this.indexOrientation = 3;
      }
     } else if (caracteristics.move[0] === "D") {
      if (this.indexOrientation + 1 < 4) {
       this.indexOrientation = this.indexOrientation + 1;
      } else {
       this.indexOrientation = 0;
      }
     }
     caracteristics.orientation = this.listOrientation[this.indexOrientation];
     caracteristics.move = caracteristics.move.substring(1);
    }
    // this.saveEndMap(adventurer);
    console.log(this.map.length, this.map[1].length);
    console.log(this.positionX, this.positionY);
    this.mapDisplay[this.positionX][this.positionY] =
     this.map[this.startPositionAdventurer[adventurer][0]][
      this.startPositionAdventurer[adventurer][1]
     ];
    this.mapDisplay[this.startPositionAdventurer[adventurer][0]][
     this.startPositionAdventurer[adventurer][1]
    ] = ".";
    console.log(this.mapDisplay);
   }
  },

  checkMove(x, y, orientation, adventurer) {
   console.log("x :", x, " y :", y);
   switch (orientation) {
    case "N":
     x -= 1;
     if (x > -1 && this.map[x][y] !== "M") {
      console.log("ok");
      this.positionX = this.positionX - 1;
      if (this.map[x][y].entity && this.map[x][y].entity === "T") {
       this.map[x][y].value -= 1;
       this.map[this.startPositionAdventurer[adventurer][0]][
        this.startPositionAdventurer[adventurer][1]
       ].tresor += 1;
       if (this.map[x][y].value === 0) {
        this.map[x][y] === ".";
       }
      }
     } else {
      console.log("can't move North");
     }
     break;
    case "E":
     y += 1;
     if (y < this.map[0].length && this.map[x][y] !== "M") {
      console.log("ok", this.map[x][y]);
      this.positionY = this.positionY + 1;
      if (this.map[x][y].entity && this.map[x][y].entity === "T") {
       this.map[x][y].value -= 1;
       this.map[this.startPositionAdventurer[adventurer][0]][
        this.startPositionAdventurer[adventurer][1]
       ].tresor += 1;
       if (this.map[x][y].value === 0) {
        this.map[x][y] === ".";
       }
      }
     } else {
      console.log("can't move East");
     }
     break;
    case "S":
     x += 1;
     if (x < this.map.length && this.map[x][y] !== "M") {
      console.log("ok", this.map[x][y]);
      this.positionX = this.positionX + 1;
      if (this.map[x][y].entity && this.map[x][y].entity === "T") {
       this.map[x][y].value -= 1;
       this.map[this.startPositionAdventurer[adventurer][0]][
        this.startPositionAdventurer[adventurer][1]
       ].tresor += 1;
       if (this.map[x][y].value === 0) {
        this.map[x][y] === ".";
       }
      }
     } else {
      console.log("can't move South");
     }
     break;
    case "O":
     y -= 1;
     if (y > -1 && this.map[x][y] !== "M") {
      console.log("ok", this.map[x][y]);
      this.positionY = this.positionY - 1;
      if (this.map[x][y].entity && this.map[x][y].entity === "T") {
       this.map[x][y].value -= 1;
       this.map[this.startPositionAdventurer[adventurer][0]][
        this.startPositionAdventurer[adventurer][1]
       ].tresor += 1;
       if (this.map[x][y].value === 0) {
        this.map[x][y] === ".";
       }
      }
     } else {
      console.log("can't move Ouest");
     }
     break;
   }
  },

  saveEndMap(adventurer) {
   console.log(this.positionX);
   console.log(this.positionY);
   this.mapDisplay[this.positionX][this.positionY] =
    this.map[this.startPositionAdventurer[adventurer][0]][
     this.startPositionAdventurer[adventurer][1]
    ];
   this.mapDisplay[this.startPositionAdventurer[adventurer][0]][
    this.startPositionAdventurer[adventurer][1]
   ] = ".";
  },

  readFile() {
   this.file = this.$refs.doc.files[0];
   const reader = new FileReader();
   if (this.file.name.includes(".txt")) {
    reader.onload = (res) => {
     this.output = res.target.result;
     this.renderMap(res.target.result);
    };
    reader.onerror = (err) => console.log(err);
    reader.readAsText(this.file);
   } else {
    this.output = "check the console for file output";
    reader.onload = (res) => {
     console.log(res.target.result);
    };
    reader.onerror = (err) => console.log(err);
    reader.readAsText(this.file);
   }
  },
 },
};
</script>

<style>
.no-uppercase {
 text-transform: unset !important;
}

[v-cloak] {
 display: none;
}
</style>
