
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import CategoryPage from "./pages/category/CategoryPage";
import ProductDetails from "./pages/productDetails/ProductDetails";
import { NavigationProvider, NavigationContext } from './context/NavigationProvider';

function App() {
  return (
    <NavigationProvider>
      <NavigationContext.Consumer>
        {({ selectedParam }) => (
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/all" />} />
                <Route path=":categoryName" element={<CategoryPage />} />
                <Route path="product/:productId" element={<ProductDetails />} />
              </Route>
            </Routes>
          </Router>
        )}
      </NavigationContext.Consumer>
    </NavigationProvider>
  );
}

export default App;