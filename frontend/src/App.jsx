import React from 'react'
import {Link,BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'
import Home from './components/Home'
import SingleProduct from './components/SingleProduct'
import AddToCart from './components/AddToCart'
import Users from './components/Users'
import OrderPage from './components/OrderPage'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/admin' element={<AdminDashboard/>}/>
          <Route path='/users' element={<Users/>}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/singleProduct/:id' element={<SingleProduct/>}/>
          <Route path='/cart' element={<AddToCart/>}/>
          <Route path='/order' element={<OrderPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
