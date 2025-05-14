import * as React from 'react';
import { Params, useParams } from 'react-router';

interface Props {
  params: Params<string>
}

export class EditNodePageInternal extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): React.ReactNode {
    const { nodeId } = this.props.params;
    return <div>Node ID: {nodeId}</div>;
  }
}

export default function EditNodePage() {
  const params = useParams();
  return <EditNodePageInternal params={params} />
}