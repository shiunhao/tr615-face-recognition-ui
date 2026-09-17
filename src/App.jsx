import TR615PaintLook from './TR615PaintLookV6'
import PresenterV1 from './PresenterV1'

function App() {
  const requestedVersion = new URLSearchParams(window.location.search).get('version');
  const version = ['v1', 'v3', 'v4'].includes(requestedVersion) ? requestedVersion : 'v2';
  const Page = version === 'v1' || version === 'v4' ? PresenterV1 : TR615PaintLook;
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <Page prototypeVersion={version} />
    </div>
  )
}

export default App
