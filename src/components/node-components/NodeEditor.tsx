import '../../styles/NodeEditor.css';
import Summary from './Summary';
import References from './References';
import Notes from './Notes';
import LinkButton from './LinkButton';
import SaveButton from './SaveButton';
import { Box } from '@mui/material';

interface NodeEditorProps {
  highlight: string;
}

function NodeEditor({ highlight }: NodeEditorProps) {
  return (
    <div className="wrapper" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <Summary className="field" text={highlight} />
      <References className="field" />
      <Notes className="field" />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <LinkButton className="button" />
        <SaveButton className="button" />
      </Box>
    </div>
  )
}

export default NodeEditor
