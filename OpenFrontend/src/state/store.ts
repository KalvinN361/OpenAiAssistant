import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {},
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
