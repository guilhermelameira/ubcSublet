import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';

class SendSubletRequest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSubletee: false,
            sent: false
        }

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleContactDescriptionChange = this.handleContactDescriptionChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }

    async componentDidMount() {
        try {
            let response = await UBCSubletService.callAPI('getSubleteeInfo', {auth: this.props.auth});
            let {firstName, lastName, contactDescription} = response
            this.setState({firstName, lastName, contactDescription, isSubletee: true})
        } catch (err) {
        }

    }

    handleFirstNameChange(event) {
        this.setState({firstName: event.target.value});
    }

    handleLastNameChange(event) {
        this.setState({lastName: event.target.value});
    }

    handleContactDescriptionChange(event) {
        this.setState({contactDescription: event.target.value});
    }

    handleMessageChange(event) {
        this.setState({message: event.target.value});
    }

    async handleSend(event) {
        event.preventDefault();

        if (!this.state.isSubletee) {
            try {
                let data = {
                    auth: this.props.auth,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    contactInfo: this.state.contactDescription
                };
                let response = await UBCSubletService.callAPI('createSubleteeInfo', data);
                this.setState({isSubletee: true})
            } catch (err) {
                alert("error")
                return;
            }
        }

        try {
            let data = {
                auth: this.props.auth,
                postId: this.props.postId,
                message: this.state.message
            };
            let response = await UBCSubletService.callAPI('createSubletRequest', data);
            this.setState({sent: true})
        } catch (err) {
            alert("error")
            return;
        }
    }


    render() {
        return (this.state.sent ?
                <p> Request sent!</p> : this.state.isSubletee ?
                    <form onSubmit={this.handleSend}>
                        <textarea type="text" placeholder="Message" required
                                  onChange={this.handleMessageChange}/>

                        <input type="submit" value="SEND"/>
                        <button onClick={this.props.handleCancel} className="secondary">CANCEL</button>
                    </form> :
                    <form onSubmit={this.handleSend}>
                        <input type="text" placeholder="First Name" required
                               onChange={this.handleFirstNameChange}/>

                        <input type="text" placeholder="Last Name" required
                               onChange={this.handleLastNameChange}/>
                        <textarea type="text" placeholder="Contact Description" required
                                  onChange={this.handleContactDescriptionChange}/>

                        <textarea type="text" placeholder="Message" required
                                  onChange={this.handleMessageChange}/>

                        <input type="submit" value="SEND"/>
                        <button onClick={this.props.handleCancel} className="secondary">CANCEL</button>
                    </form>
        )

    }
}

export default SendSubletRequest;