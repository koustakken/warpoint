import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import App from './App.tsx'

import 'primereact/resources/themes/lara-light-cyan/theme.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
)
