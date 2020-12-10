import React from "react";
import "./login_panel.css"
import * as emailjs from 'emailjs-com'
import{ init } from 'emailjs-com';
init("user_FKs2faJfpfcvA31hEtYyw");

class LogInPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            emailText: "",
            passwordText: ""
        }
    };

    checkCredentials = () => { return this.state.emailText.trim() !== "" && this.state.passwordText.trim() !== ""; }

    sendEmail = () =>
    {
        let securityCode = Math.floor( Math.random() * 8999 + 1000 ).toString();
        let messageTest = "Your one time password for login is " + securityCode + ".";

        let localChangeSessionDataFunc = (component, user, securityPassword ) =>
        { return this.props.changeSessionData(component, user, securityPassword)};
        let localEmailText = this.state.emailText;
        let templateParams = {
            to_email: this.state.emailText,
            subject: "Account verification",
            message: messageTest
        }
        emailjs.send(
            "default_service",
            "template_wu7rg6p",
            templateParams
        ).then(function(response) {
            console.log("Email sent successfully!", response.status, response.text);
            localChangeSessionDataFunc("VerificationPanel", localEmailText, securityCode);
        }, function(error) {
            console.log("Email sending failed...", error);
        });
        // for testing purposes only, will be removed
        //localChangeSessionDataFunc("VerificationPanel", localEmailText, securityCode);
    }

    validateAndSend = () =>
    {
        if ( !this.checkCredentials() )
        {
            console.log('FAILED... 1');
            return;
        }
        this.sendEmail();

    }

    render() {
        return (
            <div>
                <h2>To see the secured content please login below.</h2>
                <div style = {{display: "inline-grid"}}>
                    <div>
                        <p className = "input-label"> Email: </p>
                        <input value = {this.state.emailText}
                               type="text"
                               onChange = { (e) =>
                                    { this.setState( { emailText: e.target.value,
                                                             passwordText: this.state.passwordText})}}/>
                    </div>
                    <div>
                        <p className = "input-label"> Password: </p>
                        <input value = {this.state.passwordText}
                               type="text"
                               onChange = { (e) =>
                                    { this.setState( { emailText: this.state.emailText,
                                                             passwordText: e.target.value})}}/>
                    </div>
                    <div style = {{margin: "auto"}}>
                        <button onClick={ () => { this.validateAndSend() }}>Log In</button>
                    </div>
                </div>
            </div>
        )
    }
}
export default LogInPanel;