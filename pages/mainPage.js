import React, {Component} from 'react'
import '../styles/main.less'
import UBCSubletService from '../UBCSubletService.js';
import CreateSubletPostDialog from '../Components/CreateSubletPostDialog.js'
import History from '../Components/History.js'
import SubletRequestsDialog from '../Components/SubletRequestsDialog.js'


class MainPage extends Component {

    constructor(props) {
        super(props);
        let {query: {email, password}} = props.url;

        this.state = {
            auth: {email, password}
        }

        this.goToPostBrowser = this.goToPostBrowser.bind(this);
    }

    componentDidMount() {
        if (!this.state.auth) {
            window.location.href = `http://localhost:3000`;
        }
    }

    goToPostBrowser() {
        window.location.href = `http://localhost:3000/browsePostsPage/${this.state.auth.email}/${this.state.auth.password}`;
    }


    render() {
        return (<div>
            <header>
                <button onClick={this.goToPostBrowser}>FIND A ROOM</button>
            </header>
            <main>
                <CreateSubletPostDialog auth={this.state.auth}/>
                <SubletRequestsDialog auth={this.state.auth}/>
                <History email={this.state.auth.email} password={this.state.auth.password}/>
            </main>
        </div>)
    }
}

export default MainPage;