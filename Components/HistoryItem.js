import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';
import Post from "./Post";
import SubleteeInfo from "./SubleteeInfo";

class HistoryItem extends Component {

    constructor(props) {
        super(props);

    }


    render() {
        return (<div>
            <Post auth={this.props.auth} post={this.props.post}/>
            <SubleteeInfo subletee={this.props.subletee}/>
        </div>)
    }
}

export default HistoryItem;