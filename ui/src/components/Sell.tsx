'use client'

import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface Product {
  id: number;
  name: string;
  quantity: string;
  price: string;
}

const Sell = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [qrValue, setQrValue] = useState('')

  useEffect(() => {
    // Generate QR code value whenever products change
    const qrData = products.map(p => `${p.name},${p.quantity},${p.price}`).join('|')
    setQrValue(qrData)
  }, [products])

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), name: '', quantity: '', price: '' }])
  }

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ))
  }

  const removeProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id))
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-6xl p-8 m-4 rounded-xl backdrop-blur-lg bg-white bg-opacity-20 border border-white border-opacity-30 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Sell Items</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column: Product Form */}
          <div className="w-full md:w-1/2 space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center space-x-2 animate-fade-in">
                <input
                  type="text"
                  placeholder="Name"
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                  className="flex-grow p-2 rounded bg-white bg-opacity-50 border-none focus:ring-2 focus:ring-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={product.quantity}
                  onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                  className="w-20 p-2 rounded bg-white bg-opacity-50 border-none focus:ring-2 focus:ring-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={product.price}
                  onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                  className="w-24 p-2 rounded bg-white bg-opacity-50 border-none focus:ring-2 focus:ring-white focus:outline-none"
                />
                <button
                  onClick={() => removeProduct(product.id)}
                  className="p-2 text-white hover:text-red-500 transition-colors focus:outline-none"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addProduct}
              className="w-full mt-6 p-2 bg-white bg-opacity-30 hover:bg-opacity-40 text-white border border-white border-opacity-50 rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
            >
              + Add Product
            </button>
          </div>
          
          {/* Right column: QR Code */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105">
              <QRCodeSVG value={qrValue} size={256} />
            </div>
            <p className="mt-4 text-white text-center animate-pulse">
              Scan this QR code to view the product list
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sell

