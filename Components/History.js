import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';
import PostSubletRequests from "./PostSubletRequests";
import HistoryItem from "./HistoryItem";

class CreateSubletPost extends Component {

    constructor(props) {
        super(props);
        let {email, password} = props;

        this.state = {
            auth: {email, password}
        }
    }

    async componentDidMount() {
        let history;
        let data = {auth: this.state.auth};

        try {
            let response = await UBCSubletService.callAPI('getHistory', data);
            let history = response.historyItems.map(({subletee, ...post}) => ({post, subletee}));
            this.setState({history})
        } catch (err) {
        }

    }


    render() {
        return (<section>
            <h1>History</h1>
            {(this.state.history || []).map(({post, subletee}) =>
                <HistoryItem auth={this.state.auth} post={post} subletee={subletee} email={this.state.auth.email}
                             password={this.state.auth.password}/>
            )}
        </section>)
    }
}

export default CreateSubletPost;