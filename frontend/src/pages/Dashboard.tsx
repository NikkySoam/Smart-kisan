const Dashboard = () => {
  return (
    <div className="p-4 sm:p-8">

      <div className="mb-8">

        <h1 className="text-3xl sm:text-5xl font-bold text-green-900">
          Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Welcome to Smart Kisan
        </p>

      </div>

      {/* CARDS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500">
            Total Farmers
          </h2>

          <p className="text-4xl font-bold text-green-700 mt-4">
            12
          </p>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500">
            Total Hours
          </h2>

          <p className="text-4xl font-bold text-green-700 mt-4">
            120
          </p>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500">
            Total Earnings
          </h2>

          <p className="text-4xl font-bold text-green-700 mt-4">
            ₹18K
          </p>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500">
            Water Rate
          </h2>

          <p className="text-4xl font-bold text-green-700 mt-4">
            ₹150
          </p>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;

