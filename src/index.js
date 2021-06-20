import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { StoreProvider } from "./hooks";

ReactDOM.render(
	<React.StrictMode>
		<StoreProvider>
			<Router>
				<App />
			</Router>
		</StoreProvider>
	</React.StrictMode>,
	document.getElementById("root")
);