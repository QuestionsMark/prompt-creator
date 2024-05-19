import ReactDOM from 'react-dom/client'
import { App } from './App'

import './styles/index.scss';
import { AppProvider } from './contexts/app.context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <App />
  </AppProvider>,
);
