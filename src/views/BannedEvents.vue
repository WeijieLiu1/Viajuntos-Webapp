<template>
  <div class="container">
    <div v-if="loading" class="loading-indicator">Processing, please wait...</div>
    <div v-else>
      <div v-if="events.length < 1" class="advice">No events banned</div>
      <div v-else>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Ban Date</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.event_id">
              <td>{{ event.event_id }}</td>
              <td>{{ formatDate(event.date) }}</td>
              <td>{{ event.reason || 'No reason provided' }}</td>
              <td>
                <button
                  class="button unban-button"
                  :disabled="loading"
                  @click="confirmUnban(event.event_id)"
                >
                  Unban
                </button>
              </td>
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
  name: 'BannedEvents',
  data() {
    return {
      error: '',
      events: [],
      loading: false,
    };
  },
  methods: {
    async getBannedEvents() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/v1/admin/banned_events');
        this.events = response.data;
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
    confirmUnban(eventId) {
      if (!this.loading && confirm("Are you sure you want to unban this event?")) {
        this.unbanEvent(eventId);
      }
    },
    async unbanEvent(eventId) {
      this.loading = true;
      try {
        const response = await axiosInstance.post('/v1/admin/unban_event', { event_id: eventId });
        this.events = this.events.filter((event) => event.event_id !== eventId);

        if (response.status === 200) {
          alert("Event has been unbanned successfully.");
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
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleString('en-US', options);
    },
  },
  mounted() {
    this.getBannedEvents();
  },
};
</script>

<style scoped>
.container {
  background-color: rgba(56, 163, 165, 0.2);
  padding: 15px;
  border-radius: 8px;
}
.advice {
  margin-top: 30px;
  font-size: 20px;
  text-align: center;
}
.loading-indicator {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-top: 20px;
}
.table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}
.table th,
.table td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.button {
  border: 2px solid rgb(56, 163, 165);
  margin-top: 10px;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.2s;
}
.button:disabled {
  cursor: not-allowed;
  background-color: #f5f5f5;
  border-color: #ccc;
  color: #aaa;
}
.button:hover:not(:disabled) {
  background-color: rgba(56, 163, 165, 0.6);
}
.unban-button {
  color: red;
  border-color: red;
}
</style>
