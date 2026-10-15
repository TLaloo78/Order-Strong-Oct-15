import type { RouteObject } from 'react-router'
import { Layout } from './components/Layout'
import { AccountPage } from './features/auth/AccountPage'
import { LoginPage } from './features/auth/LoginPage'
import { ResetPasswordPage } from './features/auth/ResetPasswordPage'
import { DishSheet } from './features/dishes/DishSheet'
import { HomePage } from './features/restaurants/HomePage'
import { RestaurantPage } from './features/restaurants/RestaurantPage'
import { SavedPage } from './features/saved/SavedPage'
import { NotFoundPage } from './NotFoundPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'r/:restaurantId',
        element: <RestaurantPage />,
        children: [{ path: 'dish/:dishId', element: <DishSheet /> }],
      },
      { path: 'saved', element: <SavedPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
