<template>
  <view class="container">
    <view class="header">
      <text class="title">Subjects</text>
    </view>
    <view v-if="loading" class="loading-text">Loading subjects...</view>
    <view v-if="error" class="error-text">{{ error }}</view>
    <scroll-view v-if="!loading && !error && subjects.length > 0" scroll-y="true" class="subject-list">
      <view v-for="subject in subjects" :key="subject.id" class="subject-item">
        <text class="subject-name">{{ subject.name }}</text>
        <text class="subject-description">{{ subject.description || 'No description' }}</text>
      </view>
    </scroll-view>
    <view v-if="!loading && !error && subjects.length === 0" class="empty-text">
      No subjects found.
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Subject {
  id: number;
  name: string;
  description?: string | null;
}

const subjects = ref<Subject[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// IMPORTANT: Replace with your actual Next.js backend URL
// This should ideally be configurable, e.g., via an environment variable for the Uniapp build.
// For this MVP, we'll use the common localhost URL.
const API_URL = 'http://localhost:3000/api/admin/subjects';

const fetchSubjects = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await uni.request({
      url: API_URL,
      method: 'GET',
    });

    // uni.request returns data in response[1].data for success
    // or response[0] for error. This structure can be a bit confusing.
    // A more robust way is to check statusCode.
    // For uni.request, response is an array [err, res]
    // However, with promisified uni.request (default in setup script), it's just 'res' or throws error.
    // Let's assume the promisified version for cleaner code.
    // The actual response structure from uni.request can be [err, res] or just res
    // depending on how it's called or if it's wrapped.
    // For safety, let's check response.statusCode if it's directly the response object.
    // If uni.request is used with async/await, it often returns the full response object.

    // uni.request wraps the response. The actual data is typically in `res.data`.
    // Status code is also in `res.statusCode`.
    if (response.statusCode && response.statusCode === 200) {
      subjects.value = response.data as Subject[];
    } else if (response.data) { // Check if response.data exists and has an error message
      const errorResponse = response.data as any;
      throw new Error(errorResponse.message || errorResponse.error || `Failed to fetch subjects. Status: ${response.statusCode}`);
    } else {
      throw new Error(`Failed to fetch subjects. Status: ${response.statusCode || 'Unknown'}`);
    }
  } catch (err: any) {
    console.error('Error fetching subjects:', err);
    // Check if err.errMsg (Uniapp specific) or err.message (standard Error)
    error.value = err.errMsg || err.message || 'An unknown error occurred.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSubjects();
});
</script>

<style>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header {
  margin-bottom: 20px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.loading-text, .error-text, .empty-text {
  margin-top: 20px;
  font-size: 16px;
  color: #666;
}
.error-text {
  color: red;
}
.subject-list {
  width: 100%;
  max-width: 600px; /* Max width for better readability on wider screens */
}
.subject-item {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.subject-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: block; /* Make name take full width */
  margin-bottom: 5px;
}
.subject-description {
  font-size: 14px;
  color: #555;
}
</style>
