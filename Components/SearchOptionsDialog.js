import React, {Component} from 'react'
import UBCSubletService from '../UBCSubletService.js';
import HistoryItem from "./HistoryItem";


class SearchOptionsDialog extends Component {

    constructor(props) {
        super(props);
    }


    getFilterName(key) {
        const keyToNameMap = {
            residence: "residence",
            unitType: "room type",
            kitchens: "number of kitchens",
            bathrooms: "number of bathrooms",
            residents: "number of residents"
        }

        return keyToNameMap[key];
    }

    isSelected(key, value) {
        if (!this.props.filters[key]) {
            if (!value) {
                return true
            }
            return false
        }
        if (this.props.filters[key] == value) {
            return true
        }
        return false;
    }


    render() {

        return (<section>
            <form onSubmit={this.props.handleApply}>

                <h1>Search Options</h1>
                {
                    Object.entries(this.props.filterOptions || {}).map(([key, options]) =>
                        <div>
                            <label>Filter by {this.getFilterName(key)}</label>
                            <select onChange={(e) => {
                                this.props.handleFilterChange(key, e)
                            }}>
                                <option value="" selected>Any</option>
                                {(options || []).map(({value, count}) =>
                                    this.isSelected(key, value) ?
                                        <option value={value} selected>{value} ({count} posts)</option> :
                                        <option value={value}>{value} ({count} posts)</option>
                                )}
                            </select>
                        </div>
                    )
                }

                <div>
                    <label>Sort By</label>
                    <select onChange={this.props.handleOrderChange}>
                        <option value="price" selected>Price</option>
                        <option value="startDate">Start Date</option>
                        <option value="endDate">End Date</option>
                        <option value="building">Building</option>
                        <option value="residence">Residence</option>
                        <option value="floor">Floor</option>
                        <option value="unitType">Unit Type</option>
                        <option value="kitchens">Number of kitchens</option>
                        <option value="bathrooms">Number of bathrooms</option>
                        <option value="residents">Number of roommates</option>
                    </select>
                </div>

                <input type="submit" value="APPLY"/>
            </form>
        </section>)
    }
}

export default SearchOptionsDialog;