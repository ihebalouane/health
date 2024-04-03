import { projectFirestore, auth, isAuthenticated, logout } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      selectedItems: [],
      selectedDay: null,
      videosMap: {
        'Alternating Dumbbell Bench Press': 'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Bulk%2FChest%20program%2FAlternating%20Dumbbell%20Bench%20Press.mp4?alt=media&token=c12945d7-6dbd-428c-b22f-3211ee87b6aa',
        'Item 2': 'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Bulk%2FChest%20program%2FCable%20Crossover.mp4?alt=media&token=01e136ba-3163-4dd6-b0df-2005eb6e84d3',
        'Item 3': '',
        // Add more mappings as needed
      },
      selectedVideo: null,
      days: [],
    };
  },
  mounted() {
    this.calculateDays();
  },
  methods: {
    showItems(day) {
      this.selectedDay = day;
      // Dummy data for demonstration
      switch (day) {
        case 'Monday':
          this.selectedItems = ['Alternating Dumbbell Bench Press', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'];
          break;
        case 'Tuesday':
          this.selectedItems = ['Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12'];
          break;
        case 'Wednesday':
          this.selectedItems = ['Item 13', 'Item 14', 'Item 15', 'Item 16', 'Item 17', 'Item 18'];
          break;
        case 'Thursday':
          this.selectedItems = ['Item 19', 'Item 20', 'Item 21', 'Item 22', 'Item 23', 'Item 24'];
          break;
        case 'Friday':
          this.selectedItems = ['Item 25', 'Item 26', 'Item 27', 'Item 28', 'Item 29', 'Item 30'];
          break;
        case 'Saturday':
          this.selectedItems = ['Item 31', 'Item 32', 'Item 33', 'Item 34', 'Item 35', 'Item 36'];
          break;
        case 'Sunday':
          this.selectedItems = ['Item 37', 'Item 38', 'Item 39', 'Item 40', 'Item 41', 'Item 42'];
          break;
        default:
          this.selectedItems = [];
      }
    },
    loadVideo(item) {
      this.selectedVideo = this.videosMap[item];
    },
    calculateDays() {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const currentDate = new Date();
      const currentDayIndex = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      const nextMonday = new Date(currentDate);
      nextMonday.setDate(currentDate.getDate() + ((7 - currentDayIndex) % 7)); // Calculate next Monday
      for (let i = 0; i < days.length; i++) {
        const dayDate = new Date(nextMonday);
        dayDate.setDate(nextMonday.getDate() + i);
        this.days.push({ name: days[i], date: this.formatDate(dayDate) });
      }
    },
    formatDate(date) {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    },
  },
};
