

const SkeletonBookDetails: React.FC = () => {
    return (
      <div className="flex flex-1 overflow-hidden h-[100vh]">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="pr-2 pb-4 border-b w-full border-gray-200 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          </div>
          <div className="max-w-6xl mx-auto p-8 animate-pulse">
            <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-start">
              <div className="md:w-2/3">
                <div className="h-8 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4 border-b pb-4 border-gray-300"></div>
                <div className="flex flex-wrap mt-4 text-blue-1 text-xs md:text-sm space-x-6">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                </div>
                <div className="flex flex-wrap mt-4 text-xs md:text-sm space-x-6 border-b pb-4 border-gray-300">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                </div>
                <div className="flex items-center mt-8 space-x-4">
                  <div className="h-10 bg-gray-300 rounded w-32"></div>
                  <div className="h-10 bg-gray-300 rounded w-32"></div>
                </div>
                <div className="flex mt-6">
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                </div>
                <div className="mt-8 border-b pb-4 border-gray-300">
                  <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                </div>
                <div className="mt-8 ">
                  <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
              <div className="relative w-full h-80 mt-4 md:mt-0 md:w-80 md:h-80">
                <div className="bg-gray-300 rounded-lg w-full h-full"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };
  export default SkeletonBookDetails;   