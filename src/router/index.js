import { createWebHistory, createRouter } from "vue-router";
import ReportedUsers from '@/views/ReportedUsers.vue'
import ReportedEvents from '@/views/ReportedEvents.vue'
import EventReviews from '@/views/EventReviews.vue'
import Login from '@/views/Login.vue'
import BannedUsers from '@/views/BannedUsers.vue'
import BannedEvents from '@/views/BannedEvents.vue'

const routes = [
    {
        path: '/reportedUsers',
        name: 'ReportedUsers',
        component: ReportedUsers
    },
    {
        path: '/reportedEvents',
        name: 'ReportedEvents',
        component: ReportedEvents
    },
    {
        path: '/eventReviews/:id',
        name: 'EventReviews',
        component: EventReviews
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    
    {
        path: '/bannedEvents',
        name: 'BannedEvents',
        component: BannedEvents
    },
    {
        path: '/bannedUsers',
        name: 'BannedUsers',
        component: BannedUsers
    },

    {
        path: '/',
        redirect: { name: 'Login' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
export default router;