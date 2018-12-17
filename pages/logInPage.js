import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';
import '../styles/main.less'


class LogInPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logInInvalid: false,
            signUpInvalid: false
        };

        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogInEmailChange = this.handleLogInEmailChange.bind(this);
        this.handleLogInPasswordChange = this.handleLogInPasswordChange.bind(this);

        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleSignUpEmailChange = this.handleSignUpEmailChange.bind(this);
        this.handleSignUpPasswordChange = this.handleSignUpPasswordChange.bind(this);
    }

    async handleLogIn(event) {
        event.preventDefault();
        let data = {
            email: this.state.logInEmail,
            password: this.state.logInPassword
        };
        try {
            let response = await UBCSubletService.callAPI('logIn', data);
            this.setState({logInInvalid: false});
            window.location.href = `http://localhost:3000/mainPage/${this.state.logInEmail}/${this.state.logInPassword}`;
        } catch (err) {
            this.setState({logInInvalid: true});
        }
    }

    handleLogInEmailChange(event) {
        this.setState({logInEmail: event.target.value});
    }

    handleLogInPasswordChange(event) {
        this.setState({logInPassword: event.target.value});
    }


    async handleSignUp(event) {
        event.preventDefault();
        let data = {
            email: this.state.signUpEmail,
            password: this.state.signUpPassword
        };

        try {
            let response = await UBCSubletService.callAPI('signUp', data);
            this.setState({signUpInvalid: false});
            window.location.href = `http://localhost:3000/mainPage/${this.state.signUpEmail}/${this.state.signUpPassword}`;
        } catch (err) {
            this.setState({signUpInvalid: true});
        }
    }

    handleSignUpEmailChange(event) {
        this.setState({signUpEmail: event.target.value});
    }

    handleSignUpPasswordChange(event) {
        this.setState({signUpPassword: event.target.value});
    }

    render() {
        return (<div>
            <header>
                <form onSubmit={this.handleLogIn}>
                    <input type="email" placeholder="Email" required
                           onChange={this.handleLogInEmailChange}
                           className={`input-field ${this.state.logInInvalid ? 'invalid' : ''}`}/>
                    <input type="password" placeholder="Password" required
                           onChange={this.handleLogInPasswordChange}
                           className={`input-field ${this.state.logInInvalid ? 'invalid' : ''}`}/>
                    <input type="submit" value="LOG IN"/>
                </form>
            </header>
            <main>
                <section>
                    <form onSubmit={this.handleSignUp}>
                        <h1>Sing Up</h1>
                        <input type="email" placeholder="Email" required
                               onChange={this.handleSignUpEmailChange}
                               className={`input-field ${this.state.signUpInvalid ? 'invalid' : ''}`}/>
                        <input type="password" placeholder="Password" required
                               onChange={this.handleSignUpPasswordChange}
                               className={`input-field ${this.state.signUpInvalid ? 'invalid' : ''}`}/>
                        <input type="submit" value="SIGN UP"/>
                    </form>
                </section>
            </main>
        </div>)
    }
}

export default LogInPage;