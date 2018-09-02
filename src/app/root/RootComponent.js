import React from 'react';
import "../../sass/style.scss";

class RootComponent extends React.PureComponent {
    constructor() {
        super(...arguments);
    }

    render(){

        return(
            <div>
                Hey there...
            </div>
        );
    }
}

export default RootComponent;
