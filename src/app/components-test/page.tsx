export default function ComponentsTestPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Visual AI Component Library</h1>
      
      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-outline">Outline Button</button>
        </div>
      </section>
      
      {/* Cards Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="card-title">Card Title</h3>
            <p>This card uses our custom card and card-title classes.</p>
          </div>
          
          <div className="card">
            <h3 className="card-title">Interactive Card</h3>
            <p className="mb-4">This card has a button in it.</p>
            <button className="btn-primary">Action</button>
          </div>
          
          <div className="card">
            <h3 className="card-title">Another Card</h3>
            <p>Cards are useful for organizing content into distinct sections.</p>
          </div>
        </div>
      </section>
      
      {/* Alerts Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Alerts</h2>
        <div className="space-y-4">
          <div className="alert-info">
            This is an information alert. It provides helpful information to the user.
          </div>
          
          <div className="alert-success">
            This is a success alert. It indicates that an action was completed successfully.
          </div>
          
          <div className="alert-warning">
            This is a warning alert. It warns the user about potential issues.
          </div>
          
          <div className="alert-error">
            This is an error alert. It indicates that something went wrong.
          </div>
        </div>
      </section>
      
      {/* Layout Utilities */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Layout Utilities</h2>
        
        <div className="mb-6">
          <h3 className="text-xl mb-2">Flex Center</h3>
          <div className="flex-center h-24 bg-gray-100 rounded">
            <p>Centered Content</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl mb-2">Flex Between</h3>
          <div className="flex-between h-16 bg-gray-100 rounded px-4">
            <p>Left Content</p>
            <p>Right Content</p>
          </div>
        </div>
      </section>
    </div>
  )
} 