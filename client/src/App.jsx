import { Navbar, Welcome, Footer, Services, Transactions } from './components'


function App() {

  return (
    <div className="min-h-screen">
      <div className='gradient-bg-welcome'>
        <Navbar />
        <Welcome />
      </div>
    </div>
  )
}

export default App
