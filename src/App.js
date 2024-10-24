
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import CategoryPage from "./pages/category/CategoryPage";
import ProductDetails from "./pages/productDetails/ProductDetails";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>

          <Route index element={<Navigate to="/home/all" />} />

          <Route path="home/:categoryName" element={<CategoryPage />} />
          <Route path="product/:productId" element={<ProductDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
