<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <div>
      <input v-model="inputUrl" placeholder="Enter URL">
      <button v-on:click="shortenUrl(inputUrl)" class="margin-left-medium">Shorten</button>
<!--      <div v-if="this.error"> {{ error }} </div>-->
    </div>

    <div v-if="this.allUrls" class="flex-col">
      <h2>Recently shortened URLs . . .</h2>
      <div v-for="(url, i) in allUrls" v-bind:key="i">
        <div class="full-url"> {{ url.fullUrl.slice(1,-1) }} </div>
        <div class="short-url"> {{ url.shortUrl }} </div>
        <div class="separator"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { urlDataService } from "../UrlDataService";
import {AxiosResponse} from "axios";
import {UrlPair, InputUrl} from "../types";

interface ComponentData {
  inputUrl: InputUrl;
  allUrls: UrlPair[];
}

export default Vue.extend({
  name: "UrlShortener",
  data(): ComponentData {
    return {
      inputUrl: '',
      allUrls: [],
    };
  },
  methods: {
    getAllUrls: function(): Promise<AxiosResponse<Array<UrlPair | null>>> {
      return urlDataService.getAll().then(response => {
        try {
          this.allUrls = response.data.reverse(); //most recent at top
          return response.data;
        } catch (err) {
          console.log(err);
          return null;
        }
      });
    },

    shortenUrl: async function(inputUrl: InputUrl): Promise<void> {

      try {
        const response = await urlDataService.shortenUrl(inputUrl);

        if(!response.data) {
          window.alert("Sorry, there was a problem with this URL");
          return;
        }

        this.allUrls.push(response.data);
      }
      catch (err) {
        window.alert("Sorry, there was a problem with this URL");
        console.error(err);
      }
    }

  },
  props: {
    msg: String,
  },
  beforeMount() {
    this.getAllUrls();
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

  .full-url {
    color: deepskyblue;
  }

  .short-url {
    color: royalblue;
  }

  .separator {
    border: 1px solid midnightblue;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .margin-left-medium {
    margin-left: 20px;
  }
</style>
