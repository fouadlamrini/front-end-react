import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState('');

  const API_URL = '/products'; // Use relative path for your axios instance

  // Fetch products
  useEffect(() => {
    api.get(API_URL)
      .then(response => {
        console.log(response.data.data);
        setProducts(response.data.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Add a product
  const addProduct = () => {
    if (!newProduct) return;
    api.post(API_URL, { name: newProduct })
      .then(response => {
        setProducts([...products, response.data]);
        setNewProduct('');
      })
      .catch(error => console.error('Error adding product:', error));
  };

  // Update a product
  const updateProduct = (id) => {
    if (!updatedProduct) return;
    api.put(`${API_URL}/${id}`, { name: updatedProduct })
      .then(response => {
        setProducts(products.map(product => product.id === id ? response.data : product));
        setEditingProduct(null);
        setUpdatedProduct('');
      })
      .catch(error => console.error('Error updating product:', error));
  };

  // Delete a product
  const deleteProduct = (id) => {
    api.delete(`${API_URL}/${id}`)
      .then(() => setProducts(products.filter(product => product.id !== id)))
      .catch(error => console.error('Error deleting product:', error));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Product Management</h1>

      {/* Add Product */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="New Product Name"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 flex-1"
        />
        <button
          onClick={addProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      {/* Product List */}
      <ul className="space-y-4">
        {products.map(product => (
          <li key={product.id} className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
            {editingProduct === product.id ? (
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="text"
                  value={updatedProduct}
                  onChange={(e) => setUpdatedProduct(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 flex-1"
                />
                <button
                  onClick={() => updateProduct(product.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={product.images?.[0]?.image_url || 'https://via.placeholder.com/100'}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <strong className="block text-lg">{product.name}</strong>
                  <span className="block text-gray-600">${product.price} - Stock: {product.stock}</span>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(product.id);
                    setUpdatedProduct(product.name);
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;