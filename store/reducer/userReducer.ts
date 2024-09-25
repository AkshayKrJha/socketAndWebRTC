import { socketic } from "@/components/Socket";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    users: [],
    currentUserID: null,
    isUserConnected: false,
    testEvent: [],
    oldUsers: [],
    metzages: [],
  } as {
    users: any[];
    currentUserID: any;
    isUserConnected: any;
    testEvent: any;
    oldUsers: any;
    metzages: any;
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUserID = action.payload;
    },
    setIsUserConnected: (state, action) => {
      state.isUserConnected = action.payload;
    },
    setTestEvent: (state, action) => {
      state.testEvent = [...state.testEvent, action.payload];
    },
    adduser: (state, action) => {
      state.users?.push(action.payload);
    },
    addUsers: (state, action) => {
      console.log(
        "Add Users when joined as new user",
        state.users,
        action.payload,
        [...state.users, ...action.payload]
      );
      state.users = [...state.users, ...action.payload];
      state.oldUsers = [...action.payload];
    },
    redUserbyID: (state, action) => {
      if (action.payload?.userID === state.currentUserID)
        state.currentUserID = null;
      state.users = state.users.filter((v) => {
        const condition = v?.userID !== action.payload?.userID;
        return condition;
      });
      state.metzages = state.metzages?.filter(
        (v: any) => v?.for !== action.payload?.userID
      );
    },
    delUsers: (state) => {
      state.metzages = []; //to be reviewed
      state.users = [];
      state.oldUsers = [];
      state.currentUserID = null;
    },
    clearUnread: (state, action) => {
      state.users = state.users?.map((v) => {
        if (v?.userId === action.payload) v.unreadMetzageCount = 0;
        return v;
      });
    },
    addMetzage: (state, action) => {
      const { content, from, received } = action.payload;
      // const metzagesList = state.metzages?.get(from);
      // const metzagesList = state.metzages?.filter((v: any) => {
      //   v?.for === from;
      // });
      // console.log("Previous metzages", metzagesList);
      state.metzages?.push({
        message: content,
        for: from,
        received,
        timeStamp: +new Date(),
      });
      // const newMetzages = state.metzages?.get(from);
      // state.metzages?.set(from, metzagesList);
    },
    /**
     * add a czat
     * add previous czats
     */
    addCzat: (state, action) => {
      // state.users
      // search the user and add metzage
      // given: userID, metzage to add
      state.users = state.users?.map((v) => {
        if (v?.userID === action.payload?.from) {
          // check if messages array is blank
          // console.log("Call to add message");
          if (!v.messages) v.messages = [];
          if (!v.unreadMetzageCount) v.unreadMetzageCount = 0;
          if (
            action.payload?.from === state.currentUserID ||
            !action.payload?.received
          ) {
            v.unreadMetzageCount = 0;
          } else v.unreadMetzageCount += 1;
          console.log("Metzage Content", action.payload.content);
          v.messages.push({
            message: action.payload.content,
            received: action.payload.received,
            timeStamp: +new Date(),
          });
          return v;
        }
        return v; // may be redundant
      });
    },
  },
});

export const {
  addCzat,
  adduser,
  redUserbyID,
  addUsers,
  delUsers,
  setUser,
  clearUnread,
  setIsUserConnected,
  setTestEvent,
  addMetzage,
} = socketSlice.actions;

export default socketSlice.reducer;

const selectMetzagesList = (state: RootState) => {
  return state.socketReducer.metzages;
};

const selectCurrentUser = (state: RootState) =>
  state.socketReducer.currentUserID;

const selectMetzages = createSelector(
  [selectMetzagesList, selectCurrentUser],
  (list: any, to: any) => list?.filter((v: any) => v?.for === to)
);
export { selectMetzages };
