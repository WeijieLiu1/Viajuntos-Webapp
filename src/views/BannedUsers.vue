<template>
  <div >
    <div v-if="loading" class="loading-indicator">Processing, please wait...</div>
    <div v-else>
      <div v-if="users.length < 1" class="advice">No users banned</div>
      <div v-else>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Ban date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.date }}</td>
              <button class="button unban-button" v-on:click="confirmUnban(user.email)">Unban</button>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/utils/axios';

export default {
  name: 'BannedUsers',
  data() {
    return {
      error: '',
      users: [],
      loading: false,
    };
  },
  methods: {
    async getUsers() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/v1/admin/banned_users');
        this.users = response.data;
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            this.$router.push('/login');
          } else {
            this.error = error.response.data.error_message;
          }
        }
      } finally {
        this.loading = false; 
      }
    },
    
    confirmUnban(user) {
      if (confirm("Are you sure you want to unban this user?")) {
        this.unban(user); 
      }
    },
    async unban(email) {
      this.loading = true;
      try {
        const response = await axiosInstance.post('/v1/admin/unban_user', { email });
        this.users = this.users.filter((u) => u.email !== email);
        
        if (response.status === 200) {
          alert("User has been unbanned successfully.");
        } else if (response.data.error_message) {
          alert(response.data.error_message);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            this.$router.push('/login');
          } else {
            this.error = error.response.data.error_message;
          }
        }
      } finally {
        this.loading = false; 
      }
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>

<style scoped>
.button {
  border: 2px solid rgb(56, 163, 165);
  display: inline-block;
  margin-top: 10px;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.2s;
}
.unban-button {
  color: red;
  border-color: red;
}
.loading-indicator {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-top: 20px;
}
.container {
  background-color: rgba(56, 163, 165, 0.2);
  padding: 15px;
  border-radius: 8px;
}
.advice {
  margin-top: 30px;
  font-size: 20px;
  text-align: center;
  background-color: rgba(56, 163, 165, 0.2);
  padding: 15px;
  border-radius: 5px;
}
</style>
