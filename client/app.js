import {React} from 'react';
import {ReactDOM} from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));

class MyNestedComponent extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <input type='text'></input>
    }
}

class MyComponent extends React.Component {
    constructor() {
        super();
    }

    render() {
        return
        <div>
            <MyNestedComponent/>
        </div>
    }

}


root.render(
    <MyComponent/>
);