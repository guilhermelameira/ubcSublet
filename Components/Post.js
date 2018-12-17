import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';

class Post extends Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    async handleDelete() {
        let data = {auth: this.props.auth, postId: this.props.post.postId}

        try {
            let response = await UBCSubletService.callAPI('deletePost', data);
            location.reload();
        } catch (err) {
        }

    }

    convertDate(date) {
        date = new Date(date);
        let dateArray = date.toDateString().split(' ');
        dateArray.unshift();
        dateArray.pop();
        return dateArray.join(' ');
    }

    render() {
        return (<div>
            <div>{this.props.post.residence} {this.props.post.unitType}</div>
            <div>{this.convertDate(this.props.post.startDate)} - {this.convertDate(this.props.post.endDate)}</div>
            <div>${this.props.post.price}</div>
            <button onClick={this.handleDelete}>DELETE</button>
        </div>)
    }
}

export default Post;