import Error from "./components/Error";
import Loader from "./components/Loader";
import NotFound from "./components/NotFound";

function App() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="my-8 shadow-2xl p-4 w-[30%]">
        <h1 className="text-4xl font-semibold uppercase tracking-widest text-center mt-8 mb-8">
          Public Holidays
        </h1>

        <Error message={"Something went wrong..."} />

        <div className="w-25 mx-auto my-4">
          <Loader />
        </div>

        <div className="flex justify-center mb-8">
          <select
            name="countries"
            className="p-4 border border-gray-300 rounded-md"
          ></select>
        </div>

        <div className="px-4">
          <ul className="list-disc flex flex-col gap-2"></ul>

          <NotFound message={"No Holidays Found..."} />
        </div>
      </div>
    </div>
  );
}

export default App;
