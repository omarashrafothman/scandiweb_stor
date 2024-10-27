import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/header/Header';

export default class MainLayout extends Component {

    render() {


        const params = window.location.pathname.split('/')[1];

        return (
            <>

                <Header params={params} />
                <Outlet />
            </>
        )
    }
}
