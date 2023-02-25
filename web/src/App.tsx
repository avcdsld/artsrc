import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from 'components/pages/HomePage';
import SourcesPage from 'components/pages/SourcesPage';
import SourcePage from 'components/pages/SourcePage';
import UserPage from 'components/pages/UserPage';
import CreatePage from 'components/pages/CreatePage';
import EditPage from 'components/pages/EditPage';
import AppProviders from 'components/AppProviders';
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AppProviders>
      <RecoilRoot>
        <Router>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path='sources' element={<SourcesPage />} />
            <Route
              path='source/:ownerAddress/:sourceId'
              element={<SourcePage />}
            />
            <Route
              path='source/:ownerAddress/:sourceId/edit'
              element={<EditPage />}
            />
            <Route path='create' element={<CreatePage />} />
            <Route path='user/:address' element={<UserPage />} />
            <Route path='user/:address/collections' element={<UserPage />} />
          </Routes>
        </Router>
        <ToastContainer
          autoClose={10000}
          position='bottom-right'
          theme='light'
          newestOnTop
          pauseOnHover
          pauseOnFocusLoss
        />
      </RecoilRoot>
    </AppProviders>
  );
}

export default App;
