import { createRoot } from 'react-dom/client';
import Main from './main.container';

function render() {
  const root = createRoot(document.getElementById('root'))
  root.render(<Main />);
}

render();