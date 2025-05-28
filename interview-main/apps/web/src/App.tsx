import DatesHeader from "./components/DatesHeader";
import Schedule from "./components/Schedule";

function App() {
  const dateRange = {
    start: "2024-09-17",
    end: "2024-10-07",
  };

  return (
    <main className="antialiased w-fit px-12 py-16">
      <h1 className="mb-5 text-xl font-medium">Manager Schedule</h1>
      <div>
        <DatesHeader dateRange={dateRange} />
        <Schedule dateRange={dateRange} />
      </div>
    </main>
  );
}

export default App;