import React from "react";
import "./verification_panel.css"

class VerificationPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            securityCodeText: "",
            secondsUntilInvalid: 120,
            errorMessage: null
        }
        this.timer = 0;
    };

    checkSecurityCode = () =>
    {
        if ( this.state.securityCodeText === this.props.securityCode && this.state.secondsUntilInvalid > 0 )
        {
            clearInterval(this.timer);
            this.props.changeSessionData("Homepage", false, "");
        }
        else
        {
            this.setState({
                securityCodeText: this.state.securityCodeText,
                secondsUntilInvalid: this.state.secondsUntilInvalid,
                errorMessage: "Code is not correct!"
            })
        }
    }

    countdownUpdate = () =>
    {
        if ( this.state.secondsUntilInvalid <= 1 )
        {
            clearInterval(this.timer);
            this.setState({
                securityCodeText: "",
                secondsUntilInvalid: 0,
                errorMessage: null
            })
        }
        this.setState({
            securityCodeText: this.state.securityCodeText,
            secondsUntilInvalid: this.state.secondsUntilInvalid - 1,
            errorMessage: this.state.errorMessage
        })
    }

    renderTextSwitch = () =>
    {
        if ( this.state.secondsUntilInvalid > 0 )
        {
            return (
                <div>
                    <div>
                    <p> An email with a security code was sent to { this.props.loggedUser }.</p>
                    <p> To continue please input the security code below.</p>
                    <p> The code is valid for two minutes. ({this.state.secondsUntilInvalid})</p>
                    <p>{ this.props.securityCode }</p>
                    <input value = {this.state.securityCodeText}
                           type = "text"
                           onChange = { (e) =>
                           { this.setState( {
                               securityCodeText: e.target.value,
                               secondsUntilInvalid: this.state.secondsUntilInvalid,
                               errorMessage: null
                           })}}
                    />
                    { this.state.errorMessage === null ? null :
                        <p className = {"errorText"}>{this.state.errorMessage}</p>
                    }
                    </div>
                    <div style = {{marginTop: "1%"}}>
                        <button style = {{marginRight: "10px"}}
                                onClick = { () => {this.checkSecurityCode()}}>Verify
                        </button>
                        <button onClick = { () => {this.props.changeSessionData("LogInPanel", "", "")} }>Back</button>
                    </div>
                </div>
            )
        }
        else
        {
            return (
                <div>
                    <div>
                        <p>The security code sent to {this.props.loggedUser} expired.</p>
                        <p>Please go back to Login screen and request a new code.</p>
                    </div>
                    <div style = {{marginTop: "1%"}}>
                        <button onClick={ () => {this.props.changeSessionData("LogInPanel", "", "")} }>Back</button>
                    </div>
                </div>
            )
        }
    }

    componentDidMount() {
        this.timer = setInterval(this.countdownUpdate, 1000)
    }

    render() {
        return (
            <div>
                {this.renderTextSwitch()}
            </div>
        )
    }
}
export default VerificationPanel;