import './app.less'
import React, {Component,PropTypes} from 'react'
import ReactDOM from 'react-dom'
import ImageUpload from '../src/Upload'
import packageJson from '../package.json'
class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="app">
                <h1>{packageJson.name}</h1>
                <h2>{packageJson.description}</h2>
                <form>
                    <ImageUpload />
                </form>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
