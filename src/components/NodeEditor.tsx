import '../styles/NodeEditor.css'
import Summary from './Summary'
import References from './References';
import Notes from './Notes';
import LinkButton from './LinkButton';
import SaveButton from './SaveButton';

interface NodeEditorProps {
  highlight: string;
}

function NodeEditor({ highlight }: NodeEditorProps) {
  return (
    <div className="wrapper">
      <Summary className="field" text={ highlight } />
      <References className="field" />
      <Notes className="field" />
      <div className="button-container">
        <LinkButton className="button" />
        <SaveButton className="button" />
      </div>
    </div>
  )
}

export default NodeEditor
