import React from 'react'
import { Routes, Route } from 'react-router'
import { useLocation } from 'react-router-dom'

import routes from './routes'

import { AppHeader } from './cmps/app-header'
import { BoardDetails } from './pages/board-details'
import { HomepageHeader } from './cmps/homepage-header'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { CardDetails } from './pages/card-details'
import { Dashboard } from './pages/dashboard'

export function RootCmp() {

    const {pathname} = useLocation()

    return (
        <>
            <Provider store={store}>
                {pathname === '/' ? <HomepageHeader /> : pathname !== '/signup' && pathname !== '/login' && <AppHeader />}
                <main className='full'>
                    <Routes>
                        {routes.map(route => <Route key={route.path} exact={true} element={route.component} path={route.path} />)}
                        <Route element={<BoardDetails />} path='/board/:boardId'>
                            <Route element={<CardDetails />} path='/board/:boardId/g/:groupId/c/:cardId' />
                        </Route>
                        <Route element={<Dashboard />} path='/board/:boardId/dashboard' />
                    </Routes>
                </main>
            </Provider>

        </>
    )
}


