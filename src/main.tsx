import { createRoot } from 'react-dom/client'
import { App } from './app/app';
import { ConfigProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider>
    <AppRoot>
      <App />
    </AppRoot>
  </ConfigProvider>
);
