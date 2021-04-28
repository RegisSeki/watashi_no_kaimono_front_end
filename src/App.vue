<template>
  <div id="app" :class="{'hide-menu': !isMenuVisible || !user }">
    <Header title="Watashi no Kaimono" 
      :hideToggle="!user"
      :hideUserDropdown="!user" />
    <Menu v-if="user"/>
    <Loading v-if="validatingToken" />
    <Content v-else />
    <Footer />
  </div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, userKey } from '@/global'
import { mapState } from 'vuex'
import Header from "@/components/template/Header"
import Menu from "@/components/template/Menu"
import Content from "@/components/template/Content"
import Footer from "@/components/template/Footer"
import Loading from "@/components/template/Loading"

export default {
  name: 'App',
  components: { Header, Menu, Content, Footer, Loading },
  computed: mapState(['isMenuVisible', 'user']),
  data: function() {
    return {
      validatingToken: true
    }
  },
  methods: {
    async validateToken() {
      this.validatingToken = true
      
      const json = localStorage.getItem(userKey)
      const userData = JSON.parse(json)
      this.$store.commit('setUser', null)

      if(!userData) {      
        this.validatingToken = false
        this.$router.push({ name: 'auth' })
        return
      }
      try{
        const res = await axios.post(`${baseApiUrl}/api/v1/refresh_token`, userData)

        if(res.data) {
          localStorage.setItem(userKey, JSON.stringify(res.data))
          this.$store.commit('setUser', res.data)
        } else {
          localStorage.removeItem(userKey)
          this.$router.push({ name: 'auth' })        
        }
      } catch (err) {
        localStorage.removeItem(userKey)
        this.$router.push({ name: 'auth' })
      }

      this.validatingToken = false
    }
  },
  created() {
    this.validateToken()
  }
}
</script>

<style>
  * {
    font-family: "Lato", sans-serif;
  }

  body {
    margin: 0;
  }

  #app {
    -wekit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    height: 100vh;
    display: grid;
    grid-template-rows: 60px 1fr 40px;
    grid-template-columns: 300px 1fr;
    grid-template-areas: 
      "header header"
      "menu content"
      "menu footer";
  }

  #app.hide-menu {
    grid-template-areas: 
      "header header"
      "content content"
      "footer footer";
  }
</style>
