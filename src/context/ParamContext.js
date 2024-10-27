import React, { createContext, Component } from "react";

export const ParamContext = createContext();

export class ParamProvider extends Component {
    state = {
        param: window.location.pathname.split('/')[1] || 'all',
    };

    setParam = (newParam) => {
        this.setState({ param: newParam });
        window.history.pushState({}, '', `/${newParam}`);
    };

    render() {
        return (
            <ParamContext.Provider
                value={{
                    param: this.state.param,
                    setParam: this.setParam,
                }}
            >
                {this.props.children}
            </ParamContext.Provider>
        );
    }
}