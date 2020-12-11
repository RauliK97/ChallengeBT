import './App.css';
import React from "react";
import LogInPanel from "./authentication/login_panel";
import VerificationPanel from "./authentication/verification_panel";
import Homepage from "./content/homepage";

class App extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            activeComponent: "Homepage",
            loggedUser: "",
            securityCode: ""
        }
    };

    changeCurrentSession = (component, user, securityCode) =>
    {
        this.setState({
            activeComponent: component === false ? this.state.activeComponent : component,
            loggedUser: user === false ? this.state.loggedUser : user,
            securityCode: securityCode === false ? this.state.securityCode : securityCode
        })
    }

    renderComponentSwitch = () =>
    {
        switch (this.state.activeComponent)
        {
            case "LogInPanel":
                return <LogInPanel changeSessionData = {this.changeCurrentSession}/>;
            case "VerificationPanel":
                return <VerificationPanel changeSessionData = {this.changeCurrentSession}
                                          loggedUser = {this.state.loggedUser}
                                          securityCode = {this.state.securityCode}
                />
            case "Homepage":
                return <Homepage changeSessionData = {this.changeCurrentSession}/>;
            default:
                return;
        }
    }

    render = () =>
    {
        return (
        <div className="App">
            {
                this.renderComponentSwitch()
            }
        </div>
        );
    }
}

export default App;
