import { createContext, useContext, useState } from 'react'

const QuickViewContext = createContext(null)

export const QuickViewProvider = ({ children }) => {
  const [product, setProduct] = useState(null)

  const openQuickView = (product) => setProduct(product)
  const closeQuickView = () => setProduct(null)

  return (
    <QuickViewContext.Provider value={{ product, openQuickView, closeQuickView }}>
      {children}
    </QuickViewContext.Provider>
  )
}

export const useQuickView = () => {
  const context = useContext(QuickViewContext)
  if (!context) {
    return { product: null, openQuickView: () => {}, closeQuickView: () => {} }
  }
  return context
}