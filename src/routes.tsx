import { createBrowserRouter } from 'react-router-dom';
import CodeMiniAppPage from './pages/dashboard/code';
import PdfMiniAppPage from './pages/dashboard/pdf';
import ImageMiniAppPage from './pages/dashboard/image';
import AudioMiniAppPage from './pages/dashboard/audio';
import CliMiniAppPage from './pages/dashboard/cli';

export const router = createBrowserRouter([
  {
    path: "/dashboard/code",
    element: <CodeMiniAppPage />,
  },
  {
    path: "/dashboard/pdf",
    element: <PdfMiniAppPage />,
  },
  {
    path: "/dashboard/image",
    element: <ImageMiniAppPage />,
  },
  {
    path: "/dashboard/audio",
    element: <AudioMiniAppPage />,
  },
  {
    path: "/dashboard/cli",
    element: <CliMiniAppPage />,
  },
]); 