import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';


class CreateSubletPostDialog extends Component {

    constructor(props) {
        super(props);
        let {auth} = props;

        this.state = {
            auth,
            postInvalid: false,
            startDate: null,
            endDate: null,
            price: null,
            additionalInfo: null,
            residence: null,
            building: null,
            floor: null,
            roomNumber: null,
            unitType: null,
            genderRestrictions: null,
            dropDownOptions: {
                residences: null,
                unitTypes: null,
                genderRestrictions: null
            }
        }

        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleAdditionalInfoChange = this.handleAdditionalInfoChange.bind(this);
        this.handleBuildingChange = this.handleBuildingChange.bind(this);
        this.handleFloorChange = this.handleFloorChange.bind(this);
        this.handleResidenceChange = this.handleResidenceChange.bind(this);
        this.handleUnitTypeChange = this.handleUnitTypeChange.bind(this);
        this.handleGenderRestrictionsChange = this.handleGenderRestrictionsChange.bind(this);
        this.handleRoomNumberChange = this.handleRoomNumberChange.bind(this);
        this.handleCreatePost = this.handleCreatePost.bind(this);
    }

    async componentDidMount() {
        try {
            let response = await UBCSubletService.callAPI('getCreatePostInfo', {});
            this.setState({dropDownOptions: {...response, genderRestrictions: ['Male', 'Female', 'None']}});
        } catch (err) {
        }
    }

    handlePriceChange(event) {
        this.setState({price: event.target.value});
    }

    handleStartDateChange(event) {
        this.setState({startDate: event.target.value});
    }

    handleEndDateChange(event) {
        this.setState({endDate: event.target.value});
    }

    handleAdditionalInfoChange(event) {
        this.setState({additionalInfo: event.target.value});
    }

    handleBuildingChange(event) {
        this.setState({building: event.target.value});
    }

    handleFloorChange(event) {
        this.setState({floor: event.target.value});
    }

    handleRoomNumberChange(event) {
        this.setState({roomNumber: event.target.value});
    }

    handleResidenceChange(event) {
        this.setState({residence: event.target.value});
    }

    handleUnitTypeChange(event) {
        this.setState({unitType: event.target.value});
    }

    handleGenderRestrictionsChange(event) {
        this.setState({genderRestrictions: event.target.value});
    }

    async handleCreatePost(event) {
        event.preventDefault();
        let data = {
            auth: this.state.auth,
            price: this.state.price,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            additionalInfo: this.state.additionalInfo,
            room: {
                roomNumber: this.state.roomNumber,
                residence: this.state.residence,
                building: this.state.building,
                floor: this.state.floor,
                unitType: this.state.unitType,
                genderRestrictions: this.state.genderRestrictions
            }
        };

        try {
            let response = await UBCSubletService.callAPI('createPost', data);
            location.reload();
        } catch (err) {
            this.setState({postInvalid: true});
        }
    }


    render() {
        let inputFieldClass = `input-field ${this.state.postInvalid ? 'invalid' : ''}`;

        return (<section>
            <form onSubmit={this.handleCreatePost} className={`${this.state.postInvalid ? 'invalid' : ''}`}>
                <h1>Sublet Your Room</h1>

                <select required onChange={this.handleResidenceChange}>
                    <option value="" disabled selected>Select Residence</option>
                    {(this.state.dropDownOptions.residences || []).map(res =>
                        <option value={res}>{res}</option>
                    )}
                </select>
                <input type="text" placeholder="Building" required onChange={this.handleBuildingChange}/>
                <input type="number" min="1" maxlength="2" placeholder="Floor" required onChange={this.handleFloorChange}/>
                <input type="number" min="1" maxlength="4" placeholder="Room Number" required
                       onChange={this.handleRoomNumberChange}/>
                <select required onChange={this.handleUnitTypeChange}>
                    <option value="" disabled selected>Select Unit Type</option>
                    {(this.state.dropDownOptions.unitTypes || []).map(res =>
                        <option value={res}>{res}</option>
                    )}
                </select>
                <select required onChange={this.handleGenderRestrictionsChange}>
                    <option value="" disabled selected>Select Gender Restrictions</option>
                    {(this.state.dropDownOptions.genderRestrictions || []).map(res =>
                        <option value={res}>{res}</option>
                    )}
                </select>
                <input type="text" placeholder="Start Date" required onChange={this.handleStartDateChange}/>
                <input type="text" placeholder="End Date" required onChange={this.handleEndDateChange}/>
                <input type="number" min="0" maxlength="4" placeholder="Price" required onChange={this.handlePriceChange}/>
                <textarea placeholder="Additional Information" required onChange={this.handleAdditionalInfoChange}/>

                <input type="submit" value="CREATE POST"/>
            </form>
        </section>)
    }
}

export default CreateSubletPostDialog;