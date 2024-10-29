import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/header/Header';
import { NavigationProvider } from '../context/NavigationProvider';

export default class MainLayout extends Component {

    render() {


        const params = window.location.pathname.split('/')[1];

        return (
            <>
                <NavigationProvider>
                    <Header params={params} />
                    <Outlet />
                </NavigationProvider>
            </>
        )
    }
}
