export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tailwind CSS Test Page</h1>
      <div className="bg-blue-100 p-4 rounded-lg">
        <p className="text-blue-800">This is a blue background container with blue text.</p>
      </div>
      <div className="mt-4 flex space-x-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Blue Button
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Green Button
        </button>
      </div>
    </div>
  )
} 