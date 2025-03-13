import { create } from 'zustand';

const useThemeStore = create((set) => ({
    isDarkTheme: JSON.parse(localStorage.getItem('isDarkTheme')) ?? true, // Get from localStorage or default to true
    toggleTheme: () => set((state) => {
        const newTheme = !state.isDarkTheme;
        localStorage.setItem('isDarkTheme', JSON.stringify(newTheme)); // Store in localStorage
        return { isDarkTheme: newTheme };
    }),
}));

export default useThemeStore;
