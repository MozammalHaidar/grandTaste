import { formatPrice } from '../../utils/helpers'

const PriceTag = ({ price, discountPrice, size = 'md' }) => {
  const sizeClass = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-lg'
  return (
    <div className="flex items-center gap-2">
      <span className={`${sizeClass} font-bold text-primary-500`}>{formatPrice(discountPrice || price)}</span>
      {discountPrice && (
        <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>
      )}
    </div>
  )
}

export default PriceTag