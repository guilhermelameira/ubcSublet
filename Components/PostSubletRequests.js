import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';
import Post from "./Post";
import SubleteeInfo from "./SubleteeInfo";

class PostSubletRequests extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isAccepted: false
        }

        this.handleAcceptRequest = this.handleAcceptRequest.bind(this);

    }

    refresh() {
        location.reload();
    }

    async handleAcceptRequest() {

        let data = {auth: this.props.auth, postId: this.props.post.postId, subleteeEmail: this.props.requests[0].email}

        try {
            let response = await UBCSubletService.callAPI('acceptSubletRequest', data);
            let subletee = {
                firstName: response.subletRequestFirstName,
                lastName: response.subletRequestLastName,
                email: response.subletRequestEmail,
                contactDescription: response.subletRequestContactInfo,
                message: response.subletRequestMessage
            }

            this.setState({isAccepted: true, subletee});
        } catch (err) {
        }
    }


    render() {
        return (<div>
            <Post post={this.props.post} auth={this.props.auth}/>

            {(this.state.isAccepted && this.state.subletee) ?
                <SubleteeInfo subletee={this.state.subletee}
                              btn={<button onClick={this.refresh}>GOT IT</button>}/> :
                <div>
                    <div>{this.props.requests.length} Sublet Requests</div>
                    {this.props.requests.length ?
                        <button onClick={this.handleAcceptRequest}>ACCEPT ONE</button> : null}

                </div>}

        </div>)
    }
}

export default PostSubletRequests;