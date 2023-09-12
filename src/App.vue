<template>
 <v-app>
  <v-main>
   <Treasure />
  </v-main>
 </v-app>
</template>

<script>
import Treasure from "./components/Treasure";

export default {
 name: "App",

 components: {
  Treasure,
 },

 data: () => ({
  //
 }),
};
</script>
