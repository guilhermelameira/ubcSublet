import React, {Component} from 'react'
import '../styles/main.less'
import UBCSubletService from '../UBCSubletService.js';
import CreateSubletPostDialog from '../Components/CreateSubletPostDialog.js'
import History from '../Components/History.js'
import SubletRequestsDialog from '../Components/SubletRequestsDialog.js'
import SearchOptionsDialog from "../Components/SearchOptionsDialog";
import PostsArea from "../Components/PostsArea";


class BrowsePostsPage extends Component {

    constructor(props) {
        super(props);
        let email;
        let password;
        if (props.url.query) {
            email = props.url.query.email;
            password = props.url.query.password;
        }

        this.state = {
            auth: {email, password},
            filters: {},
            orderBy: ["price"]
        }

        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.handleApply = this.handleApply.bind(this);
        this.loadPosts = this.loadPosts.bind(this);
    }

    async componentDidMount() {
        if (!this.state.auth) {
            window.location.href = `http://localhost:3000`;
        }
        this.loadPosts();
        try {
            let response = await UBCSubletService.callAPI('getFilterCount', {});
            this.setState({filterOptions: response})
        } catch (err) {
        }
    }

    async loadPosts(e) {
        try {
            let response = await UBCSubletService.callAPI('getFilteredPosts', {
                filters: this.state.filters,
                orderBy: this.state.orderBy
            });
            this.setState({posts: response})
        } catch (err) {
            console.log(err);
        }
    }

    handleFilterChange(key, event) {
        let newFilters = {...this.state.filters};
        newFilters[key] = event.target.value;
        this.setState({filters: newFilters})
    }

    handleOrderChange(event) {
        this.setState({orderBy: [event.target.value]})
    }

    handleApply(event) {
        event.preventDefault();
        this.loadPosts();
    }

    goToMainPage() {
        window.location.href = `http://localhost:3000/mainPage/${this.state.auth.email}/${this.state.auth.password}`;
    }


    render() {
        return (<div>
            <header>
                <button onClick={this.goToMainPage}>SUBLET A ROOM</button>
            </header>
            <main>
                <SearchOptionsDialog filterOptions={this.state.filterOptions}
                                     handleFilterChange={this.handleFilterChange}
                                     filters={this.state.filters} handleApply={this.handleApply}
                                     handleOrderChange={this.handleOrderChange}/>
                <PostsArea auth={this.state.auth} posts={this.state.posts}/>
            </main>

        </div>)
    }
}

export default BrowsePostsPage;