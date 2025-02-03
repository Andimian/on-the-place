import './App.css'
import TagGroups from './components/tagGroups/TagGroups.tsx';
import { PrivateTemplateTagSettingsModal } from './components/template-tags/private-template-tag-settings-modal.tsx';
import { DrawerExample } from './components/drawler/Drawer.story.tsx';
import { Sortable } from './components/drawler/Sortable.tsx';
import { SortableTree } from './components/Tree/SortableTree.tsx';


function App() {

  return (
    <>
		<TagGroups />
		<PrivateTemplateTagSettingsModal/>
		<DrawerExample>
			<p style={{lineHeight: 2}}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac
				mauris sit amet diam pulvinar vestibulum. Sed malesuada ultrices
				hendrerit.
			</p>

			<Sortable handle removable />

			<p style={{lineHeight: 2}}>
				Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
				inceptos himenaeos. Nam nisi tortor, egestas volutpat tortor auctor,
				efficitur molestie urna. Vestibulum blandit erat massa, eu ornare diam
				porttitor at.
			</p>
		</DrawerExample>
		<SortableTree/>
    </>
  )
}

export default App
