import { createContext, useContext } from "react";

import Store from "./store";

const StoreContext = createContext();
const StoreProvider = ({ children }) => {
	const store = new Store();

	store.init();

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
const useStore = () => useContext(StoreContext);

export {
    useStore,
    StoreProvider
}