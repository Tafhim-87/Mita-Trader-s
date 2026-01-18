// Format price with currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};

// Get stock status
export const getStockStatus = (stock) => {
  if (stock === 0) {
    return {
      status: 'Out of Stock',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'AlertCircle'
    };
  }
  if (stock <= 10) {
    return {
      status: 'Low Stock',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'AlertTriangle'
    };
  }
  return {
    status: 'In Stock',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'CheckCircle'
  };
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Generate rating stars
export const generateStars = (rating, size = 'sm') => {
  const starSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i}>
        {i <= Math.floor(rating) ? (
          <span className={`${starSize} text-yellow-400 fill-yellow-400`}>★</span>
        ) : i === Math.ceil(rating) && rating % 1 !== 0 ? (
          <span className={`${starSize} text-yellow-400`}>★</span>
        ) : (
          <span className={`${starSize} text-gray-300`}>★</span>
        )}
      </span>
    );
  }
  
  return stars;
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};