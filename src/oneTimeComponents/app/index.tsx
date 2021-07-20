import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { DevelopmentSignIn } from "../developmentSignIn";
import { Companies } from "../companies";

export function App() {
    return (
        <Router>
            <Route path="/development-sign-in" exact>
                <DevelopmentSignIn />
            </Route>
            <Route path="/companies" exact>
                <Companies />
            </Route>
        </Router>
    );
}
