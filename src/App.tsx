import './App.css'
import TagGroups from './components/tagGroups/TagGroups.tsx';
import { PrivateTemplateTagSettingsModal } from './components/template-tags/private-template-tag-settings-modal.tsx';


function App() {

  return (
    <>
		<TagGroups />
		<PrivateTemplateTagSettingsModal/>
    </>
  )
}

export default App
