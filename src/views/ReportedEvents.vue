<template>
  <div >
    <div v-if="loading" class="loading-indicator">Processing, please wait...</div>
    <div v-else>
    <div v-if="reportedEvents.length > 0">
      <div v-for="reportedEvent in reportedEvents" :key="reportedEvent.event.id" class="container">
        <span class="info">Event Images:</span>
        <div class="image-scroll-container" ref="imageContainer" @mousedown="startDragging" @mouseup="stopDragging" @mousemove="drag">
          <div class="image-wrapper">
            <div
              v-for="(image, index) in reportedEvent.event.event_image_uris"
              :key="index"
              class="image-item"
            >
              <img :src="image" alt="Event Image" class="event-image" />
            </div>
          </div>
        </div>
        <div>
          <span class="info">Event ID:</span> {{ reportedEvent.event.id }}
        </div>
        <div>
          <span class="info">Event Name:</span> {{ reportedEvent.event.name }}
        </div>
        <div>
          <span class="info">Date Created:</span> {{ formatDate(reportedEvent.event.date_creation) }}
        </div>
        <div>
          <span class="info">Start Date:</span> {{ formatDate(reportedEvent.event.date_started) }}
        </div>
        <div>
          <span class="info">End Date:</span> {{ formatDate(reportedEvent.event.date_end) }}
        </div>
        <div>
          <span class="info">Description:</span> {{ reportedEvent.event.description }}
        </div>
        <div>
          <span class="info">Reported-by User ID:</span> {{ reportedEvent.id_user }}
        </div>
        <div>
          <span class="info">Reported-by User Name:</span> {{ reportedEvent.reported_by_name }}
        </div>
        <!-- <div>
          <img :src="user.reported_by_image_url || require('@/assets/noProfileImage.png')" alt="User Image" class="profile-image" />
        </div> -->
        <div class="comment">
          <strong>Comment:</strong> {{ reportedEvent.comment }}
        </div>
        <button class="button ban-button" @click="confirmBan(reportedEvent.event)">Ban Event</button>
      </div>
    </div>
    <div v-else class="advice">No events reported</div>
  </div></div>
</template>

<script>
import axiosInstance from "@/utils/axios";

export default {
  name: "ReportedEvents",
  data() {
    return {
      reportedEvents: [],
      error: "",
      isDragging: false,
      startX: 0,
      scrollLeft: 0,
      loading: false, 
    };
  },
  methods: {
    async getReportedEvents() {
      this.loading = true;
      try {
        const response = await axiosInstance.get("/v1/admin/reported_events");
        this.reportedEvents = response.data;
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },
    confirmBan(event) {
      if (confirm("Are you sure you want to ban this event?")) {
        this.banEvent(event);
      }
    },
    async banEvent(event) {
      this.loading = true;
      const reason = prompt("Please provide a reason for banning this event (optional):");
      if (reason === null) return;

      try {
        const response = await axiosInstance.post("/v1/admin/ban_event", {
          id: event.id,
          reason: reason || null,
        });
        this.reportedEvents = this.reportedEvents.filter((e) => e.event.id !== event.id);
        if (response.status === 201) {
          alert("Event has been banned successfully.");
        } else if (response.data.error_message) {
          alert(response.data.error_message);
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(dateString).toLocaleString("en-US", options);
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
    startDragging(e) {
      this.isDragging = true;
      this.startX = e.pageX - this.$refs.imageContainer.scrollLeft;
      this.scrollLeft = this.$refs.imageContainer.scrollLeft;
    },
    stopDragging() {
      this.isDragging = false;
    },
    drag(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.pageX - this.startX;
      this.$refs.imageContainer.scrollLeft = this.scrollLeft - x;
    },
  },
  mounted() {
    this.getReportedEvents();
  },
};
</script>

<style scoped>
  .container {
    background-color: rgba(56, 163, 165, 0.2);
    padding: 15px;
    border-radius: 8px;
  }
.image-scroll-container {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  white-space: nowrap;
  margin-bottom: 10px;
  cursor: grab;
}
.image-scroll-container:active {
  cursor: grabbing;
}
.image-wrapper {
  display: flex;
}
.image-item {
  flex: 0 0 auto;
  width: 150px; 
  height: 150px; 
  margin-right: 10px;
}
.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.info {
  font-weight: bold;
  margin-right: 5px;
}
.comment {
  margin-top: 10px;
  font-style: italic;
}
.advice {
  margin-top: 30px;
  font-size: 20px;
  text-align: center;
  background-color: rgba(56, 163, 165, 0.2);
  padding: 15px;
  border-radius: 5px;
}
.button {
  border: 2px solid rgb(56, 163, 165);
  margin-top: 10px;
  border-radius: 4px;
  padding: 5px 15px;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.3s;
}
.loading-indicator {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-top: 20px;
}
.button:hover {
  background-color: rgba(56, 163, 165, 0.6);
}
.ban-button {
  color: red;
  border-color: red;
}
</style>
