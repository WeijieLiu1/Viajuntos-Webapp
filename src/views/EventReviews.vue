<template>
  <div class="container">
    <p>
      {{ event.name }} - {{ username }} ( {{ email }} )
      <button @click="ban(event.user_creator)" class="button">Ban</button>
    </p>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Punctuation</th>
          <th>Review</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="review in reviews" :key="review.user_id">
          <td>{{ review.rating }}</td>
          <td>{{ review.comment }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axios";

export default {
  name: "EventReviews",
  data() {
    return {
      event: {},
      username: "",
      email: "",
      reviews: [],
      error: "",
    };
  },
  methods: {
    async getReviews() {
      try {
        const response = await axiosInstance.get(
          `/v3/events/review?eventid=${this.$route.params.id}`
        );
        this.event = response.data.event;
        this.username = response.data.username;
        this.email = response.data.email;
        this.reviews = response.data.reviews;
      } catch (error) {
        this.handleError(error);
      }
    },
    async ban(id) {
      try {
        await axiosInstance.post("/v1/admin/ban", { id });
        this.getReviews(); // 刷新数据，无需重载页面
      } catch (error) {
        this.handleError(error);
      }
    },
    handleError(error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.$router.push("/login");
        } else {
          this.error = error.response.data.error_message;
        }
      }
    },
  },
  mounted() {
    this.getReviews();
  },
};
</script>

<style scoped>
.container {
  background-color: rgba(56, 163, 165, 0.2);
}
.button {
  border: 2px solid rgb(56, 163, 165);
  display: inline-block;
  margin-top: 17px;
  border-radius: 4px;
}
p {
  text-decoration-line: underline;
}
</style>
