import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';
import SendSubletRequest from "./SendSubletRequest";

class DisplayPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sendRequestMode: false
        }

        this.handleSubletRequest = this.handleSubletRequest.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    convertDate(date) {
        date = new Date(date);
        let dateArray = date.toDateString().split(' ');
        dateArray.shift();
        return dateArray.join(' ');
    }

    handleSubletRequest() {
        this.setState({sendRequestMode: true})
    }

    handleCancel() {
        this.setState({sendRequestMode: false})
    }

    render() {
        // style={{backgroundImage: `url(${this.props.post.residencePictureLink})`}}
        return ((!this.state.sendRequestMode) ? <section className="post">
                <div className="img-container"><img src={this.props.post.residencePictureLink}/></div>
                <div className="post-info">
                    <h2><a href={this.props.post.residenceInfoLink}>{this.props.post.residence} </a></h2>

                    <h2><a href={this.props.post.unitTypeLink}>{this.props.post.unitType}</a></h2>

                    <h3>{this.convertDate(this.props.post.startDate)} - {this.convertDate(this.props.post.endDate)}</h3>
                    <h3 className="price">${this.props.post.price}</h3>
                    <div>Floor {this.props.post.floor}</div>
                    <div>{this.props.post.building}</div>
                    {(this.props.post.genderRestriction = "None") ? null :
                        <div>{this.props.post.genderRestriction} only</div>}
                    <div>{this.props.post.kitchens} kitchens</div>
                    <div>{this.props.post.bathrooms} bathrooms</div>
                    <div>{this.props.post.residents - 1} roomates</div>
                    {this.props.post.additionalInfo ?
                        <div>Additional Info: {this.props.post.additionalInfo}</div> : null}
                    {/*<img src={this.props.post.residencePictureLink}/>*/}

                </div>
                <button onClick={this.handleSubletRequest}>SEND SUBLET REQUEST</button>

            </section> :
            <section>
                <SendSubletRequest auth={this.props.auth} postId={this.props.post.postId} handleCancel={this.handleCancel}/>
            </section>)
    }
}

export default DisplayPost;