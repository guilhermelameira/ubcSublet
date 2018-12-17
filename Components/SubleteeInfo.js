import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';

class SubleteeInfo extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="subletee-info">
            <div>{this.props.subletee.firstName}</div>
            <div>{this.props.subletee.lastName}</div>
            <div>{this.props.subletee.email}</div>
            <div>{this.props.subletee.contactDescription}</div>
            <div>{this.props.subletee.message}</div>
            {this.props.btn}
        </div>)
    }
}

export default SubleteeInfo;