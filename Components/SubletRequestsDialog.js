import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';
import CreateSubletPostDialog from "./CreateSubletPostDialog";
import PostSubletRequests from "./PostSubletRequests";

class SubletRequestsDialog extends Component {

    constructor(props) {
        super(props);
        let {auth} = props;

        this.state = {
            auth,
            requests: []
        }
    }

    async componentDidMount() {
        let requests;
        let data = {auth: this.state.auth};

        try {
            let reponse = await UBCSubletService.callAPI('getSubletRequests', data);
            requests = reponse.posts.map(post => ({post: post, requests: []}));
            reponse.requests.forEach(request => {
                requests.forEach(r => {
                    if (r.post.postId == request.postId) {
                        r.requests.push(request);
                    }
                })
            });
            this.setState({requests});
        } catch (err) {
        }
    }


    render() {
        return (<section>
            <h1>Sublet Posts</h1>
            {(this.state.requests || []).map(({post, requests}) =>
                <PostSubletRequests post={post} requests={requests} auth={this.state.auth}/>
            )}
        </section>)
    }
}

export default SubletRequestsDialog;