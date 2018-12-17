import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';
import DisplayPost from "./DisplayPost";

class PostsArea extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="posts-container">
            <div className="posts">

                {(this.props.posts || []).map(post =>
                    <DisplayPost auth={this.props.auth} post={post}/>
                )}
            </div>

        </div>)
    }
}

export default PostsArea;