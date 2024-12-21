import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userSlice } from './features/userSlice';
import { socketSlice } from './features/socketSlice';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

// Set up the socket connection

// Instead of defining the reducer separately, directly use the generated reducer from userSlice
const rootReducer = combineReducers({
  auth: userSlice.reducer,
  socket: socketSlice.reducer,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   // reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// export const persistor = persistStore(store);

export const store = configureStore({
  reducer: rootReducer,
});

