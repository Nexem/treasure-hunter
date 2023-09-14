<template>
 <v-container>
  <v-row class="text-center justify-center align-center">
   <v-col cols="12">
    <v-row class="justify-center">
     <div class="display-2 font-weight-bold mb-3">Carbon IT</div>
    </v-row>
    <v-row class="justify-center">
     <div class="display-2 font-weight-bold mb-3">Treasure Hunter</div>
    </v-row>
   </v-col>

   <v-col class="justify-center align-center">
    <input type="file" ref="doc" @change="readFile()" />
   </v-col>
  </v-row>

  <v-row>
   <v-textarea v-model="output" outlined></v-textarea>
  </v-row>
  <v-row>
   <v-textarea v-model="strOut" outlined></v-textarea>
  </v-row>
  <v-row>
   <v-btn v-if="strOut !== ''" @click="downloadResults">
    Télécharger le résultat
   </v-btn>
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

  listAdventurers: [],

  positionX: 0,
  positionY: 0,

  strOut: "",
 }),

 methods: {
  renderMap(output) {
   var lines = output.split(/\r?\n/);
   for (var i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\s+/g, "").split("-").join("");
    const lineRaw = lines[i];
    // Ajouter une vérif pour éviter un doublon de map qui donnerai une map x2 si deux entrées C
    if (line[0] === "C") {
     this.strOut += lineRaw;
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
    const lineRaw = lines[i];
    switch (line[0]) {
     case "#":
      break;
     case "M":
      this.strOut +=
       `
` + lineRaw;
      this.map[line[2]][line[1]] = "M";
      break;
     case "T":
      this.map[line[2]][line[1]] = { entity: "T", value: line[3] };
      break;
     case "A":
      var adventurer = lines[i].split(" ");

      this.map[parseInt(adventurer[6])][parseInt(adventurer[4])] = "A";
      this.listAdventurers.push({
       name: adventurer[2],
       orientation: adventurer[8],
       indexOrientation: this.getIndexOrientation(adventurer[8]),
       move: adventurer[10],
       tresor: 0,
       positionX: parseInt(adventurer[6]),
       positionY: parseInt(adventurer[4]),
      });
      break;
    }
   }
   this.mapDisplay = this.map;
   console.log(this.map);

   this.moveAdventurer();
  },

  // Retrieve the first index orientation of the adventurer
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

  // Compute and move the adventurer in the map, getting consideration of orientation and obstacles
  moveAdventurer() {
   this.listAdventurers.forEach((adventurer) => {
    const nbactions = adventurer.move.length;

    this.positionX = adventurer.positionX;
    this.positionY = adventurer.positionY;

    for (var action = 0; action < nbactions; action++) {
     if (adventurer.move[0] == "A") {
      adventurer = this.checkMove(
       adventurer.positionX,
       adventurer.positionY,
       adventurer
      );
     } else if (adventurer.move[0] === "G") {
      if (adventurer.indexOrientation - 1 > -1) {
       adventurer.indexOrientation = adventurer.indexOrientation - 1;
      } else {
       adventurer.indexOrientation = 3;
      }
     } else if (adventurer.move[0] === "D") {
      if (adventurer.indexOrientation + 1 < 4) {
       adventurer.indexOrientation = adventurer.indexOrientation + 1;
      } else {
       adventurer.indexOrientation = 0;
      }
     }
     adventurer.orientation = this.listOrientation[adventurer.indexOrientation];
     adventurer.move = adventurer.move.substring(1);
    }

    this.mapDisplay[adventurer.positionX][adventurer.positionY] =
     this.map[this.positionX][this.positionY];
    this.mapDisplay[this.positionX][this.positionY] = ".";
    console.log(this.mapDisplay);
    this.saveEndMap();
   });
  },

  // Check if the move in one direction is possible (no montain / adventurer)
  // and if there is a treasure (will increment players score by 1 from the treasure)
  checkMove(x, y, adventurer) {
   switch (adventurer.orientation) {
    case "N":
     x -= 1;
     if (x > -1 && this.map[x][y] !== ("M" || "A")) {
      adventurer.positionX = adventurer.positionX - 1;
      if (this.map[x][y].entity && this.map[x][y].entity === "T") {
       this.map[x][y].value -= 1;
       adventurer.tresor += 1;
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
     if (y < this.map[0].length && this.map[x][y] !== ("M" || "A")) {
      adventurer.positionY = adventurer.positionY + 1;
      if (this.map[x][y].entity && this.map[x][y].entity === "T") {
       this.map[x][y].value -= 1;
       adventurer.tresor += 1;
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
     if (x < this.map.length && this.map[x][y] !== ("M" || "A")) {
      adventurer.positionX = adventurer.positionX + 1;
      if (this.map[x][y].entity && this.map[x][y].entity === "T") {
       this.map[x][y].value -= 1;
       adventurer.tresor += 1;
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
     if (y > -1 && this.map[x][y] !== ("M" || "A")) {
      adventurer.positionY = adventurer.positionY - 1;
      if (this.map[x][y].entity && this.map[x][y].entity === "T") {
       this.map[x][y].value -= 1;
       adventurer.tresor += 1;
       if (this.map[x][y].value === 0) {
        this.map[x][y] === ".";
       }
      }
     } else {
      console.log("can't move Ouest");
     }
     break;
   }
   return adventurer;
  },

  // Create final result, displayed on screen
  // It can also be downloaded
  saveEndMap() {
   for (var row = 0; row < this.mapDisplay.length; row++) {
    for (var col = 0; col < this.mapDisplay[0].length; col++) {
     if (
      this.mapDisplay[row][col].entity &&
      this.mapDisplay[row][col].entity === "T"
     ) {
      this.strOut +=
       `
` +
       "T - " +
       col +
       " - " +
       row +
       " - " +
       this.mapDisplay[row][col].value;
     }
    }
   }
   this.listAdventurers.forEach((adventurer) => {
    var result =
     "A - " +
     adventurer.name +
     " - " +
     adventurer.positionX +
     " - " +
     adventurer.positionY +
     " - " +
     adventurer.orientation +
     " - " +
     adventurer.tresor;

    //  Push result in the end string display
    this.strOut +=
     `
` + result;
   });
  },

  // Read entry file and store it as a string
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

  // Create output result file from the strOut string
  downloadResults() {
   var link = document.createElement("a");
   link.download = "resultsTreasure.txt";
   var blob = new Blob([this.strOut], { type: "text/plain" });
   link.href = window.URL.createObjectURL(blob);
   link.click();
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
