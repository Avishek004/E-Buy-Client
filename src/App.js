import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useEffect, lazy, Suspense } from 'react';
import { auth } from './firebase.config';
import { currentUser } from './Functions/auth';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingOutlined } from '@ant-design/icons';

const Login = lazy(() => import('./Pages/Auth/Login'));
const Home = lazy(() => import('./Pages/Home'));
const Register = lazy(() => import('./Pages/Auth/Register'));
const Header = lazy(() => import('./Components/Nav/Header'));
const RegisterComplete = lazy(() => import('./Pages/Auth/RegisterComplete'));
const ForgotPassword = lazy(() => import('./Pages/Auth/ForgotPassword'));
const History = lazy(() => import('./Pages/User/History'));
const UserRoute = lazy(() => import('./Components/PrivateRoutes/UserRoute'));
const Password = lazy(() => import('./Pages/User/Password'));
const Wishlist = lazy(() => import('./Pages/User/Wishlist'));
const AdminRoute = lazy(() => import('./Components/PrivateRoutes/AdminRoute'));
const AdminDashboard = lazy(() => import('./Pages/Admin/AdminDashboard'));
const CreateCategory = lazy(() => import('./Pages/Admin/Category/CreateCategory'));
const UpdateCategory = lazy(() => import('./Pages/Admin/Category/UpdateCategory'));
const CreateSub = lazy(() => import('./Pages/Admin/SubCategory/CreateSub'));
const UpdateSub = lazy(() => import('./Pages/Admin/SubCategory/UpdateSub'));
const CreateProduct = lazy(() => import('./Pages/Admin/Product/CreateProduct'));
const AllProducts = lazy(() => import('./Pages/Admin/Product/AllProducts'));
const UpdateProduct = lazy(() => import('./Pages/Admin/Product/UpdateProduct'));
const Product = lazy(() => import('./Pages/Product'));
const CategoryHome = lazy(() => import('./Pages/Category/CategoryHome'));
const SubCategoryHome = lazy(() => import('./Pages/SubCategory/SubCategoryHome'));
const Shop = lazy(() => import('./Pages/Shop'));
const Cart = lazy(() => import('./Pages/Cart'));
const SideDrawer = lazy(() => import('./Components/Drawer/SideDrawer'));
const Checkout = lazy(() => import('./Pages/Checkout'));
const CreateCoupon = lazy(() => import('./Pages/Admin/Coupon/CreateCoupon'));
const Payment = lazy(() => import('./Pages/Payment'));


function App() {
  const dispatch = useDispatch();

  // To Check Firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        // console.log("user", user);
        currentUser(idTokenResult.token)
          .then((res) => {
            // console.log(res);
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              }
            });
          })
          .catch(error => console.log(error));
      }
    });
    // Cleanup
    return () => unsubscribe();
  }, [dispatch])
  return (
    <Suspense
      fallback={
        <div className="col text-center p-5">
          __ React Redux EC
          <LoadingOutlined />
          MMERCE __
        </div>
      }>
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/sub/:slug" component={SubCategoryHome} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/cart" component={Cart} />
        <UserRoute exact path="/user/history" component={History} />
        <UserRoute exact path="/user/password" component={Password} />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />
        <UserRoute exact path="/checkout" component={Checkout} />
        <UserRoute exact path="/payment" component={Payment} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/category" component={CreateCategory} />
        <AdminRoute exact path="/admin/category/:slug" component={UpdateCategory} />
        <AdminRoute exact path="/admin/sub/:slug" component={UpdateSub} />
        <AdminRoute exact path="/admin/sub" component={CreateSub} />
        <AdminRoute exact path="/admin/product" component={CreateProduct} />
        <AdminRoute exact path="/admin/product/:slug" component={UpdateProduct} />
        <AdminRoute exact path="/admin/products" component={AllProducts} />
        <AdminRoute exact path="/admin/coupon" component={CreateCoupon} />
      </Switch>
    </Suspense>
  );
};

export default App;
