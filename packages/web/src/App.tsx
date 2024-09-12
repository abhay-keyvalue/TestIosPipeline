import {RouterProvider} from 'react-router-dom';
import {router} from './routes';
import './App.css';

const App: React.FC = () => {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
