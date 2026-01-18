// app/books/loading.js
export default function BooksLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-12 bg-white/20 rounded-xl animate-pulse mb-4"></div>
            <div className="h-6 bg-white/20 rounded-lg animate-pulse w-64 mx-auto"></div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Loading skeleton for filters */}
          <div className="w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-8 bg-gray-100 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Loading skeleton for books */}
          <div className="w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-4">
                  <div className="aspect-3/4 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}