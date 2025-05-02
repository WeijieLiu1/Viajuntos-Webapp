<template>
  <div>
    <div v-if="loading" class="loading-indicator">Processing, please wait...</div>
    <div v-else>
    <div v-if="users.length > 0">
      <div v-for="user in users" :key="user.reported_by" class="container">
        <div>
          <span class="info">Reported-by User ID:</span> {{ user.reported_by }}
        </div>
        <div>
          <span class="info">Reported-by User Name:</span> {{ user.reported_by_name }}
        </div>
        <div>
          <span class="info">User id:</span> {{ user.user_reported }}
        </div>
        <div>
          <span class="info">Username:</span> {{ user.user_reported.username }}
        </div>
        <div>
          <span class="info">Email:</span> {{ user.user_reported.email }}
        </div>
        <div>
          <span class="info">Description:</span> {{ user.user_reported.description }}
        </div>
        <div>
          <span class="info">Hobbies:</span> {{ user.user_reported.hobbies }}
        </div>
        
        <div class="comment">
          <strong>Comment:</strong> {{ user.comment }}
        </div>
        <button class="button ban-button" @click="confirmBan(user.user_reported.id)">Ban User</button>
      </div>
    </div>
    <div v-else class="advice">No users reported</div>
  </div></div>
</template>
<script>
import axiosInstance from "@/utils/axios";

export default {
  name: "ReportedUsers",
  data() {
    return {
      users: [],
      error: "",
      loading: false,
    };
  },
  methods: {
    async getUsers() {
      this.loading = true;
      try {
        const response = await axiosInstance.get("/v1/admin/reported_users");
        this.users = response.data;
      } catch (error) {
        this.handleError(error);
      }finally {
        this.loading = false;
      }
    },
    async ban(user) {
      this.loading = true;
      const reason = prompt("Please provide a reason for banning this user (optional):");
      if (reason === null) {
        return;
      }

      try {
        const response = await axiosInstance.post("/v1/admin/ban_user", {
          id: user,
          reason: reason || null, 
        });
        
        this.users = this.users.filter((u) => u.id_user !== user);
        if (response.status === 201) {
          alert("User has been banned successfully.");
          await this.getUsers();
        } else if (response.data.error_message) {
          alert(response.data.error_message);
        }
      } catch (error) {
        this.handleError(error);
      }finally {
        this.loading = false;
      }
    },
    confirmBan(user) {
      if (confirm("Are you sure you want to ban this user?")) {
        this.ban(user); 
      }
    },
    handleError(error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.$router.push("/login");
        } else {
          this.error = error.response.data.error_message || "An error occurred.";
        }
      }
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>


<style scoped>
.container {
  background-color: rgba(56, 163, 165, 0.2);
  padding: 15px;
  border-radius: 8px;
}
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
.button:hover {
  background-color: rgba(56, 163, 165, 0.6);
}
.ban-button {
  color: red;
  border-color: red;
}
.info {
  font-weight: bold;
  margin-right: 5px;
}
.advice {
  margin-top: 30px;
  font-size: 20px;
  text-align: center;
  background-color: rgba(56, 163, 165, 0.2);
  padding: 15px;
  border-radius: 5px;
}
.loading-indicator {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-top: 20px;
}
.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-top: 10px;
}
.comment {
  margin-top: 10px;
  font-style: italic;
}
</style>
