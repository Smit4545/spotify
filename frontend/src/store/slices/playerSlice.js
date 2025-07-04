import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSong: null,
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  isPaused: false,
  volume: 0.4,
  currentTime: 0,
  duration: 0,
  audioElement: null,
  repeat: "none", // 'none', 'one', 'all'
  shuffle: false,
  originalQueue: [],
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setAudioElement: (state, action) => {
      state.audioElement = action.payload;
    },
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
      state.originalQueue = [...action.payload];
      state.currentIndex = 0;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
      if (state.queue.length === 1) {
        state.currentSong = action.payload;
      }
    },
    removeFromQueue: (state, action) => {
      const index = action.payload;
      state.queue.splice(index, 1);
      if (state.currentIndex >= state.queue.length) {
        state.currentIndex = Math.max(0, state.queue.length - 1);
      }
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
      if (state.queue[action.payload]) {
        state.currentSong = state.queue[action.payload];
      }
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
      state.isPaused = !action.payload;
    },
    setIsPaused: (state, action) => {
      state.isPaused = action.payload;
      state.isPlaying = !action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
      if (state.audioElement) {
        state.audioElement.volume = action.payload;
      }
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setRepeat: (state, action) => {
      state.repeat = action.payload;
    },
    setShuffle: (state, action) => {
      state.shuffle = action.payload;
      if (action.payload) {
        // Shuffle the queue
        const shuffled = [...state.queue];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        state.queue = shuffled;
      } else {
        // Restore original queue
        state.queue = [...state.originalQueue];
      }
    },
    nextSong: (state) => {
      if (state.queue.length === 0) return;

      if (state.repeat === "one") {
        // Stay on same song
        return;
      }

      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
        state.currentSong = state.queue[state.currentIndex];
      } else {
        // Always loop back to first song
        state.currentIndex = 0;
        state.currentSong = state.queue[0];
      }
    },
    previousSong: (state) => {
      if (state.queue.length === 0) return;

      if (state.repeat === "one") {
        // Stay on same song
        return;
      }

      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentSong = state.queue[state.currentIndex];
      } else if (state.repeat === "all") {
        // Loop to last song
        state.currentIndex = state.queue.length - 1;
        state.currentSong = state.queue[state.currentIndex];
      } else {
        // Stop playing
        state.isPlaying = false;
        state.isPaused = true;
      }
    },
    playSong: (state, action) => {
      const song = action.payload;
      state.currentSong = song;
      state.isPlaying = true;
      state.isPaused = false;

      // If song is not in queue, add it
      const songIndex = state.queue.findIndex((s) => s._id === song._id);
      if (songIndex === -1) {
        state.queue.push(song);
        state.currentIndex = state.queue.length - 1;
      } else {
        state.currentIndex = songIndex;
      }
    },
    playPlaylist: (state, action) => {
      const { songs, startIndex = 0 } = action.payload;
      state.queue = songs;
      state.originalQueue = [...songs];
      state.currentIndex = startIndex;
      state.currentSong = songs[startIndex];
      state.isPlaying = true;
      state.isPaused = false;
    },
    clearQueue: (state) => {
      state.queue = [];
      state.originalQueue = [];
      state.currentIndex = 0;
      state.currentSong = null;
      state.isPlaying = false;
      state.isPaused = true;
    },
    reset: (state) => {
      state.currentTime = 0;
      state.duration = 0;
    },
  },
});

export const {
  setAudioElement,
  setCurrentSong,
  setQueue,
  addToQueue,
  removeFromQueue,
  setCurrentIndex,
  setIsPlaying,
  setIsPaused,
  setVolume,
  setCurrentTime,
  setDuration,
  setRepeat,
  setShuffle,
  nextSong,
  previousSong,
  playSong,
  playPlaylist,
  clearQueue,
  reset,
} = playerSlice.actions;

export default playerSlice.reducer;
