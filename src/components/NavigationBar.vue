<template>
  <div class="bar" v-if="!isLoginPage">
    <div class="container" >
      <a>
        <img :src="require('@/assets/logo.png')" style="border:1px white solid; margin-left: auto;" />
      </a>
      <router-link :to="{ path: '/reportedUsers' }" class="title">Viajuntos Webapp Admin</router-link>
      <span></span>
      |
      <a><router-link :to="{ path: '/reportedUsers' }" class="subtitle">Reported Users</router-link></a>
      |
      <a><router-link :to="{ path: '/reportedEvents' }" class="subtitle">Reported Events</router-link></a>
      |
      <a><router-link :to="{ path: '/bannedUsers' }" class="subtitle">Banned Users</router-link></a>
      |
      <a><router-link :to="{ path: '/bannedEvents' }" class="subtitle">Banned Events</router-link></a>
      |
      <div class="logout-container" >
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axios";

export default {
  name: "NavigationBar",
  computed: {
    isLoginPage() {
      return this.$route.name === "Login"; 
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("access_token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped>
.bar {
  background-color: #38A3A5;
  display: flex;
  align-items: center;
  padding: 10px 20px;
}
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.title {
  color: white;
  font-weight: bold;
  font-size: 20px;
  text-decoration: none;
  margin-left: 10px;
}
.container img {
  width: 20px;
  height: 20px;
  margin-top: 9px;
}
.subtitle {
  color: white;
  font-size: 15px;
}
.logout-container {
  margin-left: auto; /* 将登出按钮移到最右侧 */
}
.logout-btn {
  background-color: transparent;
  color: white;
  border: none;
  font-size: 15px;
  cursor: pointer;
}
.logout-btn:hover {
  text-decoration: underline;
}
</style>