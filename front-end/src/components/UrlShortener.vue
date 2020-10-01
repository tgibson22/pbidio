<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <form>
      <input v-model="inputUrl" placeholder="Enter URL">
      <button v-on:click="shortenUrl(inputUrl)">Shorten</button>
<!--      <div v-if="this.error"> {{ error }} </div>-->
    </form>

    <div v-if="this.allUrls">
      <ul>
        <h2>Recently shortened URLs . . .</h2>
        <li v-for="(url, i) in allUrls" v-bind:key="i">
          <div class="full-url"> {{ url.fullUrl.slice(1,-1) }} </div>
          <div class="short-url"> {{ url.shortUrl }} </div>
          <div class="separator"></div>
        </li>
      </ul>
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
  error: string | null;
}

export default Vue.extend({
  name: "UrlShortener",
  data(): ComponentData {
    return {
      inputUrl: '',
      allUrls: [],
      error: null
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

    shortenUrl: function(inputUrl: InputUrl): Promise<UrlPair> | null {

        const res: Promise<UrlPair> = urlDataService.shortenUrl(inputUrl).then(response => {
          if(response.data != null) {
            this.error = null;
            this.allUrls.push(response.data);
            return response.data
          } else {
            this.error = "Sorry, there was a problem with this URL";
            return null
          }
        });

        return res
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
</style>
