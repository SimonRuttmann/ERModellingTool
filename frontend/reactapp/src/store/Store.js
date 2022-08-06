import { configureStore} from "@reduxjs/toolkit";
import relationalContentSlice from "./RelationalContentSlice";
import erContentSlice from "./ErContentSlice";


export const store = configureStore({
    reducer: {
        erContent: erContentSlice,
        relationalContent: relationalContentSlice
    }
})

export default store;