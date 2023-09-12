<template>
 <v-container>
  <v-row class="text-center justify-center align-center">
   <v-col cols="12">
    <v-row class="justify-center">
     <div class="display-2 font-weight-bold mb-3">Welcome to</div>
    </v-row>
    <v-row class="justify-center">
     <div class="display-2 font-weight-bold mb-3">Treasure Hunter</div>
    </v-row>
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
 }),

 methods: {
  renderMap(output) {
   var lines = output.split(/\r?\n/);
   for (var i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\s+/g, "").split("-").join("");
    if (line[0] === "C") {
     for (var row = 0; row < line[1]; row++) {
      this.map.push([]);
      for (var col = 0; col < line[2]; col++) {
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
      this.map[line[1]][line[2]] = "M";
      break;
     case "T":
      this.map[line[1]][line[2]] = { entity: "T", value: line[3] };
      break;
     case "A":
      var adventurer = lines[i].split(" ");
      this.map[parseInt(adventurer[4])][parseInt(adventurer[6])] = {
       entity: "A",
       value: adventurer[2],
       direction: adventurer[8],
       move: adventurer[10],
       tresor: 0,
      };
      this.startPositionAdventurer.push([
       parseInt(adventurer[4]),
       parseInt(adventurer[6]),
      ]);
      break;
    }
   }
   this.moveAdventurer(output);
  },

  moveAdventurer() {
   const nbAdventurer = this.startPositionAdventurer.length;
   for (var adventurer = 0; adventurer < nbAdventurer; adventurer++) {
    // Get starting position of the adventurer
    var positionX = this.startPositionAdventurer[adventurer][0];
    var positionY = this.startPositionAdventurer[adventurer][1];
    // Get adventurer saved informations
    var caracteristics = this.map[positionX][positionY];

    // Nombre d'occurence d'actions à effectuer
    const nbactions = caracteristics.move.length;

    for (var action = 0; action < nbactions; action++) {
     //  console.log(caracteristics.move[0]);
     if (caracteristics.move[0] === "A") {
      this.checkMove(positionX, positionY, caracteristics.orientation);
     } else {
      if (caracteristics.move[0] === "G") {
       caracteristics.orientation =
        this.listOrientation[caracteristics.orientation - 1];
      } else {
       caracteristics.orientation =
        this.listOrientation[caracteristics.orientation + 1];
      }
     }
     console.log(this.listOrientation[caracteristics.orientation + 1]);
     caracteristics.move = caracteristics.move.substring(1);
    }
   }
  },

  checkMove(x, y, orientation) {
   switch (orientation) {
    case "N":
     break;
    case "E":
     break;
    case "S":
     break;
    case "O":
     break;
   }
   //  console.log("avance");
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
