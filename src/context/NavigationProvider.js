// NavigationContext.js
import React, { createContext, Component } from 'react';

export const NavigationContext = createContext();

export class NavigationProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedParam: this.getSelectedParam(),
        };
    }

    getSelectedParam = () => {
        const pathSegments = window.location.pathname.split('/');


        if (pathSegments.length > 2) {

            return pathSegments[2];
        }

        return pathSegments[1] || "all";

    };

    setSelectedParam = (param) => {
        this.setState({ selectedParam: param });
    };

    componentDidMount() {
        window.onpopstate = () => {
            this.setState({ selectedParam: this.getSelectedParam() });
        };
    }






    render() {
        return (
            <NavigationContext.Provider
                value={{
                    selectedParam: this.state.selectedParam,
                    setSelectedParam: this.setSelectedParam,
                }}
            >
                {this.props.children}
            </NavigationContext.Provider>
        );
    }
}
